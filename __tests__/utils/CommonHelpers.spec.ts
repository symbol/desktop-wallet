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
import { CommonHelpers } from '@/core/utils/CommonHelpers';
import { MultisigService } from '@/services/MultisigService';
import { givenParentAccountGraphInfo } from '@MOCKS/multisigGraphInfo';
import { Address } from 'symbol-sdk';

describe('utils/CommonHelpers', () => {
    describe('parseObjectProperties()', () => {
        test('returns array of addresses', () => {
            const multisigService = new MultisigService();
            const graphInfo = MultisigService.getMultisigInfoFromMultisigGraphInfo(givenParentAccountGraphInfo());
            const addresses: Address[] = [];
            const multisigChildren = multisigService.getMultisigChildren([graphInfo]);
            // @ts-ignore
            CommonHelpers.parseObjectProperties(multisigChildren[0].children, (k, prop) => {
                addresses.push(Address.createFromRawAddress(prop));
            });
            expect(addresses.length).toBe(2);
        });
    });
});
