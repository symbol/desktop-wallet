import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import i18n from '@/language';
import VueI18n from 'vue-i18n';
import { NetworkType } from 'symbol-sdk';
import router from '@/router/AppRouter';
//@ts-ignore
import ImportQRButton from '@/components/QRCode/ImportQRButton/ImportQRButton.vue';
//@ts-ignore
import PageLayoutTs from '@/views/layout/PageLayout/PageLayout.vue';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { getTestProfile } from '@MOCKS/profiles';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(VueRouter);

const networkModule = {
    namespaced: true,
    getters: {
        isConnected: () => true,
        currentPeer: () => URLHelpers.getNodeUrl('http://localhost:3000'),
        networkType: () => NetworkType.TEST_NET,
        generationHash: () => '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155',
    },
};
const profileModule = {
    namespaced: true,
    getters: {
        currentProfile: () => getTestProfile('profile1'),
    },
};
const accountModule = {
    namespaced: true,
    getters: {
        isCosignatoryMode: () => false,
        currentAccount: () => getTestProfile('profile1'),
    },
};
const appModule = {
    namespaced: true,
    getters: {
        explorerUrl: () => 'http://explorer.testnet.symboldev.network/',
        faucetUrl: () => 'http://faucet.testnet.symboldev.network/',
    },
};

const store = new Vuex.Store({
    modules: {
        network: networkModule,
        app: appModule,
        profile: profileModule,
        account: accountModule,
    },
});
store.commit = jest.fn();
store.dispatch = jest.fn();

const options = {
    localVue,
    i18n,
    store,
    router,
    stubs: {
        ImportQRButton,
    },
};

let wrapper;
let vm;
beforeEach(() => {
    wrapper = shallowMount(PageLayoutTs, options);
    vm = wrapper.vm;
});
afterEach(() => {
    wrapper.destroy();
    vm = undefined;
});

describe('PageLayoutTs', () => {
    it('call on reconnect', async () => {
        vm.reconnect();
        expect(vm.$store.dispatch).toBeCalledWith('network/CONNECT', { waitBetweenTrials: true });
    });
});
