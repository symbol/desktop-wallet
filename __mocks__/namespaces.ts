export const createMockNamespace = (name, aliasType, aliasTarget, startHeight, endHeight) => {
    const aliasValue = {
        aliasTargetAddressRawPlain: undefined,
        aliasTargetMosaicIdHex: undefined,
    };

    if (aliasType === 1) {
        aliasValue.aliasTargetMosaicIdHex = aliasTarget;
    } else if (aliasType === 2) {
        aliasValue.aliasTargetAddressRawPlain = aliasTarget;
    }

    return {
        namespaceIdHex: '80DE90A24D6C0CC4',
        name,
        isRoot: name.split('.').length <= 1,
        ownerAddressRawPlain: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
        aliasType,
        ...aliasValue,
        parentNamespaceIdHex: '',
        startHeight,
        endHeight,
        depth: 0,
        metadataList: [],
    };
};

export const mockNamespaceRowValue = {
    aliasIdentifier: 'N/A',
    aliasType: 'N/A',
    expiration: '29 d 23 h 58 m ',
    expired: false,
    hexId: '80DE90A24D6C0CC4',
    metadataList: [
        {
            metadataId: '62FC8624E173875059E72DE1',
            metadataType: 1,
            scopedMetadataKey: 'A14173CB00ED0041',
            sourceAddress: 'TCABUWAK5WMJ26ZPERMGWBOWAJF4XPNCJOWPAAI',
            targetAddress: 'TBF43DIZI62PR2W6JQBJR3AI6OZLRXJYMGHLTFI',
            targetId: '7E77578D00C26DFC',
            value: 'metavalue',
        },
    ],
    name: 'helloworld',
};
