import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import { NetworkType } from 'symbol-sdk';
import i18n from '@/language';
//@ts-ignore
import PageLayout from '@/views/layout/PageLayout/PageLayout.vue';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { getTestProfile } from '@MOCKS/profiles';
import { ProfileService } from '@/services/ProfileService';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(VueRouter);

const testnetProfile = getTestProfile('profile_testnet');
const service = new ProfileService();

const networkModule = {
    namespaced: true,
    getters: {
        isConnected: () => true,
        currentPeer: () => URLHelpers.getNodeUrl(testnetProfile.selectedNodeUrlToConnect),
        networkType: () => NetworkType.TEST_NET,
        generationHash: () => testnetProfile.generationHash,
    },
};
const profileModule = {
    namespaced: true,
    getters: {
        currentProfile: () => testnetProfile,
    },
};
const accountModule = {
    namespaced: true,
    getters: {
        isCosignatoryMode: () => false,
        currentAccount: () => testnetProfile,
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

const router = new VueRouter();

const options = {
    localVue,
    i18n,
    store,
    router,
};

let wrapper;
let vm;
beforeEach(() => {
    // Mock profile
    service.saveProfile(testnetProfile);
    wrapper = shallowMount(PageLayout, options);
    vm = wrapper.vm;
});
afterEach(() => {
    // delete mock profile
    service.deleteProfile(testnetProfile.profileName);
    wrapper.destroy();
    vm = undefined;
});

describe('PageLayout', () => {
    it('should not able to call reconnect method in /login path', async () => {
        // arrange
        vm.$router.push('/login');

        // act
        vm.reconnect();

        // assert
        expect(vm.$store.dispatch).not.toBeCalledWith('network/CONNECT', { waitBetweenTrials: true });
    });

    it('should able to call reconnect method in any non `login` path', async () => {
        // arrange
        vm.$router.push('/non-login');

        // act
        vm.reconnect();

        // assert
        expect(vm.$store.dispatch).toBeCalledWith('network/CONNECT', { waitBetweenTrials: true });
    });
});
