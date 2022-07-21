import { AmountDisplayTs } from '@/components/AmountDisplay/AmountDisplayTs';
//@ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue';
import { appConfig } from '@/config';
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';

appConfig.constants.DECIMAL_SEPARATOR = '.';
const localVue = createLocalVue();
localVue.use(Vuex);
const networkStore = {
    namespaced: true,
    getters: {
        networkConfiguration: () => ({ maxMosaicDivisibility: 6 }),
    },
};
const componentOptions = {
    localVue,
    store: new Vuex.Store({
        modules: {
            network: networkStore,
        },
    }),
};

describe('AmountDisplay', () => {
    let amountDisplay: Wrapper<Vue>;
    let amountDisplayTs: AmountDisplayTs;

    beforeEach(() => {
        amountDisplay = shallowMount(AmountDisplay, { ...componentOptions });
        amountDisplayTs = amountDisplay.vm as AmountDisplayTs;
    });

    [
        { locale: 'us-EN', decimalSeparator: '.' },
        { locale: 'pl-PL', decimalSeparator: ',' },
    ].forEach((testLocale) => {
        const locale = testLocale.locale;
        const expectedFractionalPart = testLocale.decimalSeparator + '234';
        [
            { input: 0, integerPart: '0', fractionalPart: '' },
            { input: 1, integerPart: '1', fractionalPart: '' },
            { input: 1.234, integerPart: '1', fractionalPart: expectedFractionalPart },
            { input: 0.234, integerPart: '0', fractionalPart: expectedFractionalPart },
            { input: -1, integerPart: '-1', fractionalPart: '' },
            { input: -1.234, integerPart: '-1', fractionalPart: expectedFractionalPart },
            { input: -0.234, integerPart: '-0', fractionalPart: expectedFractionalPart },
        ].forEach((testCase, index) =>
            test(`${testCase.input} should be displayed correctly in locale: ${locale}`, async () => {
                const showTicker = index % 2 === 0;
                const ticker = showTicker ? 'my-ticker' : '';
                amountDisplay.setProps({ value: testCase.input, locale, showTicker, ticker });
                await flushPromises();

                expect(amountDisplayTs.integerPart).toEqual(testCase.integerPart);
                expect(amountDisplayTs.fractionalPart).toEqual(testCase.fractionalPart);
                expect(amountDisplayTs.displayedTicker).toBe(ticker);
            }),
        );
    });

    test('when decimal precision is 5', async () => {
        // Arrange + Act:
        const decimals = 5;
        const integerPart = '1';
        const fractionalPart = '.234';
        amountDisplay.setProps({ value: 1.234, locale: 'us-EN', decimals });
        await flushPromises();

        // Assert:
        expect(amountDisplayTs.integerPart).toEqual(integerPart);
        expect(amountDisplayTs.fractionalPart).toEqual(fractionalPart);
    });
});
