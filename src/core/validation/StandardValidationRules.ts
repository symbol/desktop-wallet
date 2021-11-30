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
import { extend } from 'vee-validate';
import { digits, excluded, integer, is, is_not, max_value, max, min_value, min, regex, required } from 'vee-validate/dist/rules';

export class StandardValidationRules {
    /**
     * Registers validation rules shipped with vee-validate
     * @static
     */
    public static register() {
        extend('digits', digits);
        extend('excluded', excluded);
        extend('integer', integer);
        extend('is', is);
        extend('is_not', is_not);
        extend('max_value', max_value);
        extend('max', max);
        extend('min_value', min_value);
        extend('min', min);
        extend('regex', regex);
        extend('required', required);
    }
}
