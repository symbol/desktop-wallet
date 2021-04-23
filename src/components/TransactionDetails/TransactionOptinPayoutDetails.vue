<template>
    <div class="root">
        <div class="row">
            <div class="image-container">
                <img :src="OptinLogo" class="image" />
            </div>
            <div class="text-container">
                <div class="title-text">
                    Post-launch Opt-in
                </div>
                <div class="content-text text-description">
                    Your Opt-in payment is being processed. You will receive the XYM coins, when this transaction is confirmed.
                </div>
                <div class="content-text">
                    <table>
                        <tr>
                            <td class="table-header-text">The amount you will recieve:</td>
                            <td class="amount-text">{{ amount }} XYM</td>
                        </tr>
                        <tr>
                            <td class="table-header-text">Yor NEM NIS1 Address:</td>
                            <td class="address-text">{{ NISAddress }}</td>
                        </tr>
                    </table>
                     <span ></span>.
                </div>
            </div>
        </div>
        <div class="column">
            <div class="details-button">
                {{ detailsButtonText }}
            </div>
            <TransactionDetails v-if="isDetailsShown" :transaction="transaction" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AggregateTransaction, NetworkType } from 'symbol-sdk';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { optinImages } from '@/views/resources/Images';
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';

@Component({
    components: {
        TransactionDetails
    }
})
export default class TransactionOptinPayoutDetails extends Vue {
    @Prop({ required: true }) readonly transaction: AggregateTransaction;
    // @Prop({ required: true }) readonly currentAccount: AccountModel;
    // @Prop({ required: true }) readonly networkType: NetworkType;

    private OptinLogo = optinImages.optinLogo;
    private isDetailsShown = false;

    private get amount() {
        return 39.65;
    }

    private get NISAddress() {
        return 'TCF7NKYXF6X3KFFO6AKLXBTHDCZL73K45ILQVWJK';
    }

    private get detailsButtonText() {
        return this.isDetailsShown 
            ? 'Hide Details'
            : 'Show Details';
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
    //margin-top: 0.1rem;
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
    font-size: 40px;
    margin-bottom: 0.2rem;
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
    //font-family: @symbolFontBold;
   padding-right: 0.3rem;
}

.address-text {
    //font-family: @symbolFontSemiBold;
    color: @purpleLightest;
}

.amount-text {
    //font-family: @symbolFontSemiBold;
    color: @accentGreen;
}

.details-button {
    font-family: @symbolFontSemiBold;
    color: @accentPink;
    align-self: flex-end;
    cursor: pointer;
}
</style>
