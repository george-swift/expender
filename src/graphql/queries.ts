import * as APITypes from '@/types/smartscan'

type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType
  __generatedQueryOutput: OutputType
}

export const getSmartScanResult =
  /* GraphQL */ `query GetSmartScanResult($userId: String!, $scanId: String!) {
  getSmartScanResult(userId: $userId, scanId: $scanId) {
    userId
    scanId
    objectKey
    result {
      merchant
      date
      category
      currency
      amount
      createdAt
      confidence
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
    APITypes.GetSmartScanResultQueryVariables,
    APITypes.GetSmartScanResultQuery
  >
