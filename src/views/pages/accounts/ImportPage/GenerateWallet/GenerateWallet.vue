<template>
  <div class="generate-wallet-page-wrapper">
    <div class="import-wallet">
      <div class="select-network">
        <div class="title">
          {{ $t('chain_net') }}:
        </div>
        <input type="text" placeholder="symbol">
      </div>
      <div class="select-network">
        <div class="title">
          {{ $t('Network_type') }}:
        </div>
        <Select v-model="networkType">
          <Option v-for="(item,index) in networkTypeList" :key="index" :value="item.value">
            {{ item.label }}
          </Option>
        </Select>
      </div>
    </div>
    <TableTitle>{{ $t('select_wallet_list') }}</TableTitle>
    <div class="blank" />
    <SelectAccountTable :wallet-list="walletList" @click-row="updateSelectedList" />
    <div class="button-container">
      <ButtonStep @click="$router.go(-1)">
        {{ $t('Previous_step') }}
      </ButtonStep>
      <ButtonStep :primary="true" @click="submit">
        {{ $t('Next_step') }}
      </ButtonStep>
    </div>
  </div>
</template>

<script>
import GenerateWalletTs from './GenerateWalletTs'
import './GenerateWallet.less'
export default class GenerateWallet extends GenerateWalletTs {}
</script>
