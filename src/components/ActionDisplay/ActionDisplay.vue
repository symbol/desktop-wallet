<template>
    <div v-if="transaction.type">
        <div class="overflow_ellipsis">
            <div v-if="transaction.type !== transactionType.TRANSFER">
                <AddressDisplay
                    v-if="hasAggregateBondedSigner && aggregateTransactionSenderAddress"
                    :address="aggregateTransactionSenderAddress"
                />
                <AddressDisplay v-else :address="transaction.signer.address" />
            </div>
            <div v-else>
                <AddressDisplay
                    :address="
                        address.plain() === transaction.signer.address.plain() ? transaction.recipientAddress : transaction.signer.address
                    "
                />
            </div>
        </div>
        <div class="bottom overflow_ellipsis">
            <span>{{ getTransactionType() }}</span>
            <span v-if="needsCosignature" class="click-to-cosign">({{ $t('click_to_cosign') }})</span>
        </div>
    </div>
</template>

<script lang="ts">
import { ActionDisplayTs } from './ActionDisplayTs';
export default class ActionDisplay extends ActionDisplayTs {}
</script>
