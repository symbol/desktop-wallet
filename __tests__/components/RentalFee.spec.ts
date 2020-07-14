import { createLocalVue, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import Vuex from 'vuex'
//@ts-ignore
import RentalFee from '@/components/RentalFee/RentalFee.vue'
import VueI18n from 'vue-i18n'
import i18n from '@/language'
import { RentalFees, UInt64 } from 'symbol-sdk'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
const networkModule = {
  namespaced: true,
  getters: {
    rentalFees: () => {
      const effectiveRootNamespaceRentalFeePerBlock: UInt64 = new UInt64([1000, 0])
      const effectiveChildNamespaceRentalFee: UInt64 = new UInt64([100000, 0])
      const effectiveMosaicRentalFee: UInt64 = new UInt64([500000, 0])
      return new RentalFees(
        effectiveRootNamespaceRentalFeePerBlock,
        effectiveChildNamespaceRentalFee,
        effectiveMosaicRentalFee,
      )
    },
  },
}
const store = new Vuex.Store({
  modules: {
    network: networkModule,
  },
})
const propsData = {
  rentalType: 'mosaic',
  duration: 172800,
}
const options: ThisTypedShallowMountOptions<Vue> = {
  localVue,
  i18n,
  store,
  propsData,
}
let wrapper
beforeEach(() => {
  wrapper = shallowMount(RentalFee, options)
})
afterEach(() => {
  wrapper.destroy()
})
describe('RentalFee', () => {
  it("should return effectiveMosaicFee when rentalType==='mosaic'", () => {
    expect(wrapper.vm.rentalFeeAmount).toBe(500000)
  })
  it("should return effectiveRootNamespaceRentalFeePerBlock when rentalType==='root-namespace'", () => {
    wrapper.setProps({
      rentalType: 'root-namespace',
    })
    expect(wrapper.vm.rentalFeeAmount).toBe(1000 * 172800)
  })
  it("should return effectiveChildNamespaceRentalFee when rentalType==='child-namespace'", () => {
    wrapper.setProps({
      rentalType: 'child-namespace',
    })
    expect(wrapper.vm.rentalFeeAmount).toBe(100000)
  })
})
