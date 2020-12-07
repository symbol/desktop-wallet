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
                if (blockType === RestrictionBlockType.BLOCK) {
                    return OperationRestrictionFlag.BlockOutgoingTransactionType;
                } else {
                    return OperationRestrictionFlag.AllowOutgoingTransactionType;
                }
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
