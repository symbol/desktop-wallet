<template>
    <div class="root">
        <div class="row">
            <div class="image-container">
                <img :src="OptinLogo" class="image" />
            </div>
            <div class="text-container">
                <div class="title-text">
                    {{$t('optin_postlaunch_tx_title')}}
                </div>
                <div class="content-text text-description">
                    {{completed ? $t('optin_postlaunch_tx_completed_description') : $t('optin_postlaunch_tx_pending_description')}}
                </div>
                <div class="content-text">
                    <table>
                        <tr>
                            <td class="table-header-text">{{completed ? $t('optin_postlaunch_tx_completed_amount') : $t('optin_postlaunch_tx_pending_amount')}}</td>
                            <td class="amount-text">
                                <MosaicAmountDisplay
                                    v-if="amount !== null"
                                    :id="transferredMosaicId"
                                    :absolute-amount="amount"
                                    :show-ticker="true"
                                    color="green"
                                    
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="table-header-text">{{$t('optin_postlaunch_tx_nis_address')}}</td>
                            <td class="address-text">{{ NISAddress }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="details-button" @click="onDetailsClick">
                {{isDetailsShown ? $t('hide_details') : $t('show_details')}}
            </div>
            <div v-if="isDetailsShown" class="transaction-details">
                <TransactionDetails 
                    :transaction="transaction" 
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AggregateTransaction, UInt64, Mosaic, TransactionType, TransferTransaction, UnresolvedMosaicId } from 'symbol-sdk';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { optinImages } from '@/views/resources/Images';
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
import { TransactionView } from '@/core/transactions/TransactionView';
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';

@Component({
    components: {
        MosaicAmountDisplay,
        TransactionDetails
    }
})
export default class TransactionOptinPayoutDetails extends Vue {
    @Prop({ required: true }) readonly transaction: AggregateTransaction;
    @Prop({ required: true }) readonly currentAccount: AccountModel;

    private OptinLogo = optinImages.optinLogo;
    private isDetailsShown = false;

    private get referenceInnerTransaction(): TransferTransaction | null {
        const currentAddress = this.currentAccount.address;
        const transaction = this.transaction.innerTransactions.find(
            innerTransaction => 
                innerTransaction.type === TransactionType.TRANSFER &&
                (innerTransaction as TransferTransaction).recipientAddress?.plain() === currentAddress
        );

        return transaction as TransferTransaction || null;
    }

    private get completed(): boolean {
        return TransactionView.getTransactionStatus(this.transaction) === 'confirmed';
    }

    private get transferredMosaic(): Mosaic | null {
        return (this.referenceInnerTransaction?.mosaics?.length && this.referenceInnerTransaction.mosaics[0]) || null;
    }

    private get amount(): UInt64 {
        return this.transferredMosaic?.amount;
    }

    private get mosaicId(): UnresolvedMosaicId {
        return this.transferredMosaic?.id;
    }

    private get NISAddress(): string | null {
        let NISAddress = null;
        
        try {
            const json = JSON.parse(this.referenceInnerTransaction?.message.payload);
            NISAddress = json.nisAddress;
        }
        catch(e){}

        return NISAddress;
    }

    private onDetailsClick() {
        this.isDetailsShown = !this.isDetailsShown;
    }

    private mounted() {
        this.isDetailsShown = false;
    }
}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.root {
   padding-bottom: 33.2px;
}

.row {
    display: flex;
    flex-direction: row;
}

.column {
    display: flex;
    flex-direction: column;
}

.image-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 2rem;
    margin-top: -1px;
    margin-left: 0.1rem;
    margin-right: 0.3rem;
}

.image {
    width: 2rem;
    height: auto;
}

.text-container {
    flex: 1;
    color: @primary;
    font-size: @normalFont;
}

.title-text {
    font-family: @symbolFontBold;
    font-size: @subtitleFont;
    margin: 0 0 13px;
}

.content-text {
    font-family: @symbolFontMedium;
    margin: 16px 0;
    line-height: 28px;
}

.text-description {
    font-family: @symbolFont;
    margin-bottom: 32px;
}

.table-header-text {
   padding-right: 0.3rem;
   font-family: @symbolFontMedium;
}

.address-text {
    color: @purpleLightest;
}

.amount-text {
    color: @accentGreen;
}

.details-button {
    font-family: @symbolFontSemiBold;
    font-size: @smallFont;
    color: @accentPink;
    margin-right: 0.1rem;
    align-self: flex-end;
    cursor: pointer;
}

.transaction-details {
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: @line;
    margin: 0.3rem 0.1rem;
    padding-top: 0.3rem;
}
</style>
