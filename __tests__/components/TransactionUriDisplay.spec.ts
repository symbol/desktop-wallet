import { Transaction, TransferTransaction, Deadline, NamespaceId, PlainMessage, NetworkType } from 'symbol-sdk';
import { getComponent } from '@MOCKS/Components';
import TransactionUriDisplay from '@/components/TransactionUri/TransactionUriDisplay/TransactionUriDisplay.vue';
import TransactionUriDisplayTs from '@/components/TransactionUri/TransactionUriDisplay/TransactionUriDisplayTs';

describe('components/TransactionUri/TransactionUriDisplay', () => {
    test('returns transaction uri', () => {
        // Arrange:
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('1'),
            new NamespaceId('alias'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
        ) as Transaction;

        const wrapper = getComponent(
            TransactionUriDisplay,
            {},
            {},
            { transaction: transferTransaction },
            {
                Poptip: true,
                Icon: true,
            },
        );

        const component = wrapper.vm as TransactionUriDisplayTs;

        // Act + Assert:
        expect(component.transactionURI).toBe(
            'web+symbol://transaction?data=AD000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001985441000000000000000001000000000000009930E8142B432878EC0000000000000000000000000000000D0000000000000000746573742D6D657373616765',
        );
    });
});
