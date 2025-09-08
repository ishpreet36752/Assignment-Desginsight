#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up DesignSight Testing Environment...\n');

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
    console.log(`${colors.green}${description} - COMPLETED${colors.reset}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}${description} - FAILED${colors.reset}\n`);
    return false;
  }
}

async function setupTests() {
  const backendPath = path.join(__dirname, 'backend');
  const frontendPath = path.join(__dirname, 'frontend');
  
  console.log(`${colors.blue}${colors.bold}📦 Installing Dependencies...${colors.reset}\n`);
  
  // Install backend dependencies
  const backendInstall = runCommand('npm install', backendPath, 'Backend Dependencies');
  
  // Install frontend dependencies
  const frontendInstall = runCommand('npm install', frontendPath, 'Frontend Dependencies');
  
  if (!backendInstall || !frontendInstall) {
    console.log(`${colors.red}❌ Dependency installation failed. Please check the errors above.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}${colors.bold}🎉 Testing environment setup complete!${colors.reset}\n`);
  console.log(`${colors.blue}Next steps:${colors.reset}`);
  console.log(`1. Run backend tests: ${colors.yellow}cd backend && npm test${colors.reset}`);
  console.log(`2. Run frontend tests: ${colors.yellow}cd frontend && npm test${colors.reset}`);
  console.log(`3. Run all tests: ${colors.yellow}node run-tests.js${colors.reset}\n`);
  
  console.log(`${colors.green}🚀 Ready to test DesignSight!${colors.reset}`);
}

setupTests();
