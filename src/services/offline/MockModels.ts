import {
    AccountInfo,
    AccountNames,
    ChainInfo,
    ChainProperties,
    Currency,
    FinalizedBlock,
    MosaicId,
    MultisigAccountGraphInfo,
    NamespaceId,
    NamespaceName,
    NetworkConfiguration,
    NetworkCurrencies,
    NetworkProperties,
    NetworkType,
    NodeInfo,
    PluginProperties,
    RentalFees,
    StorageInfo,
    TransactionFees,
    UInt64,
} from 'symbol-sdk';
import { NodeIdentityEqualityStrategy } from 'symbol-openapi-typescript-fetch-client';
import { Address } from 'symbol-sdk';
import { AccountType } from 'symbol-sdk';
import { SupplementalPublicKeys } from 'symbol-sdk';
import { networkConfig } from '@/config';
import { AccountLinkNetworkProperties } from 'symbol-sdk/dist/src/model/network/AccountLinkNetworkProperties';
import { AggregateNetworkProperties } from 'symbol-sdk/dist/src/model/network/AggregateNetworkProperties';
import { HashLockNetworkProperties } from 'symbol-sdk/dist/src/model/network/HashLockNetworkProperties';
import { SecretLockNetworkProperties } from 'symbol-sdk/dist/src/model/network/SecretLockNetworkProperties';
import { MetadataNetworkProperties } from 'symbol-sdk/dist/src/model/network/MetadataNetworkProperties';
import { MosaicNetworkProperties } from 'symbol-sdk/dist/src/model/network/MosaicNetworkProperties';
import { MultisigNetworkProperties } from 'symbol-sdk/dist/src/model/network/MultisigNetworkProperties';
import { NamespaceNetworkProperties } from 'symbol-sdk/dist/src/model/network/NamespaceNetworkProperties';
import { AccountRestrictionNetworkProperties } from 'symbol-sdk/dist/src/model/network/AccountRestrictionNetworkProperties';
import { MosaicRestrictionNetworkProperties } from 'symbol-sdk/dist/src/model/network/MosaicRestrictionNetworkProperties';
import { TransferNetworkProperties } from 'symbol-sdk/dist/src/model/network/TransferNetworkProperties';

export const OfflineUrl = 'http://mock:3000';

export const OfflineGenerationHash = {
    [NetworkType.TEST_NET]: networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.generationHash,
    [NetworkType.MAIN_NET]: networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.generationHash,
};

// use 100 as min fee multiplier for offline transaction.
export const OfflineTransactionFees = new TransactionFees(84587, 100, 1136363, 0, 100);

export const OfflineNodeInfo = (networkType: NetworkType) =>
    new NodeInfo('pubkey', OfflineGenerationHash[networkType], 3000, networkType, 0, [], 'host', 'name');

