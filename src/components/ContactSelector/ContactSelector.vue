<template>
    <div class="contact-selector">
        <Poptip v-model="poptipVisible" placement="bottom-end" class="endpoint-poptip" :transfer="true" @on-popper-show="onPopTipShow">
            <div class="button-container">
                <span class="network-text pointer">{{ $t('select_contact') }}</span>
                <img src="@/views/resources/img/newicons/Tag.svg" class="icon-left-button" />
            </div>
            <div slot="content" class="node-selector-container">
                <div class="node-list-container">
                    <div class="node-list-content">
                        <ul>
                            <li
                                v-for="(contact, index) in contactList"
                                :key="`sep${index}`"
                                class="list-item pointer"
                                @click="selectContact(contact.id)"
                            >
                                <div>
                                    <div class="node-list-head">{{ contact.name }}</div>
                                    <div class="overflow_ellipsis" :title="contact.address">{{ contact.address }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Poptip>
    </div>
</template>

<script lang="ts">
import { ContactSelectorTs } from './ContactSelectorTs';

export default class ContactSelector extends ContactSelectorTs {}
</script>

<style lang="less" scoped>
@import './ContactSelector.less';
</style>
