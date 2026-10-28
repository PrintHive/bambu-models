import type { AmsKind, Camera, Family, Model, Source, Sourced } from "./model.ts"

/** ha-bambulab's pybambu, MIT. */
const PYBAMBU = "greghesp/ha-bambulab@0e027ff, custom_components/bambu_lab/pybambu"

/** OpenBambuAPI, GFDL-1.3; only facts are used. */
const OPENBAMBUAPI = "Doridian/OpenBambuAPI@cc383a2"

/** PrintHive's own LAN capture: SSDP `DevModel.bambu.com` and the serial in each printer's MQTT TLS certificate. */
const TAPE = "PrintHive LAN capture 2026-10-28, lanscout SSDP and TLS certificate"

const fact = <const A>(value: A, source: Source, ref: string): Sourced<A> => ({ value, source, ref })

const pybambu = <const A>(value: A, ref: string) => fact(value, "community-mit", `${PYBAMBU}/${ref}`)

const openBambuApi = <const A>(value: A, ref: string) => fact(value, "openbambuapi", `${OPENBAMBUAPI}/${ref}`)

const tape = <const A>(value: A) => fact(value, "tape", TAPE)

const short = (value: string) => fact(value, "inferred", "PrintHive short names")

const product = (name: string) => pybambu(`Bambu Lab ${name}`, "utils.py get_printer_type product_map")

const named = (name: string) => pybambu(name, "utils.py get_printer_type product_map")

const family = (value: Family) => pybambu(value, "models.py supports_feature model groups")

const single = pybambu(1, "models.py supports_feature DUAL_NOZZLES")

const dual = pybambu(2, "models.py supports_feature DUAL_NOZZLES")

const rtsps: Sourced<Camera> = fact("rtsps-322", "community-mit", `${PYBAMBU}/models.py supports_feature CAMERA_RTSP; port 322 per ${OPENBAMBUAPI}/video.md`)

const jpeg: Sourced<Camera> = fact("jpeg-tls-6000", "community-mit", `${PYBAMBU}/models.py supports_feature CAMERA_IMAGE; port 6000 per ${OPENBAMBUAPI}/video.md`)

const chamberReal = pybambu("real", "models.py supports_feature CHAMBER_TEMPERATURE")

const chamberNone = pybambu("none", "models.py supports_feature CHAMBER_TEMPERATURE")

const heated = pybambu(true, "models.py supports_feature ACTIVE_CHAMBER_HEATER")

const unheated = pybambu(false, "models.py supports_feature ACTIVE_CHAMBER_HEATER")

const ftps = openBambuApi({ port: 990 }, "ftp.md")

const ams = (kinds: ReadonlyArray<AmsKind>, mock: string) => pybambu(kinds, `mock_data/${mock} AMS product_name`)

/**
 * Every Bambu Lab printer model known to PrintHive, keyed by a stable id. Built only from PrintHive's own captures
 * and permissively licensed or factual sources; see each fact's `ref`.
 */
