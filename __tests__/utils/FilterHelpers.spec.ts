/*
 * Copyright 2020 NEM (https://nem.io)
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
import { FilterHelpers } from '@/core/utils/FilterHelpers';

describe('stripFilter', () => {
    // should return a string without tags
    test.each([
        ['no tags', 'no tags'],
        ['no tags;\'"#!?%&/8{}', 'no tags;\'"#!?%&/8{}'],
        ['<script>/>good', '/>good'],
        ['<>>', '<>>'],
        ['<a>>', '>'],
        ['test <img src="" /> another', 'test  another'],
        ['<img src="" />', ''],
        ['<parent <child <sub />></child>></parent>', '>>'],
        ['<script>alert("abc");</script>', 'alert("abc");'],
        ['/><script>alert("abc");</script>', '/>alert("abc");'],
        ['This is a normal text <img src="nothing" onerror="alert("abc");" />', 'This is a normal text '],
    ])('FilterHelpers.stripFilter(%s)', (a, expected) => {
        expect(FilterHelpers.stripFilter(a)).toBe(expected);
    });
});
