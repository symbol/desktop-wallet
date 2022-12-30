import TransactionRow from '@/components/TransactionList/TransactionRow/TransactionRow.vue';
import { TransactionRowTs } from '@/components/TransactionList/TransactionRow/TransactionRowTs';
import { getComponent } from '@MOCKS/Components';
import { getTestProfile } from '@MOCKS/profiles';
import { mosaicsMock } from '@MOCKS/mosaics';
import { networkMock } from '@MOCKS/network';
import { getTestAccount, WalletsModel1, WalletsModel2 } from '@MOCKS/Accounts';
import { TransactionGroupEnum } from 'symbol-openapi-typescript-fetch-client';
import {
    TransferTransaction,
    Deadline,
    PlainMessage,
    EmptyMessage,
    EncryptedMessage,
    NetworkType,
    MosaicId,
    UInt64,
    PublicAccount,
    Mosaic,
    Convert,
    AggregateTransaction,
    TransactionInfo,
    HashLockTransaction,
    MultisigAccountInfo,
    Address,
    TransactionType,
    AggregateTransactionCosignature,
    MultisigAccountModificationTransaction,
    AccountAddressRestrictionTransaction,
    AccountMetadataTransaction,
    AddressRestrictionFlag,
    InnerTransaction,
    UnresolvedAddress,
    Message,
    TransactionStatus,
} from 'symbol-sdk';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';

