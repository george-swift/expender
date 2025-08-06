import * as APITypes from '@/types/smartscan'

type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType
  __generatedSubscriptionOutput: OutputType
}

export const onSmartScanResultAvailable =
  /* GraphQL */ `subscription OnSmartScanResultAvailable($userId: String!) {
  onSmartScanResultAvailable(userId: $userId) {
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
` as GeneratedSubscription<
    APITypes.OnSmartScanResultAvailableSubscriptionVariables,
    APITypes.OnSmartScanResultAvailableSubscription
  >
