//@ts-ignore
import SymbolTabPane from '@/components/SymbolTabs/SymbolTabPane/SymbolTabPane.vue'
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import { Vue } from 'vue-property-decorator'
const localVue = createLocalVue()
const options: ThisTypedShallowMountOptions<Vue> = {
  localVue,
  propsData: {
    label: 'tabPane1',
  },
  parentComponent: {
    data() {
      return { activeNavIndex: '1' }
    },
  },
  slots: {
    default: '<div>hello world</div>',
  },
}
let wrapper
describe('SymbolTabPane should be rendered correctly', () => {
  it('with a slot', async () => {
    wrapper = shallowMount(SymbolTabPane, options)
    wrapper.setData({ currentIndex: '1' })
    await Vue.nextTick()
    expect(wrapper.find('.tab-content-container').html()).toContain('<div>hello world</div>')
  })
})
