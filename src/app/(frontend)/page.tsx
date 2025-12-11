import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './globals.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  return <div className="home"></div>
}
