/** Where a fact comes from. Every fact in the table carries one, with a `ref` precise enough to re-check it. */
export type Source = "tape" | "vendor-doc" | "community-mit" | "openbambuapi" | "inferred"

export interface Sourced<A> {
  readonly value: A
  readonly source: Source
  readonly ref: string
}

export type Family = "A1" | "A2" | "H2" | "P1" | "P2" | "X1" | "X2"

/** `rtsps-322` is an RTSPS stream on port 322; `jpeg-tls-6000` is a JPEG frame stream over TLS on port 6000. */
export type Camera = "rtsps-322" | "jpeg-tls-6000" | "none"

export type ChamberSensor = "real" | "placeholder" | "none"

export type AmsKind = "AMS" | "AMS 2 Pro" | "AMS HT" | "AMS lite"

/**
 * What a Bambu Lab printer model is: its identity and hardware. How its firmware talks belongs elsewhere.
 *
 * A missing field means unknown, never false or none. A field is present only when a source affirms it.
 */
export interface Model {
  readonly name: Sourced<string>
  /** The `product_name` the printer reports for itself in its module list, such as `Bambu Lab P1S`. */
  readonly productName?: Sourced<string>
  /** The short token PrintHive uses for the model, such as `A1M` or `H2D Pro`. */
  readonly shortName: Sourced<string>
  readonly family: Sourced<Family>
  /** SSDP `DevModel.bambu.com` values, which the cloud API also reports as `dev_model_name`. */
  readonly modelCodes?: Sourced<ReadonlyArray<string>>
  /** The first three characters of the serial number. */
  readonly serialPrefixes?: Sourced<ReadonlyArray<string>>
  /** MQTT `print.printer_type` values. */
  readonly printerTypes?: Sourced<ReadonlyArray<string>>
  readonly extruders?: Sourced<1 | 2>
  /** AMS kinds seen attached to this model. Not exhaustive: a kind absent here is unknown, not unsupported. */
  readonly amsKindsSeen?: Sourced<ReadonlyArray<AmsKind>>
  readonly chamberSensor?: Sourced<ChamberSensor>
  readonly chamberHeating?: Sourced<boolean>
  readonly camera?: Sourced<Camera>
  readonly ftps?: Sourced<{ readonly port: 990 }>
}
