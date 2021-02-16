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
import { Validator, staticImplements } from './Validator';
import { appConfig } from '@/config';
const { DECIMAL_SEPARATOR } = appConfig.constants;

@staticImplements<Validator>()
export class MaxDecimalsValidator {
    /**
     * Validates the max number of decimals in a number
     * @static
     * @param {*} value
     * @param {number} maxDecimalNumber
     * @returns {boolean}
     */
    public static validate(value: any, maxDecimalNumber: number): boolean {
        if (Math.floor(value) == value) {
            return true;
        }
        const split: string[] = value.toString().split(DECIMAL_SEPARATOR);

        if (split.length <= 1) {
            return true;
        }

        if (split.length !== 2) {
            return false;
        }

        const decimalNumber = split[1].length || 0;
        return decimalNumber <= maxDecimalNumber;
    }
}
