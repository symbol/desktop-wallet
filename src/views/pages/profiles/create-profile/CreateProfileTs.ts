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

@Component
export default class CreateProfileTs extends Vue {
    /**
     * List of steps
     * @var {string[]}
     */
    public StepBarTitleList = ['create_profile', 'generate_mnemonic', 'backup_mnemonic_phrase', 'verify_Mnemonic_phrase', 'finish'];

    /**
     * Hook called when the page is mounted
     * @return {void}
     */
    async mounted() {
        await this.$store.dispatch('temporary/initialize');
    }

    public getCurrentStep(): number {
        switch (this.$route.name) {
            default:
            case 'profiles.createProfile.info':
                return 0;
            case 'profiles.createProfile.generateMnemonic':
                return 1;
            case 'profiles.createProfile.showMnemonic':
                return 2;
            case 'profiles.createProfile.verifyMnemonic':
                return 3;
            case 'profiles.createProfile.finalize':
                return 4;
        }
    }

    public getStepClassName(index: number): string {
        return this.getCurrentStep() == index ? 'active' : this.getCurrentStep() > index ? 'done' : '';
    }
}
