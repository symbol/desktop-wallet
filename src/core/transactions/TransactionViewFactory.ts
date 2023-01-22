/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import {
    AddressAliasTransaction,
    HashLockTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction,
    MultisigAccountModificationTransaction,
    NamespaceRegistrationTransaction,
    Transaction,
    TransactionType,
    TransferTransaction,
    AccountKeyLinkTransaction,
    VotingKeyLinkTransaction,
    VrfKeyLinkTransaction,
    NodeKeyLinkTransaction,
    AccountMetadataTransaction,
    MosaicMetadataTransaction,
    NamespaceMetadataTransaction,
    AccountAddressRestrictionTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    PersistentHarvestingDelegationMessage,
    SecretLockTransaction,
    SecretProofTransaction,
    MosaicSupplyRevocationTransaction,
} from 'symbol-sdk';
import { ViewUnknownTransaction } from '@/core/transactions/ViewUnknownTransaction';
import { ViewHashLockTransaction } from '@/core/transactions/ViewHashLockTransaction';
import { ViewMultisigAccountModificationTransaction } from '@/core/transactions/ViewMultisigAccountModificationTransaction';
import { ViewMosaicDefinitionTransaction } from '@/core/transactions/ViewMosaicDefinitionTransaction';
import { ViewMosaicSupplyChangeTransaction } from '@/core/transactions/ViewMosaicSupplyChangeTransaction';
import { ViewMosaicSupplyRevocationTransaction } from '@/core/transactions/ViewMosaicSupplyRevocationTransaction';
import { ViewNamespaceRegistrationTransaction } from '@/core/transactions/ViewNamespaceRegistrationTransaction';
import { ViewTransferTransaction } from '@/core/transactions/ViewTransferTransaction';
import { ViewAliasTransaction } from '@/core/transactions/ViewAliasTransaction';
import { ViewAccountKeyLinkTransaction } from '@/core/transactions/ViewAccountKeyLinkTransaction';
import { Store } from 'vuex';
import { TransactionView } from '@/core/transactions/TransactionView';
import { ViewVotingKeyLinkTransaction } from '@/core/transactions/ViewVotingKeyLinkTransaction';
import { ViewVrfKeyLinkTransaction } from '@/core/transactions/ViewVrfKeyLinkTransaction';
import { ViewNodeKeyLinkTransaction } from './ViewNodeKeyLinkTransaction';
import { ViewAccountMetadataTransaction } from '@/core/transactions/ViewAccountMetadataTransaction';
import { ViewNamespaceMetadataTransaction } from '@/core/transactions/ViewNamespaceMetadataTransaction';
import { ViewMosaicMetadataTransaction } from '@/core/transactions/ViewMosaicMetadataTransaction';
import { ViewAccountAddressRestrictionTransaction } from './ViewAccountAddressRestrictionTransaction';
import { ViewAccountMosaicRestrictionTransaction } from './ViewAccountMosaicRestrictionTransaction';
import { ViewAccountOperationRestrictionTransaction } from './ViewAccountOperationRestrictionTransaction';
import { ViewHarvestingTransaction } from './ViewHarvestingTransaction';
import { ViewSecretLockTransaction } from './ViewSecretLockTransaction';
import { ViewSecretProofTransaction } from './ViewSecretProofTransaction';

/**
 * Transaction view factory.
 */
export class TransactionViewFactory {
    /**
     * It creates the view for the given transaction.
     *
     * @param $store the vue store.
     * @param transaction the transaction.
     */
    public static getView($store: Store<any>, transaction: Transaction): TransactionView<Transaction> {
        switch (transaction.type) {
            /// region XXX views for transaction types not yet implemented
            case TransactionType.AGGREGATE_BONDED:
            case TransactionType.AGGREGATE_COMPLETE:
            case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
            case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
                return new ViewUnknownTransaction($store, transaction);
            /// end-region XXX views for transaction types not yet implemented
            case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
                return new ViewAccountAddressRestrictionTransaction($store, transaction as AccountAddressRestrictionTransaction);
            case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
                return new ViewAccountMosaicRestrictionTransaction($store, transaction as AccountMosaicRestrictionTransaction);
            case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
                return new ViewAccountOperationRestrictionTransaction($store, transaction as AccountOperationRestrictionTransaction);
            case TransactionType.ACCOUNT_METADATA:
                return new ViewAccountMetadataTransaction($store, transaction as AccountMetadataTransaction);
            case TransactionType.MOSAIC_METADATA:
                return new ViewMosaicMetadataTransaction($store, transaction as MosaicMetadataTransaction);
            case TransactionType.NAMESPACE_METADATA:
                return new ViewNamespaceMetadataTransaction($store, transaction as NamespaceMetadataTransaction);
            case TransactionType.HASH_LOCK:
                return new ViewHashLockTransaction($store, transaction as HashLockTransaction);
            case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
                return new ViewMultisigAccountModificationTransaction($store, transaction as MultisigAccountModificationTransaction);
            case TransactionType.VRF_KEY_LINK:
                return new ViewVrfKeyLinkTransaction($store, transaction as VrfKeyLinkTransaction);
            case TransactionType.NODE_KEY_LINK:
                return new ViewNodeKeyLinkTransaction($store, transaction as NodeKeyLinkTransaction);
            case TransactionType.VOTING_KEY_LINK:
                return new ViewVotingKeyLinkTransaction($store, transaction as VotingKeyLinkTransaction);
            case TransactionType.MOSAIC_DEFINITION:
                return new ViewMosaicDefinitionTransaction($store, transaction as MosaicDefinitionTransaction);
            case TransactionType.MOSAIC_SUPPLY_CHANGE:
                return new ViewMosaicSupplyChangeTransaction($store, transaction as MosaicSupplyChangeTransaction);
            case TransactionType.MOSAIC_SUPPLY_REVOCATION:
                return new ViewMosaicSupplyRevocationTransaction($store, transaction as MosaicSupplyRevocationTransaction);
            case TransactionType.NAMESPACE_REGISTRATION:
                return new ViewNamespaceRegistrationTransaction($store, transaction as NamespaceRegistrationTransaction);
            case TransactionType.TRANSFER: {
                const transferTransaction = transaction as TransferTransaction;
                return transferTransaction.message instanceof PersistentHarvestingDelegationMessage
                    ? new ViewHarvestingTransaction($store, transferTransaction)
                    : new ViewTransferTransaction($store, transferTransaction);
            }
            case TransactionType.MOSAIC_ALIAS:
                return new ViewAliasTransaction($store, transaction as MosaicAliasTransaction);
            case TransactionType.ADDRESS_ALIAS:
                return new ViewAliasTransaction($store, transaction as AddressAliasTransaction);
            case TransactionType.ACCOUNT_KEY_LINK:
                return new ViewAccountKeyLinkTransaction($store, transaction as AccountKeyLinkTransaction);
            case TransactionType.SECRET_LOCK:
                return new ViewSecretLockTransaction($store, transaction as SecretLockTransaction);
            case TransactionType.SECRET_PROOF:
                return new ViewSecretProofTransaction($store, transaction as SecretProofTransaction);
            default:
                throw new Error(`View not implemented for transaction type '${transaction.type}'`);
        }
    }
}
