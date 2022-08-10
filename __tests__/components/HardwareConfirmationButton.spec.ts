/*
 * (C) Symbol Contributors 2022
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
import HardwareConfirmationButton from '@/components/HardwareConfirmationButton/HardwareConfirmationButton.vue';
import { HardwareConfirmationButtonTs } from '@/components/HardwareConfirmationButton/HardwareConfirmationButtonTs';
import TrezorConnect from '@/core/utils/TrezorConnect';
import { WalletsModel1 } from '@MOCKS/Accounts';
import { getComponent } from '@MOCKS/Components';
import { transferTransaction } from '@MOCKS/transactions';

describe('components/HardwareConfirmationButton', () => {
    const account = WalletsModel1;
    const mockAccountStore = {
        namespaced: true,
        state: {
            currentAccount: account,
        },
        getters: {
            currentAccount: (state) => {
                return state.currentAccount;
            },
        },
    };

    const getHardwareConfirmationButtonWrapper = () => {
        return getComponent(HardwareConfirmationButton, { account: mockAccountStore }, {}, {}, {});
    };

    test('renders hardware confirmation button', () => {
        // Arrange:
        const wrapper = getHardwareConfirmationButtonWrapper();

        // Act + Assert:
        expect(wrapper.find('button').exists()).toBe(true);
    });

    test('success event emitted when confirm button clicked', async () => {
        // Arrange:
        const wrapper = getHardwareConfirmationButtonWrapper();

        // Act:
        await wrapper.find('button').trigger('click');

        // Assert:
        expect(wrapper.emitted('success')).toBeTruthy();
    });

    test('signs a transaction successfully', async () => {
        // Arrange:
        const wrapper = getHardwareConfirmationButtonWrapper();
        const component = wrapper.vm as HardwareConfirmationButtonTs;
        const transaction = transferTransaction;
        const expectedResult = { success: true, payload: { data: 'PAYLOAD_DATA' } };
        jest.spyOn(TrezorConnect, 'nemSignTransaction').mockResolvedValue(expectedResult);

        // Act:
        const signedTx = await component.signTransaction(transaction).toPromise();

        // Assert:
        expect(signedTx.payload).toBe(expectedResult.payload.data);
    });

    test('error on signing transaction', async () => {
        // Arrange:
        const wrapper = getHardwareConfirmationButtonWrapper();
        const component = wrapper.vm as HardwareConfirmationButtonTs;
        const transaction = transferTransaction;
        const expectedResult = { success: false, payload: { error: 'PAYLOAD_ERROR' } };
        jest.spyOn(TrezorConnect, 'nemSignTransaction').mockResolvedValue(expectedResult);

        // Act + Assert:
        expect(component.signTransaction(transaction).toPromise()).rejects.toThrow(expectedResult.payload.error);
    });

    test('throws not implemented error when cosign a transaction', async () => {
        // Arrange:
        const wrapper = getHardwareConfirmationButtonWrapper();
        const component = wrapper.vm as HardwareConfirmationButtonTs;

        // Act + Assert:
        expect(component.signCosignatureTransaction(undefined).toPromise()).rejects.toThrow('Not Implemented!!!');
    });
});
