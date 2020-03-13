<template>
    <div v-click-focus class="show-mnemonic">
        <div class="input-already" v-for="word in wordsArray">{{word}}</div>
        <div class="mnemonic-input-container">
            <input  class="mnemonic-input" v-on:keyup.space='addWord' v-on:keyup.delete="deleteWord"
                v-model.trim="inputWord" type="text" maxlength="50">
        </div>
    </div>
</template>
<script lang="ts">
import { MnemonicInputTs } from "./MnemonicInputTs";
export default class MnemonicInput extends MnemonicInputTs { };
</script>
<style lang="less" scoped>
@import "./MnemonicInput.less";
</style>