import { DataWritten as DataWrittenEvent } from "../generated/Contract/Contract"
import { DataWritten } from "../generated/schema"

export function handleDataWritten(event: DataWrittenEvent): void {
  let entity = new DataWritten(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.tag = event.params.tag
  entity.data = event.params.data
  entity.dataHash = event.params.dataHash
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
