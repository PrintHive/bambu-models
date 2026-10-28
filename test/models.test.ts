import { describe, expect, it } from "vitest"
import { modelByCode, modelByPrinterType, modelByProductName, modelBySerial, modelIds, models } from "../src/index.ts"
import type { Model, ModelCode, Sourced } from "../src/index.ts"

const SOURCES = ["tape", "vendor-doc", "community-mit", "openbambuapi", "inferred"]

const facts = (): Array<[string, string, Sourced<unknown>]> =>
  modelIds.flatMap((id) => Object.entries(models[id]).map(([field, fact]): [string, string, Sourced<unknown>] => [id, field, fact]))

describe("models", () => {
  it("gives every fact a known source and a ref", () => {
    const unsourced = facts().filter(([, , f]) => !SOURCES.includes(f.source) || f.ref.trim() === "")

    expect(unsourced).toEqual([])
  })

  it.each(["modelCodes", "serialPrefixes", "printerTypes", "productName"] as const)("never assigns one %s to two models", (field) => {
    const owners = new Map<string, Array<string>>()

    for (const id of modelIds) {
      const model: Model = models[id]
      const values = field === "productName" ? [model.productName?.value ?? []].flat() : (model[field]?.value ?? [])

      for (const v of values) owners.set(v, [...(owners.get(v) ?? []), id])
    }

    expect([...owners].filter(([, ids]) => ids.length > 1)).toEqual([])
  })

  it("looks models up by code, serial, and product name", () => {
    expect(["C12", "N2S", "BL-P001", "O1D", "C11", "N1"].map(modelByCode)).toEqual(["P1S", "A1", "X1C", "H2D", "P1P", "A1M"])
    expect(modelBySerial("01P00C000000000")).toBe("P1S")
    expect(modelBySerial("00m00a000000000")).toBe("X1C")
    expect(modelByProductName("Bambu Lab H2D Pro")).toBe("H2DPRO")
    expect([modelByCode("ZZZ"), modelBySerial("ZZZ0000"), modelByPrinterType("unknown")]).toEqual([undefined, undefined, undefined])
  })

  it("types model codes as a literal union", () => {
    const known: ReadonlyArray<ModelCode> = ["N2S", "N1", "C11", "C12", "O1D", "BL-P001"]
    // @ts-expect-error: a code missing from the table is not a ModelCode
    const unknown: ModelCode = "ZZZ"

    expect([known.length, unknown]).toEqual([6, "ZZZ"])
  })
})
