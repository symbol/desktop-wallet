<template>
  <div class="transaction-details-item-inner-container">
    <div
      v-for="({ key, value, isMosaic }, index) in items"
      :key="index"
      class="transaction-row-outer-container"
    >
      <TransactionDetailRow :label="key" :value="value" :is-mosaic="isMosaic" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  MosaicId,
  TransferTransaction,
  NamespaceId,
  Address,
  Message,
} from 'nem2-sdk'

// internal dependencies
import { ViewTransferTransaction } from '@/core/transactions/ViewTransferTransaction'
import { MosaicService } from '@/services/MosaicService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

// @TODO: this type should be used more globally
interface AttachedMosaic {
  id: MosaicId | NamespaceId
  mosaicHex: string
  amount: number
}

@Component({ components: { TransactionDetailRow } })
export default class Transfer extends Vue {
  @Prop({ default: null }) view: ViewTransferTransaction

  /**
   * Displayed sender
   * @var {string}
   */
  private get sender(): string {
    if (this.view.transaction.signer) return this.view.transaction.signer.address.pretty()
    const currentSignerAddress = this.$store.getters['wallet/currentSignerAddress']
    return currentSignerAddress ? currentSignerAddress.pretty() : ''
  }

  /**
   * Displayed recipient
   * @var {string}
   */
  private get recipient(): string {
    const recipient = (this.view.transaction as TransferTransaction)
      .recipientAddress
    if (recipient instanceof NamespaceId) {
      const name = (recipient as NamespaceId).fullName
      return name.length ? name : (recipient as NamespaceId).toHex()
    }

    return (recipient as Address).pretty()
  }

  /**
   * Displayed items
   * @type {({ key: string, value: string | boolean, isMosaic: boolean }[])}
   */
  protected get items(): { key: string, value: any, isMosaic?: boolean }[] {
    const attachedMosaics: AttachedMosaic[] = this.view.values.get('mosaics')
    const message: Message = this.view.values.get('message')
    

    const mosaicItems = attachedMosaics.map((mosaic, index, self) => {
      // If the mosaicId is a namespaceId, try to substitute the namespaceId for a mosaicId
      const _mosaic = mosaic.id instanceof NamespaceId
        ? this.getMosaicWithMosaicIdFromNamespaceId(mosaic)
        : mosaic

      return {
        key: `${this.$t('mosaic')} (${index + 1}/${self.length})`,
        value: _mosaic,
        isMosaic: true,
      }
    })

    return [
      { key: 'sender', value: this.sender },
      { key: 'Recipient', value: this.recipient },
      ...mosaicItems,
      { key: 'message', value: message.payload || '-' },
    ]
  }

  // @TODO: quickfix, should be a service method
  private getMosaicWithMosaicIdFromNamespaceId(attachedMosaic: AttachedMosaic): AttachedMosaic {
    const service = new MosaicService(this.$store)
    const model = service.getMosaicSync(attachedMosaic.id)
    if (!model) return attachedMosaic
    return {
      id: new MosaicId(model.getIdentifier()),
      amount: attachedMosaic.amount,
      mosaicHex: model.getIdentifier(),
    }
  }
}
</script>

<style lang="less" scoped>
@import "../TransactionDetails.less";
</style>
