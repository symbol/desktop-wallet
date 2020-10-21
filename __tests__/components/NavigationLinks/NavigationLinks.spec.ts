//@ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
import { shallowMount, createLocalVue, ThisTypedShallowMountOptions } from '@vue/test-utils';
import { Vue } from 'vue-property-decorator';
const localVue = createLocalVue();
const options: ThisTypedShallowMountOptions<Vue> = {
    localVue,
    propsData: {
        direction: 'horizontal',
    },
};
let wrapper;
beforeEach(() => {
    wrapper = shallowMount(NavigationLinks, options);
});
afterEach(() => {
    wrapper.destroy();
});
describe('NavigationLinks should be rendered correctly with', () => {
    it("prop 'horizontal'", () => {
        expect(wrapper.find('.symbol-tab-container').classes()).toEqual(['symbol-tab-container', 'horizontal']);
    });
    it("with prop 'vertical'", async () => {
        wrapper.setProps({ direction: 'vertical' });
        await Vue.nextTick();
        expect(wrapper.find('.symbol-tab-container').classes()).toEqual(['symbol-tab-container', 'vertical']);
    });
});
