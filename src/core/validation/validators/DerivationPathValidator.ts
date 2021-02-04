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
import { Validator, staticImplements } from './Validator';
import { NetworkType } from 'symbol-sdk';

@staticImplements<Validator>()
export class DerivationPathValidator {
    /**
     * Executes the validator
     * @static
     * @param {string} value
     * @param {NetworkType} networkType
     * @returns {({valid: boolean|string})}
     */
    public static validate(value: any, networkType: NetworkType): boolean {
        if (networkType === NetworkType.MAIN_NET) {
            if (value.match(/^m\/44'\/4343'\/[0-9]+'\/[0-9]+'\/[0-9]+'/)) {
                return value;
            }
        } else {
            if (value.match(/^m\/44'\/1'\/[0-9]+'\/[0-9]+'\/[0-9]+'/)) {
                return value;
            }
        }
        return false;
    }
}
