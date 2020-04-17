//@ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'
import { createLocalVue, mount, ThisTypedMountOptions } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import i18n from '@/language/index'
const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(Vuex)
let wrapper
describe('NavigationTabs', () => {
  describe('isPrivateKeyProfile is true', () => {
    /* fake store */
    const accountModule = {
      namespaced: true,
      getters: {
        currentAccount: () => null,
      },
    }
    const profileModule = {
      namespaced: true,
      getters: {
        isPrivateKeyProfile: () => true,
      },
    }

    const store = new Vuex.Store({
      modules: {
        account: accountModule,
        profile: profileModule,
      },
    })

    const options: ThisTypedMountOptions<Vue> = {
      localVue,
      i18n,
      store,
      mocks: {
        $router: {
          getTabEntries: () => {
            return [
              {
                title: 'page_title_account_backup',
                isActive: jest.fn(),
              },
              {
                title: 'page_title_account_details',
                isActive: jest.fn(),
              },
            ]
          },
        },
      },
    }
    test("'title=page_title_account_backup' tabEntries will be filtered", () => {
      wrapper = mount(NavigationTabs, options)
      expect(wrapper.vm.tabEntries.length).toBe(1)
    })
  })
  describe('isPrivateKeyProfile is false', () => {
    test('tabEntries will not be filtered', () => {
      const accountModule = {
        namespaced: true,
        getters: {
          currentAccount: () => null,
        },
      }
      const profileModule = {
        namespaced: true,
        getters: {
          isPrivateKeyProfile: () => false,
        },
      }

      const store = new Vuex.Store({
        modules: {
          account: accountModule,
          profile: profileModule,
        },
      })

      const options: ThisTypedMountOptions<Vue> = {
        localVue,
        i18n,
        store,
        mocks: {
          $router: {
            getTabEntries: () => {
              return [
                {
                  title: 'page_title_account_backup',
                  isActive: jest.fn(),
                },
                {
                  title: 'page_title_account_details',
                  isActive: jest.fn(),
                },
              ]
            },
          },
        },
      }
      wrapper = mount(NavigationTabs, options)
      expect(wrapper.vm.tabEntries.length).toBe(2)
    })
  })
})
