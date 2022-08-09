//@ts-ignore
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue';
import { getComponent } from '@MOCKS/Components';

describe('TransactionListHeaderFilter', () => {
    test('render transaction list table header', () => {
        // Arrange:
        const wrapper = getComponent(TransactionListHeader, {}, {}, {}, {});

        // Act + Assert:
        expect(wrapper.findAll('.transaction-table-columns span').length).toBe(5);
        expect(wrapper.find('.icon-header').exists()).toBe(true);
        expect(wrapper.find('.address-header').exists()).toBe(true);
        expect(wrapper.find('.amount-header').exists()).toBe(true);
        expect(wrapper.find('.confirmation-header').exists()).toBe(true);
        expect(wrapper.find('.hash-header').exists()).toBe(true);
    });
});
