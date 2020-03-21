/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// external dependencies
import {mapGetters} from 'vuex'
import {Component, Prop, Vue} from 'vue-property-decorator'
import {MosaicId} from 'symbol-sdk'
// internal dependencies
// configuration
// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'


@Component({
  components: {AmountDisplay},
  computed: {
    ...mapGetters({
      mosaics: 'mosaic/mosaics',
      networkCurrency: 'mosaic/networkCurrency',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class MosaicAmountDisplayTs extends Vue {

  @Prop({
    default: null,
    required: true,
  }) id: MosaicId

  @Prop({
    default: null,
  }) relativeAmount: number

  @Prop({
    default: null,
  }) absoluteAmount: number

  /**
   * Whether to show absolute amount or not
   */
  @Prop({
    default: false,
  }) absolute: boolean

  @Prop({
    default: 'green',
  }) color: 'red' | 'green'

  @Prop({
    default: 'normal',
  }) size: 'normal' | 'smaller' | 'bigger' | 'biggest'

  @Prop({
    default: false,
  }) showTicker: false

  @Prop({
    default: null,
  }) ticker: string

  private mosaics: MosaicModel[]

  private networkCurrency: NetworkCurrencyModel

  private networkConfiguration: NetworkConfigurationModel

  /// region computed properties getter/setter
  /**
   * Mosaic divisibility from database
   * @return {number}
   */
  protected get divisibility(): number {
    if (!this.id && this.networkCurrency) {
      return this.networkCurrency.divisibility
    }
    if (this.id && this.networkCurrency && this.id.toHex() === this.networkCurrency.mosaicIdHex) {
      return this.networkCurrency.divisibility
    }
    const mosaic = this.id && this.mosaics.find(m => m.mosaicIdHex === this.id.toHex())
    if (mosaic) return mosaic.divisibility

    return this.networkConfiguration.maxMosaicDivisibility

  }

  public get amount(): number {
    if (this.absolute && null === this.absoluteAmount) {
      return this.relativeAmount * Math.pow(10, this.divisibility)
    } else if (this.absolute) {
      return this.absoluteAmount
    } else if (!this.absolute && this.absoluteAmount && this.divisibility >= 0) {
      return this.absoluteAmount / Math.pow(10, this.divisibility)
    }
    return this.relativeAmount
  }

/// end-region computed properties getter/setter
}
