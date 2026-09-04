const fs = require('fs');
let c = fs.readFileSync('src/jsx/relationship-graph.jsx', 'utf8');

const newComponent = `import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const calculateRoleScore = (c1, c2, role) => {
  if (!window.calculateAshtakoot) return 0;
  const match = window.calculateAshtakoot(c1, c2, role);
  return match.score;
};

window.RelationshipGraph = ({ prs, chs }) => {
  const d3Container = useRef(null);
  const [roleMode, setRoleMode] = useState("Spouse");
  const [profileA, setProfileA] = useState("ALL");
  const [profileB, setProfileB] = useState("ALL");

  useEffect(() => {
    if (!prs || prs.length < 2 || !d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove();

    const width = d3Container.current.clientWidth;
    const height = 400;

    const svg = d3.select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    // Determine which nodes to show
    let activePrs = prs;
    if (profileA !== "ALL" && profileB !== "ALL") {
       activePrs = prs.filter(p => p.id === profileA || p.id === profileB);
    } else if (profileA !== "ALL") {
       activePrs = prs; // Show all, but we will filter links
    } else if (profileB !== "ALL") {
       activePrs = prs; // Show all, but we will filter links
    }
    
    const nodes = activePrs.map(p => ({
      id: p.id,
      name: p.name.split(" ")[0],
      group: (p.id === profileA || p.id === profileB) ? 2 : 1
    }));

    const links = [];
    for (let i = 0; i < prs.length; i++) {
      for (let j = i + 1; j < prs.length; j++) {
        const p1 = prs[i];
        const p2 = prs[j];
        
        let shouldConnect = true;
        if (profileA !== "ALL" && profileB !== "ALL") {
           shouldConnect = (p1.id === profileA && p2.id === profileB) || (p1.id === profileB && p2.id === profileA);
        } else if (profileA !== "ALL") {
           shouldConnect = p1.id === profileA || p2.id === profileA;
        } else if (profileB !== "ALL") {
           shouldConnect = p1.id === profileB || p2.id === profileB;
        }
        
        if (!shouldConnect) continue;
        
        const c1 = chs[p1.id];
        const c2 = chs[p2.id];
        if (c1 && c2) {
           const score = calculateRoleScore(c1, c2, roleMode);
           links.push({
             source: p1.id,
             target: p2.id,
             value: score
           });
        }
      }
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => Math.max(80, 200 - (d.value * 4))))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(45));

    const getLinkColor = (score) => {
      if (score >= 28) return "#10b981"; 
      if (score >= 18) return "#fbbf24"; 
      return "#f43f5e"; 
    };

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.max(1, d.value / 6))
      .attr("stroke", d => getLinkColor(d.value));

    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text(d => d.value.toFixed(1))
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .attr("font-family", "monospace")
      .style("pointer-events", "none")
      .attr("dy", -4);

    const node = svg.append("g")
      .attr("stroke", "#27272a")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.group === 2 ? 24 : 18)
      .attr("fill", d => d.group === 2 ? "#6366f1" : "#18181b")
      .call(drag(simulation));

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.name)
      .attr("font-size", "11px")
      .attr("fill", d => d.group === 2 ? "#fff" : "#a1a1aa")
      .attr("font-family", "sans-serif")
      .attr("dx", 22)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [prs, chs, roleMode, profileA, profileB]);

  return (
    <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] shadow-inner mt-8">
      <div className="flex justify-between items-start md:items-center mb-6 flex-col md:flex-row gap-4">
         <div>
           <h3 className="text-amber-300 font-serif text-xl">Vedic Network Graph</h3>
           <p className="text-xs text-white/50 font-mono">Topological Compatibility Filter</p>
         </div>
         <div className="flex flex-wrap items-center gap-2">
            <select value={profileA} onChange={(e) => setProfileA(e.target.value)} className="bg-black/40 border border-[#27272a] rounded-lg px-2 py-1 text-xs text-white outline-none">
              <option value="ALL" className="bg-[#09090b]">All Profiles</option>
              {prs.map(p => (
                 <option key={\`A-\${p.id}\`} value={p.id} className="bg-[#09090b] notranslate">{p.name}</option>
              ))}
            </select>
            <span className="text-white/30 text-xs">←</span>
            <select value={roleMode} onChange={(e) => setRoleMode(e.target.value)} className="bg-amber-900/20 text-amber-300 border border-amber-500/30 rounded-lg px-2 py-1 text-xs outline-none">
              <option value="Spouse" className="bg-[#09090b]">Spouse / Partner</option>
              <option value="Family" className="bg-[#09090b]">Family Member</option>
              <option value="Sibling" className="bg-[#09090b]">Sibling</option>
              <option value="Mother" className="bg-[#09090b]">Mother</option>
              <option value="Father" className="bg-[#09090b]">Father</option>
              <option value="Son" className="bg-[#09090b]">Son</option>
              <option value="Daughter" className="bg-[#09090b]">Daughter</option>
              <option value="In-Laws" className="bg-[#09090b]">In-Laws</option>
              <option value="Business Partner" className="bg-[#09090b]">Business Partner</option>
              <option value="Friend" className="bg-[#09090b]">Friend</option>
            </select>
            <span className="text-white/30 text-xs">→</span>
            <select value={profileB} onChange={(e) => setProfileB(e.target.value)} className="bg-black/40 border border-[#27272a] rounded-lg px-2 py-1 text-xs text-white outline-none">
              <option value="ALL" className="bg-[#09090b]">All Profiles</option>
              {prs.map(p => (
                 <option key={\`B-\${p.id}\`} value={p.id} className="bg-[#09090b] notranslate">{p.name}</option>
              ))}
            </select>
         </div>
      </div>
      <div ref={d3Container} className="w-full h-[400px] border border-white/5 rounded-xl bg-black/20" />
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-[10px] uppercase font-mono text-white/60">Excellent (&ge;28)</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className="text-[10px] uppercase font-mono text-white/60">Average (&ge;18)</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-[10px] uppercase font-mono text-white/60">Challenging (&lt;18)</span></div>
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/jsx/relationship-graph.jsx', newComponent);
