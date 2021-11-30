/*
 * (C) Symbol Contributors 2021
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
import { NamespaceId } from 'symbol-sdk';

// internal dependencies
import { Validator, staticImplements } from './Validator';

@staticImplements<Validator>()
export class NamespaceIdValidator {
    /**
     * Executes the validator
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    public static validate(value: any): boolean {
        try {
            new NamespaceId(value);
            return true;
        } catch (error) {
            return false;
        }
    }
}
