import { Transaction, TransferTransaction, Deadline, NamespaceId, PlainMessage, NetworkType, TransactionMapping } from 'symbol-sdk';
import { getComponent } from '@MOCKS/Components';
import TransactionUriDisplay from '@/components/TransactionUri/TransactionUriDisplay/TransactionUriDisplay.vue';
import TransactionUriDisplayTs from '@/components/TransactionUri/TransactionUriDisplay/TransactionUriDisplayTs';
import { TransactionURI } from 'symbol-uri-scheme';

describe('components/TransactionUri/TransactionUriDisplay', () => {
    test('returns transaction uri', () => {
        // Arrange:
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1573430400),
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

        transferTransaction.serialize();

        jest.spyOn(TransactionURI.prototype, 'build').mockImplementation();

        // Act:
        component.transactionURI;

        // Assert:
        expect(TransactionURI.prototype.build).toHaveBeenCalled();
    });
});
