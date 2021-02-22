import { createLocalVue, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils';
import Vuex from 'vuex';
import i18n from '@/language';
import VueI18n from 'vue-i18n';
import { Icon } from 'view-design';
//@ts-ignore
import Settings from '@/components/Settings/Settings.vue';
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
/* fake module */
const profileModule = {
    namespaced: true,
    getters: {
        isSettingsVisible: () => true,
    },
};
const store = new Vuex.Store({
    modules: {
        profile: profileModule,
    },
});
store.commit = jest.fn();
const options: ThisTypedShallowMountOptions<Vue> = {
    localVue,
    store,
    stubs: { Icon },
    i18n,
};

describe('Settings', () => {
    test('trigger commit', () => {
        const wrapper = shallowMount(Settings, options);
        wrapper.find('.setting-menu-icon').trigger('click');
        expect(wrapper.vm.$store.commit).toBeCalledWith('profile/toggleSettings');
        wrapper.destroy();
    });
});
