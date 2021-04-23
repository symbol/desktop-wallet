<template>
    <div class="root">
        <div class="row">
            <div class="image-container">
            </div>
            <div class="text-container">
            </div>
        </div>
        <div class="row">
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
    @Prop({ required: true }) readonly currentAccount: AccountModel;
    @Prop({ required: true }) readonly networkType: NetworkType;

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

<style>

</style>