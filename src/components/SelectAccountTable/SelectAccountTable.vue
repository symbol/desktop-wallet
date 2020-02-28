<template>
  <Table
    size="large" height="190" :columns="columns1"
    :data="walletList"
    @on-row-click="toggleSelect"
  >
    <template slot="choices" slot-scope="{ row }">
      <!-- <img :src="row.choices" alt=""> -->
      <Icon :type="selectedList.includes(row.index) ? 'md-checkmark' : ''" />
    </template>
  </Table>
</template>

<script>
import { SelectAccountTableTs } from './SelectAccountTableTs'
import './SelectAccountTable.less'
export default class SelectAccountTable extends SelectAccountTableTs {}
</script>
