const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src') // for App.tsx
];

// Mappings from hardcoded to CSS variables
const mappings = [
  { regex: /'#070709'/g, replacement: "'var(--color-bg-primary)'" },
  { regex: /"#070709"/g, replacement: '"var(--color-bg-primary)"' },
  { regex: /'#0d0d0d'/g, replacement: "'var(--color-bg-primary)'" },
  { regex: /"#0d0d0d"/g, replacement: '"var(--color-bg-primary)"' },
  { regex: /'#131313'/g, replacement: "'var(--color-bg-secondary)'" },
  { regex: /"#131313"/g, replacement: '"var(--color-bg-secondary)"' },
  { regex: /'#141414'/g, replacement: "'var(--color-bg-secondary)'" },
  { regex: /"#141414"/g, replacement: '"var(--color-bg-secondary)"' },
  { regex: /'#1a1a1a'/g, replacement: "'var(--color-bg-card)'" },
  { regex: /"#1a1a1a"/g, replacement: '"var(--color-bg-card)"' },
  { regex: /'#222222'/g, replacement: "'var(--color-bg-elevated)'" },
  { regex: /"#222222"/g, replacement: '"var(--color-bg-elevated)"' },

  { regex: /'#f5f5f5'/g, replacement: "'var(--color-text-primary)'" },
  { regex: /"#f5f5f5"/g, replacement: '"var(--color-text-primary)"' },
  { regex: /'#fff'/g, replacement: "'var(--color-text-primary)'" },
  { regex: /"#fff"/g, replacement: '"var(--color-text-primary)"' },
  { regex: /'white'/g, replacement: "'var(--color-text-primary)'" },
  { regex: /"white"/g, replacement: '"var(--color-text-primary)"' },

  // Background overlays / muted text
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.65\)'/g, replacement: "'var(--color-text-secondary)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.75\)'/g, replacement: "'var(--color-text-secondary)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.7\)'/g, replacement: "'var(--color-text-secondary)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.55\)'/g, replacement: "'var(--color-text-secondary)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.4\)'/g, replacement: "'var(--color-text-muted)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.45\)'/g, replacement: "'var(--color-text-muted)'" },
  { regex: /'rgba\(245,\s*245,\s*245,\s*0\.5\)'/g, replacement: "'var(--color-text-muted)'" },

  // Borders
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.1\)'/g, replacement: "'var(--color-border)'" },
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.08\)'/g, replacement: "'var(--color-border)'" },
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.06\)'/g, replacement: "'var(--color-border)'" },
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.15\)'/g, replacement: "'var(--color-border-light)'" },
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.14\)'/g, replacement: "'var(--color-border-light)'" },
  { regex: /'rgba\(255,\s*255,\s*255,\s*0\.2\)'/g, replacement: "'var(--color-border-light)'" },

  // Dark background rgba variants (mostly cards, panels)
  { regex: /'rgba\(20,\s*20,\s*20,\s*0\.35\)'/g, replacement: "'var(--color-bg-card)'" },
  { regex: /'rgba\(20,\s*20,\s*20,\s*0\.5\)'/g, replacement: "'var(--color-bg-card)'" },
  { regex: /'rgba\(10,\s*10,\s*10,\s*0\.98\)'/g, replacement: "'var(--color-bg-primary)'" },
  
  // Red variations
  { regex: /'rgba\(204,\s*22,\s*22,\s*0\.1\)'/g, replacement: "'var(--color-red-glow)'" },
  { regex: /'rgba\(204,\s*22,\s*22,\s*0\.15\)'/g, replacement: "'var(--color-red-glow)'" },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (let mapping of mappings) {
    content = content.replace(mapping.regex, mapping.replacement);
  }

  content = content.replace(/background:\s*'#000'/g, "background: 'var(--color-bg-primary)'");
  content = content.replace(/backgroundColor:\s*'#000'/g, "backgroundColor: 'var(--color-bg-primary)'");
  
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
      if (file !== 'ui') {
        walkDir(fullPath);
      }
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
console.log('Done!');
