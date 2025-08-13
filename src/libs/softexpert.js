// src/libs/softexpert.js
import { XMLParser } from 'fast-xml-parser'
import { buildEnvelope, callSoap } from './soapClient.js'

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true
})

const ensureArray = (x) => (Array.isArray(x) ? x : x ? [x] : [])

// --- cache simple (opcional)
let cache = { time: 0, data: [] }
const TTL_MS = 60 * 1000 // 60s

export async function searchCategoryRaw() {
  const now = Date.now()
  if (now - cache.time < TTL_MS && cache.data.length) return cache.data

  const body = buildEnvelope('<urn:searchCategory/>')
  const xml = await callSoap({ body })
  const obj = parser.parse(xml)

  const items = ensureArray(
    obj?.Envelope?.Body?.searchCategoryResponse?.return?.RESULTARRAY?.item
  )

  cache = { time: now, data: items }
  return items
}

export async function searchCategoryByOwner(owner) {
  const list = await searchCategoryRaw()
  if (owner === undefined || owner === null || owner === '') return list
  const s = String(owner)
  return list.filter(it => String(it.CDCATEGORYOWNER) === s)
}
