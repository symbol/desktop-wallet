/*
 * (C) Symbol Contributors 2022
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
import i18n from '@/language';

describe('language/i18n', () => {
    describe("Should translations match default locale's keys", () => {
        const languages = Object.keys(i18n.messages);
        const defaultLanguage = i18n.locale;
        const defaultLanguageLocaleKeys = Object.keys(i18n.messages[defaultLanguage]).sort();

        languages.forEach((lang) => {
            test(`Should keys of "${lang}" match "${defaultLanguage}"`, () => {
                const locale = i18n.messages[lang];
                const localeKeys = Object.keys(locale).sort();
                expect(localeKeys).toEqual(defaultLanguageLocaleKeys);
            });
        });
    });
});
