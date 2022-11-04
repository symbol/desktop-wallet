/*
 * (C) Symbol Contributors 2021
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
import Vue from 'vue';
import { Electron } from '@/core/utils/Electron';
import Router from 'vue-router';
import VueRx from 'vue-rx';
import moment from 'vue-moment';
import iView from 'view-design';
import locale from 'view-design/dist/locale/en-US';
import 'view-design/dist/styles/iview.css';
import infiniteScroll from 'vue-infinite-scroll';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// internal dependencies
import VueNumber from 'vue-number-animation';
import { VeeValidateSetup } from '@/core/validation/VeeValidateSetup';
import clickOutsideDirective from '@/directives/clickOutside';
import { PluginOptions } from 'vue-toastification/dist/types/src/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export class UIBootstrapper {
    public static initializePlugins(clazz: typeof Vue): typeof Vue {
        /// region UI plugins
        clazz.use(iView, { locale });
        clazz.use(moment as any);
        clazz.use(Router);

        clazz.use(VueRx);
        clazz.use(VueNumber);
        VeeValidateSetup.initialize();
        clazz.use(infiniteScroll);
        const toastDefaultOptions: PluginOptions = {
            closeButton: false,
            timeout: 3000,
            transition: 'Vue-Toastification__fade',
            transitionDuration: 300,
        };
        clazz.use(Toast, toastDefaultOptions);
        library.add(faFileCsv);
        clazz.component('font-awesome-icon', FontAwesomeIcon);
        /// end-region UI plugins

        /// directives
        clazz.directive('click-outside', clickOutsideDirective);
        return clazz;
    }

    /**
     * Bootstrap a Vue app instance
     * @param {Vue} app
     * @return {Vue}
     */
    public static configure(app: Vue): Vue {
        /// region electron fixes
        Electron.htmlRem();
        /// end-region electron fixes

        /// region vue directives
        Vue.directive('focus', {
            inserted: function (el) {
                Vue.nextTick(() => el.focus());
            },
        });
        Vue.directive('click-focus', {
            inserted: function (el) {
                el.addEventListener('click', function () {
                    el.querySelector('input').focus();
                });
            },
        });
        Vue.directive('auto-scroll', {
            componentUpdated: function (el, { value }) {
                if (value && value.length) {
                    const className = value.charAt(0) === '.' ? value : '.' + value;
                    if (el.querySelector(className)) {
                        const offsetTop = (el.querySelector(className) as HTMLElement).offsetTop;
                        el.scrollTo(0, offsetTop);
                    }
                }
            },
        });
        /// end-region vue directives

        return app;
    }
}
