<template>
  <div class="transaction-table-container">
    <TransactionListHeader />
    <Spin
      v-if="isFetchingTransactions" size="large" fix
      class="absolute"
    />
    <div v-if="transactionsList.length" class="transaction-rows-outer-container">
      <div v-if="transactionsList.length" class="transaction-rows-inner-container">
        <TransactionRow
          v-for="transaction in transactionsList"
          :key="transaction.transactionInfo.hash"
          :transaction="transaction"
          :is-partial="getTransactionStatus(transaction) === 'partial'"
          @click="$emit('click', transaction)"
        />
      </div>
    </div>
    <div v-if="!transactionsList.length && !isFetchingTransactions" class="no-data-outer-container">
      <div class="no-data-message-container">
        <div>{{ $t(emptyMessage) }}</div>
      </div>
      <div class="no-data-inner-container">
        <div v-for="item in nodata" :key="item">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// external dependenies
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Transaction } from 'symbol-sdk'

// child components
import TransactionRow from '@/components/TransactionList/TransactionRow/TransactionRow.vue'
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue'

@Component({
  components: {
    TransactionRow,
    TransactionListHeader,
  },
})
export default class TransactionTable extends Vue {
  @Prop() transactions: Transaction[] | undefined
  @Prop({ default: 'no_data_transactions'}) emptyMessage: string
  public nodata = [...Array(10).keys()]

  get transactionsList(): Transaction[] {
    return this.transactions || []
  }

  /**
   * Whether transactios are currently being fetched
   */
  get isFetchingTransactions(): boolean{
    return !this.transactions
  }
}
</script>

<style lang="less">
@import "./TransactionTable.less";
</style>
