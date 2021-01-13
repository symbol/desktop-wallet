<template>
    <div class="align-right">
        <Button class="button-style validation-button left-side-button" type="success" @click="processHardware">
            {{ $t('confirm') }}
        </Button>
    </div>
</template>

<script lang="ts">
import { HardwareConfirmationButtonTs } from './HardwareConfirmationButtonTs';

export default class HardwareConfirmationButton extends HardwareConfirmationButtonTs {}
</script>
