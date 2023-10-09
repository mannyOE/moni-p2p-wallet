interface LogHistory {
  type: string
  message: string
  time: number
}

interface Log {
  time_spent: number
  attempts: number
  authentication: string
  errors: number
  success: boolean
  mobile: boolean
  input: any[] // You can specify a more specific type if needed
  channel: string | null
  history: LogHistory[]
}

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  customer_code: string
  phone: string | null
  metadata: any // You can specify a more specific type if needed
  risk_action: string
}

interface Authorization {
  authorization_code: string
  bin: string
  last4: string
  exp_month: string
  exp_year: string
  card_type: string
  bank: string
  country_code: string
  brand: string
  account_name: string
  signature: string
}

interface Data {
  id: number
  domain: string
  status: string
  reference: string
  amount: number
  message: string | null
  gateway_response: string
  paid_at: string
  created_at: string
  channel: string
  currency: string
  ip_address: string
  metadata: {
    userId: number
    walletId: number
  } // You can specify a more specific type if needed
  log: Log
  fees: any | null // You can specify a more specific type if needed
  customer: Customer
  authorization: Authorization
  plan: any // You can specify a more specific type if needed
}

export interface ChargeEvent {
  event: string
  data: Data
}