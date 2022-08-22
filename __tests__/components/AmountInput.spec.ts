import AmountInput from '@/components/AmountInput/AmountInput.vue';
import { ValidationProvider, extend, validate } from 'vee-validate';

import { mosaicsMock } from '@MOCKS/mosaics';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VueI18n, { Values } from 'vue-i18n';
import i18n from '@/language/index';
import { StandardValidationRules } from '@/core/validation/StandardValidationRules';
import { MaxDecimalsValidator, PositiveDecimalNumberValidator, MaxRelativeAmountValidator } from '@/core/validation/validators';
import { appConfig } from '@/config';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { StartsWithZeroValidator } from '@/core/validation/validators/StartsWithZeroValidator';
import { AmountInputTs } from '@/components/AmountInput/AmountInputTs';

StandardValidationRules.register();
appConfig.constants.DECIMAL_SEPARATOR = '.';
extend('maxDecimals', {
    validate: (value, args: any) => {
        const { maxDecimalNumber } = args;
        return MaxDecimalsValidator.validate(value, maxDecimalNumber);
    },
    message: (_fieldName: string, values: Values) => `${i18n.t('max_decimal_number_error', values)}`,
    params: ['maxDecimalNumber'],
});
extend('positiveDecimal', {
    validate: (value) => PositiveDecimalNumberValidator.validate(value),
    message: () => i18n.t('positive_decimal_error', { decimalSeparator: appConfig.constants.DECIMAL_SEPARATOR }).toString(),
});
extend('startsWithZero', {
    validate: (value) => StartsWithZeroValidator.validate(value),
    message: () => i18n.t('amount_value_cannot_start_with_zero').toString(),
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
const localVue = createLocalVue();
localVue.component('ValidationProvider', ValidationProvider);
localVue.use(Vuex);
localVue.use(VueI18n);
const mosaicModule = {
    namespaced: true,
    getters: {
        mosaics: () => {
            return mosaicsMock;
        },
        balanceMosaics: () => {
            return mosaicsMock;
        },
    },
};

const networkModule = {
    namespaced: true,
    getters: {
        networkConfiguration: () => new NetworkConfigurationModel(),
    },
};

const store = new Vuex.Store({
    modules: {
        mosaic: mosaicModule,
        network: networkModule,
    },
});
const options = {
    localVue,
    i18n,
    store,
    propsData: {
        mosaicHex: '519FC24B9223E0B4',
    },
    stubs: ['Tooltip'],
    sync: false,
};
const options2 = {
    localVue,
    i18n,
    store,
    propsData: {
        mosaicHex: '534CD11F6D984B4B',
    },
    stubs: ['Tooltip'],
    sync: false,
};
let wrapper;
let wrapper2;

describe('AmountInput', () => {
    beforeEach(() => {
        wrapper = mount(AmountInput, options);
        wrapper2 = mount(AmountInput, options2);
    });

    afterEach(() => {
        wrapper.destroy();
        wrapper2 = mount(AmountInput, options2);
    });

    test('input correctly', async () => {
        const amount = '10.12345678';
        wrapper.setProps({
            value: amount,
        });
        await flushPromises();
        expect(wrapper.vm.relativeValue).toBe(amount);
    });

    test('output correctly', async () => {
        wrapper.find('.input-style').setValue('10.1234567');
        await flushPromises();
        expect(wrapper.emitted().input[0]).toEqual(['10.1234567']);
    });

    test("divisibility of the mosaic '519FC24B9223E0B4' is 6", async () => {
        const rule = wrapper.vm.validationRules.amount;
        const falseResult = await validate('10.1234567', rule);
        expect(falseResult.valid).toBeFalsy();
        const rightResult = await validate('10.123456', rule);
        expect(rightResult.valid).toBeTruthy();

        const falseResultMaxRelativeAmount = await validate('89999999990', rule);
        expect(falseResultMaxRelativeAmount.valid).toBeFalsy();
        const rightResultMaxRelativeAmount = await validate('8999999999', rule);
        expect(rightResultMaxRelativeAmount.valid).toBeTruthy();
    });

    test("divisibility of the mosaic '534CD11F6D984B4B' is 5", async () => {
        wrapper2.setProps({
            mosaicHex: '534CD11F6D984B4B',
        });
        await flushPromises();
        const rule = wrapper2.vm.validationRules.amount;
        const falseResult = await validate('10.123456', rule);
        expect(falseResult.valid).toBeFalsy();
        const rightResult = await validate('10.12345', rule);
        expect(rightResult.valid).toBeTruthy();

        const falseResultMaxRelativeAmount = await validate('899999999900', rule);
        expect(falseResultMaxRelativeAmount.valid).toBeFalsy();
        const rightResultMaxRelativeAmount = await validate('89999999990', rule);
        expect(rightResultMaxRelativeAmount.valid).toBeTruthy();
    });

    test('use maximum balance when the selected account is regular', async () => {
        // Arrange:
        const selectedMosaic = mosaicsMock[0];
        const maxBalance = (selectedMosaic.balance / Math.pow(10, selectedMosaic.divisibility)).toString();

        // Act:
        wrapper.find('button').trigger('click');
        await flushPromises();

        // Assert:
        expect(wrapper.emitted().input[0]).toEqual([maxBalance]);
    });

    test('use maximum balance when selected account is cosigner', async () => {
        // Arrange:
        const maxBalanceAfterFee = 14;
        const mockAccountStore = {
            namespaced: true,
            state: {
                isCosignatoryMode: false,
            },
            getters: {
                isCosignatoryMode: (state) => state.isCosignatoryMode,
            },
        };
        const networkConfiguration = { currencyMosaicId: '519FC24B9223E0B4' };
        const mockNetworkStore = {
            namespaced: true,
            state: { networkConfiguration },
            getters: {
                networkConfiguration: (state) => {
                    return state.networkConfiguration;
                },
            },
        };
        const store = new Vuex.Store({
            modules: {
                mosaic: mosaicModule,
                network: mockNetworkStore,
                account: mockAccountStore,
            },
        });

        // Act:
        wrapper = mount(AmountInput, { ...options, store });
        wrapper.setProps({
            selectedFeeValue: 1_000_000,
        });
        wrapper.find('button').trigger('click');
        const component = wrapper.vm as AmountInputTs;
        await flushPromises();

        // Assert:
        expect(component.totalAvailableAmount).toBe(maxBalanceAfterFee);
    });

    test('divisibility is set to default when chosen mosaic is not found', async () => {
        // Arrange:
        const mockMosaicStore = {
            namespaced: true,
            getters: {
                mosaics: () => [],
                balanceMosaics: () => mosaicsMock,
            },
        };
        const store = new Vuex.Store({
            modules: {
                mosaic: mockMosaicStore,
                network: networkModule,
            },
        });

        // Act:
        wrapper = mount(AmountInput, { ...options, store });
        const component = wrapper.vm as AmountInputTs;

        // Assert:
        expect(component.validationRules.amount).toContain('maxDecimals:6');
    });
});
