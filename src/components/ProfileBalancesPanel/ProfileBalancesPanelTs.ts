/*
 * (C) Symbol Contributors 2021 (https://nem.io)
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
import { Address } from 'symbol-sdk';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
// @ts-ignore
import MosaicBalanceList from '@/components/MosaicBalanceList/MosaicBalanceList.vue';
//@ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';

@Component({
    components: {
        MosaicAmountDisplay,
        MosaicBalanceList,
        ButtonCopyToClipboard,
    },
    computed: {
        ...mapGetters({
            currentSignerAddress: 'account/currentSignerAddress',
            balanceMosaics: 'mosaic/balanceMosaics',
            isCosignatoryMode: 'account/isCosignatoryMode',
            networkCurrency: 'mosaic/networkCurrency',
        }),
    },
})
export class ProfileBalancesPanelTs extends Vue {
    /**
     * Currently active signer
     * @var {any}
     */
    public currentSignerAddress: Address;

    /**
     * Currently active account's balances
     * @var {Mosaic[]}
     */
    public balanceMosaics: MosaicModel[];

    /**
     * Whether currently active account is in cosignatory mode
     * @var {boolean}
     */
    public isCosignatoryMode: boolean;

    /**
     * Networks currency mosaic
     * @var {MosaicId}
     */
    public networkCurrency: NetworkCurrencyModel;

    public async created() {
        this.$store.dispatch('mosaic/LOAD_MOSAICS');
    }

    public get absoluteBalance() {
        const networkMosaicData = this.balanceMosaics.filter((m) => m.isCurrencyMosaic).find((i) => i);
        return (networkMosaicData && networkMosaicData.balance) || 0;
    }
}
