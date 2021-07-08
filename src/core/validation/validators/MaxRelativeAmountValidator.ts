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
export class MaxRelativeAmountValidator {
    /**
     * Validates the max amount of the mosaic supply. eg: 9,000,000,000
     * @static
     * @param {*} relativeAmount
     * @returns {boolean}
     */
    public static validate(relativeAmount: string, maxRelativeAmount: number): boolean {
        // Check on the locale decimal separator.
        return DECIMAL_SEPARATOR === ','
            ? Number(relativeAmount.replace(DECIMAL_SEPARATOR, '.')) <= maxRelativeAmount
            : Number(relativeAmount) <= maxRelativeAmount;
    }
}
