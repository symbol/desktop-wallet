// external dependencies
import { extend } from 'vee-validate';
import i18n from '@/language';
import { Account, Address, NetworkType, Password, NamespaceId } from 'symbol-sdk';
// internal dependencies
import { ProfileService } from '@/services/ProfileService';
import { NotificationType } from '@/core/utils/NotificationType';
import { AppStoreWrapper } from '@/app/AppStore';
// configuration
import { networkConfig, appConfig } from '@/config';
import {
    AddressValidator,
    AliasValidator,
    MaxRelativeAmountValidator,
    MaxDecimalsValidator,
    MaxMessageValidator,
    PublicKeyValidator,
    PositiveDecimalNumberValidator,
    UrlValidator,
} from './validators';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { AccountService } from '@/services/AccountService';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { Values } from 'vue-i18n';
import { StartsWithZeroValidator } from '@/core/validation/validators/StartsWithZeroValidator';

// TODO CustomValidationRules needs to be created when the network configuration is resolved, UI
// needs to use the resolved CustomValidationRules
// ATM rules are using the hardcoded file
const currentNetwork: NetworkConfigurationModel = networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults;
const { MIN_PASSWORD_LENGTH, DECIMAL_SEPARATOR } = appConfig.constants;

export class CustomValidationRules {
    /**
     * Registers custom validation rules
     * @static
     */
    public static register(): void {
        extend('address', {
            validate: (value) => {
                return AddressValidator.validate(value);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.ADDRESS_INVALID, values)}`,
        });

        extend('maxDecimals', {
            validate: (value, args: any) => {
                const { maxDecimalNumber } = args;
                return MaxDecimalsValidator.validate(value, maxDecimalNumber);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('max_decimal_number_error', values)}`,
            params: ['maxDecimalNumber'],
        });

        extend('maxRelativeAmount', {
            validate: (value, { maxMosaicAtomicUnits, maxMosaicDivisibility }: any) => {
                const maxRelativeAmount =
                    maxMosaicDivisibility === 0 ? maxMosaicAtomicUnits : maxMosaicAtomicUnits / Math.pow(10, maxMosaicDivisibility);
                return MaxRelativeAmountValidator.validate(value, maxRelativeAmount);
            },
            message: (_fieldName: string, values: Values) =>
                `${i18n.t('max_amount_error', {
                    ...values,
                    maxRelativeAmount: `${
                        values['maxMosaicAtomicUnits'] === 0
                            ? values['maxMosaicAtomicUnits']
                            : values['maxMosaicAtomicUnits'] / Math.pow(10, values['maxMosaicDivisibility'])
                    }`,
                })}`,
            params: ['maxMosaicAtomicUnits', 'maxMosaicDivisibility'],
        });

        extend('maxMessage', {
            validate: (value, args: any) => {
                const { maxMessageNumber } = args;
                return MaxMessageValidator.validate(value, maxMessageNumber);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('max_message_length_error', values)}`,
            params: ['maxMessageNumber'],
        });

        extend('positiveDecimal', {
            validate: (value) => PositiveDecimalNumberValidator.validate(value),
            message: () => i18n.t('positive_decimal_error', { decimalSeparator: DECIMAL_SEPARATOR }).toString(),
        });
        extend('startsWithZero', {
            validate: (value) => StartsWithZeroValidator.validate(value),
            message: () => i18n.t('amount_value_cannot_start_with_zero').toString(),
        });

        extend('addressOrAlias', {
            validate: async (value) => {
                const isValidAddress = AddressValidator.validate(value);
                const isValidAlias = AliasValidator.validate(value);
                if (isValidAddress) {
                    return true;
                }
                if (isValidAlias) {
                    await AppStoreWrapper.getStore().dispatch('namespace/GET_LINKED_ADDRESS', new NamespaceId(value));
                    return !!AppStoreWrapper.getStore().getters['namespace/linkedAddress'];
                }
                return false;
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('error_incorrect_field', values)}`,
        });

        extend('addressOrAliasNetworkType', {
            validate: (value, args: any) => {
                const { networkType } = args;
                if (!AddressValidator.validate(value)) {
                    return true;
                }
                return Address.createFromRawAddress(value).networkType == networkType;
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.NETWORK_TYPE_INVALID, values)}`,
            params: ['networkType'],
        });

        extend('url', {
            validate: (value) => {
                return UrlValidator.validate(value);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('error_incorrect_url', values)}`,
        });

        extend('confirmPassword', {
            validate(value, args: any) {
                const { target } = args;
                return value === target;
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.PASSWORDS_NOT_MATCHING, values)}`,
            params: ['target'],
        });

        extend('newAccountName', {
            validate(value) {
                const currentProfile = new ProfileService().getProfileByName(value);
                return !(currentProfile && currentProfile.accounts.length > 0);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.PROFILE_NAME_EXISTS_ERROR, values)}`,
        });

        extend('profilePassword', {
            validate(value) {
                if (!value || value.length < 8) {
                    return false;
                }

                const currentProfile: ProfileModel = AppStoreWrapper.getStore().getters['profile/currentProfile'];
                const currentHash = currentProfile.password;
                const inputHash = ProfileService.getPasswordHash(new Password(value));
                return inputHash === currentHash;
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.WRONG_PASSWORD_ERROR, values)}`,
        });

        extend('profileAccountName', {
            validate(value) {
                const accountService = new AccountService();

                // - fetch current profile accounts
                const currentProfile: ProfileModel = AppStoreWrapper.getStore().getters['profile/currentProfile'];
                const knownAccounts = Object.values(accountService.getKnownAccounts(currentProfile.accounts));
                return undefined === knownAccounts.find((w) => value === w.name);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.ERROR_ACCOUNT_NAME_ALREADY_EXISTS, values)}`,
        });

        extend('privateKey', {
            validate(value) {
                try {
                    Account.createFromPrivateKey(value, NetworkType.TEST_NET);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            message: (_fieldName: string, values: Values) => `${i18n.t(NotificationType.PRIVATE_KEY_INVALID_ERROR, values)}`,
        });

        extend('addressOrPublicKey', {
            validate: (value) => {
                const isValidAddress = AddressValidator.validate(value);
                const currentProfile: ProfileModel = AppStoreWrapper.getStore().getters['profile/currentProfile'];
                const isValidPublicKey = PublicKeyValidator.validate(value, currentProfile.networkType);
                if (isValidAddress || isValidPublicKey) {
                    return true;
                }
                return false;
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('error_incorrect_field', values)}`,
        });

        extend('maxNamespaceDuration', {
            validate: (value) => {
                return value <= currentNetwork.maxNamespaceDuration;
            },
            message: (_fieldName: string, values: Values) => {
                return `${i18n.t('error_incorrect_field', { ...values, maxValue: currentNetwork.maxNamespaceDuration })}`;
            },
        });

        extend('passwordRegex', {
            validate: (value) => {
                return new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z])(.{${MIN_PASSWORD_LENGTH},})$`).test(value);
            },
            message: `${i18n.t('error_new_password_format')}`,
        });

        extend('in', {
            validate: (value, array: string[]) => {
                if (!array) {
                    return false;
                }
                return array.includes(value);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('error_not_exist', values)}`,
        });

        extend('profileExists', {
            validate: (value, profileNames: string[]) => {
                if (!profileNames) {
                    return false;
                }
                return profileNames.includes(value);
            },
            message: (_fieldName: string, values: Values) => `${i18n.t('error_profile_does_not_exist', values)}`,
        });
    }
}
