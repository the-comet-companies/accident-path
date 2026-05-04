const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (f.endsWith('.json')) files.push(full);
  }
  return files;
}

const results = [];
for (const filePath of walk('content')) {
  let data;
  try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { continue; }
  if (!data.metaDescription) continue;
  const slug = data.slug || '';
  const desc = data.metaDescription;
  const normalized = filePath.split(path.sep).join('/');
  const parts = normalized.split('/');
  const category = parts[1];
  const isEs = parts.includes('es');
  const prefixMap = {
    accidents: isEs ? '/es/accidents' : '/accidents',
    guides: isEs ? '/es/guides' : '/guides',
    injuries: isEs ? '/es/injuries' : '/injuries',
    tools: isEs ? '/es/tools' : '/tools',
    cities: isEs ? '/es/cities' : '/cities',
    states: isEs ? '/es/states' : '/states',
  };
  const prefix = prefixMap[category] || '';
  const route = slug ? 'https://accident-path.vercel.app' + prefix + '/' + slug : '';
  results.push(route + '\t' + desc);
}
console.log(results.join('\n'));
