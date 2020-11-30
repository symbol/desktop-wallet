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
// internal dependencies
import {AssetTableService, TableField} from './AssetTableService';
import {
    AccountRestriction,
    Address,
    AddressRestrictionFlag, MosaicId,
    MosaicRestrictionFlag,
    OperationRestrictionFlag, TransactionType
} from "symbol-sdk";

export class AccountRestrictionTableService extends AssetTableService {
    constructor(
        private readonly accountRestrictions: AccountRestriction[],
    ) {
        super(0);
    }

    /**
     * Return table fields to be displayed in a table header
     * @returns {TableField[]}
     */
    public getTableFields(): TableField[] {
        return [
            { name: 'direction', label: 'table_header_direction' },
            { name: 'value', label: 'table_header_value' },
            { name: 'action', label: 'table_header_action' },
        ];
    }

    /**
     * Return table values to be displayed in a table rows
     * @returns {MosaicTableRowValues[]}
     */
    public getTableRows(): any[] {
        // - get reactive mosaic data from the store
        const accountRestrictions = this.accountRestrictions;
        return accountRestrictions
            .map((accountRestriction) => {
                let direction;
                switch (accountRestriction.restrictionFlags) {
                    case AddressRestrictionFlag.AllowIncomingAddress:
                    case AddressRestrictionFlag.BlockIncomingAddress:
                    case MosaicRestrictionFlag.BlockMosaic:
                    case MosaicRestrictionFlag.AllowMosaic:
                        direction = 'incoming';
                        break;
                    case AddressRestrictionFlag.BlockOutgoingAddress:
                    case AddressRestrictionFlag.AllowOutgoingAddress:
                    case OperationRestrictionFlag.AllowOutgoingTransactionType:
                    case OperationRestrictionFlag.BlockOutgoingTransactionType:
                        direction = 'outgoing';
                        break;
                }
                let action;
                switch (accountRestriction.restrictionFlags) {
                    case AddressRestrictionFlag.BlockOutgoingAddress:
                    case AddressRestrictionFlag.BlockIncomingAddress:
                    case MosaicRestrictionFlag.BlockMosaic:
                    case OperationRestrictionFlag.BlockOutgoingTransactionType:
                        action = 'block';
                        break;
                    case AddressRestrictionFlag.AllowIncomingAddress:
                    case AddressRestrictionFlag.AllowOutgoingAddress:
                    case MosaicRestrictionFlag.AllowMosaic:
                    case OperationRestrictionFlag.AllowOutgoingTransactionType:
                        action = 'allow';
                        break;
                }
                let rawValue = '';
                // TODO: Remove Workaround
                function getEnumKeyByEnumValue(myEnum, enumValue) {
                    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
                    return keys.length > 0 ? keys[0] : null;
                }
                let first = true
                for (let value of accountRestriction.values) {
                    if (value instanceof Address) {
                        rawValue += (first ? '' : ', ') + value.pretty();
                    } else if (value instanceof MosaicId) {
                        rawValue += (first ? '' : ', ') + value.toHex()
                    } else {
                        rawValue += (first ? '' : ', ') + getEnumKeyByEnumValue(TransactionType, value);
                    }
                    first = false;
                }
                return {
                    direction: direction,
                    value: rawValue,
                    action: action,
                };
            })
            .filter((x) => x); // filter out mosaics that are not yet available
    }
}
