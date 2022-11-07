import {
    Deadline,
    NamespaceId,
    NetworkType,
    PlainMessage,
    PublicAccount,
    TransactionInfo,
    TransactionVersion,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';
import { account1 } from './Accounts';

export const transferTransaction = new TransferTransaction(
    NetworkType.TEST_NET,
    TransactionVersion.TRANSFER,
    Deadline.create(1573430400),
    UInt64.fromUint(1_000_000),
    new NamespaceId('alias'),
    [],
    PlainMessage.create('test-message'),
    undefined,
    PublicAccount.createFromPublicKey(account1.publicKey, NetworkType.TEST_NET),
    new TransactionInfo(
        UInt64.fromUint(108907),
        0,
        '',
        UInt64.fromUint(1566230400),
        100,
        '9661088F22C2DC72E76EE2B0F07BFC0D8E98EEE0CC8AE274362EDBB44F164F16',
        '9661088F22C2DC72E76EE2B0F07BFC0D8E98EEE0CC8AE274362EDBB44F164F16',
    ),
);
