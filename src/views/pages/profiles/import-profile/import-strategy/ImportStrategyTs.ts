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
import Vue from 'vue';
import Component from 'vue-class-component';
// resources
import { walletTypeImages } from '@/views/resources/Images';

@Component
export default class ImportStrategyTs extends Vue {
    /**
     * Ledger is available only on Electron native app and development environment
     * @returns {boolean}
     */
    public get isLedgerAvailable(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        const isElectronApp = userAgent.indexOf(' electron/') > -1;

        return isElectronApp || process.env.NODE_ENV === 'development';
    }

    /**
     * List of available follow-up pages
     * @var {any[]}
     */
    public importInfoList = [
        {
            image: walletTypeImages.createImg,
            title: 'create_profile',
            description: 'create_mnemonic_passphrase',
            route: 'profiles.createProfile.info',
        },
        {
            image: walletTypeImages.seedImg,
            title: 'import_profile',
            description: 'import_mnemonic_passphrase',
            route: 'profiles.importProfile.info',
        },
        {
            image: walletTypeImages.ledgerImg,
            title: 'access_ledger',
            description: 'access_your_ledger_account',
            route: 'profiles.accessLedger.info',
        },
    ];

    /**
     * Redirect user to clicked route
     * @param link
     */
    public redirect(routeName: string) {
        if (!routeName || !routeName.length) {
            return this.$store.dispatch('notification/ADD_WARNING', this.$t('not_yet_open'));
        }
        if (routeName === 'profiles.accessLedger.info' && !this.isLedgerAvailable) {
            return;
        }
        return this.$router.push({
            name: routeName,
            params: {
                nextPage: 'profiles.importProfile.importMnemonic',
            },
        });
    }
}
