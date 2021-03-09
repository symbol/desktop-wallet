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
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { AccountModel } from '@/core/database/entities/AccountModel';
import { ProfileService } from '@/services/ProfileService';
import { AccountService } from '@/services/AccountService';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            currentAccount: 'account/currentAccount',
        }),
    },
})
export default class FinalizeTs extends Vue {
    /**
     * Finalize the profile creation process by adding
     * just redirect to dashboard page.
     * @return {void}
     */
    /**
     * Profile Service
     * @var {ProfileService}
     */
    public profileService: ProfileService = new ProfileService();
    public ledgerAccountService: AccountService = new AccountService();
    public marked: boolean = false;
    public currentProfile: ProfileModel;
    public currentAccount: AccountModel;
    public async submit() {
        // use repository for storage
        this.profileService.updateProfileTermsAndConditionsStatus(this.currentProfile, true);

        // flush and continue
        return this.$router.push({ name: 'dashboard' });
    }
}
