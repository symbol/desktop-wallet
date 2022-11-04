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
import 'view-design/dist/styles/iview.css';
import Vue from 'vue';
import 'vue-toastification/dist/index.css';

// internal dependencies
import { AppStore } from '@/app/AppStore';
import { UIBootstrapper } from '@/app/UIBootstrapper';
import i18n from '@/language/index';
import router from '@/router/AppRouter';
import App from '@/app/App.vue';

UIBootstrapper.initializePlugins(Vue);

const app = new Vue({
    // @ts-ignore
    router,
    store: AppStore,
    i18n,
    created: function () {
        // This will execute following processes:
        // - configure Electron
        // - configure Vue directives
        UIBootstrapper.configure(this);
    },
    render: (h) => h(App),
});
app.$mount('#app');
export default app;
