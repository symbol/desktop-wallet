import { NetworkType } from 'symbol-sdk';
import { OfflineNetworkProperties } from '@/services/offline/MockModels';
import { NetworkConfigurationHelpers } from '@/core/utils/NetworkConfigurationHelpers';
import { networkConfig } from '@/config';

describe('core/utils/NetworkConfigurationHelpers', () => {
    describe('epochAdjustment()', () => {
        test('should return default value when no network configuration passed', () => {
            // Arrange + Act:
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(undefined, 100);
            // Assert:
            expect(epochAdjustment).toBe(100);
        });

        test('should return epoch adjustment for mainnet', () => {
            // Arrange:
            const offlineNetworkConfiguration = OfflineNetworkProperties[NetworkType.MAIN_NET];
            // Act:
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(offlineNetworkConfiguration, 100);
            // Assert:
            expect(epochAdjustment).toBe(networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.epochAdjustment);
        });

        test('should return epoch adjustment for testnet', () => {
            // Arrange:
            const offlineNetworkConfiguration = OfflineNetworkProperties[NetworkType.TEST_NET];
            // Act:
            const epochAdjustment = NetworkConfigurationHelpers.epochAdjustment(offlineNetworkConfiguration, 100);
            // Assert:
            expect(epochAdjustment).toBe(networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.epochAdjustment);
        });
    });
});
