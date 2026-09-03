import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Extracted from TabUnion logic for roles
const calculateRoleScore = (c1, c2, role) => {
  if (!window.calculateAshtakoot) return 0;
  const match = window.calculateAshtakoot(c1, c2, role);
  return match.score;
};

window.RelationshipGraph = ({ prs, chs }) => {
  const d3Container = useRef(null);
  const [roleMode, setRoleMode] = useState("Spouse");

  useEffect(() => {
    if (!prs || prs.length < 2 || !d3Container.current) return;

    // Clear previous graph
    d3.select(d3Container.current).selectAll("*").remove();

    const width = d3Container.current.clientWidth;
    const height = 400;

    const svg = d3.select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    // Nodes
    const nodes = prs.map(p => ({
      id: p.id,
      name: p.name.split(" ")[0], // First name only
      group: 1
    }));

    // Links (all possible pairs)
    const links = [];
    for (let i = 0; i < prs.length; i++) {
      for (let j = i + 1; j < prs.length; j++) {
        const c1 = chs[prs[i].id];
        const c2 = chs[prs[j].id];
        if (c1 && c2) {
          const score = calculateRoleScore(c1, c2, roleMode);
          links.push({
            source: prs[i].id,
            target: prs[j].id,
            score: score,
            distance: 40 - score // Higher score = closer distance
          });
        }
      }
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => 100 + (36 - d.score) * 5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Define a gradient for links based on score (optional, but a nice touch)
    const getLinkColor = (score) => {
      if (score >= 28) return "#10b981"; // Emerald for high
      if (score >= 18) return "#fbbf24"; // Amber for medium
      return "#f43f5e"; // Rose for low
    };

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => getLinkColor(d.score))
      .attr("stroke-width", d => Math.max(1, d.score / 6));

    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("font-size", "10px")
      .attr("fill", "#a1a1aa")
      .attr("font-family", "monospace")
      .attr("dy", -5)
      .text(d => d.score.toFixed(1));

    const node = svg.append("g")
      .attr("stroke", "#27272a")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", "#3f3f46")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const text = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "12px")
      .attr("fill", "#e4e4e7")
      .attr("font-weight", "bold")
      .attr("font-family", "serif")
      .attr("text-anchor", "middle")
      .attr("dy", 35)
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => Math.max(20, Math.min(width - 20, d.source.x)))
        .attr("y1", d => Math.max(20, Math.min(height - 20, d.source.y)))
        .attr("x2", d => Math.max(20, Math.min(width - 20, d.target.x)))
        .attr("y2", d => Math.max(20, Math.min(height - 20, d.target.y)));

      linkLabels
        .attr("x", d => (Math.max(20, Math.min(width - 20, d.source.x)) + Math.max(20, Math.min(width - 20, d.target.x))) / 2)
        .attr("y", d => (Math.max(20, Math.min(height - 20, d.source.y)) + Math.max(20, Math.min(height - 20, d.target.y))) / 2);

      node
        .attr("cx", d => Math.max(20, Math.min(width - 20, d.x)))
        .attr("cy", d => Math.max(20, Math.min(height - 20, d.y)));
        
      text
        .attr("x", d => Math.max(20, Math.min(width - 20, d.x)))
        .attr("y", d => Math.max(20, Math.min(height - 20, d.y)));
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [prs, chs, roleMode]);

  return (
    <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-xl relative overflow-hidden mt-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
         <div>
            <h3 className="font-serif text-xl text-pink-200">Network Compatibility Graph</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-1">D3 Force-Directed Relationship Mapping</p>
         </div>
         <div className="mt-4 sm:mt-0">
            <label className="text-[10px] uppercase font-mono text-slate-500 mr-2">Lens:</label>
            <select value={roleMode} onChange={(e) => setRoleMode(e.target.value)} className="bg-black/40 border border-[#27272a] rounded-lg px-2 py-1 text-xs text-white outline-none">
              {["Spouse", "Girlfriend", "Brother", "Sister", "Mother", "Father", "In-Laws", "Son", "Daughter", "Business Partner", "Friend"].map(r => (
                 <option key={r} value={r} className="bg-[#09090b]">{r}</option>
              ))}
            </select>
         </div>
       </div>
       
       <div className="w-full relative h-[400px] bg-black/20 rounded-2xl border border-[#27272a]">
          <div ref={d3Container} className="w-full h-full cursor-crosshair"></div>
          
          <div className="absolute bottom-4 left-4 flex gap-3 text-[9px] font-mono uppercase">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> High (28+)</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Med (18-28)</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Low (&lt;18)</div>
          </div>
       </div>
    </div>
  );
};
