import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n, { Values } from 'vue-i18n'
import i18n from '@/language/index'

/* import components */
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
//@ts-ignore
import InputPrivateKey from '@/views/pages/profiles/import-private-key/input-private-key/InputPrivateKey.vue'
import { StandardValidationRules } from '@/core/validation/StandardValidationRules'
import flushPromises from 'flush-promises'
import { Account, NetworkType } from 'symbol-sdk'
import { NotificationType } from '@/core/utils/NotificationType'

StandardValidationRules.register()
extend('privateKey', {
  validate(value) {
    try {
      Account.createFromPrivateKey(value, NetworkType.MIJIN_TEST)
      return true
    } catch (e) {
      return false
    }
  },
  message: (fieldName: string, values: Values) => `${i18n.t(NotificationType.PROFILE_NAME_EXISTS_ERROR, values)}`,
})
const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(Vuex)
localVue.component('ValidationObserver', ValidationObserver)
localVue.component('ValidationProvider', ValidationProvider)

/* fake store */
const profileModule = {
  namespaced: true,
  getters: {
    currentProfile: () => {
      return {
        accounts: [],
        generationHash: '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2',
        hint: 'mmmm',
        networkType: 152,
        password: 'hello123456',
        profileName: 'private08',
        seed: '',
      }
    },
  },
}
const temporaryModule = {
  namespaced: true,
  getters: {
    password: () => 'hello123456',
  },
}
const store = new Vuex.Store({
  modules: {
    profile: profileModule,
    temporary: temporaryModule,
  },
})
const options = {
  localVue,
  i18n,
  store,
  mocks: {
    $store: {
      dispatch: jest.fn(),
    },
    $router: {
      push: jest.fn(),
    },
  },
  stubs: ['Tooltip'],
  sync: false,
}
let wrapper
beforeEach(() => {
  wrapper = mount(InputPrivateKey, options)
})
describe('InputPrivateKey', () => {
  describe('input a expected privateKey', () => {
    test('Be able to create profile', async () => {
      expect(wrapper.vm.account).toBe(null)
      wrapper
        .find("input[type='password']")
        .setValue('D5DC464E23B6EE64BA6FA1A772D4457E0EB8D46D87A970E01429CBD1C211C29F')
      await flushPromises()
      const error = wrapper.find('tooltip-stub')
      expect(error.attributes('content')).toBeFalsy()
      wrapper.vm.$store.dispatch = jest.fn()
      wrapper.vm.createAccountByPrivate()
      expect(wrapper.vm.$store.dispatch).not.toBeCalledWith(
        'notification/ADD_ERROR',
        'An error happened, please try again.',
      )
    })
  })
  describe('input a unexpected privateKey', () => {
    test('be unable to create profile', async () => {
      expect(wrapper.vm.account).toBe(null)
      wrapper.find("input[type='password']").setValue('8766555')
      await flushPromises()
      const error = wrapper.find('tooltip-stub')
      expect(error.attributes('content')).toBeTruthy()
    })
  })
})
