#!/usr/bin/env node

import { execSync } from 'child_process'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

const log = {
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
}

function runCommand(name, command) {
  log.title(`[${name}]`)
  try {
    execSync(command, { stdio: 'pipe', encoding: 'utf8' })
    log.success(`${name} passed!`)
    return true
  } catch (error) {
    log.error(`${name} failed!`)
    console.log('')
    
    const output = error.stdout || error.stderr || ''
    const lines = output.split('\n').filter(line => line.trim())
    
    // Chỉ hiện các dòng quan trọng
    lines.forEach(line => {
      if (line.includes('error') || line.includes('Error')) {
        console.log(`  ${colors.red}${line}${colors.reset}`)
      } else if (line.includes('warning') || line.includes('warn')) {
        console.log(`  ${colors.yellow}${line}${colors.reset}`)
      } else if (line.includes('.tsx') || line.includes('.ts')) {
        console.log(`  ${colors.cyan}${line}${colors.reset}`)
      }
    })
    
    return false
  }
}

console.log('')
console.log('╔═══════════════════════════════════════════════════════╗')
console.log('║              🔍 RUNNING VALIDATION                    ║')
console.log('╚═══════════════════════════════════════════════════════╝')

const results = {
  typeCheck: runCommand('TypeScript', 'npx tsc --noEmit'),
  lint: runCommand('ESLint', 'npx eslint src --ext .ts,.tsx --quiet'),
  format: runCommand('Prettier', 'npx prettier --check "src/**/*.{ts,tsx,css,json}"'),
}

console.log('')
console.log('═══════════════════════════════════════════════════════')
console.log('')

const allPassed = Object.values(results).every(Boolean)

if (allPassed) {
  log.success('All checks passed! ✨')
} else {
  log.error('Some checks failed!')
  log.info('Run "npm run validate:fix" to auto-fix issues')
  process.exit(1)
}
