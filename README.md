# @printhive/bambu-models

Bambu Lab printer models, their identity and their hardware, with a source for every fact.

- Look a printer up by its SSDP model code, serial number, MQTT `printer_type`, or reported product name.
- Every value carries `{ value, source, ref }`, so a reader can see where a fact came from and re-check it.
- A missing field means unknown, never false.
- No runtime dependencies: plain data and types.

[@printhive/lanscout](https://github.com/PrintHive/lanscout) and @printhive/bambu use it. It covers what a printer is, not how its firmware talks.

## Install

```sh
npm install @printhive/bambu-models
```

## Use it

```ts
import { modelByCode, modelBySerial, models } from "@printhive/bambu-models"

const id = modelByCode("C12") // "P1S"
const printer = id && models[id]

printer?.camera?.value // "jpeg-tls-6000"
printer?.camera?.source // "community-mit"
printer?.camera?.ref // where to check it

modelBySerial("01P00C000000000") // "P1S"
```

`ModelId` is the union of the table's keys, such as `"X1C"` or `"H2DPRO"`. `ModelCode` is the union of every model code in the table, such as `"C12"` or `"BL-P001"`. Code keyed by `ModelId` fails to compile when a model is missing.

## Fields

| Field | Meaning |
| --- | --- |
| `name` | Marketing name, such as `X1-Carbon` |
| `productName` | The `product_name` the printer reports in its module list, such as `Bambu Lab P1S` |
| `shortName` | PrintHive's short token, such as `A1M` or `H2D Pro` |
| `family` | `A1`, `A2`, `H2`, `P1`, `P2`, `X1`, or `X2` |
| `modelCodes` | SSDP `DevModel.bambu.com` values, also the cloud's `dev_model_name` |
| `serialPrefixes` | First three characters of the serial number |
| `printerTypes` | MQTT `print.printer_type` values |
| `extruders` | 1 or 2 |
| `amsKindsSeen` | AMS kinds seen attached to the model. Not exhaustive |
| `chamberSensor` | `real`, `placeholder`, or `none` |
| `chamberHeating` | Whether the chamber is actively heated |
| `camera` | `rtsps-322`, `jpeg-tls-6000`, or `none` |
| `ftps` | The FTPS port |

## Sources

Every fact comes from one of these, named in its `source`:

| Source | What it is |
| --- | --- |
| `tape` | PrintHive's own captures from real printers |
| `community-mit` | [pybambu](https://github.com/greghesp/ha-bambulab) in ha-bambulab, MIT, pinned at `0e027ff` |
| `openbambuapi` | Facts documented by [OpenBambuAPI](https://github.com/Doridian/OpenBambuAPI), GFDL-1.3, pinned at `cc383a2` |
| `vendor-doc` | Bambu Lab's own published documentation |
| `inferred` | PrintHive conventions, such as the short names |

The table never copies from or derives from AGPL or GPL projects, such as BambuStudio or OrcaSlicer. Those may be used only to cross-check a fact that already has a clean source.

Model codes, serial prefixes, and `printer_type` values are known for only some models so far. Each fact is added when a capture or a clean source confirms it.

## Develop

```sh
bun install
bun run check
bun run build
```

## License

MIT
