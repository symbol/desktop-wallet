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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Password, Crypto } from 'symbol-sdk';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
import CryptoJS from 'crypto-js';
// internal dependencies
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { NotificationType } from '@/core/utils/NotificationType';
import { ProfileService } from '@/services/ProfileService';

@Component({
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            currentPassword: 'temporary/password',
        }),
    },
})
export default class GenerateMnemonicTs extends Vue {
    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Previous step's password
     * @see {Store.Temporary}
     * @var {Password}
     */
    public currentPassword: Password;

    /**
     * Profile repository
     * @var {ProfileService}
     */
    public profileService: ProfileService = new ProfileService();

    /**
     * Whether component should track mouse move
     * @var {boolean}
     */
    public shouldTrackMouse: boolean = true;

    /**
     * Entropy storage
     * @var {string}
     */
    private entropy = '';

    /**
     * Percentage of entropy generation process
     * @var {number}
     */
    private percent: number = 0;

    /**
     * Hook called when the layout is mounted
     * @return {void}
     */
    public mounted(): void {
        document.addEventListener('mouseover', this.handleMousemove);
    }

    /**
     * Hook called when the component is destroyed
     * @return {void}
     */
    public destroyed(): void {
        document.removeEventListener('mouseover', this.handleMousemove);
    }

    /**
     * Track and handle mouse move event
     * @param {Vue.Event} event
     * @return {void}
     */
    public handleMousemove() {
        if (this.percent < 100) {
            this.entropy += Crypto.randomBytes(8);
            this.percent++;
            return;
        }

        // stop tracking
        this.shouldTrackMouse = false;
        return this.saveMnemonicAndGoToNextPage();
    }

    /**
     * Save mnemonic and redirect to next page
     * return {void}
     */
    private async saveMnemonicAndGoToNextPage() {
        try {
            // act
            const seed = this.filterRepeatedWords();

            // encrypt seed for storage
            const encSeed = Crypto.encrypt(seed.plain, this.currentPassword.value);

            // update currentProfile instance and storage
            this.profileService.updateSeed(this.currentProfile, encSeed);

            // update state
            await this.$store.dispatch('profile/SET_CURRENT_PROFILE', this.currentProfile);
            this.$store.dispatch('temporary/SET_MNEMONIC', seed);

            // redirect
            return this.$router.push({ name: 'profiles.createProfile.showMnemonic' });
        } catch (error) {
            console.log('An error happened while generating Mnenomic:', error);
            this.$store.dispatch('notification/ADD_ERROR', NotificationType.MNEMONIC_GENERATION_ERROR);
        }
    }

    /**
     * Filter repeating words in Mnemonic phrase
     * retrun seed
     */
    private filterRepeatedWords() {
        const entropy = CryptoJS.SHA256(this.entropy + Crypto.randomBytes(8)).toString();
        const seed = MnemonicPassPhrase.createFromEntropy(entropy);
        if (new Set(seed.toArray()).size != seed.toArray().length) {
            return this.filterRepeatedWords();
        }
        return seed;
    }
}
