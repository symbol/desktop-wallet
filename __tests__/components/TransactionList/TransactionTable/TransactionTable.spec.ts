import { createLocalVue, shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import i18n from '@/language'
//@ts-ignore
import TransactionTable from '@/components/TransactionList/TransactionTable/TransactionTable.vue'
import {
  TransferTransaction,
  NetworkType,
  Deadline,
  UInt64,
  Address,
  Mosaic,
  MosaicId,
  PlainMessage,
  PublicAccount,
  TransactionInfo,
} from 'symbol-sdk'
import flushPromises from 'flush-promises'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
//fake store
const transactionModule = {
  namespaced: true,
  getters: {
    isFetchingTransactions: () => false,
  },
}
const store = new Vuex.Store({
  modules: {
    transaction: transactionModule,
  },
})

const mosaic = new Mosaic(new MosaicId([3646934825, 3576016193]), new UInt64([0, 160000]))
const transactionInfo1 = new TransactionInfo(
  new UInt64([186353, 0]),
  0,
  '5EF9973BC38DC30EBB879A72',
  '50BD71387144EE3062BEED2742A24F75B76B62E135E7575AFC5DA6BD15C3E188',
  '50BD71387144EE3062BEED2742A24F75B76B62E135E7575AFC5DA6BD15C3E188',
)
const transactionInfo2 = new TransactionInfo(
  new UInt64([186353, 0]),
  0,
  '5EF9973BC38DC30EBB879A72',
  '50BD71387144EE3062BEED2742A24F75B76B62E135E7575AFC5DA6BD15C3E188',
  '50BD71387144EE3062BEED2742A24F75B76B62E135E7575AFC5DA6BD15C3E188',
)
const transaction1 = new TransferTransaction(
  NetworkType.TEST_NET,
  1,
  Deadline.create(),
  new UInt64([0, 160000]),
  Address.createFromRawAddress('TCVSJSKTHNXNH6L7QX2YXBWD3MWN2FYK7QFO643N'),
  [mosaic],
  PlainMessage.create(''),
  '1F30AE84B51DA5E321C973A1D80B337CBED4D11C13366C72100D6297E689326B12E5266E1FF8A678D1F86643FAF0ED9D78C0008180CB16ACC21F84526DCCFF09',
  PublicAccount.createFromPublicKey(
    '4135C04C2AC233F561AC824BF959968204071E598081B6285E4592781E1F2BD5',
    NetworkType.TEST_NET,
  ),
  transactionInfo1,
)

const transaction2 = new TransferTransaction(
  NetworkType.TEST_NET,
  1,
  Deadline.create(),
  new UInt64([0, 160000]),
  Address.createFromRawAddress('TCIQUGLHHZY7TMMHIBLQJBS7V4TBJFVSDXD24J4H'),
  [mosaic],
  PlainMessage.create(''),
  '1F30AE84B51DA5E321C973A1D80B337CBED4D11C13366C72100D6297E689326B12E5266E1FF8A678D1F86643FAF0ED9D78C0008180CB16ACC21F84526DCCFF09',
  PublicAccount.createFromPublicKey(
    '4135C04C2AC233F561AC824BF959968204071E598081B6285E4592781E1F2BD5',
    NetworkType.TEST_NET,
  ),
  transactionInfo2,
)
const options: ThisTypedShallowMountOptions<Vue> = {
  localVue,
  i18n,
  store,
  propsData: {
    transactions: [transaction1],
  },
}
const wrapper = shallowMount(TransactionTable, options)
describe('TransactionTable', () => {
  it('renders correctly', async () => {
    const transactions = wrapper.findAll('transactionrow-stub')
    expect(transactions.length).toBe(1)
    expect(transactions.at(0)['vnode'].data.attrs.transaction.recipientAddress.address).toBe(
      'TCVSJSKTHNXNH6L7QX2YXBWD3MWN2FYK7QFO643N',
    )
    wrapper.setProps({
      transactions: [transaction2],
    })
    await flushPromises()
    const transaction = wrapper.find('transactionrow-stub')
    expect(transaction['vnode'].data.attrs.transaction.recipientAddress.address).toBe(
      'TCIQUGLHHZY7TMMHIBLQJBS7V4TBJFVSDXD24J4H',
    )
    wrapper.setProps({
      transactions: [],
    })
    await flushPromises()
    expect(wrapper.findAll('transactionrow-stub').length).toBe(0)
  })
})
