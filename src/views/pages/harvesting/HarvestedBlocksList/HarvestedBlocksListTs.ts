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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { HarvestedBlock } from '@/store/Harvesting';
import { PageInfo } from '@/store/Transaction';
//@ts-ignore
import Pagination from '@/components/Pagination/Pagination.vue';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
import { AccountInfo } from 'symbol-sdk';

@Component({
    components: { Pagination },
    computed: {
        ...mapGetters({
            harvestedBlocks: 'harvesting/harvestedBlocks',
            pageInfo: 'harvesting/harvestedBlocksPageInfo',
            isFetchingHarvestedBlocks: 'harvesting/isFetchingHarvestedBlocks',
            currentSignerAccountInfo: 'account/currentSignerAccountInfo',
            networkCurrency: 'mosaic/networkCurrency',
        }),
    },
})
export default class HarvestedBlocksListTs extends Vue {
    public harvestedBlocks: HarvestedBlock[];
    public pageInfo: PageInfo;
    public isFetchingHarvestedBlocks: boolean;
    public requestedPage = 1;
    public networkCurrency: NetworkCurrencyModel;
    public currentSignerAccountInfo: AccountInfo;

    private columns;

    created() {
        this.onPageChange(this.requestedPage);
        this.columns = [
            {
                title: this.$t('block'),
                key: 'blockNo',
            },
            {
                title: this.$t('fees_earned'),
                key: 'fee',
            },
        ];
    }

    public get blockList() {
        return !!this.harvestedBlocks
            ? this.harvestedBlocks.map((i) => ({
                  blockNo: i.blockNo?.compact(),
                  fee: (i.fee?.compact() / Math.pow(10, this.networkCurrency.divisibility)).toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: this.networkCurrency.divisibility,
                  }),
              }))
            : [];
    }

    public onPageChange(nextPage: number) {
        this.requestedPage = nextPage;
        this.$store.dispatch('harvesting/LOAD_HARVESTED_BLOCKS', { pageNumber: this.requestedPage, pageSize: 20 });
    }

    @Watch('currentSignerAccountInfo')
    public refreshWatcher() {
        this.onPageChange(1);
    }

    beforeDestroy() {
        this.$store.dispatch('harvesting/RESET_STATE');
    }
}
