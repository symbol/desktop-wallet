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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters({
            currentLanguage: 'app/language',
            languageList: 'app/languages',
        }),
    },
})
export class LanguageSelectorTs extends Vue {
    @Prop({
        default: '',
    })
    value: string;

    @Prop({
        default: false,
    })
    defaultFormStyle: boolean;

    @Prop({
        default: true,
    })
    autoSubmit: boolean;

    /**
     * Currently active language
     * @see {Store.AppInfo}
     * @var {string}
     */
    public currentLanguage: string;
    private language: string = '';
    /**
     * List of available languages
     * @see {Store.AppInfo}
     * @var {any[]}
     */
    public languageList: { value: string; label: string }[];

    @Watch('language')
    onLanguageChange() {
        if (this.autoSubmit) {
            this.$store.dispatch('app/SET_LANGUAGE', this.language);
        }
        this.$emit('input', this.language);
    }
    created() {
        this.language = this.currentLanguage;
    }
}
