<template>
    <input
        :value="value"
        @input="updateValue($event.target.value)"
        onselectstart="return false"
        onpaste="return false"
        onCopy="return false"
        onCut="return false"
        class="input-size input-style"
        :placeholder="placeholder"
        type="password"
    />
</template>

<script lang="ts">
import PasswordInputTs from './PasswordInputTs';
export default class PasswordInput extends PasswordInputTs {}
</script>
