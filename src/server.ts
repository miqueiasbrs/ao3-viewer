import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { networkInterfaces } from 'node:os'

import { app } from './app.js'

const PORT = Number(process.env.PORT ?? 5173)

function parseIPv4Addresses(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('Ethernet') || line.startsWith('Wi-Fi'))
    .map((line) => line.split(/\s+/).pop() ?? '')
    .filter((line) => !line.startsWith('169.254') && /^\d+\.\d+\.\d+\.\d+$/.test(line))
}

function isRunningInWsl() {
  if (process.platform !== 'linux') return false

  try {
    const procVersion = readFileSync('/proc/version', 'utf8').toLowerCase()
    return procVersion.includes('microsoft')
  } catch {
    return false
  }
}

function getWindowsIPv4Address() {
  if (!isRunningInWsl()) return null

  try {
    const defaultRouteCommand = `powershell.exe -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress"`
    const defaultRouteOutput = execSync(defaultRouteCommand, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })

    const addresses = parseIPv4Addresses(defaultRouteOutput)
    for (const address of addresses) {
      console.log(`- Windows: http://${address}:${PORT}`)
    }
  } catch {
    return
  }
}

function getLocalIPv4Addresses() {
  const interfaces = networkInterfaces()
  const addresses = new Set<string>()

  for (const net of Object.values(interfaces)) {
    if (!net) continue

    for (const address of net) {
      if (address.family === 'IPv4' && !address.internal) {
        addresses.add(address.address)
      }
    }
  }

  for (const address of addresses) {
    console.log(`- Network: http://${address}:${PORT}`)
  }
}

app.listen(PORT, () => {
  console.log('HTTP server started:')
  console.log(`- Local:   http://localhost:${PORT}`)

  getWindowsIPv4Address()
  getLocalIPv4Addresses()
})

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Shutting down HTTP server...`)

  app.close((error) => {
    if (error) {
      console.error('Error while closing server:', error)
      process.exit(1)
      return
    }

    console.log('HTTP server closed gracefully.')
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
