// src/libs/soapClient.js
import axios from 'axios'
import https from 'https'
import { softExpert } from '../softExpertConfig.js'

const allowSelf = process.env.ALLOW_SELF_SIGNED === 'true'
if (allowSelf) {
  // ⚠️ solo DEV
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: !allowSelf
})

// Cliente axios fijo (mantiene agent en redirects y evita proxy)
const client = axios.create({
  timeout: softExpert.timeout,
  httpsAgent,
  proxy: false,
  maxRedirects: 5,
  beforeRedirect: (options) => { options.agent = httpsAgent }
})

export const buildEnvelope = (innerXml) => `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:document">
  <soapenv:Header/>
  <soapenv:Body>${innerXml}</soapenv:Body>
</soapenv:Envelope>`

export async function callSoap({ body, soapAction = softExpert.soapAction }) {
  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'Accept': 'text/xml',
    'User-Agent': 'CaptureSoft/1.0'
  }

  // SOAPAction opcional (si tu gateway falla, deja soapAction = '' en la config)
  if (soapAction) headers['SOAPAction'] = `"${soapAction}"`

  // Header de token configurable
  if (softExpert.token) {
    const name = softExpert.tokenHeader || 'Authorization'   // p.ej. 'Authorization' | 'X-Auth-Token' | 'token'
    const prefix = softExpert.tokenPrefix ?? 'Bearer '        // p.ej. 'Bearer ' o '' (sin prefijo)
    headers[name] = `${prefix}${softExpert.token}`.trim()
  }

  // DEBUG opcional (borra en prod)
  // console.log('Auth header ->', Object.keys(headers).find(h => h.toLowerCase().includes('auth') || h === 'token'), headers.Authorization || headers['X-Auth-Token'] || headers.token)

  const { status, data } = await client.post(softExpert.url, body, { headers })
  if (status !== 200) throw new Error(`SOAP HTTP ${status}`)

  if (typeof data === 'string' && data.includes('<Fault>')) {
    const m = data.match(/<faultstring>([\s\S]*?)<\/faultstring>/i)
    throw new Error(`SOAP Fault: ${m ? m[1] : 'Unknown fault'}`)
  }
  return data
}
