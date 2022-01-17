import { Address } from 'symbol-sdk';
//@ts-ignore
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue';
import { getComponent } from '@MOCKS/Components';
import AccountStore from '@/store/Account';
import TransactionStore from '@/store/Transaction';
import AddressBookStore from '@/store/AddressBook';
import { getTestAccount } from '@MOCKS/Accounts';
let wrapper;
let vm;
import { addressBookMock } from '@MOCKS/AddressBookMock';
const currentSigner = getTestAccount('remoteTestnet');
const isBlackListFilterActivated = false;

beforeEach(() => {
    wrapper = getComponent(
        TransactionListFilters,
        { account: AccountStore, transaction: TransactionStore, addressBook: AddressBookStore },
        {
            currentAccount: null,
            currentAccountSigner: currentSigner,
            addressBook: addressBookMock,
            isBlackListFilterActivated: isBlackListFilterActivated,
            signers: [],
        },
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

    test("should call 'transaction/filterTransactions' with blacklisted contacts", () => {
        vm.onSelectBlackListed();
        expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
            filterOption: null,
            currentSignerAddress: currentSigner.address.plain(),
            multisigAddresses: [],
            shouldFilterOptionChange: false,
            blacklistedContacts: addressBookMock.getBlackListedContacts(),
        });
        expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', !isBlackListFilterActivated);
    });

    test("should call 'transaction/filterTransactions'", () => {
        wrapper = getComponent(
            TransactionListFilters,
            { account: AccountStore, transaction: TransactionStore, addressBook: AddressBookStore },
            {
                currentAccount: null,
                currentAccountSigner: currentSigner,
                addressBook: addressBookMock,
                isBlackListFilterActivated: true,
                signers: [],
            },
            {},
            {},
        );
        vm = wrapper.vm as TransactionListFilters;
        vm.onSelectBlackListed();
        expect(vm.$store.commit).toBeCalledWith('transaction/filterTransactions', {
            currentSignerAddress: currentSigner.address.plain(),
            filterOption: null,
        });
        expect(vm.$store.commit).toBeCalledWith('transaction/isBlackListFilterActivated', false);
    });
});
