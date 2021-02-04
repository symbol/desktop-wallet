import { Address } from 'symbol-sdk';
//@ts-ignore
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue';
import { getComponent } from '@MOCKS/Components';
import AccountStore from '@/store/Account';
import TransactionStore from '@/store/Transaction';
let wrapper;
let vm;
beforeEach(() => {
    wrapper = getComponent(
        TransactionListFilters,
        { account: AccountStore, transaction: TransactionStore },
        { currentAccount: null, signers: [] },
        {},
        {},
    );
    vm = wrapper.vm as TransactionListFilters;
});
afterEach(() => {
    wrapper.destroy();
});
const addr = Address.createFromRawAddress('TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY');
describe('TransactionListFilters', () => {
    test("should call the 'account/SET_CURRENT_SIGNER' with address", () => {
        vm.onSignerSelectorChange('TAD5BAHLOIXCRRB6GU2H72HPXMBBVAEUQRYPHBY');
        expect(vm.$store.dispatch).toBeCalledWith('account/SET_CURRENT_SIGNER', { address: addr, reset: true, unsubscribeWS: false });
    });
    test("should not call the 'account/SET_CURRENT_SIGNER' without address", () => {
        vm.onSignerSelectorChange();
        expect(vm.$store.dispatch).not.toBeCalled();
    });
});
