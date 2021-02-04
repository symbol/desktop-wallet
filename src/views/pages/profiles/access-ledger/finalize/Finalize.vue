<template>
    <div class="finish-sec scroll" @keyup.enter="submit">
        <div class="finish-col">
            <div class="finish-left">
                <div class="buttons clear">
                    <div class="float-right">
                        <button type="button" class="solid-button button-style fat-button create-account-style" @click="$router.back()">
                            {{ $t('back') }}
                        </button>
                        <button type="submit" class="inverted-button button-style fat-button create-account-style" @click="submit">
                            {{ $t('next') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import FinalizeTs from './FinalizeTs';
export default class Finalize extends FinalizeTs {}
</script>
<style lang="less" scoped>
@import './Finalize.less';
</style>
