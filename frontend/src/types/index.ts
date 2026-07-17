export interface Metrics {
  id?: number
  timestamp: string
  cpu: number; memory: number; requests: number
  latency: number; restarts: number; disk: number
  network_in: number; network_out: number; process_count: number
  fault_active: boolean; fault_type: string | null
  demo_fault_active?: boolean; demo_fault_type?: string
}

export interface Action {
  action: string
  priority: 'critical'|'high'|'medium'|'low'|'none'
  automated: boolean; cause: string
}

export interface ShapValue {
  feature: string
  value: number
  pct: number
  direction: 'positive' | 'negative'
}

export interface ShapData {
  available: boolean
  base_value?: number
  values: ShapValue[]
}

export interface Prediction {
  failure: boolean; confidence: number; confidence_raw: number
  status: string; root_causes: string[]
  cause_severities: Record<string,string>; actions: Action[]
  explanation: string; severity: 'critical'|'warning'|'info'
  model_probas: Record<string,number>; top_features: string[]
  shap: ShapData
  timestamp: string
}

export interface Incident {
  id: number; timestamp: string; severity: string
  root_causes: string[]; actions: string[]
  explanation: string; acknowledged: number; resolved: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
