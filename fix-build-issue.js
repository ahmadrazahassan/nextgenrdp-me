const fs = require('fs');
const path = require('path');

console.log('Checking component files...');

// List of files that should exist
const requiredFiles = [
  'src/components/ui/card.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/input.tsx',
  'src/components/admin/RecentOrdersTable.tsx'
];

// Check if each file exists
let allFilesExist = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.error(`✗ ${file} is missing`);
    allFilesExist = false;
  }
});

// Check src directory structure
console.log('\nDirectory structure:');
try {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const uiDir = path.join(componentsDir, 'ui');
  const adminDir = path.join(componentsDir, 'admin');
  
  if (fs.existsSync(componentsDir)) {
    console.log('✓ src/components directory exists');
    console.log('Contents:', fs.readdirSync(componentsDir));
    
    if (fs.existsSync(uiDir)) {
      console.log('✓ src/components/ui directory exists');
      console.log('Contents:', fs.readdirSync(uiDir));
    } else {
      console.error('✗ src/components/ui directory is missing');
    }
    
    if (fs.existsSync(adminDir)) {
      console.log('✓ src/components/admin directory exists');
      console.log('Contents:', fs.readdirSync(adminDir));
    } else {
      console.error('✗ src/components/admin directory is missing');
    }
  } else {
    console.error('✗ src/components directory is missing');
  }
} catch (error) {
  console.error('Error checking directories:', error);
}

console.log('\nBuild check completed');
process.exit(allFilesExist ? 0 : 1); 