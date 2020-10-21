import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import i18n from '@/language';
import VueI18n, { Values } from 'vue-i18n';
import { Vue } from 'vue-property-decorator';
import { NotificationType } from '@/core/utils/NotificationType';
import flushPromises from 'flush-promises';
//@ts-ignore
import FormNodeEdit from '@/views/forms/FormNodeEdit/FormNodeEdit.vue';
import { NetworkType } from 'symbol-sdk';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import { extend } from 'vee-validate';
import { UrlValidator } from '@/core/validation/validators';
StandardValidationRules.register();
extend('url', {
    validate: (value) => {
        return UrlValidator.validate(value);
    },
    message: (fieldName: string, values: Values) => `${i18n.t('error_incorrect_url', values)}`,
});
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);

/* fake store */
const networkModule = {
    namespaced: true,
    getters: {
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
        currentProfile: () => {
            return {
                netWorkType: NetworkType,
            };
        },
    },
};
const store = new Vuex.Store({
    modules: {
        network: networkModule,
    },
});
store.commit = jest.fn();
store.dispatch = jest.fn();

const options = {
    localVue,
    i18n,
    store,
};
let wrapper;
let vm;
beforeEach(() => {
    wrapper = shallowMount(FormNodeEdit, options);
    vm = wrapper.vm;
});
afterEach(() => {
    wrapper.destroy();
    vm = undefined;
});
describe('FormNodeEdit', () => {
    it('successfully submitted', async () => {
        wrapper.setData({
            formItems: {
                nodeUrl: '',
                networkType: '',
                networkHash: '',
            },
        });
        wrapper.setMethods({
            addPeer: jest.fn(),
        });
        await Vue.nextTick();
        vm.onSubmit();
        expect(vm.addPeer).toBeCalled();
    });
    it('successfully add custom node', async () => {
        wrapper.setData({
            formItems: {
                nodeUrl: 'http://api-01.us-west-1.0941-v1.symboldev.network:3000',
                networkType: 'TEST_NET',
                networkHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
            },
        });
        vm.addPeer();
        expect(vm.$store.dispatch).toBeCalledWith('notification/ADD_ERROR', NotificationType.NODE_EXISTS_ERROR);
        wrapper.setData({
            formItems: {
                nodeUrl: 'http://dual-001.symbol.ninja:3000',
                networkType: 'TEST_NET',
                networkHash: 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4',
            },
        });
        await flushPromises();
        vm.addPeer();
        expect(vm.$store.dispatch).toBeCalledWith('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS);
    });
    it('provide the right choices', async () => {
        await vm.handleInput('http://api-01.us-west-1.0941-v1.symboldev.network:8000');
        expect(vm.customNodeData).toContain('http://api-01.us-west-1.0941-v1.symboldev.network:8000');
    });
});
