/*
 * Copyright 2020 NEM Foundation (https://nem.io)
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

const resolvedNetworkConfig = window['networkConfig']
console.log('networkConfig resolved!', resolvedNetworkConfig)
export const networkConfig = resolvedNetworkConfig

const resolvedAppConfig = window['appConfig']
console.log('appConfig resolved!', resolvedAppConfig)
export const appConfig = resolvedAppConfig

const resolvedFeesConfig = window['feesConfig']
console.log('feesConfig resolved!', resolvedFeesConfig)
export const feesConfig = resolvedFeesConfig
