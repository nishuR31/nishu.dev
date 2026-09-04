const fetch = require('node-fetch'); // or native fetch in node 18+

async function run() {
  const api = "https://nishu-dev-api.onrender.com";
  const res = await fetch(`${api}/api/portfolio`);
  const json = await res.json();
  const data = json.data ?? json;
  console.log("data.developer?.name:", data?.developer?.name);
  console.log("Keys in data:", Object.keys(data));
}
run();
