import fs from 'fs'
import path from 'path'

// Read properties.json
const propertiesPath = path.resolve(process.cwd(), 'lib/data/properties.json')
const propertiesData = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'))

// Read all files from /photos directory
const photosDir = path.resolve(process.cwd(), 'photos')
const photoFiles = fs.readdirSync(photosDir)

// Build a map: legacy_id -> array of image filenames
const photosMap = new Map()

for (const file of photoFiles) {
  // Parse filename: image_{legacy_id}_{number}.{ext}
  const match = file.match(/^image_(\d+)_(\d+)\.(jpg|jpeg)$/i)
  if (match) {
    const legacyId = match[1]
    if (!photosMap.has(legacyId)) {
      photosMap.set(legacyId, [])
    }
    photosMap.get(legacyId).push(file)
  }
}

// Sort images within each legacy_id by the sequence number
for (const [legacyId, files] of photosMap.entries()) {
  files.sort((a, b) => {
    const numA = parseInt(a.match(/_(\d+)\./)[1])
    const numB = parseInt(b.match(/_(\d+)\./)[1])
    return numB - numA
  })
}

// Transform properties - replace images array with actual filenames
const transformedProperties = propertiesData.map(property => {
  const legacyId = String(property.legacy_id)
  const images = photosMap.get(legacyId) || []
  return {
    ...property,
    images: images
  }
})

// Write to new file
const outputPath = path.resolve(process.cwd(), 'lib/data/imoti-new.json')
fs.writeFileSync(outputPath, JSON.stringify(transformedProperties, null, 2))

// Summary
console.log(`Processed ${transformedProperties.length} properties`)
console.log(`Found ${photosMap.size} unique legacy_ids in photos folder`)
console.log(`Total ${photoFiles.length} photo files`)
console.log(`\nProperties with images: ${transformedProperties.filter(p => p.images.length > 0).length}`)
console.log(`Properties without images: ${transformedProperties.filter(p => p.images.length === 0).length}`)
console.log(`\nOutput written to: ${outputPath}`)

// Show a sample of legacy_ids with their image counts
console.log('\nSample of legacy_ids with images:')
for (const [legacyId, files] of Array.from(photosMap.entries()).slice(0, 10)) {
  console.log(`  legacy_id ${legacyId}: ${files.length} images`)
}
