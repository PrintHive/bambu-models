import type { Model } from "./model.ts"
import { models } from "./models.ts"

export type { AmsKind, Camera, ChamberSensor, Family, Model, Source, Sourced } from "./model.ts"

export { models }

export type ModelId = keyof typeof models

type CodesOf<K extends ModelId> = (typeof models)[K] extends { readonly modelCodes: { readonly value: ReadonlyArray<infer C> } } ? C : never

/** Every SSDP `DevModel.bambu.com` value in the table, as a literal union. */
export type ModelCode = { readonly [K in ModelId]: CodesOf<K> }[ModelId]

export const modelIds: ReadonlyArray<ModelId> = Object.keys(models).filter((id): id is ModelId => Object.hasOwn(models, id))

const index = (values: (model: Model) => ReadonlyArray<string> | undefined): ReadonlyMap<string, ModelId> => {
  const out = new Map<string, ModelId>()

  for (const id of modelIds) for (const value of values(models[id]) ?? []) out.set(value, id)

  return out
}

const byModelCode = index((m) => m.modelCodes?.value)
const bySerialPrefix = index((m) => m.serialPrefixes?.value)
const byPrinterType = index((m) => m.printerTypes?.value)
const byProductName = index((m) => (m.productName ? [m.productName.value] : undefined))

/** The model with this SSDP `DevModel.bambu.com` code, such as `C12`. */
export const modelByCode = (code: string): ModelId | undefined => byModelCode.get(code)

/** The model whose serials start like this one. */
export const modelBySerial = (serial: string): ModelId | undefined => bySerialPrefix.get(serial.slice(0, 3).toUpperCase())

/** The model with this MQTT `print.printer_type`. */
export const modelByPrinterType = (printerType: string): ModelId | undefined => byPrinterType.get(printerType)

/** The model whose module list reports this `product_name`, such as `Bambu Lab H2D`. */
export const modelByProductName = (productName: string): ModelId | undefined => byProductName.get(productName)
