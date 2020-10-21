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
    normal: number;
    fast: number;
    median: number;
    slow: number;
    highest: number;
    fastest: number;
    free: number;
    slowest: number;
}

const defaultFeesConfig: FeesConfig = {
    median: 1,
    highest: 2,
    free: 0,
    slowest: 5000,
    slow: 30000,
    normal: 50000,
    fast: 100000,
    fastest: 1000000,
};

const resolvedFeesConfig: FeesConfig = window['feesConfig'] || defaultFeesConfig;
console.log('feesConfig resolved!', resolvedFeesConfig);
export const feesConfig = resolvedFeesConfig;
