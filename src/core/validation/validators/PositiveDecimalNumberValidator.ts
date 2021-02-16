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
export class PositiveDecimalNumberValidator {
    private static regex = new RegExp(`^\\s*\\d+(\\${DECIMAL_SEPARATOR}\\d*)?\\s*$`);

    /**
     * Validates the value is a valid decimal number
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    public static validate(value: any): boolean {
        return this.regex.test(value.toString());
    }
}
