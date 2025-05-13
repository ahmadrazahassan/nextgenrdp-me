const fs = require('fs');
const path = require('path');

console.log('Creating symlinks to ensure component availability...');

// This script ensures that components are available at both path structures
// We'll create symbolic links in directories if needed

// Function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// First, check if src/app/ui exists - if not, create it
const srcAppUIDir = path.join(process.cwd(), 'src', 'app', 'ui');
ensureDirectoryExists(srcAppUIDir);

// Get all component files from src/components/ui
const srcComponentsUIDir = path.join(process.cwd(), 'src', 'components', 'ui');
if (fs.existsSync(srcComponentsUIDir)) {
  const files = fs.readdirSync(srcComponentsUIDir);
  
  // For each file, create a copy in src/app/ui if it doesn't exist
  files.forEach(file => {
    const sourcePath = path.join(srcComponentsUIDir, file);
    const destinationPath = path.join(srcAppUIDir, file);
    
    // Only copy if it's a file, not a directory
    if (fs.statSync(sourcePath).isFile()) {
      if (!fs.existsSync(destinationPath)) {
        console.log(`Copying ${file} to app/ui/`);
        fs.copyFileSync(sourcePath, destinationPath);
      }
    }
  });
}

console.log('Symlink creation completed!');
process.exit(0); 