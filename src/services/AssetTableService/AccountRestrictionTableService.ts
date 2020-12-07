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
// @ts-ignore
import i18n from '@/language';
import RestrictionFlagMapping from '@/views/forms/FormAccountRestrictionTransaction/RestrictionFlagMapping';
import { AccountRestriction, Address, MosaicId } from 'symbol-sdk';
import { AssetTableService, TableField } from './AssetTableService';

export class AccountRestrictionTableService extends AssetTableService {
    constructor(private readonly accountRestrictions: AccountRestriction[]) {
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
        return this.accountRestrictions
            .flatMap((r) => r.values.map((v) => ({ ...r, values: [v] } as AccountRestriction)))
            .map((accountRestriction) => {
                const direction = RestrictionFlagMapping.toDirection(accountRestriction.restrictionFlags);
                const action = RestrictionFlagMapping.toBlockType(accountRestriction.restrictionFlags);
                let rawValue = '';

                if (accountRestriction?.values) {
                    const value = accountRestriction?.values[0];
                    if (value instanceof Address) {
                        rawValue = value.pretty();
                    } else if (value instanceof MosaicId) {
                        rawValue = value.toHex();
                    } else {
                        rawValue += i18n.t(`transaction_descriptor_${value}`);
                    }
                }
                return {
                    direction: direction,
                    value: rawValue,
                    action: action,
                    hiddenData: {
                        rowObject: accountRestriction,
                    },
                };
            })
            .filter((x) => x); // filter out mosaics that are not yet available
    }
}
