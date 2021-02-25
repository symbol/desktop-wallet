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
        amountDisplay = shallowMount(AmountDisplay, componentOptions);
        amountDisplayTs = amountDisplay.vm as AmountDisplayTs;
    });

    [
        { input: 0, integerPart: '0', fractionalPart: '' },
        { input: 1, integerPart: '1', fractionalPart: '' },
        { input: 1.234, integerPart: '1', fractionalPart: '.234' },
        { input: 0.234, integerPart: '0', fractionalPart: '.234' },
        { input: -1, integerPart: '-1', fractionalPart: '' },
        { input: -1.234, integerPart: '-1', fractionalPart: '.234' },
        { input: -0.234, integerPart: '-0', fractionalPart: '.234' },
    ].forEach((testCase) =>
        test(`${testCase.input} should be displayed correctly`, async () => {
            amountDisplay.setProps({ value: testCase.input });
            await flushPromises();

            expect(amountDisplayTs.integerPart).toEqual(testCase.integerPart);
            expect(amountDisplayTs.fractionalPart).toEqual(testCase.fractionalPart);
        }),
    );
});
