const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Checking for linter errors in RDP and VPS service pages...');

try {
  console.log('Checking src/app/dashboard/services/rdp/page.tsx');
  execSync('npx eslint src/app/dashboard/services/rdp/page.tsx', { stdio: 'inherit' });
  console.log('✅ No errors in RDP page');
} catch (error) {
  console.log('❌ Errors found in RDP page');
}

try {
  console.log('Checking src/app/dashboard/services/vps/page.tsx');
  execSync('npx eslint src/app/dashboard/services/vps/page.tsx', { stdio: 'inherit' });
  console.log('✅ No errors in VPS page');
} catch (error) {
  console.log('❌ Errors found in VPS page');
}

try {
  console.log('Checking src/utils/services.ts');
  execSync('npx eslint src/utils/services.ts', { stdio: 'inherit' });
  console.log('✅ No errors in services utility');
} catch (error) {
  console.log('❌ Errors found in services utility');
}

console.log('Check complete!'); 