const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace dark rgb/rgba backgrounds (10, 13, 20, 26, etc)
  content = content.replace(/'rgba\((10|13|20|26|0|5),\s*(10|13|20|26|0|5),\s*(10|13|20|26|0|5),\s*(0\.\d+|1)\)'/g, (match, r, g, b, alpha) => {
    // If it's a very dark transparent background
    const a = parseFloat(alpha);
    if (a >= 0.9) return "'var(--color-bg-primary)'";
    if (a > 0.4 && a < 0.9) return `'color-mix(in srgb, var(--color-bg-primary) ${Math.round(a*100)}%, transparent)'`;
    return `'color-mix(in srgb, var(--color-bg-card) ${Math.round(a*100)}%, transparent)'`;
  });

  // Gradients with dark backgrounds
  content = content.replace(/rgba\((10|13|20|26|0|5),\s*(10|13|20|26|0|5),\s*(10|13|20|26|0|5),\s*(0\.\d+|1)\)/g, (match, r, g, b, alpha) => {
    const a = parseFloat(alpha);
    return `color-mix(in srgb, var(--color-bg-primary) ${Math.round(a*100)}%, transparent)`;
  });

  // Replace white/light transparent texts and borders
  content = content.replace(/'rgba\(255,\s*255,\s*255,\s*(0\.\d+|1)\)'/g, (match, alpha) => {
    const a = parseFloat(alpha);
    if (a <= 0.25) return "'var(--color-border)'";
    if (a <= 0.5) return "'var(--color-text-muted)'";
    return "'var(--color-text-secondary)'";
  });
  
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*(0\.\d+|1)\)/g, (match, alpha) => {
    const a = parseFloat(alpha);
    if (a <= 0.25) return "var(--color-border)";
    if (a <= 0.5) return "var(--color-text-muted)";
    return "var(--color-text-secondary)";
  });

  content = content.replace(/'rgba\(245,\s*245,\s*245,\s*(0\.\d+|1)\)'/g, (match, alpha) => {
    const a = parseFloat(alpha);
    if (a <= 0.5) return "'var(--color-text-muted)'";
    return "'var(--color-text-secondary)'";
  });
  
  content = content.replace(/rgba\(245,\s*245,\s*245,\s*(0\.\d+|1)\)/g, (match, alpha) => {
    const a = parseFloat(alpha);
    if (a <= 0.5) return "var(--color-text-muted)";
    return "var(--color-text-secondary)";
  });

  // Remaining hex codes
  content = content.replace(/'#0a0505'/g, "'var(--color-bg-primary)'"); // from Hero.tsx

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'ui') walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => {
  if (dir.endsWith('src')) {
    const appPath = path.join(dir, 'App.tsx');
    if (fs.existsSync(appPath)) processFile(appPath);
  } else {
    walkDir(dir);
  }
});
console.log('Done v2!');
