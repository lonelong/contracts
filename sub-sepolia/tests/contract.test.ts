import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { DataWritten } from "../generated/schema"
import { DataWritten as DataWrittenEvent } from "../generated/Contract/Contract"
import { handleDataWritten } from "../src/contract"
import { createDataWrittenEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tag = Bytes.fromI32(1234567890)
    let data = Bytes.fromI32(1234567890)
    let dataHash = Bytes.fromI32(1234567890)
    let timestamp = BigInt.fromI32(234)
    let newDataWrittenEvent = createDataWrittenEvent(
      sender,
      tag,
      data,
      dataHash,
      timestamp
    )
    handleDataWritten(newDataWrittenEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("DataWritten created and stored", () => {
    assert.entityCount("DataWritten", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DataWritten",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DataWritten",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tag",
      "1234567890"
    )
    assert.fieldEquals(
      "DataWritten",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "data",
      "1234567890"
    )
    assert.fieldEquals(
      "DataWritten",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dataHash",
      "1234567890"
    )
    assert.fieldEquals(
      "DataWritten",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
