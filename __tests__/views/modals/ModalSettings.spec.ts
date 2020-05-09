//@ts-ignore
import ModalSettings from '@/views/modals/ModalSettings/ModalSettings.vue'
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import VueRouter from 'vue-router'
import i18n from '@/language'
import VueI18n from 'vue-i18n'
import { Vue } from 'vue-property-decorator'
let wrapper
const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(VueI18n)
const $route = {
  path: '/profiles/create',
}

const options: ThisTypedShallowMountOptions<Vue> = {
  i18n,
  mocks: {
    $route,
    $emit: jest.fn(),
  },
  propsData: {
    visible: true,
  },
  stubs: ['Modal'],
}
beforeEach(() => {
  wrapper = shallowMount(ModalSettings, options)
})
afterEach(() => {
  wrapper.destroy()
})
describe('ModalSettings', () => {
  it('should display correctly according to route', () => {
    expect(wrapper.vm.$route.path.match(/^\/profiles/)).toBeTruthy()
  })
  it('get a correct value of isShowModal with prop input', () => {
    expect(wrapper.vm.isShowModal).toBeTruthy()
  })
})
