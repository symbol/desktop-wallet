<template>
    <div class="main-container">
        <div class="lef-container">
            <div class="left-top-container">
                <div class="title-container">
                    <h1 class="title-style">
                        {{ $t('transaction_type_title') }}
                    </h1>
                </div>
                <!--- TODO: ADD onClick Action to all add_button-->
                <div class="transaction-type-container">
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/transactions.svg" alt />
                        </span>
                        <span class="mosaic_name">{{ $t('simple_transfer_type') }}</span>
                        <button class="add_button" @click="onClickAdd(1)">
                            <img src="@/views/resources/img/icons/add.png" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/mosaic.svg" alt />
                        </span>
                        <span class="mosaic_name">{{ $t('mosaic_transfer_type') }}</span>
                        <button class="add_button" @click="onClickAdd(2)">
                            <img src="@/views/resources/img/icons/add.png" alt />
                        </button>
                    </div>
                    <div class="mosaic_data">
                        <span class="img_container">
                            <img src="@/views/resources/img/icons/namespace.svg" alt />
                        </span>
                        <span class="mosaic_name">{{ $t('namespace_transfer_type') }}</span>
                        <button class="add_button" @click="onClickAdd(3)">
                            <img src="@/views/resources/img/icons/add.png" alt />
                        </button>
                    </div>
                </div>
            </div>
            <div class="left-bottom-container">
                <div class="title-container">
                    <h1 class="title-style">
                        {{ $t('my_transaction_title') }}
                    </h1>
                </div>
                <!-- TODO: DYNAMIC TRANSACTION LIST & REMOVE onClick Action to all remove_button -->
                <FormWrapper>
                    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                        <form onsubmit="event.preventDefault()" class="bottom-form-wrapper">
                            <div class="transaction-list-container">
                                <div
                                    v-for="{ title } in simpleAggregateTransaction"
                                    :key="title"
                                    class="transfer_data"
                                    @click="onSelectTx(title)"
                                >
                                    <span v-if="title" class="img_container">
                                        <img
                                            v-if="title.indexOf(`${$t('simple_transaction')}`) !== -1"
                                            src="@/views/resources/img/icons/transactions.svg"
                                            alt
                                        />
                                        <img
                                            v-else-if="title.indexOf(`${$t('mosaic_transaction')}`) !== -1"
                                            src="@/views/resources/img/icons/mosaic.svg"
                                            alt
                                        />
                                        <img v-else src="@/views/resources/img/icons/namespace.svg" alt />
                                    </span>
                                    <span class="transfer_name">{{ title }}</span>
                                    <button class="remove_button" @click="onClickDelete(title)">
                                        <img src="@/views/resources/img/icons/bin.svg" alt />
                                    </button>
                                </div>
                            </div>
                            <div class="bottom-container">
                                <MaxFeeSelector v-model="formItems.maxFee" @button-clicked="handleSubmit(onClickSendAggregate)" />
                                <div class="send-button">
                                    <button
                                        class="full-width-centered-button button-style inverted-button fat-button"
                                        style="cursor: pointer;"
                                        type="submit"
                                        @click="handleSubmit(onSubmit)"
                                    >
                                        {{ $t('aggregate_send') }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </ValidationObserver>
                </FormWrapper>
                <ModalTransactionConfirmation
                    v-if="hasConfirmationModal"
                    :command="command"
                    :visible="hasConfirmationModal"
                    @success="onConfirmationSuccess"
                    @error="onConfirmationError"
                    @close="onConfirmationCancel"
                />
            </div>
        </div>
        <div class="right-container">
            <!-- TODO: TRANSFER FORM GOES HERE Same as Dashboard Transfer -->
            <!-- <AggregateTransaction /> -->
            <div class="title-container">
                <div
                    v-if="currentSelectedTransaction && currentSelectedTransaction.title && currentSelectedTransaction.component"
                    class="transaction-form"
                >
                    <h1 class="title-style">
                        {{ currentSelectedTransaction.title }}
                    </h1>
                    <div class="transaction-form-container">
                        <component
                            :is="currentSelectedTransaction.component"
                            v-model="currentTxItems"
                            :hide-submit="true"
                            :is-aggregate="true"
                            :value.sync="currentTxItems"
                            :title.sync="currentSelectedTransaction.title"
                            @txInput="onSaveTransaction"
                        ></component>
                    </div>
                </div>
            </div>
        </div>
        <ModalFormProfileUnlock
            v-if="hasAccountUnlockModal"
            :visible="hasAccountUnlockModal"
            :on-success="onAccountUnlocked"
            @close="hasAccountUnlockModal = false"
        />
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { FormAggregateTransactionTs } from './FormAggregateTransactionTs';
export default class FormAggregateTransaction extends FormAggregateTransactionTs {}
</script>

<style lang="less" scoped>
@import './FormAggregateTransaction.less';
</style>
