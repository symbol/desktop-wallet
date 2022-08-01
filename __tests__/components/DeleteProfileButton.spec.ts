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
import DeleteProfileButton from '@/components/DeleteProfileButton/DeleteProfileButton.vue';
import { DeleteProfileButtonTs } from '@/components/DeleteProfileButton/DeleteProfileButtonTs';
import { getComponent } from '@MOCKS/Components';
import i18n from '@/language';

describe('components/DeleteProfileButton', () => {
    const profile = {
        profileName: 'test',
    };
    const mockProfileStore = {
        namespaced: true,
        state: {
            currentProfile: profile,
        },
        getters: {
            currentProfile: (state) => {
                return state.currentProfile;
            },
        },
    };

    const getDeleteProfileButtonWrapper = () => {
        // Arrange:
        const wrapper = getComponent(DeleteProfileButton, { profile: mockProfileStore }, {}, {});
        return wrapper;
    };

    test('renders delete profile button', () => {
        // Arrange + Act:
        const wrapper = getDeleteProfileButtonWrapper();

        // Assert:
        expect(wrapper.find('button').text()).toBe(i18n.t('delete_profile'));
    });

    test('profile is to be deleted when delete action is triggered', async () => {
        // Arrange + Act:
        const wrapper = getDeleteProfileButtonWrapper();
        const component = wrapper.vm as DeleteProfileButtonTs;
        // @ts-ignore - accessing private property
        component.profileService.deleteProfile = jest.fn();
        await component.deleteProfile();

        // Assert:
        // @ts-ignore - accessing private property
        expect(component.profileService.deleteProfile).toHaveBeenCalled();
        expect(wrapper.emitted('logout')).toBeTruthy();
    });
});
