<template>
    <input
        :value="value"
        onselectstart="return false"
        onpaste="return false"
        onCopy="return false"
        onCut="return false"
        class="input-size input-style"
        :placeholder="placeholder"
        type="password"
        @input="updateValue($event.target.value)"
    />
</template>

<script lang="ts">
import PasswordInputTs from './PasswordInputTs';
export default class PasswordInput extends PasswordInputTs {}
</script>
