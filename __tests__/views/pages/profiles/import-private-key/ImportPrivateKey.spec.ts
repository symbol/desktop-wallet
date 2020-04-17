import { createLocalVue, mount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import i18n from '@/language/index'
//@ts-ignore
import ImportPrivateKey from '@/views/pages/profiles/import-private-key/ImportPrivateKey.vue'
const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(Vuex)

const options: ThisTypedShallowMountOptions<Vue> = {
  localVue,
  i18n,
  mocks: {
    $store: {
      dispatch: jest.fn(),
    },
  },
  stubs: ['router-view'],
}
let wrapper
let $route
describe('ImportPrivateKey', () => {
  test('getCurrentStep() should return a expected value', () => {
    $route = {
      meta: {
        icon: 'iconUrl',
      },
      name: 'profiles.importPrivateKey.fillInfo',
    }
    options.mocks['$route'] = $route
    wrapper = mount(ImportPrivateKey, options)
    expect(wrapper.vm.getCurrentStep()).toBe(0)
    expect(wrapper.vm.getStepClassName(0)).toBe('white')
    expect(wrapper.vm.getStepClassName(1)).toBe('gray')
    expect(wrapper.vm.getStepClassName(2)).toBe('gray')
    $route.name = 'profiles.importPrivateKey.input'
    wrapper = mount(ImportPrivateKey, options)
    expect(wrapper.vm.getCurrentStep()).toBe(1)
    expect(wrapper.vm.getStepClassName(0)).toBe('white')
    expect(wrapper.vm.getStepClassName(1)).toBe('white')
    expect(wrapper.vm.getStepClassName(2)).toBe('gray')
    $route.name = 'profiles.importPrivateKey.finalize'
    wrapper = mount(ImportPrivateKey, options)
    expect(wrapper.vm.getCurrentStep()).toBe(2)
    expect(wrapper.vm.getStepClassName(0)).toBe('white')
    expect(wrapper.vm.getStepClassName(1)).toBe('white')
    expect(wrapper.vm.getStepClassName(2)).toBe('white')
  })
})
