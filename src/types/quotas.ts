export interface Quota {
  status: 'active' | 'deactivated'
  plan: 'Free Plan' | 'Pro Plan'
  limit: number
  used: number
  remaining: number
}
