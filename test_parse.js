const str = "ECIES:kDlJ";
let prof;
try {
  prof = typeof str === 'string' ? JSON.parse(str) : str;
} catch (e) {
  if (typeof str === 'string' && str.startsWith("ECIES:")) {
     console.log("caught ECIES");
  }
}
