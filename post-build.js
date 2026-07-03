const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, 'dist', 'angular22', 'browser');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (filePath.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

if (!fs.existsSync(browserDir)) {
  console.error(`Browser directory not found: ${browserDir}`);
  process.exit(1);
}

const htmlFiles = getHtmlFiles(browserDir);
console.log(`Found ${htmlFiles.length} HTML files to optimize...`);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove fonts.googleapis.com preconnect if it exists in built files
  content = content.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\/?>/g, '');
  content = content.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s+crossorigin\/?>/g, '');

  // Find the main-*.js script tag
  const scriptRegex = /<script\s+src="([^"]*main-[a-zA-Z0-9_-]+\.js)"\s+type="module"><\/script>/i;
  const match = content.match(scriptRegex);
  
  if (match) {
    const scriptSrc = match[1];
    // Formulate the absolute path for preloading
    const preloadPath = scriptSrc.startsWith('/') ? scriptSrc : '/' + scriptSrc;
    const preloadTag = `<link rel="modulepreload" href="${preloadPath}">`;
    
    // Check if it's already preloaded
    if (!content.includes(preloadTag)) {
      // Insert in the head, right before </head>
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${preloadTag}</head>`);
        console.log(`Injected preload for ${scriptSrc} in ${path.relative(browserDir, file)}`);
      } else {
        console.warn(`Could not find </head> in ${file}`);
      }
    }
  } else {
    console.warn(`No main-*.js script tag found in ${path.relative(browserDir, file)}`);
  }
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Post-build optimization complete!');
