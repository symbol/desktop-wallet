<template>
  <div class="ledger_import_container">
    <div class="page_import_title">
      {{ $t('connect_ledger_title') }}
    </div>
    <div class="describe">
      {{ $t('ledger_description') }}
    </div>
    <ul>
      <li>
        {{ $t('choose_account_index') }}
        <div class="gray_content">
          <input
            v-model="ledgerForm.accountIndex"
            class="absolute"
            type="number"
            min="0"
            max="1000000"
            :placeholder="$t('choose_account_index')"
          />
        </div>
      </li>
      <li>
        {{ $t('Set_the_Ledger_account_name') }}
        <div class="gray_content">
          <input
            v-model="ledgerForm.walletName"
            class="absolute"
            type="text"
            :placeholder="$t('Set_the_Ledger_account_name')"
          />
        </div>
      </li>
    </ul>

    <div class="bottom_button">
      <span class="back left" @click="toBack"> {{ $t('back') }}</span>
      <span class="import right" @click="onSubmit">{{ $t('connect_ledger_prompt') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { ImportLedgerProfileTs } from '@/views/pages/profiles/import-ledger-profile/ImportLedgerProfileTs.ts'
import './ImportLedgerProfile.less'
export default class ImportLedgerProfile extends ImportLedgerProfileTs {}
</script>
