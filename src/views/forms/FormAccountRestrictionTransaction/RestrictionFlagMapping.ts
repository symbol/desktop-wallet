/*
 * Copyright 2020 NEM (https://nem.io)
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
// @ts-ignore
import { RestrictionDirection } from '@/components/RestrictionDirectionInput/RestrictionDirectionInput.vue';
// @ts-ignore
import { RestrictionBlockType } from '@/components/RestrictionTypeInput/RestrictionTypeInput.vue';
import { AddressRestrictionFlag, MosaicRestrictionFlag, OperationRestrictionFlag } from 'symbol-sdk';
import { AccountRestrictionTxType } from './FormAccountRestrictionTransactionTs';
// @ts-ignore

export default class RestrictionFlagMapping {
    /**
     * Maps parameters to RestrictionFlag
     * @param restrictionTxType
     * @param direction
     * @param blockType
     */
    public static toRestrictionFlag(
        restrictionTxType: AccountRestrictionTxType,
        direction: RestrictionDirection,
        blockType: RestrictionBlockType,
    ): AddressRestrictionFlag | MosaicRestrictionFlag | OperationRestrictionFlag {
        switch (restrictionTxType) {
            case AccountRestrictionTxType.ADDRESS:
                if (direction === RestrictionDirection.INCOMING) {
                    if (blockType === RestrictionBlockType.BLOCK) {
                        return AddressRestrictionFlag.BlockIncomingAddress;
                    } else {
                        return AddressRestrictionFlag.AllowIncomingAddress;
                    }
                } else {
                    // OUTGOING
                    if (blockType === RestrictionBlockType.BLOCK) {
                        return AddressRestrictionFlag.BlockOutgoingAddress;
                    } else {
                        return AddressRestrictionFlag.AllowOutgoingAddress;
                    }
                }
            case AccountRestrictionTxType.MOSAIC:
                if (blockType === RestrictionBlockType.BLOCK) {
                    return MosaicRestrictionFlag.BlockMosaic;
                } else {
                    return MosaicRestrictionFlag.AllowMosaic;
                }
            case AccountRestrictionTxType.TRANSACTION_TYPE:
                return OperationRestrictionFlag.BlockOutgoingTransactionType;
        }
    }

    /**
     * Maps restrictionFlags to RestrictionDirection
     * @param restrictionFlags
     */
    public static toDirection(
        restrictionFlags: AddressRestrictionFlag | MosaicRestrictionFlag | OperationRestrictionFlag,
    ): RestrictionDirection {
        switch (restrictionFlags) {
            case AddressRestrictionFlag.AllowIncomingAddress:
            case AddressRestrictionFlag.BlockIncomingAddress:
            case MosaicRestrictionFlag.BlockMosaic:
            case MosaicRestrictionFlag.AllowMosaic:
                return RestrictionDirection.INCOMING;
            case AddressRestrictionFlag.BlockOutgoingAddress:
            case AddressRestrictionFlag.AllowOutgoingAddress:
            case OperationRestrictionFlag.AllowOutgoingTransactionType:
            case OperationRestrictionFlag.BlockOutgoingTransactionType:
                return RestrictionDirection.OUTGOING;
        }
    }

    /** Maps restrictionFlags to RestrictionBlockType */
    public static toBlockType(
        restrictionFlags: AddressRestrictionFlag | MosaicRestrictionFlag | OperationRestrictionFlag,
    ): RestrictionBlockType {
        switch (restrictionFlags) {
            case AddressRestrictionFlag.BlockOutgoingAddress:
            case AddressRestrictionFlag.BlockIncomingAddress:
            case MosaicRestrictionFlag.BlockMosaic:
            case OperationRestrictionFlag.BlockOutgoingTransactionType:
                return RestrictionBlockType.BLOCK;
            case AddressRestrictionFlag.AllowIncomingAddress:
            case AddressRestrictionFlag.AllowOutgoingAddress:
            case MosaicRestrictionFlag.AllowMosaic:
            case OperationRestrictionFlag.AllowOutgoingTransactionType:
                return RestrictionBlockType.ALLOW;
        }
    }
}
