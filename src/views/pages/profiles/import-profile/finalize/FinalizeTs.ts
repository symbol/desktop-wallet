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
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ProfileService } from '@/services/ProfileService';

@Component({
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export default class FinalizeTs extends Vue {
    /**
     * Controls submit button for terms and conditions
     * @type {boolean}
     */
    private marked: boolean = false;

    /**
     * Modal forms visibility states
     * @protected
     * @type {{
     *     termsAndConditions: boolean
     *     privacyAndPolicy: boolean
     *   }}
     */
    protected modalVisibility: {
        termsAndConditions: boolean;
        privacyAndPolicy: boolean;
    } = {
        termsAndConditions: false,
        privacyAndPolicy: false,
    };

    /**
     * Profile Service
     * @var {ProfileService}
     */
    public profileService: ProfileService = new ProfileService();

    /**
     * Closes a modal
     * @protected
     * @param {string} modalIdentifier
     * @return {void}
     */
    protected displayModal(modalIdentifier: string): void {
        Vue.set(this.modalVisibility, modalIdentifier, true);
    }

    /**
     * Closes a modal
     * @protected
     * @param {string} modalIdentifier
     * @return {void}
     */
    protected closeModal(modalIdentifier: string): void {
        Vue.set(this.modalVisibility, modalIdentifier, false);
    }
}
