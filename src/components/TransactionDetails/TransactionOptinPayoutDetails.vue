<template>
    <div class="root">
        <div class="row">
            <div class="image-container">
            </div>
            <div class="text-container">
                <div class="title-text">
                    Congratulation!
                </div>
                <div class="content-text">
                    Your account is in the opt-in round. You will recieve your XYM after this transaction got confirmed. 
                    The amount you will recieve: <span class="amount-text">{{ amount }}</span>.
                    The XEM address which participated in the Op-in process: <span class="address-text">{{ NISAddress }}</span>.
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
import { officialIcons } from '@/views/resources/Images';
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue';

@Component({
    components: {
        TransactionDetails
    }
})
export default class Alert extends Vue {
    @Prop({ required: true }) readonly transaction: AggregateTransaction;
    // @Prop({ required: true }) readonly currentAccount: AccountModel;
    // @Prop({ required: true }) readonly networkType: NetworkType;

    private OptinLogo = officialIcons.optinLogo;
    private isDetailsShown = false;

    private get amount() {
        return 39.65;
    }

    private get NISAddress() {
        return 'TCF7NKYXF6X3KFFO6AKLXBTHDCZL73K45ILQVWJK';
    }

    private get detailsButtonText() {
        return this.isDetailsShown 
            ? 'Show Details'
            : 'Hide Details';
    }

    private mounted() {
        this.isDetailsShown = false;
    }
}
</script>

<style lang="less" scoped>
@import '../../views/resources/css/variables.less';

.root {
   
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
    width: 1rem;
}

.text-container {
    flex: 1;
    color: @primary;
}

.title-text {
    font-family: @symbolFontBold;
}

.content-text {
    font-family: @symbolFontMedium;
}

.address-text {
    font-family: @symbolFontSemiBold;
    color: @purpleLightest;
}

.amount-text {
    font-family: @symbolFontSemiBold;
    color: @accentGreen;
}

.details-button {
    font-family: @symbolFontSemiBold;
    color: @accentPink;
}
</style>
