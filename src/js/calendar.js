window.generateICS = (profile, chart, days = 30) => {
  if (!profile || !chart) return;
  
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Graha Ledger//EN\nCALSCALE:GREGORIAN\n";
  const now = new Date();
  
  const formatDate = (d) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getPlanet = (i) => ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][i % 7];
  const getHouse = (i) => ["Wealth (2nd)", "Courage (3rd)", "Home (4th)", "Intellect (5th)", "Partnership (7th)", "Career (10th)", "Gains (11th)"][i % 7];

  for (let i = 0; i < days; i += 3) { // Mock an event every ~3 days
    const evStart = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
    const evEnd = new Date(evStart.getTime() + (60 * 60 * 1000)); // 1 hour event
    
    const planet = getPlanet(i);
    const house = getHouse(i);
    const title = `${planet} Transit in ${house}`;
    const desc = `Important transit for ${profile.name}. ${planet} moves through the ${house}, bringing focus and energetic shifts according to your natal chart.`;

    ics += "BEGIN:VEVENT\n";
    ics += `SUMMARY:${title}\n`;
    ics += `DESCRIPTION:${desc}\n`;
    ics += `DTSTART:${formatDate(evStart)}\n`;
    ics += `DTEND:${formatDate(evEnd)}\n`;
    ics += "END:VEVENT\n";
  }

  // Also add current Mahadasha
  const currentDasha = chart.dasha?.[0] || { lord: "Jupiter" };
  const dashaStart = new Date();
  const dashaEnd = new Date(dashaStart.getTime() + (365 * 24 * 60 * 60 * 1000));
  ics += "BEGIN:VEVENT\n";
  ics += `SUMMARY:${currentDasha.lord} Mahadasha Active\n`;
  ics += `DESCRIPTION:${profile.name} is currently running ${currentDasha.lord} Mahadasha.\n`;
  ics += `DTSTART;VALUE=DATE:${dashaStart.toISOString().split('T')[0].replace(/-/g, '')}\n`;
  ics += `DTEND;VALUE=DATE:${dashaEnd.toISOString().split('T')[0].replace(/-/g, '')}\n`;
  ics += "END:VEVENT\n";

  ics += "END:VCALENDAR";

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Astrology_Events_${profile.name.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
