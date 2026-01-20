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
  dim: '\x1b[2m'
}

const log = {
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}  ${msg}${colors.reset}`)
}

function runFix(name, command) {
  log.title(`[${name}]`)
  try {
    const output = execSync(command, { stdio: 'pipe', encoding: 'utf8' })
    
    // Đếm số file được sửa
    const lines = output.split('\n').filter(l => l.trim())
    const fixed = lines.filter(l => !l.includes('unchanged') && l.includes('.ts')).length
    const unchanged = lines.filter(l => l.includes('unchanged')).length
    
    if (fixed > 0) {
      log.success(`Fixed ${fixed} file(s)`)
    } else {
      log.success(`All ${unchanged} files already formatted!`)
    }
    return true
  } catch (error) {
    const output = error.stdout || error.stderr || ''
    
    // Kiểm tra warnings
    const warnings = (output.match(/warning/gi) || []).length
    if (warnings > 0) {
      log.warn(`Completed with ${warnings} warning(s)`)
      return true
    }
    
    log.error(`${name} failed!`)
    return false
  }
}

console.log('')
console.log('╔═══════════════════════════════════════════════════════╗')
console.log('║              🔧 AUTO-FIXING CODE                      ║')
console.log('╚═══════════════════════════════════════════════════════╝')

const results = {
  lint: runFix('ESLint Fix', 'npx eslint src --ext .ts,.tsx --fix --quiet 2>&1 || true'),
  format: runFix('Prettier Format', 'npx prettier --write "src/**/*.{ts,tsx,css,json}" 2>&1')
}

console.log('')
console.log('═══════════════════════════════════════════════════════')
console.log('')

log.success('Auto-fix completed! ✨')
log.info('Run "npm run validate" to verify')
