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

export enum LedgerProfileType {
    NORMAL = 1,
    OPTIN = 2,
}

type ProfileLedgerEntry = { value: number; label: string };

export class ProfileTypeHelper {
    /**
     * Network types with their names
     */
    public static profileTypeList: ProfileLedgerEntry[] = [
        { value: 1, label: 'normal_wallet' },
        { value: 2, label: 'optin_wallet' },
    ];

    /**
     * Getter for network type label
     * @param {NetworkType} networkType
     * @return {string}
     */
    public static getProfileTypeLabel(profileType: number): string {
        const findType = ProfileTypeHelper.profileTypeList.find((n) => n.value === profileType);
        if (findType === undefined) {
            return '';
        }
        return findType.label;
    }
}
