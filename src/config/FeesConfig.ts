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

export interface FeesConfig {
    fast: number;
    median: number;
    slow: number;
    slowest: number;
    free: number;
}

const defaultFeesConfig: FeesConfig = {
    fast: 20,
    median: 10,
    slow: 5,
    slowest: 1,
    free: 0,
};

const resolvedFeesConfig: FeesConfig = window['feesConfig'] || defaultFeesConfig;
console.log('feesConfig resolved!', resolvedFeesConfig);
export const feesConfig = resolvedFeesConfig;
