<template>
    <div class="mnemonic_container" @keyup.enter="next()">
        <div class="mnemonicWordDiv clear scroll">
            <draggable v-model="selectedWordIndexes" ghost-class="ghost" @end="drag = false">
                <span v-for="index in selectedWordIndexes" :key="index">
                    <Tag closable @on-close="removeWord(index)">
                        {{ shuffledWords[index] }}
                    </Tag>
                </span>
            </draggable>
        </div>
        <div class="wordDiv clear">
            <span
                v-for="index in shuffledWordsIndexes"
                :key="index"
                :class="selectedWordIndexes.includes(index) ? 'confirmed_word' : ''"
                @click="onWordClicked(index)"
            >
                {{ shuffledWords[index] }}
            </span>
        </div>
        <div class="buttons clear">
            <div class="float-right mt-3">
                <button type="button" class="solid-button button-style create-account-style" @click="$emit('cancelled')">
                    {{ $t('back') }}
                </button>
                <button
                    type="submit"
                    class="inverted-button button-style create-account-style"
                    :disabled="!correctWordsAreSelected()"
                    @click="next()"
                >
                    {{ $t('next') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { MnemonicVerificationTs } from './MnemonicVerificationTs';
export default class MnemonicVerification extends MnemonicVerificationTs {}
</script>
<style lang="less" scoped>
@import './MnemonicVerification.less';
</style>
