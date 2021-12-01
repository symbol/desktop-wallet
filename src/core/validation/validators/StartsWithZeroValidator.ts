/*
 * Copyright 2020 NEM
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

@staticImplements<Validator>()
export class StartsWithZeroValidator {
    /**
     * Validates amount value to not starts with 0 in case of value > 1
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    public static validate(value: any): boolean {
        return parseInt(value) > 0 ? !value.startsWith('0') : true;
    }
}