export const OfflineNetworkProperties = {
    [NetworkType.TEST_NET]: new NetworkConfiguration(
        new NetworkProperties(
            'public-test',
            NodeIdentityEqualityStrategy.Host,
            '071964D3C040D62DE905EAE978E2119BFC8E70489BFDF45A85B3D7ED5A517AA8',
            OfflineGenerationHash[NetworkType.TEST_NET],
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.epochAdjustment + 's',
        ),
        new ChainProperties(
            true,
            true,
            '0x' + networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.currencyMosaicId,
            '0x' + networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.harvestingMosaicId,
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.blockGenerationTargetTime + 's',
            '3000',
            '180',
            '5',
            '0',
            '60',
            "1'000",
            '6h',
            '500ms',
            "7'831'975'436'000'000",
            "9'000'000'000'000'000",
            `${networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.maxMosaicAtomicUnits}`,
            "10'000'000'000",
            "50'000'000'000'000",
            "3'000'000'000'000",
            '720',
            '3',
            '28',
            '26280',
            '25',
            '5',
            'TDGY4DD2U4YQQGERFMDQYHPYS6M7LHIF6XUCJ4Q',
            "6'000",
        ),
        new PluginProperties(
            new AccountLinkNetworkProperties('to trigger plugin load'),
            new AggregateNetworkProperties('100', '25', false, true, '48h'),
            new HashLockNetworkProperties("10'000'000", '2d'),
            new SecretLockNetworkProperties('365d', '0', '1024'),
            new MetadataNetworkProperties('1024'),
            new MosaicNetworkProperties("1'000", '3650d', '6', 'TA53AVLYMT5HCP5TJ23CGKGTUXQHNPBTJ4Z2LIQ', '500000'),
            new MultisigNetworkProperties('3', '25', '25'),
            new NamespaceNetworkProperties(
                '64',
                '100',
                '3',
                '30d',
                '1825d',
                '1d',
                'symbol, symbl, xym, xem, nem, user, account, org, com, biz, net, edu, mil, gov, info',
                'TDVFW6NZN3YI6O4ZRYZHGY73KADCW4HX6IDIKZI',
                '2',
                '100000',
            ),
            new AccountRestrictionNetworkProperties('100'),
            new MosaicRestrictionNetworkProperties('20'),
            new TransferNetworkProperties('1024'),
        ),
    ),
    [NetworkType.MAIN_NET]: new NetworkConfiguration(
        new NetworkProperties(
            'public',
            NodeIdentityEqualityStrategy.Host,
            '78F0F6FFDE5C130777506FE2A597ADC5E98BD46041ABF775908299FE94BFD5D0',
            OfflineGenerationHash[NetworkType.MAIN_NET],
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.epochAdjustment + 's',
        ),
        new ChainProperties(
            true,
            true,
            '0x' + networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.currencyMosaicId,
            '0x' + networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.harvestingMosaicId,
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.blockGenerationTargetTime + 's',
            '3000',
            '180',
            '5',
            '0',
            '60',
            "1'000",
            '6h',
            '500ms',
            "7'831'975'436'000'000",
            "9'000'000'000'000'000",
            `${networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.maxMosaicAtomicUnits}`,
            "10'000'000'000",
            "50'000'000'000'000",
            "3'000'000'000'000",
            "3'000'000'000'000",
            '3',
            '28',
            '26280',
            '25',
            '5',
            'NAMV77WU2EUFC6FBDFBQCDQARAGUTCRFDN7YLVA',
            "6'000",
        ),
        new PluginProperties(
            new AccountLinkNetworkProperties('to trigger plugin load'),
            new AggregateNetworkProperties('100', '25', false, true, '48h'),
            new HashLockNetworkProperties("10'000'000", '2d'),
            new SecretLockNetworkProperties('365d', '0', '1024'),
            new MetadataNetworkProperties('1024'),
            new MosaicNetworkProperties("1'000", '3650d', '6', 'NC733XE7DF46Q7QYLIIZBBSCJN2BEEP5FQ6PAYA', '500000'),
            new MultisigNetworkProperties('3', '25', '25'),
            new NamespaceNetworkProperties(
                '64',
                '100',
                '3',
                '30d',
                '1825d',
                '30d',
                'symbol, symbl, xym, xem, nem, user, account, org, com, biz, net, edu, mil, gov, info',
                'NBDTBUD6R32ZYJWDEWLJM4YMOX3OOILHGDUMTSA',
                '2',
                '100000',
            ),
            new AccountRestrictionNetworkProperties('100'),
            new MosaicRestrictionNetworkProperties('20'),
            new TransferNetworkProperties('1024'),
        ),
    ),
};

export const OfflineChainInfo = new ChainInfo(
    UInt64.fromUint(1),
    UInt64.fromUint(1),
    UInt64.fromUint(1),
    new FinalizedBlock(UInt64.fromUint(1), '6E477727F5AAF578F1AAE9752788B21DF75DB91194937D76E9E7ADD89B835BA0', 1, 1),
);

export const OfflineAccountInfo = (address: Address) =>
    new AccountInfo(
        0,
        'recordId',
        address,
        UInt64.fromUint(0),
        '0000000000000000000000000000000000000000000000000000000000000000',
        UInt64.fromUint(0),
        AccountType.Unlinked,
        new SupplementalPublicKeys(),
        [],
        [],
        UInt64.fromUint(0),
        UInt64.fromUint(0),
    );

export const OfflineStorageInfo = new StorageInfo(0, 0, 0);

export const OfflineRentalFees = new RentalFees(UInt64.fromUint(1000), UInt64.fromUint(100000), UInt64.fromUint(500000));

export const OfflineAccountNames = (address: Address) => new AccountNames(address, []);

export const OfflineNamespaceNames = (namespaceId: NamespaceId) => new NamespaceName(namespaceId, 'mocknamespace');

export const OfflineMultisigAccountGraphInfo = new MultisigAccountGraphInfo(new Map());

export const OfflineNetworkCurrencies = (networkType: NetworkType): NetworkCurrencies => {
    const publicCurrency = new Currency({
        namespaceId: new NamespaceId('symbol.xym'),
        divisibility: 6,
        transferable: true,
        supplyMutable: false,
        restrictable: false,
        mosaicId: new MosaicId(networkConfig[networkType].networkConfigurationDefaults.currencyMosaicId),
    });
    return new NetworkCurrencies(publicCurrency, publicCurrency);
};
