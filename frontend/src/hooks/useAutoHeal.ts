'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Metrics, Prediction, Incident } from '@/src/types'

const POLL_MS = 3000

export function useAutoHeal() {
  const [metrics,    setMetrics]    = useState<Metrics | null>(null)
  const [history,    setHistory]    = useState<Metrics[]>([])
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [incidents,  setIncidents]  = useState<Incident[]>([])
  const [connected,  setConnected]  = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [mRes, hRes, pRes, iRes, hltRes] = await Promise.all([
        fetch('/api/metrics/current'),
        fetch('/api/metrics/history?n=80'),
        fetch('/api/predictions/latest'),
        fetch('/api/alerts/incidents?n=20'),
        fetch('/api/health'),
      ])

      if (!mRes.ok) throw new Error(`HTTP ${mRes.status}`)

      const [mData, hData, pData, iData, hltData] = await Promise.all([
        mRes.json(), hRes.json(), pRes.json(), iRes.json(), hltRes.json(),
      ])

      if (mData.metrics)      setMetrics(mData.metrics)
      if (hData.data)         setHistory(hData.data)
      if (pData.prediction)   setPrediction(pData.prediction)
      if (iData.data)         setIncidents(iData.data)
      if (hltData.model_ready !== undefined) setModelReady(hltData.model_ready)

      setConnected(true)
      setLastUpdate(new Date().toLocaleTimeString('en-US', { hour12: false }))
    } catch {
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    timerRef.current = setInterval(fetchAll, POLL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetchAll])

  const ackIncident = useCallback(async (id: number) => {
    try {
      await fetch(`/api/alerts/incidents/${id}/acknowledge`, { method: 'POST' })
      await fetchAll()
    } catch { /* silent */ }
  }, [fetchAll])

  return {
    metrics, history, prediction, incidents,
    connected, modelReady, lastUpdate, ackIncident,
  }
}
