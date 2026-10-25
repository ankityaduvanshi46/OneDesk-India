import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')

console.log('[Favicon Generator] Checking favicons & touch icons...')

const icoPath = path.join(publicDir, 'favicon.ico')
const icon48Path = path.join(publicDir, 'favicon-48x48.png')

// Check if sips is available (macOS utility)
let hasSips = false
try {
  execSync('which sips', { stdio: 'pipe' })
  hasSips = true
} catch {
  hasSips = false
}

if (!hasSips) {
  if (fs.existsSync(icoPath) && fs.existsSync(icon48Path)) {
    console.log('✅  Pre-generated favicons exist and sips is not present (Linux/CI environment). Skipping regeneration.')
    process.exit(0)
  }
}

const svgPath = path.join(publicDir, 'favicon.svg')
if (!fs.existsSync(svgPath)) {
  console.error('[Favicon Generator] Error: public/favicon.svg not found!')
  process.exit(1)
}

// 1. Read favicon.svg and create a 512x512 master raster
let svgContent = fs.readFileSync(svgPath, 'utf8')
svgContent = svgContent.replace(/width="100%" height="100%"/, 'width="512" height="512"')

const tempSvg = path.join(publicDir, '.temp-512.svg')
const master512Png = path.join(publicDir, 'icon-512.png')
fs.writeFileSync(tempSvg, svgContent, 'utf8')

try {
  // Use macOS sips to render vector SVG to high-res PNG
  execSync(`sips -s format png "${tempSvg}" --out "${master512Png}"`, { stdio: 'pipe' })

  // Also create logo.png as alias to 512 master
  fs.copyFileSync(master512Png, path.join(publicDir, 'logo.png'))

  // 2. Generate required icon sizes
  // 48x48 is explicitly required by Google Search Favicon Guidelines
  const targetSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'icon-192.png' }
  ]

  for (const { size, name } of targetSizes) {
    const dest = path.join(publicDir, name)
    execSync(`sips -z ${size} ${size} "${master512Png}" --out "${dest}"`, { stdio: 'pipe' })
  }

  // 3. Construct binary multi-resolution favicon.ico container (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48]
  const images = icoSizes.map((s) => ({
    width: s,
    height: s,
    buffer: fs.readFileSync(path.join(publicDir, `favicon-${s}x${s}.png`))
  }))

  const headerSize = 6
  const entrySize = 16
  let offset = headerSize + entrySize * images.length

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // Reserved
  header.writeUInt16LE(1, 2) // Type 1 = ICO
  header.writeUInt16LE(images.length, 4) // Number of images

  const entries = []
  for (const img of images) {
    const entry = Buffer.alloc(entrySize)
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0)
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1)
    entry.writeUInt8(0, 2) // Colors
    entry.writeUInt8(0, 3) // Reserved
    entry.writeUInt16LE(1, 4) // Color planes
    entry.writeUInt16LE(32, 6) // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8) // Size of image data
    entry.writeUInt32LE(offset, 12) // Offset from file start
    entries.push(entry)
    offset += img.buffer.length
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)])
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer)

  console.log('✅  Generated favicon.ico (16, 32, 48px), favicon-48x48.png, apple-touch-icon.png, icon-192.png, icon-512.png')
} finally {
  if (fs.existsSync(tempSvg)) {
    try {
      fs.unlinkSync(tempSvg)
    } catch {
      // ignore
    }
  }
}
