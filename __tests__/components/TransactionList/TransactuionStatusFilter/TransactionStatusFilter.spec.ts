//@ts-ignore
import TransactionStatusFilter from '@/components/TransactionList/TransactionListFilters/TransactionStatusFilter/TransactionStatusFilter.vue';
import { getComponent } from '@MOCKS/Components';
import AccountStore from '@/store/Account';
import TransactionStore from '@/store/Transaction';
import { Vue } from 'vue-property-decorator';
let wrapper;
/* eslint-disable @typescript-eslint/no-unused-vars */
let vm;
beforeEach(() => {
    wrapper = getComponent(
        TransactionStatusFilter,
        { account: AccountStore, transaction: TransactionStore },
        { currentAccount: null, signers: [] },
        {},
        {},
    );
    vm = wrapper.vm as TransactionStatusFilter;
});
afterEach(() => {
    wrapper.destroy();
});
describe('TransactionStatusFilter', () => {
    let wrapper: any;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let vm: any;
    beforeEach(() => {
        wrapper = getComponent(
            TransactionStatusFilter,
            { account: AccountStore, transaction: TransactionStore },
            { currentAccount: null, signers: [] },
            {},
            {},
        );
        vm = wrapper.vm as TransactionStatusFilter;
    });
    afterEach(() => {
        wrapper.destroy();
    });
    describe('TransactionStatusFilter', () => {
        test('renders correctly', async (): Promise<void> => {
            expect(wrapper).toMatchSnapshot();

            wrapper.find('.filter-button').trigger('click');

            await Vue.nextTick();

            expect(wrapper).toMatchSnapshot();
        });
    });
});
