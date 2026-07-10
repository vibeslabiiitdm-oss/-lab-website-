const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Skip data/lab.ts since we already manually edited it to define BASE_URL
    if (filePath.replace(/\\/g, '/').endsWith('data/lab.ts')) return;

    if (content.includes('http://localhost:5000')) {
      // First, ensure BASE_URL is imported from @/data/lab
      if (!content.includes('BASE_URL')) {
        // Find existing import from @/data/lab
        if (content.includes('from "@/data/lab"')) {
          content = content.replace(/import \{([^}]+)\} from "@\/data\/lab";/, (match, p1) => {
            return `import {${p1}, BASE_URL } from "@/data/lab";`;
          });
        } else {
          // Add it after the last import
          const importIndex = content.lastIndexOf('import ');
          if (importIndex !== -1) {
            const endOfLine = content.indexOf('\n', importIndex);
            content = content.slice(0, endOfLine + 1) + 'import { BASE_URL } from "@/data/lab";\n' + content.slice(endOfLine + 1);
          } else {
             content = 'import { BASE_URL } from "@/data/lab";\n' + content;
          }
        }
      }

      // Replace standard fetch("http://localhost:5000...")
      content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${BASE_URL}$1`');
      
      // Replace template literals `http://localhost:5000${...}`
      content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${BASE_URL}$1`');

      if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
});
