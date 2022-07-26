import i18n from '@/language/index';
import Vuex from 'vuex';
//@ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
import { ButtonCopyToClipboardTs } from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboardTs';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { UIHelpers } from '@/core/utils/UIHelpers';
import { NotificationType } from '@/core/utils/NotificationType';

// Arrange:
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
describe('components/ButtonCopyToClipboard', () => {
    test('receive a property "value" correctly', () => {
        // Assert:
        expect(vm.value).toBe('123');
    });

    test('Click on Button should call method "copyToClipboard" when prop "value" exists', () => {
        // Arrange:
        UIHelpers.copyToClipboard = jest.fn();

        // Act:
        wrapper.find('Button').trigger('click');

        // Assert:
        expect(UIHelpers.copyToClipboard).toBeCalledWith('123');
    });

    test('Click on Button should throw an error on copy failure', () => {
        // Arrange:
        UIHelpers.copyToClipboard = jest.fn().mockImplementation(() => {
            throw new Error('Error');
        });

        // Act:
        wrapper.find('Button').trigger('click');

        // Assert:
        expect(wrapper.vm.$store.dispatch).toBeCalledWith('notification/ADD_ERROR', NotificationType.COPY_FAILED);
    });

    test('Click on Button should not call method "copyToClipboard" when prop "value" does not exists', async () => {
        // Arrange:
        UIHelpers.copyToClipboard = jest.fn();
        wrapper.setProps({ value: null });
        await vm.$nextTick();

        // Act:
        wrapper.find('Button').trigger('click');

        // Assert:
        expect(UIHelpers.copyToClipboard).not.toBeCalled();
    });
});
