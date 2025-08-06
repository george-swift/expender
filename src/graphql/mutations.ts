import * as APITypes from '@/types/smartscan'

type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType
  __generatedMutationOutput: OutputType
}

export const publishSmartScanResult =
  /* GraphQL */ `mutation PublishSmartScanResult(
  $userId: String!
  $scanId: String!
  $objectKey: String!
  $result: ScanResultInput!
) {
  publishSmartScanResult(
    userId: $userId
    scanId: $scanId
    objectKey: $objectKey
    result: $result
  ) {
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
` as GeneratedMutation<
    APITypes.PublishSmartScanResultMutationVariables,
    APITypes.PublishSmartScanResultMutation
  >
