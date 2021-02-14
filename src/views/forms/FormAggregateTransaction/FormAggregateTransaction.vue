<template>
    <div class="main-container">
        <div class="left-container">
            <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
            <div
                v-if="currentSelectedTransaction && currentSelectedTransaction.title && currentSelectedTransaction.component"
                class="transaction-container"
            >
                <div class="title-container">
                    <h1 class="title-style">
                        {{ currentSelectedTransaction.title }}
                    </h1>
                </div>
                <div class="transaction-form-container">
                    <component
                        :is="currentSelectedTransaction.component"
                        ref="transactionForm"
                        v-model="currentSelectedTransaction.formItems"
                        :is-aggregate="true"
                        :title.sync="currentSelectedTransaction.title"
                        class="transaction-form-component"
                        @txInput="onSaveTransaction"
                    ></component>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="title-container">
                <h1 class="title-style">
                    {{ $t('my_transaction_title') }}
                </h1>
            </div>
            <FormWrapper>
                <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                    <form onsubmit="event.preventDefault()" class="transactions-form-wrapper">
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
                            <MaxFeeSelector
                                v-model="formItems.maxFee"
                                placement="top-start"
                                :show-fee-label="true"
                                @button-clicked="handleSubmit(onClickSendAggregate)"
                            />
                            <div class="send-button">
                                <button
                                    class="full-width-centered-button button-style inverted-button fat-button"
                                    style="cursor: pointer;"
                                    type="submit"
                                    :disabled="!simpleAggregateTransaction.length"
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
        <ModalTransactionEdit
            v-if="showTransactionEditModal"
            :visible="showTransactionEditModal"
            :transaction="toBeEditedTransaction"
            @cancel="showTransactionEditModal = false"
            @save="saveEditedTransaction"
        ></ModalTransactionEdit>
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
