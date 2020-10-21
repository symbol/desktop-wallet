//@ts-ignore
import PeerSelector from '@/components/PeerSelector/PeerSelector.vue';
import { createLocalVue, ThisTypedShallowMountOptions, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import i18n from '@/language';
import VueI18n from 'vue-i18n';
import { NetworkService } from '@/services/NetworkService';
import { networkConfig } from '@/config';
// configuration
let wrapper;
let vm;
let options: ThisTypedShallowMountOptions<Vue>;
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.directive('auto-scroll', {
    componentUpdated: function (el, { value }) {
        if (value && value.length) {
            const className = value.charAt(0) === '.' ? value : '.' + value;
            if (el.querySelector(className)) {
                const offsetTop = (el.querySelector(className) as HTMLElement).offsetTop;
                el.scrollTo(0, offsetTop);
            }
        }
    },
});
beforeEach(() => {
    const networkModule = {
        namespaced: true,
        getters: {
            currentPeerInfo: () => {
                return { url: 'www.google.com', friendlyName: 'google' };
            },
            isConnected: () => true,
            networkType: () => null,
            repositoryFactory: () => NetworkService.createRepositoryFactory(networkConfig.defaultNodeUrl),
            generationHash: () => 123,
            knowNodes: () => [
                { url: 'http://api-01.us-west-1.0941-v1.symboldev.network:3000', friendlyName: '614084b4', isDefault: true },
                {
                    url: 'http://api-01.ap-southeast-1.0941-v1.symboldev.network:3000',
                    friendlyName: '08b0274c',
                    isDefault: true,
                },
                { url: 'http://api-01.eu-west-1.0941-v1.symboldev.network:3000', friendlyName: 'c44a95bd', isDefault: true },
                { url: 'http://api-02.eu-central-1.0941-v1.symboldev.network:3000', friendlyName: '7a26944a', isDefault: true },
                {
                    url: 'http://api-02.ap-northeast-1.0941-v1.symboldev.network:3000',
                    friendlyName: '4d08a4d9',
                    isDefault: true,
                },
                { url: 'http://api-01.eu-central-1.0941-v1.symboldev.network:3000', friendlyName: 'a08950e0', isDefault: true },
                {
                    url: 'http://api-01.ap-northeast-1.0941-v1.symboldev.network:3000',
                    friendlyName: 'API AP North-East 1',
                    isDefault: true,
                },
            ],
        },
    };
    const store = new Vuex.Store({
        modules: {
            network: networkModule,
        },
    });
    options = {
        localVue,
        i18n,
        store,
        stubs: ['Poptip', 'i-col', 'Row', 'Icon'],
    };
    wrapper = mount(PeerSelector, options);
    vm = wrapper.vm;
});
describe('PeerSelector should', () => {
    it("correctly get value of 'networkTypeText' ", () => {
        expect(vm.isConnected).toBeTruthy();
        expect(vm.networkType).toBeFalsy();
        expect(vm.networkTypeText).toBe('Loading...');
    });
    it("correctly get value of 'peersList'", () => {
        expect(vm.peersList.length).toBe(7);
    });
});