describe('components/TransactionList/TransactionRow', () => {
    beforeEach(() => {
        process.env.KEYS_FINANCE = JSON.stringify({
            testnet: [
                'BEE707042AB8B15DFD9EB4FCD549B05524310FD62A6EF9B443CD26ED7CE2875B',
                '117A09B2F26E057DDC3E3F82AB5D49B024D9CDF422558499F511AA00D2BAFC2A',
            ],
            mainnet: ['BEE707042AB8B15DFD9EB4FCD549B05524310FD62A6EF9B443CD26ED7CE2875B'],
        });
    });

    afterEach(() => jest.restoreAllMocks());

    const testnetProfile = getTestProfile('profile_testnet');
    const currentSigner = getTestAccount('remoteTestnet');

    const mockSignature =
        'F4E954AEC49B99E2773A3B05273A31BE25683F852559CF11BDB61DE47195D82BC5DE9ED61C966F1668769CE782F8673E7F0C65099D967E3E806EE9AD27F3D70D';
    const mockDeadline = Deadline.createFromDTO('1');
    const mockMerkleComponentHash = '81E5E7AE49998802DABC816EC10158D3A7879702FF29084C2C992CD1289877A7';
    const mockTimestamp = UInt64.fromUint(1);
    const mockFeeMultiplier = 100;

    const dispatch = jest.fn();

    const createMockTransferTransaction = (mosaics: Mosaic[] = [], message: Message = EmptyMessage) => {
        return new TransferTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(10),
            Address.createFromPublicKey(WalletsModel2.publicKey, NetworkType.TEST_NET),
            mosaics,
            message,
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            new TransactionInfo(
                UInt64.fromUint(2),
                0,
                '1',
                mockTimestamp,
                mockFeeMultiplier,
                '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
            ),
        );
    };

    const createMockAggregateTransaction = (
        innerTransactions: InnerTransaction[] = [],
        cosignatures: AggregateTransactionCosignature[] = [],
        merkleComponentHash: string = mockMerkleComponentHash,
    ) => {
        return new AggregateTransaction(
            NetworkType.TEST_NET,
            TransactionType.AGGREGATE_BONDED,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            innerTransactions,
            cosignatures,
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            new TransactionInfo(
                UInt64.fromUint(2),
                0,
                '1',
                mockTimestamp,
                mockFeeMultiplier,
                '3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
                merkleComponentHash,
            ),
        );
    };

    const createMockAccountAddressRestrictionTransaction = (restrictionAdditions: UnresolvedAddress[] = []) => {
        return new AccountAddressRestrictionTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            AddressRestrictionFlag.AllowIncomingAddress,
            restrictionAdditions,
            [],
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
        );
    };

    const createMockMultisigAccountModificationTransaction = (addressAdditions: UnresolvedAddress[] = []) => {
        return new MultisigAccountModificationTransaction(
            NetworkType.TEST_NET,
            1,
            mockDeadline,
            UInt64.fromUint(100),
            2,
            1,
            addressAdditions,
            [],
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
        );
    };

    const getTransactionRowWrapper = (state = {}, props = {}) => {
        const mockNetworkStore = {
            namespaced: true,
            state: { networkConfiguration: undefined },
            getters: {
                networkConfiguration: () => Object.assign(new NetworkConfigurationModel(), { epochAdjustment: 1573430400 }),
            },
        };

        const mockMosaicStore = {
            namespaced: true,
            state: {
                balanceMosaics: [],
                networkMosaicId: null,
                holdMosaics: [],
            },
            getters: {
                balanceMosaics: (state) => {
                    return state.balanceMosaics;
                },
                networkMosaic: (state) => {
                    return new MosaicId(state.networkMosaicId);
                },
                holdMosaics: (state) => {
                    return state.holdMosaics;
                },
            },
        };

        const mockAccountStore = {
            namespaced: true,
            state: {
                currentAccount: null,
                multisigAccountGraph: null,
                currentAccountMultisigInfo: null,
            },
            getters: {
                currentAccount: (state) => {
                    return state.currentAccount;
                },
                multisigAccountGraph: (state) => {
                    return state.multisigAccountGraph;
                },
                currentAccountMultisigInfo: (state) => {
                    return state.currentAccountMultisigInfo;
                },
            },
        };

        const mockProfileStore = {
            namespaced: true,
            state: {
                currentProfile: null,
            },
            getters: {
                currentProfile: (state) => {
                    return state.currentProfile;
                },
            },
        };

        return getComponent(
            TransactionRow,
            {
                mosaic: mockMosaicStore,
                network: mockNetworkStore,
                profile: mockProfileStore,
                account: mockAccountStore,
            },
            state,
            props,
            {
                Tooltip: true,
            },
            dispatch,
        );
    };

    describe('transaction icon column', () => {
        test('returns unconfirmed transactions icon', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockTransferTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm.transaction, 'isConfirmed').mockReturnValue(false);

            // Act + Assert:
            expect(vm.getIcon()).toBe('dashboardUnconfirmed.png');
        });

        test('returns confirmed outgoing transactions icon', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockTransferTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            // Act + Assert:
            expect(vm.getIcon()).toBe('outgoing.png');
        });

        test('returns confirmed incoming transactions icon', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockTransferTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm.view, 'isIncoming', 'get').mockReturnValue(true);

            // Act + Assert:
            expect(vm.getIcon()).toBe('incoming.png');
        });

        test('returns optin transactions icon', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockAggregateTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm.transaction, 'isConfirmed').mockReturnValue(true);
            jest.spyOn(vm, 'isOptinPayoutTransaction', 'get').mockReturnValue(true);

            // Act + Assert:
            expect(vm.getIcon()).toBe('optin-transaction.png');
        });

        test('returns other transactions icon', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile },
                { transaction: createMockAccountAddressRestrictionTransaction() },
            );

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm.transaction, 'isConfirmed').mockReturnValue(true);
            jest.spyOn(vm, 'isOptinPayoutTransaction', 'get').mockReturnValue(false);

            // Act + Assert:
            expect(vm.getIcon()).toBe('account-restriction.png');
        });
    });

    describe('transaction amount column', () => {
        const runBasicMessageTests = (message, expectMessagePayload) => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile },
                {
                    transaction: createMockTransferTransaction([new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(0))], message),
                },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            const hasMessage = vm.hasMessage();

            // Assert:
            expect(hasMessage).toBe(true);
            expect(vm.messagePayload).toBe(expectMessagePayload);
            expect(wrapper.find('.extend-icon-holder.message').exists()).toBe(true);
        };

        const runBasicNonMosaicListTests = (transaction, expectedResult) => {
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, networkMosaicId: networkMock.currency.mosaicIdHex, balanceMosaics: mosaicsMock },
                { transaction },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            const mosaicList = vm.nonNativeMosaicList();

            // Act + Assert:
            expect(mosaicList).toEqual(expectedResult);
        };

        test('returns amount 0 when transaction type non transfer transactions', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile },
                { transaction: createMockAccountAddressRestrictionTransaction() },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            const amount = vm.getAmount();
            const amountColor = vm.getAmountColor();
            const mosaicId = vm.getAmountMosaicId();
            const hasMessage = vm.hasMessage();
            const hasNetworkMosaic = vm.hasNetworkMosaic();
            const hasNonNativeMosaic = vm.hasNonNativeMosaic();

            // Assert:
            expect(amount).toBe(0);
            expect(amountColor).toBe(undefined);
            expect(mosaicId).toBe(undefined);
            expect(hasMessage).toBe(false);
            expect(hasNetworkMosaic).toBe(false);
            expect(hasNonNativeMosaic).toBe(false);
            expect(vm.messagePayload).toBe('');
        });

        test('returns negative amount when outgoing transaction', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, networkMosaicId: networkMock.currency.mosaicIdHex },
                {
                    transaction: createMockTransferTransaction([
                        new Mosaic(new MosaicId(networkMock.currency.mosaicIdHex), UInt64.fromUint(100)),
                    ]),
                },
            );

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm, 'isIncomingTransaction').mockReturnValue(false);

            // Act:
            const amount = vm.getAmount();
            const amountColor = vm.getAmountColor();
            const hasNetworkMosaic = vm.hasNetworkMosaic();
            const getAmountMosaicId = vm.getAmountMosaicId();
            const isAmountShowTicker = vm.isAmountShowTicker();

            // Assert:
            expect(amount).toBe(-100);
            expect(amountColor).toBe('red');
            expect(hasNetworkMosaic).toBe(true);
            expect(getAmountMosaicId.toHex()).toBe('091F837E059AE13C');
            expect(isAmountShowTicker).toBe(false);
        });

        test('returns amount when incoming transactions', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, networkMosaicId: networkMock.currency.mosaicIdHex },
                {
                    transaction: createMockTransferTransaction([
                        new Mosaic(new MosaicId(networkMock.currency.mosaicIdHex), UInt64.fromUint(100)),
                    ]),
                },
            );

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm, 'isIncomingTransaction').mockReturnValue(true);

            // Act:
            const amount = vm.getAmount();
            const amountColor = vm.getAmountColor();
            const hasNetworkMosaic = vm.hasNetworkMosaic();
            const getAmountMosaicId = vm.getAmountMosaicId();
            const isAmountShowTicker = vm.isAmountShowTicker();

            // Assert:
            expect(amount).toBe(100);
            expect(amountColor).toBe('green');
            expect(hasNetworkMosaic).toBe(true);
            expect(getAmountMosaicId.toHex()).toBe('091F837E059AE13C');
            expect(isAmountShowTicker).toBe(false);
        });

        test('hide message icon when included transaction does not have message', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockTransferTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            const hasMessage = vm.hasMessage();

            // Assert:
            expect(hasMessage).toBe(false);
            expect(wrapper.find('.extend-icon-holder.message').exists()).toBe(false);
        });

        test('display message icon when message type is PlanMessage', () => {
            runBasicMessageTests(PlainMessage.create('test-message'), 'test-message');
        });

        test('display message icon when message type is EncryptedMessage', () => {
            // Arrange:
            const recipient = getTestAccount('remoteTestnetRecipient');

            runBasicMessageTests(EncryptedMessage.create('test', recipient.publicAccount, currentSigner.privateKey), 'Encrypted message');
        });

        test('returns message payload in truncate when message length over 40', () => {
            runBasicMessageTests(PlainMessage.create('0'.repeat(45)), '0000000000000000000000000000000000000000...');
        });

        test('display mosaic icon when mosaics list contains non network mosaic', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile },
                {
                    transaction: createMockTransferTransaction([new Mosaic(new MosaicId('461A9811A1DC1FBB'), UInt64.fromUint(0))]),
                },
            );

            const vm = wrapper.vm as TransactionRowTs;

            jest.spyOn(vm, 'isIncomingTransaction').mockReturnValue(true);

            // Act:
            const amount = vm.getAmount();
            const getAmountMosaicId = vm.getAmountMosaicId();

            // Assert:
            expect(amount).toBe(0);
            expect(getAmountMosaicId).toBe(undefined);
            expect(wrapper.find('.extend-icon-holder.mosaic-icon').exists()).toBe(true);
        });

        test('returns non network mosaic when transaction type is transfer transaction', () => {
            // Arrange:
            const mockMosaic = [
                { idHex: networkMock.currency.mosaicIdHex, amount: 100 },
                { idHex: '461A9811A1DC1FBB', amount: 100 },
                { idHex: '119C8A107ACADD5F', amount: 100 },
                { idHex: '2C56C7D764F17B09', amount: 100 },
                { idHex: '5B2DCC92C3B0FFD8', amount: 100 },
                { idHex: '4A1D5DA123186518', amount: 100 },
            ];

            const mosaics = mockMosaic.map((mosaic) => new Mosaic(new MosaicId(mosaic.idHex), UInt64.fromUint(mosaic.amount)));

            runBasicNonMosaicListTests(createMockTransferTransaction(mosaics), [
                { name: '461A9811A1DC1FBB', relativeAmount: '100' },
                { name: '119C8A107ACADD5F', relativeAmount: '0.1' },
                { name: '2C56C7D764F17B09', relativeAmount: '100' },
                { name: '5B2DCC92C3B0FFD8', relativeAmount: '100' },
                { name: '4A1D5DA123186518', relativeAmount: '100' },
            ]);
        });

        test('returns empty non network mosaic when mosaics only contain network mosaic', () => {
            // Arrange:
            const mockMosaic = [{ idHex: networkMock.currency.mosaicIdHex, amount: 100 }];

            const mosaics = mockMosaic.map((mosaic) => new Mosaic(new MosaicId(mosaic.idHex), UInt64.fromUint(mosaic.amount)));

            runBasicNonMosaicListTests(createMockTransferTransaction(mosaics), []);
        });

        test('returns empty non network mosaic when transaction type is non transfer transaction', () => {
            runBasicNonMosaicListTests(createMockAccountAddressRestrictionTransaction(), []);
        });
    });

    describe('needsCosignature', () => {
        const runBasicNeedsCosignatureTests = (transaction, expectedResult) => {
            // Arrange:
            const multisigAccounts = new Map<number, MultisigAccountInfo[]>();

            const wrapper = getTransactionRowWrapper(
                {
                    currentProfile: testnetProfile,
                    currentAccount: WalletsModel1,
                    multisigAccountGraph: (multisigAccounts as unknown) as MultisigAccountInfo[][],
                },
                { transaction },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // @ts-ignore - for private method
            vm.aggregateTransactionDetails = transaction;

            // Act:
            vm.needsCosignature();

            // Assert:
            // @ts-ignore - for private method
            expect(vm.transactionSigningFlag).toBe(expectedResult);
        };

        test('set transactionSigningFlag to false when current account is multisig', () => {
            // Arrange:
            const cosig1Address = 'TALPBVKED63OTOS6LNKFIE4H357MBOQPVGJBLOI';
            const cosig2Address = 'TD2KY5BKECF6YKSWSTGMUHFP66GG33S5MG6UOYQ';

            const multisigAccountInfo = new MultisigAccountInfo(
                1,
                currentSigner.address,
                2,
                1,
                [Address.createFromRawAddress(cosig1Address), Address.createFromRawAddress(cosig2Address)],
                [],
            );

            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, currentAccount: WalletsModel1, currentAccountMultisigInfo: multisigAccountInfo },
                { transaction: createMockAggregateTransaction() },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            vm.needsCosignature();

            // Assert:
            // @ts-ignore - for private method
            expect(vm.transactionSigningFlag).toBe(false);
        });

        test('set transactionSigningFlag to false when transaction type is not aggregate bonded', () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, currentAccount: WalletsModel1 },
                { transaction: createMockTransferTransaction() },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // Act:
            vm.needsCosignature();

            // Assert:
            // @ts-ignore - for private method
            expect(vm.transactionSigningFlag).toBe(false);
        });

        test('set transactionSigningFlag to false when transaction signed by current account', () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction(
                [createMockTransferTransaction()],
                [
                    new AggregateTransactionCosignature(
                        '939673209A13FF82397578D22CC96EB8516A6760C894D9B7535E3A1E068007B9255CFA9A914C97142A7AE18533E381C846B69D2AE0D60D1DC8A55AD120E2B606',
                        PublicAccount.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET),
                        UInt64.fromUint(0),
                    ),
                ],
            );

            runBasicNeedsCosignatureTests(aggregateTransaction, false);
        });

        test("set transactionSigningFlag to false when transaction's cosigner is not required for the current account.", () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction([
                createMockMultisigAccountModificationTransaction(),
                createMockAccountAddressRestrictionTransaction(),
            ]);

            runBasicNeedsCosignatureTests(aggregateTransaction, false);
        });

        test("set transactionSigningFlag to false when transaction's signer is not required for the current account", () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction();

            runBasicNeedsCosignatureTests(aggregateTransaction, false);
        });

        test('set transactionSigningFlag to true when current account required cosign', () => {
            // Arrange:
            const accountMetadata = new AccountMetadataTransaction(
                NetworkType.TEST_NET,
                1,
                mockDeadline,
                UInt64.fromUint(100),
                Address.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET),
                UInt64.fromUint(10),
                1,
                Convert.utf8ToUint8('test'),
                mockSignature,
                PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
            );

            const aggregateTransaction = createMockAggregateTransaction([
                createMockMultisigAccountModificationTransaction([
                    Address.createFromPublicKey(WalletsModel1.publicKey, NetworkType.TEST_NET),
                ]),
                createMockAccountAddressRestrictionTransaction([Address.createFromRawAddress(WalletsModel2.address)]),
                accountMetadata,
                createMockTransferTransaction(),
            ]);

            runBasicNeedsCosignatureTests(aggregateTransaction, true);
        });
    });

    describe('transaction date', () => {
        const runTransactionDateTests = ({ transactionType, mockTransaction, expectedDate }) => {
            test(`returns date for ${transactionType} transaction`, () => {
                // Arrange:
                const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: mockTransaction });

                const vm = wrapper.vm as TransactionRowTs;

                // Act + Assert:
                expect(vm.date).toBe(expectedDate);
            });
        };

        // Arrange:
        const aggregateTransaction = AggregateTransaction.createBonded(
            mockDeadline,
            [],
            NetworkType.TEST_NET,
            [],
            UInt64.fromUint(100),
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
        );

        const signedTransaction = currentSigner.sign(
            aggregateTransaction,
            '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
        );

        const hashLockTransaction = HashLockTransaction.create(
            mockDeadline,
            new Mosaic(new MosaicId(networkMock.currency.mosaicIdHex), UInt64.fromUint(10)),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.TEST_NET,
            UInt64.fromUint(100),
            mockSignature,
            PublicAccount.createFromPublicKey(currentSigner.publicKey, NetworkType.TEST_NET),
        );

        const preparedData = [
            {
                transactionType: 'other transaction deadline in 6 hours',
                mockTransaction: createMockTransferTransaction(),
                expectedDate: '2019-11-10 22:00:00',
            },
            {
                transactionType: 'Aggregate Bond transaction deadline in 48 hours',
                mockTransaction: createMockAggregateTransaction(),
                expectedDate: '2019-11-09 00:00:00',
            },
            {
                transactionType: 'Hash Lock transaction deadline in 6 hours',
                mockTransaction: hashLockTransaction,
                expectedDate: '2019-11-10 18:00:00',
            },
        ];

        preparedData.map((test) => runTransactionDateTests(test));
    });

    describe('isOptinPayoutTransaction', () => {
        test('returns false when transaction does not exist', async () => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, currentAccount: WalletsModel1 },
                { transaction: createMockTransferTransaction() },
            );

            const vm = wrapper.vm as TransactionRowTs;

            vm.transaction = undefined;

            // Act + Assert:
            expect(vm.isOptinPayoutTransaction).toBe(false);
        });

        const runIsOptinPayoutTransactionTests = (state) => {
            // Arrange:
            const wrapper = getTransactionRowWrapper(state, { transaction: createMockAggregateTransaction() });

            const vm = wrapper.vm as TransactionRowTs;

            // Act + Assert:
            expect(vm.isOptinPayoutTransaction).toBe(true);
        };

        test('returns true when transaction is optin payout (testnet)', async () => {
            runIsOptinPayoutTransactionTests({ currentProfile: testnetProfile, currentAccount: WalletsModel1 });
        });

        test('returns true when transaction is optin payout (mainnet)', async () => {
            runIsOptinPayoutTransactionTests({ currentProfile: getTestProfile('profile_mainnet'), currentAccount: WalletsModel2 });
        });
    });

    test('returns explorer url link', () => {
        // Arrange:
        const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile }, { transaction: createMockTransferTransaction() });
        const vm = wrapper.vm as TransactionRowTs;

        // Act + Assert:
        expect(vm.explorerUrl).toBe(
            'https://testnet.symbol.fyi/transactions/3A4B36EDFD3126D3911916497A9243336AE56B60B5CEB9410B4191D7338201CD',
        );
    });

    describe('hasMissingSignatures', () => {
        const runBasicMissingSignaturesTests = (transaction, expectedResult) => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile, currentAccount: WalletsModel1 }, { transaction });

            const vm = wrapper.vm as TransactionRowTs;

            // Act + Assert:
            // @ts-ignore - for private method
            expect(vm.hasMissingSignatures).toBe(expectedResult);
        };

        test('returns false when transaction type is not aggregate bonded', () => {
            runBasicMissingSignaturesTests(createMockTransferTransaction(), false);
        });

        test('returns false when aggregate bonded transaction signed', () => {
            runBasicMissingSignaturesTests(createMockAggregateTransaction(), false);
        });

        test('returns true when aggregate bonded transaction missing signature', () => {
            runBasicMissingSignaturesTests(createMockAggregateTransaction([], [], '0'.repeat(64)), true);
        });
    });

    describe('fetchTransaction', () => {
        const runBasicFetchTransactionTests = async (transaction) => {
            // Arrange:
            const wrapper = getTransactionRowWrapper({ currentProfile: testnetProfile, currentAccount: WalletsModel1 }, { transaction });

            const vm = wrapper.vm as TransactionRowTs;

            // @ts-ignore - for private method
            jest.spyOn(vm, 'hasMissingSignatures', 'get').mockReturnValue(true);
            jest.spyOn(vm, 'needsCosignature');

            // Act:
            // @ts-ignore - for private method
            await vm.fetchTransaction();

            // Assert:
            // @ts-ignore - for private method
            expect(vm.needsCosignature).not.toBeCalled();
        };

        test('calls needsCosignature when transaction status confirmed', async () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction();

            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.resolve(new TransactionStatus(TransactionGroupEnum.Confirmed, '1', mockDeadline));
                } else if (type === 'transaction/LOAD_TRANSACTION_DETAILS') {
                    return Promise.resolve(aggregateTransaction);
                }
            });

            const wrapper = getTransactionRowWrapper(
                { currentProfile: testnetProfile, currentAccount: WalletsModel1 },
                { transaction: aggregateTransaction },
            );

            const vm = wrapper.vm as TransactionRowTs;

            // @ts-ignore - for private method
            jest.spyOn(vm, 'hasMissingSignatures', 'get').mockReturnValue(true);
            jest.spyOn(vm, 'needsCosignature');

            // Act:
            // @ts-ignore - for private method
            await vm.fetchTransaction();

            // Assert:
            // @ts-ignore - for private method
            expect(vm.needsCosignature).toHaveBeenCalled();
            expect(vm.$store.dispatch).toHaveBeenCalledWith('transaction/FETCH_TRANSACTION_STATUS', {
                transactionHash: aggregateTransaction.transactionInfo.hash,
            });
            expect(vm.$store.dispatch).toHaveBeenCalledWith('transaction/LOAD_TRANSACTION_DETAILS', {
                group: TransactionGroupEnum.Confirmed,
                transactionHash: aggregateTransaction.transactionInfo.hash,
            });
        });

        test('skips needsCosignature when transaction status failed', async () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction();

            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.resolve(new TransactionStatus(TransactionGroupEnum.Failed, '1', mockDeadline));
                } else if (type === 'transaction/LOAD_TRANSACTION_DETAILS') {
                    return Promise.resolve(aggregateTransaction);
                }
            });

            await runBasicFetchTransactionTests(aggregateTransaction);
        });

        test('throw error when fetch transaction failed', async () => {
            // Arrange:
            const aggregateTransaction = createMockAggregateTransaction();

            dispatch.mockImplementation((type: string) => {
                if (type === 'transaction/FETCH_TRANSACTION_STATUS') {
                    return Promise.reject(new Error('error'));
                }
            });

            await runBasicFetchTransactionTests(aggregateTransaction);
        });
    });
});
