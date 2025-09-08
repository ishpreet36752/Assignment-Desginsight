#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('Running DesignSight Test Suite...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function runCommand(command, cwd, description) {
  console.log(`${colors.blue}${colors.bold}${description}${colors.reset}`);
  console.log(`${colors.yellow}Running: ${command}${colors.reset}\n`);
  
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    console.log(`${colors.green}${description} - PASSED${colors.reset}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}${description} - FAILED${colors.reset}\n`);
    return false;
  }
}

async function runAllTests() {
  const backendPath = path.join(__dirname, 'backend');
  const frontendPath = path.join(__dirname, 'frontend');
  
  let allPassed = true;
  
  // Install dependencies if needed
  console.log(`${colors.blue}${colors.bold}📦 Installing Dependencies...${colors.reset}\n`);
  
  try {
    runCommand('npm install', backendPath, 'Backend Dependencies');
    runCommand('npm install', frontendPath, 'Frontend Dependencies');
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Dependencies installation had issues, continuing with tests...${colors.reset}\n`);
  }
  
  // Run backend tests
  console.log(`${colors.blue}${colors.bold}🔧 Backend Tests${colors.reset}`);
  console.log('='.repeat(50));
  
  const backendPassed = runCommand(
    'npm test', 
    backendPath, 
    'Backend API Tests'
  );
  
  if (!backendPassed) allPassed = false;
  
  // Run frontend tests
  console.log(`${colors.blue}${colors.bold}⚛️  Frontend Tests${colors.reset}`);
  console.log('='.repeat(50));
  
  const frontendPassed = runCommand(
    'npm test', 
    frontendPath, 
    'Frontend Component Tests'
  );
  
  if (!frontendPassed) allPassed = false;
  
  // Run integration tests
  console.log(`${colors.blue}${colors.bold}🔗 Integration Tests${colors.reset}`);
  console.log('='.repeat(50));
  
  const integrationPassed = runCommand(
    'npm run test:integration', 
    backendPath, 
    'End-to-End Integration Tests'
  );
  
  if (!integrationPassed) allPassed = false;
  
  // Final results
  console.log(`${colors.blue}${colors.bold}📊 Test Results Summary${colors.reset}`);
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED!${colors.reset}`);
    console.log(`${colors.green}✅ Backend API Tests: PASSED${colors.reset}`);
    console.log(`${colors.green}✅ Frontend Component Tests: PASSED${colors.reset}`);
    console.log(`${colors.green}✅ Integration Tests: PASSED${colors.reset}`);
    console.log(`\n${colors.green}🚀 DesignSight is ready for production!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}❌ SOME TESTS FAILED${colors.reset}`);
    console.log(`${backendPassed ? colors.green + '✅' : colors.red + '❌'} Backend API Tests: ${backendPassed ? 'PASSED' : 'FAILED'}${colors.reset}`);
    console.log(`${frontendPassed ? colors.green + '✅' : colors.red + '❌'} Frontend Component Tests: ${frontendPassed ? 'PASSED' : 'FAILED'}${colors.reset}`);
    console.log(`${integrationPassed ? colors.green + '✅' : colors.red + '❌'} Integration Tests: ${integrationPassed ? 'PASSED' : 'FAILED'}${colors.reset}`);
    console.log(`\n${colors.yellow}🔧 Please fix the failing tests before proceeding.${colors.reset}`);
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Add integration test script to backend package.json
const fs = require('fs');
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  if (!packageJson.scripts['test:integration']) {
    packageJson.scripts['test:integration'] = 'jest --testPathPattern=integration';
    fs.writeFileSync(backendPackagePath, JSON.stringify(packageJson, null, 2));
  }
} catch (error) {
  console.log(`${colors.yellow}⚠️  Could not update package.json scripts${colors.reset}`);
}

runAllTests();
