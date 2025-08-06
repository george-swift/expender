/* tslint:disable */

//  This file was automatically generated and should not be edited.

export type ScanResultInput = {
  merchant: string
  date: string
  category: string
  currency: string
  amount: number
  createdAt: string
  confidence?: number | null
}

export type SmartScanResult = {
  __typename: 'SmartScanResult'
  userId?: string | null
  scanId?: string | null
  objectKey?: string | null
  result?: ScanResult | null
}

export type ScanResult = {
  __typename: 'ScanResult'
  merchant: string
  date: string
  category: string
  currency: string
  amount: number
  createdAt: string
  confidence?: number | null
}

export type PublishSmartScanResultMutationVariables = {
  userId: string
  scanId: string
  objectKey: string
  result: ScanResultInput
}

export type PublishSmartScanResultMutation = {
  publishSmartScanResult?: {
    __typename: 'SmartScanResult'
    userId?: string | null
    scanId?: string | null
    objectKey?: string | null
    result?: {
      __typename: 'ScanResult'
      merchant: string
      date: string
      category: string
      currency: string
      amount: number
      createdAt: string
      confidence?: number | null
    } | null
  } | null
}

export type GetSmartScanResultQueryVariables = {
  userId: string
  scanId: string
}

export type GetSmartScanResultQuery = {
  getSmartScanResult?: {
    __typename: 'SmartScanResult'
    userId?: string | null
    scanId?: string | null
    objectKey?: string | null
    result?: {
      __typename: 'ScanResult'
      merchant: string
      date: string
      category: string
      currency: string
      amount: number
      createdAt: string
      confidence?: number | null
    } | null
  } | null
}

export type OnSmartScanResultAvailableSubscriptionVariables = {
  userId: string
}

export type OnSmartScanResultAvailableSubscription = {
  onSmartScanResultAvailable?: {
    __typename: 'SmartScanResult'
    userId?: string | null
    scanId?: string | null
    objectKey?: string | null
    result?: {
      __typename: 'ScanResult'
      merchant: string
      date: string
      category: string
      currency: string
      amount: number
      createdAt: string
      confidence?: number | null
    } | null
  } | null
}
