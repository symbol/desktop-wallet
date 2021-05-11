<template>
    <div class="root">
        <div v-if="!isLoading" class="row">
            <div class="image-container">
                <img :src="OptinLogo" class="image" />
            </div>
            <div class="text-container">
                <div class="title-text">
                    {{ $t('optin_postlaunch_tx_title') }}
                </div>
                <div class="content-text text-description">
                    {{ completed ? $t('optin_postlaunch_tx_completed_description') : $t('optin_postlaunch_tx_pending_description') }}
                </div>
                <div v-if="hasTransfers" class="content-text">
                    <table>
                        <tr>
                            <td class="table-header-text">
                                {{ completed ? $t('optin_postlaunch_tx_completed_amount') : $t('optin_postlaunch_tx_pending_amount') }}
                            </td>
                            <td class="amount-text">
                                <MosaicAmountDisplay
                                    v-if="amount !== null"
                                    :id="mosaicId"
                                    :absolute-amount="amount"
                                    :show-ticker="true"
                                    color="green"
                                />
                            </td>
                        </tr>
                        <tr v-for="(address, index) in NISAddresses" :key="'' + index + 'nisaddr'">
                            <td class="table-header-text">
                                {{ $t('optin_postlaunch_tx_nis_address') }} {{ NISAddresses.length > 1 ? index + 1 : '' }}:
                            </td>
                            <td class="address-text">{{ address }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="details-button" @click="onDetailsClick">
                {{ isDetailsShown ? $t('hide_details') : $t('show_details') }}
            </div>
            <transition name="collapse">
                <div v-if="isDetailsShown" class="transaction-details" :class="{ 'transaction-details-expanded': isExpanded }">
                    <TransactionDetails :transaction="transaction" />
                </div>
            </transition>
        </div>
        <Spin v-if="isLoading" size="large" fix class="absolute" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
    AggregateTransaction,
    UInt64,
    Mosaic,
    TransactionStatus,
    TransactionType,
    TransferTransaction,
    UnresolvedMosaicId,
} from 'symbol-sdk';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { optinImages } from '@/views/resources/Images';
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';
import { TransactionView } from '@/core/transactions/TransactionView';
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';

@Component({
    components: {
        MosaicAmountDisplay,
        TransactionDetails,
    },
})
export default class TransactionOptinPayoutDetails extends Vue {
    @Prop({ required: true }) readonly transaction: AggregateTransaction;
    @Prop({ required: true }) readonly currentAccount: AccountModel;

    private OptinLogo = optinImages.optinLogo;
    private isDetailsShown = false;
    private isExpanded = false;
    private isLoading = false;
    private transactionDetails: AggregateTransaction = null;

    private get referenceInnerTransactions(): Array<TransferTransaction> {
        const currentAddress = this.currentAccount.address;
        const innerTransactions = this.transaction.innerTransactions.length
            ? this.transaction.innerTransactions
            : this.transactionDetails?.innerTransactions || [];

        const transactions = innerTransactions.filter(
            (innerTransaction) =>
                innerTransaction.type === TransactionType.TRANSFER &&
                (innerTransaction as TransferTransaction).recipientAddress?.plain() === currentAddress &&
                (innerTransaction as TransferTransaction).mosaics?.length,
        );

        return transactions as Array<TransferTransaction>;
    }

    private get hasTransfers(): boolean {
        return !!this.referenceInnerTransactions.length;
    }

    private get completed(): boolean {
        return TransactionView.getTransactionStatus(this.transaction) === 'confirmed';
    }

    private get transferredMosaics(): Array<Mosaic> {
        return this.referenceInnerTransactions.map((transaction) => transaction.mosaics[0]);
    }

    private get amount(): UInt64 {
        let sumAmount = UInt64.fromNumericString('0');
        this.transferredMosaics?.forEach((mosaic) => (sumAmount = sumAmount.add(mosaic.amount)));

        return sumAmount;
    }

    private get mosaicId(): UnresolvedMosaicId {
        return this.transferredMosaics[0]?.id;
    }

    private get NISAddresses(): Array<string> {
        let NISAddresses = [];

        try {
            NISAddresses = this.referenceInnerTransactions
                .map((transaction) => JSON.parse(transaction?.message.payload || '{}').nisAddress)
                .filter((nisAddress) => !!nisAddress);
        } catch (e) {
            console.log('Opt-in payment transaction. Failed to get NIS1 address', e);
        }

        return NISAddresses;
    }

    public async fetchTransactionDetails() {
        this.isLoading = true;

        try {
            const transactionHash = this.transaction.transactionInfo.hash;
            const transactionStatus: TransactionStatus = (await this.$store.dispatch('transaction/FETCH_TRANSACTION_STATUS', {
                transactionHash,
            })) as TransactionStatus;

            if (transactionStatus.group !== 'failed') {
                this.transactionDetails = (await this.$store.dispatch('transaction/LOAD_TRANSACTION_DETAILS', {
                    group: transactionStatus.group,
                    transactionHash,
                })) as AggregateTransaction;
            }
        } catch (error) {
            console.log(error);
        }

        this.isLoading = false;
    }

    private onDetailsClick() {
        this.isDetailsShown = !this.isDetailsShown;
        setTimeout(() => {
            this.isExpanded = this.isDetailsShown;
        }, 500);
    }

    private mounted() {
        this.isDetailsShown = false;
        this.isExpanded = false;
        this.isLoading = false;
        this.fetchTransactionDetails();
    }
}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.root {
    padding-bottom: 0.1rem;
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
    width: 1.92rem;
    margin-top: -1px;
    margin-left: 0.1rem;
    margin-right: 0.3rem;
}

.image {
    width: 1.92rem;
    height: auto;
}

.text-container {
    flex: 1;
    color: @primary;
    font-size: @normalFont;
}

.title-text {
    font-family: @symbolFontBold;
    font-size: 40px;
    margin: 0;
}

.content-text {
    font-family: @symbolFontMedium;
    margin: 16px 0;
    line-height: 24px;
}

.text-description {
    font-family: @symbolFontSemiBold;
    margin-bottom: 0.6rem;
}

.table-header-text {
    padding-right: 0.3rem;
}

.address-text {
    color: @purpleLightest;
}

.amount-text {
    color: @accentGreen;
}

.details-button {
    font-family: @symbolFontSemiBold;
    color: @accentPink;
    margin-right: 0.1rem;
    align-self: flex-end;
    cursor: pointer;
}

.transaction-details {
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: @line;
    padding-top: 0.4rem;
    margin-top: 0.4rem;
    max-height: 3rem;
}

.transaction-details-expanded {
    max-height: 100rem;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: max-height 0.3s;
}

.collapse-enter,
.collapse-leave-to {
    max-height: 0;
}
</style>
