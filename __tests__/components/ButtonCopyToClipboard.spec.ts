import i18n from '@/language/index';
import Vuex from 'vuex';
//@ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
import { ButtonCopyToClipboardTs } from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboardTs';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { UIHelpers } from '@/core/utils/UIHelpers';
const localVue = createLocalVue();

const options = {
    localVue,
    Vuex,
    i18n,
    propsData: {
        value: '123',
    },
    mocks: {
        $store: {
            dispatch: jest.fn(),
        },
    },
};
const wrapper = shallowMount(ButtonCopyToClipboard, options);

const vm = wrapper.vm as ButtonCopyToClipboardTs;
describe('ButtonCopyToClipboard', () => {
    test('receive a property "value" correctly', () => {
        expect(vm.value).toBe('123');
    });
    test('Click on Button should call method "copyToClipboard" when prop "value" exists', () => {
        UIHelpers.copyToClipboard = jest.fn();
        wrapper.find('Button').trigger('click');
        expect(UIHelpers.copyToClipboard).toBeCalledWith('123');
    });
    test('Click on Button should call method "copyToClipboard" when prop "value" does not exists', () => {
        UIHelpers.copyToClipboard = jest.fn();
        wrapper.setProps({ value: null });
        wrapper.find('Button').trigger('click');
        expect(UIHelpers.copyToClipboard).toBeCalled();
    });
});
