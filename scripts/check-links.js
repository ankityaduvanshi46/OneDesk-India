import { services } from '../src/data/services.js'

async function checkUrl(url) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'OneDeskIndia-LinkHealth/1.0' },
      signal: controller.signal,
      redirect: 'follow'
    })
    clearTimeout(timeoutId)
    return { ok: res.status < 400, status: res.status }
  } catch (err) {
    clearTimeout(timeoutId)
    try {
      const getRes = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'OneDeskIndia-LinkHealth/1.0' },
        signal: AbortSignal.timeout(8000),
        redirect: 'follow'
      })
      return { ok: getRes.status < 400, status: getRes.status }
    } catch (fallbackErr) {
      return { ok: false, status: 'ERROR', error: fallbackErr.message }
    }
  }
}

async function runHealthCheck() {
  console.log(`Starting link health check for ${services.length} government services on OneDesk India...`)
  const failures = []
  const successes = []

  for (let i = 0; i < services.length; i++) {
    const service = services[i]
    process.stdout.write(`[${i + 1}/${services.length}] Checking ${service.name}... `)
    const result = await checkUrl(service.url)

    if (result.ok) {
      console.log(`OK (${result.status})`)
      successes.push({ id: service.id, url: service.url, status: result.status })
    } else {
      console.log(`FAILED (${result.status})`)
      failures.push({ id: service.id, name: service.name, url: service.url, status: result.status, error: result.error })
    }
  }

  console.log('\n--- HEALTH CHECK SUMMARY ---')
  console.log(`Total Services: ${services.length}`)
  console.log(`Healthy Links: ${successes.length}`)
  console.log(`Flagged Links: ${failures.length}`)

  if (failures.length > 0) {
    console.log('\nFlagged Services Requiring Review:')
    console.table(failures)
    process.exit(1)
  } else {
    console.log('\nAll official links are accessible and valid!')
    process.exit(0)
  }
}

runHealthCheck()
