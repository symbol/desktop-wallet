/*
 * (C) Symbol Contributors 2021 (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import { Address, MultisigAccountGraphInfo, MultisigAccountInfo, NetworkType, PublicAccount } from 'symbol-sdk';

export const multisigGraphInfoPublicAccount1 = PublicAccount.createFromPublicKey(
    'B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D',
    NetworkType.TEST_NET,
);
export const multisigGraphInfoPublicAccount2 = PublicAccount.createFromPublicKey(
    'CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB',
    NetworkType.TEST_NET,
);
export const multisigGraphInfoPublicAccount3 = PublicAccount.createFromPublicKey(
    '68B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B0B763',
    NetworkType.TEST_NET,
);
export const multisigGraphInfoPublicAccount4 = PublicAccount.createFromPublicKey(
    'DAB1C38C3E1642494FCCB33138B95E81867B5FB59FC4277A1D53761C8B9F6D14',
    NetworkType.TEST_NET,
);
export const multisigGraphInfoPublicAccount5 = PublicAccount.createFromPublicKey(
    '1674016C27FE2C2EB5DFA73996FA54A183B38AED0AA64F756A3918BAF08E061B',
    NetworkType.TEST_NET,
);

export const multisigGraphInfoPublicAccounts = [
    multisigGraphInfoPublicAccount1,
    multisigGraphInfoPublicAccount2,
    multisigGraphInfoPublicAccount3,
    multisigGraphInfoPublicAccount4,
    multisigGraphInfoPublicAccount5,
];

const multisigAccountGraphInfoDTO = {
    level: -1,
    multisigEntries: [
        {
            multisig: {
                version: 1,
                accountAddress: multisigGraphInfoPublicAccount1.address,
                cosignatoryAddresses: [
                    multisigGraphInfoPublicAccount2.address,
                    multisigGraphInfoPublicAccount3.address,
                    multisigGraphInfoPublicAccount4.address,
                ],
                minApproval: 3,
                minRemoval: 3,
                multisigAddresses: [multisigGraphInfoPublicAccount5.address],
            },
        },
    ],
};

export const multisigEntries1 = multisigAccountGraphInfoDTO.multisigEntries.map(
    (multisigAccountInfoDTO) =>
        new MultisigAccountInfo(
            1,
            multisigAccountInfoDTO.multisig.accountAddress,
            multisigAccountInfoDTO.multisig.minApproval,
            multisigAccountInfoDTO.multisig.minRemoval,
            multisigAccountInfoDTO.multisig.cosignatoryAddresses,
            multisigAccountInfoDTO.multisig.multisigAddresses,
        ),
);

const multisigAccountGraphInfoDTO2 = {
    level: -2,
    multisigEntries: [
        {
            multisig: {
                version: 1,
                accountAddress: multisigGraphInfoPublicAccount5.address,
                cosignatoryAddresses: [multisigGraphInfoPublicAccount1.address],
                minApproval: 1,
                minRemoval: 1,
                multisigAddresses: [],
            },
        },
    ],
};

export const multisigEntries2 = multisigAccountGraphInfoDTO2.multisigEntries.map(
    (multisigAccountInfoDTO) =>
        new MultisigAccountInfo(
            1,
            multisigAccountInfoDTO.multisig.accountAddress,
            multisigAccountInfoDTO.multisig.minApproval,
            multisigAccountInfoDTO.multisig.minRemoval,
            multisigAccountInfoDTO.multisig.cosignatoryAddresses,
            multisigAccountInfoDTO.multisig.multisigAddresses,
        ),
);

export const multisigEntries3 = multisigAccountGraphInfoDTO.multisigEntries.map(
    (multisigAccountInfoDTO) =>
        new MultisigAccountInfo(
            1,
            multisigAccountInfoDTO.multisig.accountAddress,
            multisigAccountInfoDTO.multisig.minApproval,
            multisigAccountInfoDTO.multisig.minRemoval,
            [],
            multisigAccountInfoDTO.multisig.multisigAddresses,
        ),
);
const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
multisigAccounts.set(multisigAccountGraphInfoDTO.level, multisigEntries1);

multisigAccounts.set(multisigAccountGraphInfoDTO2.level, multisigEntries2);

export const multisigGraphInfo1 = new MultisigAccountGraphInfo(multisigAccounts);

export const account1 = Address.createFromPublicKey(
    '68B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B0B763',
    NetworkType.TEST_NET,
);

export const multisig1 = Address.createFromPublicKey(
    'B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D',
    NetworkType.TEST_NET,
);

export const multisig2 = Address.createFromPublicKey(
    'CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB',
    NetworkType.TEST_NET,
);
export function givenParentAccountGraphInfo(): MultisigAccountGraphInfo {
    const map = new Map<number, MultisigAccountInfo[]>();
    map.set(0, [new MultisigAccountInfo(1, account1, 0, 0, [], [multisig1])])
        .set(-1, [new MultisigAccountInfo(1, multisig1, 1, 1, [account1], [multisig2])])
        .set(-2, [new MultisigAccountInfo(1, multisig2, 1, 1, [multisig1], [])]);
    return new MultisigAccountGraphInfo(map);
}
