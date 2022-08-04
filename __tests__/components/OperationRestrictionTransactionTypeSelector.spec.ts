import { getComponent } from '@MOCKS/Components';
import OperationRestrictionTransactionTypeSelector from '@/components/OperationRestrictionTransactionTypeSelector/OperationRestrictionTransactionTypeSelector.vue';
import OperationRestrictionTransactionTypeSelectorTs from '@/components/OperationRestrictionTransactionTypeSelector/OperationRestrictionTransactionTypeSelectorTs';

describe('components/OperationRestrictionTransactionTypeSelector', () => {
    const getTransactionTypeSelectorWrapper = () => {
        return getComponent(OperationRestrictionTransactionTypeSelector, {}, {}, { value: null, disabled: false }, {});
    };

    test('returns sorted transaction type list', () => {
        // Arrange:
        const wrapper = getTransactionTypeSelectorWrapper();
        const component = wrapper.vm as OperationRestrictionTransactionTypeSelectorTs;

        // Act:
        const list = component.transactionTypeList;

        // Assert:
        expect(list).toEqual([
            ['ACCOUNT_ADDRESS_RESTRICTION', 16720],
            ['ACCOUNT_KEY_LINK', 16716],
            ['ACCOUNT_METADATA', 16708],
            ['ACCOUNT_MOSAIC_RESTRICTION', 16976],
            ['ADDRESS_ALIAS', 16974],
            ['AGGREGATE_BONDED', 16961],
            ['AGGREGATE_COMPLETE', 16705],
            ['HASH_LOCK', 16712],
            ['MOSAIC_ADDRESS_RESTRICTION', 16977],
            ['MOSAIC_ALIAS', 17230],
            ['MOSAIC_DEFINITION', 16717],
            ['MOSAIC_GLOBAL_RESTRICTION', 16721],
            ['MOSAIC_METADATA', 16964],
            ['MOSAIC_SUPPLY_CHANGE', 16973],
            ['MOSAIC_SUPPLY_REVOCATION', 17229],
            ['MULTISIG_ACCOUNT_MODIFICATION', 16725],
            ['NAMESPACE_METADATA', 17220],
            ['NAMESPACE_REGISTRATION', 16718],
            ['NODE_KEY_LINK', 16972],
            ['SECRET_LOCK', 16722],
            ['SECRET_PROOF', 16978],
            ['TRANSFER', 16724],
            ['VOTING_KEY_LINK', 16707],
            ['VRF_KEY_LINK', 16963],
        ]);
    });

    test('returns new value when user selected', async () => {
        // Arrange:
        const wrapper = getTransactionTypeSelectorWrapper();
        const component = wrapper.vm as OperationRestrictionTransactionTypeSelectorTs;

        // Act:
        component.chosenValue = 16974;
        wrapper.setProps({ value: 16974 });

        await component.$nextTick();

        // Assert:
        expect(component.chosenValue).toBe(16974);
        expect(wrapper.emitted().input[0]).toEqual([16974]);
    });
});
