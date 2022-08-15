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
import LogoutButton from '@/components/LogoutButton/LogoutButton.vue';
import { LogoutButtonTs } from '@/components/LogoutButton/LogoutButtonTs';
import { getComponent } from '@MOCKS/Components';

describe('components/LogoutButton', () => {
    const getLogoutButtonWrapper = () => {
        return getComponent(LogoutButton, {});
    };

    test('render component', async () => {
        // Arrange:
        const mockT = jest.fn().mockImplementation((key) => 'translated_' + key);
        const expectedText = 'translated_logout';

        // Act:
        const wrapper = getLogoutButtonWrapper();
        const component = wrapper.vm as LogoutButtonTs;
        component.$t = mockT;
        component.$mount();
        await component.$nextTick();
        const iconElement = wrapper.find('icon');
        const spanElement = wrapper.find('span');

        // Assert:
        expect(iconElement.exists()).toBe(true);
        expect(spanElement.text()).toBe(expectedText);
    });

    test('handle click', async () => {
        // Arrange:
        const mockLogout = jest.fn();

        // Act:
        const wrapper = getLogoutButtonWrapper();
        const component = wrapper.vm as LogoutButtonTs;
        component.logout = mockLogout;
        component.$mount();
        await wrapper.find('a').trigger('click');

        // Assert:
        expect(mockLogout).toBeCalledTimes(1);
    });

    test('logout()', async () => {
        // Arrange:
        const mockDispatch = jest.fn();
        const mockRouterPush = jest.fn();
        const expectedActionToBeDispatched = 'profile/LOG_OUT';
        const expectedRouteToBePushed = 'profiles.login';

        // Act:
        const wrapper = getLogoutButtonWrapper();
        const component = wrapper.vm as LogoutButtonTs;
        component.$store.dispatch = mockDispatch;
        (component.$router as any) = {
            push: mockRouterPush,
        };
        await component.logout();

        // Assert:
        expect(mockDispatch).toBeCalledWith(expectedActionToBeDispatched);
        expect(mockRouterPush).toBeCalledWith({ name: expectedRouteToBePushed });
    });
});
