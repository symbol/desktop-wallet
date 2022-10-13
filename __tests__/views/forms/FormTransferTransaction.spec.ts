import { AccountModel } from '@/core/database/entities/AccountModel';
import i18n from '@/language';
import FormTransferTransaction from '@/views/forms/FormTransferTransaction/FormTransferTransaction.vue';
import {
    account1,
    account2,
    cosigner1AccountModel,
    cosigner2AccountModel,
    multisigAccountModel,
    WalletsModel1,
    WalletsModel2,
} from '@MOCKS/Accounts';
import { getHandlers, responses } from '@MOCKS/Http';
import TestUIHelpers from '@MOCKS/testUtils/TestUIHelpers';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, waitFor } from '@testing-library/vue';
import flushPromises from 'flush-promises';
import WS from 'jest-websocket-mock';
import { setupServer } from 'msw/node';

// mock local storage
jest.mock('@/core/database/backends/LocalStorageBackend', () => ({
    LocalStorageBackend: jest.requireActual('@/core/database/backends/ObjectStorageBackend').ObjectStorageBackend,
}));

// mock http server with base responses denoted by * which are basic responses for the accounts __mock__/Accounts.ts
const httpServer = setupServer(...getHandlers(responses['*']));
// mock websocket server
const websocketServer = new WS('wss://001-joey-dual.symboltest.net:3001/ws', { jsonProtocol: true });
websocketServer.on('connection', (socket) => {
    console.log('Websocket client connected!');
    socket.send('{"uid":"FAKE_UID"}');
});

beforeAll(() => httpServer.listen());
afterEach(async () => {
    await flushPromises();
    httpServer.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => {
    httpServer.close();
    websocketServer.close();
});

const testProfileName = 'profile1';
const testProfilePassword = 'Password1';
const sufficientAccountBalance = '10000000001';

describe('views/forms/FormTransferTransaction', () => {
    const renderPage = (currentAccount: AccountModel, knownAccounts: string[]) => {
        return TestUIHelpers.renderComponentWithStore(FormTransferTransaction, currentAccount, knownAccounts, testProfileName);
    };

    const renderPageWithAccount = (currentAccount: AccountModel, knownAccounts: AccountModel[]) => {
        return TestUIHelpers.renderComponentWithAccount(
            FormTransferTransaction,
            currentAccount,
            knownAccounts,
            testProfileName,
            sufficientAccountBalance,
        );
    };

    test('renders component', async () => {
        // Arrange + Act:
        const currentAccountModel = WalletsModel1;
        await renderPage(currentAccountModel, [account1.address.plain(), account2.address.plain()]);

        // Assert:
        expect(await screen.findByText(i18n.t('sender').toString() + ':')).toBeDefined();
        expect(await screen.findByText(currentAccountModel.address)).toBeDefined();
        const sendButton = (await screen.findByTestId('submitButton')) as HTMLButtonElement;
        await waitFor(async () => expect(sendButton.disabled).toBe(false), {
            timeout: 10_000,
        });
    });

    const testSignTxWithAccount = async (
        currentAccountModel: AccountModel,
        knownAccountModels: AccountModel[],
        recipientAddress: string,
        encryptMessage = false,
        currentSignerAccountModel?: AccountModel,
    ) => {
        // Arrange:
        const store = await renderPageWithAccount(currentAccountModel, knownAccountModels);

        if (currentSignerAccountModel && currentAccountModel.address !== currentSignerAccountModel.address) {
            await TestUIHelpers.selectMultisigAccount(
                currentSignerAccountModel.address,
                currentAccountModel.address,
                store,
                sufficientAccountBalance,
            );
        }

        const recipientInput = await screen.findByPlaceholderText(i18n.t('placeholder_address_or_alias').toString());
        await userEvent.type(recipientInput, recipientAddress);

        const amountInput = (await screen.findByTestId('relativeAmount')) as HTMLInputElement;
        fireEvent.update(amountInput, '1');

        const messageInput = await screen.findByPlaceholderText(i18n.t('please_enter_notes').toString());
        userEvent.type(messageInput, 'Here is a message');

        if (encryptMessage) {
            const encryptMessageCheckbox = await screen.findByTestId('encryptMessage');
            userEvent.click(encryptMessageCheckbox);
            TestUIHelpers.unlockProfile(testProfilePassword);
        }

        const sendButton = (await screen.findByTestId('submitButton')) as HTMLButtonElement;
        await waitFor(async () => expect(sendButton.disabled).toBe(false), {
            timeout: 10_000,
        });

        // Act:
        userEvent.click(sendButton);

        // Assert:
        await TestUIHelpers.confirmTransactions(testProfilePassword);
        await TestUIHelpers.expectToastMessage('success_transactions_signed', 'success');
    };

    test('regular account - sign transaction successfully', async () => {
        // Arrange + Act:
        const knownAccountModels = [WalletsModel1, WalletsModel2];
        const currentAccountModel = WalletsModel1;
        const recipientAddress = currentAccountModel.address;

        await testSignTxWithAccount(currentAccountModel, knownAccountModels, recipientAddress);
    });

    test('regular account - encrypt message and sign transaction successfully', async () => {
        // Arrange + Act:
        const knownAccountModels = [WalletsModel1, WalletsModel2];
        const currentAccountModel = WalletsModel1;
        const recipientAddress = currentAccountModel.address;

        await testSignTxWithAccount(currentAccountModel, knownAccountModels, recipientAddress, true);
    });

    test('multisig account - sign transaction successfully', async () => {
        // Arrange + Act:
        const knownAccountModels = [cosigner1AccountModel, cosigner2AccountModel, multisigAccountModel];
        const currentAccountModel = cosigner1AccountModel;
        const recipientAddress = currentAccountModel.address;

        await testSignTxWithAccount(currentAccountModel, knownAccountModels, recipientAddress, false, multisigAccountModel);
    });
});
