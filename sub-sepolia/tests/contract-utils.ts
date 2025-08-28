import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { DataWritten } from "../generated/Contract/Contract"

export function createDataWrittenEvent(
  sender: Address,
  tag: Bytes,
  data: Bytes,
  dataHash: Bytes,
  timestamp: BigInt
): DataWritten {
  let dataWrittenEvent = changetype<DataWritten>(newMockEvent())

  dataWrittenEvent.parameters = new Array()

  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("tag", ethereum.Value.fromFixedBytes(tag))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam("dataHash", ethereum.Value.fromFixedBytes(dataHash))
  )
  dataWrittenEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return dataWrittenEvent
}
