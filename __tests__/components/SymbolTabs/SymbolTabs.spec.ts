//@ts-ignore
import SymbolTabs from '@/components/SymbolTabs/SymbolTabs.vue'
import { shallowMount, createLocalVue, ThisTypedShallowMountOptions } from '@vue/test-utils'
import { Vue } from 'vue-property-decorator'
const localVue = createLocalVue()
const options: ThisTypedShallowMountOptions<Vue> = {
  localVue,
  propsData: {
    direction: 'horizontal',
  },
}
let wrapper
beforeEach(() => {
  wrapper = shallowMount(SymbolTabs, options)
})
afterEach(() => {
  wrapper.destroy()
})
describe('SymbolTabs should be rendered correctly with', () => {
  it("prop 'horizontal'", () => {
    expect(wrapper.find('.symbol-tab-container').classes()).toEqual(['symbol-tab-container', 'horizontal'])
  })
  it("with prop 'vertical'", async () => {
    wrapper.setProps({ direction: 'vertical' })
    await Vue.nextTick()
    expect(wrapper.find('.symbol-tab-container').classes()).toEqual(['symbol-tab-container', 'vertical'])
  })
  it("with children component 'TabPane' ", async () => {
    wrapper.setData({ tabPaneNavigators: [{ label: 'tabPane1' }] })
    await Vue.nextTick()
    expect(wrapper.find('.nav-item').html()).toContain('<span>tabPane1</span>')
  })
  it('with a slot', () => {
    options.slots = {
      default: '<div>123</div>',
    }
    wrapper = shallowMount(SymbolTabs, options)
    expect(wrapper.find('.tabs-content').html()).toContain('<div>123</div>')
  })
})
