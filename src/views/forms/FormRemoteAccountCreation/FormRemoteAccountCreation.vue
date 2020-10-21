<template>
    <div class="form-remote-account">
        <div>
            <h2>{{ $t('harvesting_subtitle_overview') }}</h2>
            <p>
                {{ $t('harvesting_remote_account_description_1') }} {{ $t('harvesting_create_remote_account') }}
                {{ $t('harvesting_remote_account_description_3') }}
            </p>
            <FormProfileUnlock v-if="!remoteAccount" button-text="create" @success="onAccountUnlocked" @error="onError" />
        </div>

        <div v-if="remoteAccount" class="account-details-grid">
            <p class="detail-row">
                <AccountAddressDisplay :address="remoteAccount.address.plain()" />
            </p>

            <p class="detail-row">
                <AccountPublicKeyDisplay :account="remoteAccount" />
            </p>

            <p class="detail-row">
                <ProtectedPrivateKeyDisplay :account="remoteAccount" />
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { FormRemoteAccountCreationTs } from './FormRemoteAccountCreationTs';
export default class FormRemoteAccountCreation extends FormRemoteAccountCreationTs {}
</script>