export const models = {
  A1: {
    name: named("A1"),
    productName: product("A1"),
    shortName: short("A1"),
    family: family("A1"),
    modelCodes: fact(["N2S"], "tape", `${TAPE}; also ${PYBAMBU}/utils.py get_printer_type project_name`),
    serialPrefixes: tape(["039"]),
    extruders: single,
    chamberSensor: chamberNone,
    chamberHeating: unheated,
    camera: jpeg,
    ftps
  },
  A1M: {
    name: named("A1 mini"),
    productName: product("A1 mini"),
    shortName: short("A1M"),
    family: family("A1"),
    modelCodes: pybambu(["N1"], "utils.py get_printer_type project_name"),
    extruders: single,
    chamberSensor: chamberNone,
    chamberHeating: unheated,
    camera: jpeg,
    ftps
  },
  A2L: {
    name: named("A2L"),
    productName: product("A2L"),
    shortName: short("A2L"),
    family: family("A2"),
    extruders: single,
    amsKindsSeen: ams(["AMS lite"], "MOCK-A2L.json"),
    chamberSensor: chamberNone,
    chamberHeating: unheated,
    camera: jpeg,
    ftps
  },
  P1P: {
    name: named("P1P"),
    productName: product("P1P"),
    shortName: short("P1P"),
    family: family("P1"),
    modelCodes: pybambu(["C11"], "utils.py get_printer_type project_name"),
    extruders: single,
    chamberHeating: unheated,
    camera: jpeg,
    ftps
  },
  P1S: {
    name: named("P1S"),
    productName: product("P1S"),
    shortName: short("P1S"),
    family: family("P1"),
    modelCodes: fact(["C12"], "tape", `${TAPE}; also ${PYBAMBU}/utils.py get_printer_type project_name`),
    serialPrefixes: tape(["01P"]),
    extruders: single,
    chamberHeating: unheated,
    camera: jpeg,
    ftps
  },
  P2S: {
    name: named("P2S"),
    productName: product("P2S"),
    shortName: short("P2S"),
    family: family("P2"),
    extruders: single,
    amsKindsSeen: ams(["AMS 2 Pro"], "MOCK-P2S.json"),
    chamberSensor: chamberReal,
    chamberHeating: unheated,
    camera: rtsps,
    ftps
  },
  H2C: {
    name: named("H2C"),
    productName: product("H2C"),
    shortName: short("H2C"),
    family: family("H2"),
    extruders: dual,
    amsKindsSeen: ams(["AMS 2 Pro"], "MOCK-H2C.json"),
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  },
  H2D: {
    name: named("H2D"),
    productName: product("H2D"),
    shortName: short("H2D"),
    family: family("H2"),
    modelCodes: tape(["O1D"]),
    serialPrefixes: tape(["094"]),
    extruders: dual,
    amsKindsSeen: ams(["AMS", "AMS 2 Pro", "AMS HT"], "MOCK-H2DEXTSPOOLACTIVE.json"),
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  },
  H2DPRO: {
    name: named("H2D Pro"),
    productName: product("H2D Pro"),
    shortName: short("H2D Pro"),
    family: family("H2"),
    extruders: dual,
    amsKindsSeen: ams(["AMS 2 Pro", "AMS HT"], "MOCK-H2DPRO.json"),
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  },
  H2S: {
    name: named("H2S"),
    productName: product("H2S"),
    shortName: short("H2S"),
    family: family("H2"),
    extruders: single,
    amsKindsSeen: ams(["AMS 2 Pro"], "MOCK-H2S.json"),
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  },
  X1: {
    name: pybambu("X1", "const.py Printers"),
    shortName: short("X1"),
    family: family("X1"),
    extruders: single,
    chamberSensor: chamberReal,
    chamberHeating: unheated,
    camera: rtsps,
    ftps
  },
  X1C: {
    name: pybambu("X1-Carbon", "mock_data/MOCK-X1CMULTIAMS.json product_name"),
    productName: pybambu("Bambu Lab X1-Carbon", "mock_data/MOCK-X1CMULTIAMS.json product_name"),
    shortName: short("X1C"),
    family: family("X1"),
    modelCodes: fact(["BL-P001"], "tape", `${TAPE}; also ${PYBAMBU}/bambu_cloud.py dev_model_name`),
    serialPrefixes: tape(["00M"]),
    extruders: single,
    amsKindsSeen: ams(["AMS", "AMS 2 Pro", "AMS HT"], "MOCK-X1CMULTIAMS.json"),
    chamberSensor: chamberReal,
    chamberHeating: unheated,
    camera: rtsps,
    ftps
  },
  X1E: {
    name: pybambu("X1E", "const.py Printers"),
    shortName: short("X1E"),
    family: family("X1"),
    extruders: single,
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  },
  X2D: {
    name: named("X2D"),
    productName: product("X2D"),
    shortName: short("X2D"),
    family: family("X2"),
    extruders: dual,
    amsKindsSeen: ams(["AMS 2 Pro"], "MOCK-X2D.json"),
    chamberSensor: chamberReal,
    chamberHeating: heated,
    camera: rtsps,
    ftps
  }
} as const satisfies Record<string, Model>
