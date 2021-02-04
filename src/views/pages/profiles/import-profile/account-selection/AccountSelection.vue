<template>
    <div class="account-selection-container" @keyup.enter="submit">
        <div class="dialog-sub-tips">
            {{ $t('address_to_interact_with') }}
        </div>
        <div class="choose-hd-path scroll">
            <div class="address-list">
                <div class="table-title">
                    <span class="address-id">{{ $t('id') }}</span>
                    <span class="address-value">{{ $t('address') }}</span>
                    <span class="address-balance">{{ $t('balance') }}</span>
                </div>
                <div class="scrollable">
                    <div v-for="(a, index) in addressesList" :key="index" @click="onAddAddress(index)">
                        <div v-if="!selectedAccounts.includes(index)" class="table-item pointer">
                            <span class="address-id">{{ index + 1 }}</span>
                            <span class="address-value">{{ formatters.miniAddress(a) }}</span>
                            <span v-if="addressMosaicMap[a.plain()]" class="address-balance overflow_ellipsis">
                                <MosaicAmountDisplay :absolute-amount="addressMosaicMap[a.plain()]" />
                            </span>
                            <span v-else class="address-balance overflow_ellipsis">
                                N/A
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container flex-container">
            <button class="solid-button button-style back-create-button button" @click="previous">
                {{ $t('back') }}
            </button>
            <button class="button-style validation-create-button button" @click="submit">
                {{ $t('next') }}
            </button>
        </div>
    </div>
</template>

<script>
import AccountSelectionTs from './AccountSelectionTs';
export default class AccountSelection extends AccountSelectionTs {}
</script>
<style lang="less" scoped>
@import './AccountSelection.less';
</style>
