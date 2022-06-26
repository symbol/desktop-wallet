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
// internal dependencies
// @ts-ignore
import AccountAddressDisplay from '@/components/AccountAddressDisplay/AccountAddressDisplay.vue';
import { AccountAddressDisplayTs } from '@/components/AccountAddressDisplay/AccountAddressDisplayTs';
import { getComponent } from '@MOCKS/Components';

describe('components/AccountAddressDisplay', () => {
    const getAccountAddressDisplayValue = (addressProp) => {
        // Arrange:
        const wrapper = getComponent(
            AccountAddressDisplay,
            {},
            {},
            {
                address: addressProp,
            },
        );
        const component = wrapper.vm as AccountAddressDisplayTs;

        // Act:
        const actual = component.prettyAddress;

        return actual;
    };

    test('return empty string given no address', () => {
        // Arrange + Act:
        const actual = getAccountAddressDisplayValue(null);

        // Assert:
        expect(actual).toBeDefined();
        expect(actual.length).toBe(0);
    });

    test('return given pretty address', () => {
        // Arrange + Act:
        const address = 'TBWALHG5EOT6JUWYUAWT6GYMRASATJVQBYH2XDY';
        const actual = getAccountAddressDisplayValue(address);

        // Assert:
        expect(actual).toBe(address);
    });
});
