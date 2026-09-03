import('recharts').then(r => {
  console.log("RadarChart:", typeof r.RadarChart);
  console.log("ResponsiveContainer:", typeof r.ResponsiveContainer);
}).catch(console.error);
