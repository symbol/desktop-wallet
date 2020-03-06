// internal dependencies
import Vue from 'vue'
import {Mosaic} from 'symbol-sdk'

export class MosaicInputsManager {
  /**
   * Maps mosaic hex ids to slots (input indexes)
   * @private
   */
  private mosaicMap: Record<string, number | null> = {}

  /**
   * Initialize a new instance of MosaicInputsManager
   * @static
   * @param {Mosaic[]} mosaics
   * @param {MosaicService} mosaicService
   * @returns {MosaicInputsManager}
   */
  public static initialize(mosaics: Mosaic[]): MosaicInputsManager {
    return new MosaicInputsManager(mosaics || [])
  }

  /**
   * Creates an instance of MosaicInputsManager.
   * @param {Mosaic[]} mosaics
   */
  private constructor(mosaics: Mosaic[]) {
    // Set mosaicMap with null values
    mosaics.forEach(mosaic => Vue.set(this.mosaicMap, mosaic.id.toHex(), null))
  }

  /**
   * Whether the mosaicMap has a free slot
   * If yes, a new mosaic input can be created
   * @returns {boolean}
   */
  public hasFreeSlots(): boolean {
    return Object.values(this.mosaicMap).find(values => values === null) !== undefined
  }

  /**
   * Affects a mosaic hex to a slot
   * @param {string} hexId
   * @param {number} index
   */
  public setSlot(hexId: string, index: number): void {
    // get the entry
    const slot = this.mosaicMap[hexId]

    // throw if an entry does not exist for the provided mosaic id
    if (slot === undefined) {
      throw new Error(`${hexId} does not exist in ${JSON.stringify(this.mosaicMap)}`)
    }

    // throw if the entry is already affected to another input
    if (slot !== null && slot !== index) {
      throw new Error(`${hexId} is already affected to input ${slot}`)
    }

    // unset the current slot allocation
    this.unsetSlot(index)

    // allocate the entry
    Vue.set(this.mosaicMap, hexId, index)
  }

  /**
   * Set a slot to null
   * @param {number} index
   */
  public unsetSlot(index: number): void {
    // get the slot entry
    const entry = this.getEntryBySlot(index)

    // ignore if the slot had no affected entry
    if (entry === undefined) return

    // unset the entry slot allocation
    const [hexId] = entry
    Vue.set(this.mosaicMap, hexId, null)
  }

  /**
   * Returns mosaics that can be used by a slot
   *
   * @param {number} index
   * @returns {string[]}
   */
  public getMosaicsBySlot(index: number): string[] {
    // get affected mosaic
    const affectedEntry = this.getEntryBySlot(index)

    // get non-affected entries
    const nonAffectedEntries = Object.entries(this.mosaicMap)
      .filter(([, slot]) => slot === null)
      .map(([hex]) => hex)

    return affectedEntry
      ? [affectedEntry[0], ...nonAffectedEntries]
      : nonAffectedEntries
  }

  /**
   * Returns an entry given a slot number
   * @private
   * @param {number} index
   * @returns {([string, number] | undefined)}
   */
  private getEntryBySlot(index: number): [string, number] | undefined {
    return Object.entries(this.mosaicMap).find(([, slot]) => slot == index)
  }
}
