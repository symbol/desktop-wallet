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

import { givenParentAccountGraphInfo, multisigEntries1, multisigEntries2, multisigGraphInfo1 } from '@MOCKS/multisigGraphInfo';
import { MultisigService } from '@/services/MultisigService';

describe('services/MultisigService', () => {
    const multisignService = new MultisigService();
    const graphInfo = MultisigService.getMultisigInfoFromMultisigGraphInfo(givenParentAccountGraphInfo());

    describe('getMultisigInfoFromMultisigGraphInfo() should', () => {
        test('return multisig info contained in a multisig graph', () => {
            const multisigsInfo = MultisigService.getMultisigInfoFromMultisigGraphInfo(multisigGraphInfo1);
            expect(multisigsInfo).toStrictEqual([...multisigEntries1, ...multisigEntries2]);
        });
    });

    describe('getMultisigChildren() should', () => {
        test('return multisigChildren', () => {
            const multisigChildren = multisignService.getMultisigChildren([graphInfo]);
            expect(multisigChildren.length).toBe(1);
            // @ts-ignore
            expect(multisigChildren[0].children).not.toBe(undefined);
        });
    });

    describe('getMultisigChildren() should', () => {
        test('return empty array for multisigAccount', () => {
            const multisigChildren = multisignService.getMultisigChildren([multisigEntries1]);
            expect(multisigChildren.length).toBe(0);
        });
    });
    describe('getMultisigChildrenAddresses() should', () => {
        test('return array for Addresses', () => {
            const multisigChildren = multisignService.getMultisigChildrenAddresses([graphInfo]);
            expect(multisigChildren.length).toBe(2);
        });
    });
});
