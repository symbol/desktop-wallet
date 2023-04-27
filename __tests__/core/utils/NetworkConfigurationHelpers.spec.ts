import { NetworkType } from 'symbol-sdk';
import { OfflineNetworkProperties } from '@/services/offline/MockModels';
import { NetworkConfigurationHelpers } from '@/core/utils/NetworkConfigurationHelpers';
import { networkConfig } from '@/config';

describe('core/utils/NetworkConfigurationHelpers', () => {
    describe('epochAdjustment()', () => {
        test('should return default value when no network configuration passed', () => {
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(undefined, 100);
            expect(epochAdjustment).toBe(100);
        });

        test('should return epoch adjustment for mainnet', () => {
            const offlineNetworkConfiguration = OfflineNetworkProperties[NetworkType.MAIN_NET];
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(offlineNetworkConfiguration, 100);
            expect(epochAdjustment).toBe(networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.epochAdjustment);
        });

        test('should return epoch adjustment for testnet', () => {
            const offlineNetworkConfiguration = OfflineNetworkProperties[NetworkType.TEST_NET];
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(offlineNetworkConfiguration, 100);
            expect(epochAdjustment).toBe(networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.epochAdjustment);
        });
    });
});
