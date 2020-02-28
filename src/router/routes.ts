/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import i18n from '@/language'
import { AppRoute } from './AppRoute'

export const routes: AppRoute[] = [
  {
    path: '/',
    name: 'home',
    meta: { protected: false },
    redirect: {name: 'accounts.login'},
    // @ts-ignore
    component: () => import('@/views/layout/PageLayout/PageLayout.vue'),
    /// region PageLayout children
    children: [
      {
        path: 'accounts',
        name: 'accounts',
        // @ts-ignore
        component: () => import('@/views/layout/RouterPage.vue'),
        meta: {
          protected: false,
          hideFromMenu: true,
        },
        children: [
          {
            path: 'create',
            name: 'accounts.importAccount.importStrategy',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/ImportPage/ImportStrategy/ImportStrategy.vue'),
          },
          {
            path: 'creationPage',
            name: 'accounts.creation.home',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/CreationPage/CreationPage.vue'),
            children: [
              {
                path: 'generateMnemonic',
                name: 'accounts.creation.generateMnemonic',
                meta: { 
                  protected: false,
                  extension: '1',
                  nextPage: 'accounts.creation.backupMnemonic',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/CreationPage/GenerateMnemonic/GenerateMnemonic.vue'),
              },
              {
                path: 'backupMnemonic',
                name: 'accounts.creation.backupMnemonic',
                meta: {
                  protected: false,
                  title: 'bar_step_one_two',
                  extension: '2',
                  nextPage: 'accounts.creation.verifyMnemonic',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/CreationPage/BackupMnemonic/BackupMnemonic.vue'),
              },
              {
                path: 'verifyMnemonic',
                name: 'accounts.creation.verifyMnemonic',
                meta: {
                  protected: false,
                  title: 'bar_step_one_three',
                  extension: '3',
                  nextPage: 'accounts.creation.accountInfo',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/CreationPage/VerifyMnemonic/VerifyMnemonic.vue'),
              },
              {
                path: 'accountInfo',
                name: 'accounts.creation.accountInfo',
                meta: {
                  protected: false,
                  title: 'bar_step_two',
                  extension: '4',
                  nextPage: 'accounts.creation.generateWallet',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/CreationPage/AccountInfo/AccountInfo.vue'),
              },
              {
                path: 'generateWallet',
                name: 'accounts.creation.generateWallet',
                meta: {
                  protected: false,
                  title: 'bar_step_three',
                  extension: '5',
                  nextPage: 'dashboard',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/CreationPage/GenerateWallet/GenerateWallet.vue'),
              },
            ],
          },
          {
            path: 'importPage',
            name: 'accounts.import.home',
            meta: { protected: false },
            // @ts-ignore
            component: () => import('@/views/pages/accounts/ImportPage/ImportPage.vue'),
            children: [
              {
                path: 'importMnemonic',
                name: 'accounts.import.importMnemonic',
                meta: {
                  protected: false,
                  title: 'bar_step_one',
                  extension: '1',
                  nextPage: 'accounts.import.accountInfo',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/ImportPage/ImportMnemonic/ImportMnemonic.vue'),
              },
              {
                path: 'accountInfo',
                name: 'accounts.import.accountInfo',
                meta: {
                  protected: false,
                  title: 'bar_step_two',
                  extension: '2',
                  nextPage: 'accounts.import.generateWallet',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/ImportPage/AccountInfo/AccountInfo.vue'),
              },
              {
                path: 'generateWallet',
                name: 'accounts.import.generateWallet',
                meta: {
                  protected: false,
                  title: 'bar_step_three',
                  extension: '3',
                  nextPage: 'dashboard',
                },
                // @ts-ignore
                component: () => import('@/views/pages/accounts/ImportPage/GenerateWallet/GenerateWallet.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_home').toString(),
          icon: 'md-home',
        },
        redirect: '/home',
        // @ts-ignore
        component: () => import('@/views/pages/dashboard/Dashboard.vue'),
        children: [
          {
            path: '/home',
            name: 'dashboard.index',
            meta: {
              protected: true,
              title: i18n.t('page_title_dashboard').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/home/DashboardHomePage.vue'),
          }, {
            path: '/transfer',
            name: 'dashboard.transfer',
            meta: {
              protected: true,
              title: i18n.t('page_title_transfer').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/transfer/DashboardTransferPage.vue'),
          }, {
            path: '/invoice',
            name: 'dashboard.invoice',
            meta: {
              protected: true,
              title: i18n.t('page_title_invoice').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/invoice/DashboardInvoicePage.vue'),
          },
          {
            path: '/harvesting',
            name: 'dashboard.harvesting',
            meta: {
              protected: true,
              title: i18n.t('page_title_harvesting').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/dashboard/harvesting/DashboardHarvestingPage.vue'),
          }
        ],
      },
      {
        path: '/wallets',
        name: 'wallets',
        redirect: '/wallets/details',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_wallets').toString(),
          icon: 'md-card',
        },
        // @ts-ignore
        component: () => import('@/views/pages/wallets/Wallets.vue'),
        children: [
          {
            path: 'details',
            name: 'wallet.details',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_details').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletDetailsPage/WalletDetailsPage.vue'),
          },
          {
            path: 'backup',
            name: 'wallet.backup',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_backup').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletBackupPage/WalletBackupPage.vue'),
          },
          {
            path: 'harvesting',
            name: 'wallet.harvesting',
            meta: {
              protected: true,
              title: i18n.t('page_title_wallet_harvesting').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/wallets/WalletHarvestingPage/WalletHarvestingPage.vue'),
          },
        ],
      }, {
        path: '/mosaics',
        name: 'mosaics',
        redirect: '/mosaicList',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_mosaics').toString(),
          icon: 'md-apps',
        },
        // @ts-ignore
        component: () => import('@/views/pages/mosaics/MosaicsDashboardPage/MosaicsDashboardPage.vue'),
        children: [
          {
            path: '/mosaicList',
            name: 'mosaics.list',
            meta: {
              protected: true,
              title: i18n.t('page_title_mosaics').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/mosaics/MosaicListPage/MosaicListPage.vue'),
          }, {
            path: '/createMosaic',
            name: 'mosaics.create',
            meta: {
              protected: true,
              title: i18n.t('page_title_mosaics_create').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/mosaics/CreateMosaicPage/CreateMosaicPage.vue'),
          },
        ],
      },
      {
        path: '/namespaces',
        name: 'namespaces',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_namespaces').toString(),
          icon: 'md-text',
        },
        redirect: '/namespaceList',
        // @ts-ignore
        component: () => import('@/views/pages/namespaces/NamespacesDashboardPage/NamespacesDashboardPage.vue'),
        children: [
          {
            path: '/namespaceList',
            name: 'namespaces.list',
            meta: {
              protected: true,
              title: i18n.t('page_title_namespaces').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/namespaces/NamespaceListPage/NamespaceListPage.vue'),
          },
          {
            path: '/createNamespace',
            name: 'namespaces.createRootNamespace',
            meta: {
              protected: true,
              title: i18n.t('page_title_namespaces_create').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/namespaces/CreateNamespacePage/CreateNamespacePage.vue'),
          },
        ],
      }, {
        path: '/multisig',
        name: 'multisig',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_multisig').toString(),
          icon: 'md-contacts',
        },
        redirect: '/multisigManagement',
        // @ts-ignore
        component: () => import('@/views/pages/multisig/MultisigDashboardPage/MultisigDashboardPage.vue'),
        children: [
          // {
          //   path: '/multisigConversion',
          //   name: 'multisig.conversion',
          //   meta: {
          //     protected: true,
          //     title: i18n.t('page_title_multisig_convert').toString(),
          //   },
          //   // @ts-ignore
          //   component: () => import('@/views/pages/multisig/ConvertAccountPage/ConvertAccountPage.vue'),
          // }, 
          {
            path: '/multisigManagement',
            name: 'multisig.management',
            meta: {
              protected: true,
              title: i18n.t('page_title_multisig_manage').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/multisig/ManageAccountPage/ManageAccountPage.vue'),
          }, {
            path: '/multisigCosign',
            name: 'multisig.cosign',
            meta: {
              protected: true,
              title: i18n.t('page_title_multisig_cosign').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/multisig/PartialTransactionDashboardPage/PartialTransactionDashboardPage.vue'),
          },
        ],
      }, {
        path: '/communityPanel',
        name: 'community',
        redirect: '/information',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_community').toString(),
          icon: 'md-chatbubbles',
        },
        // @ts-ignore
        component: () => import('@/views/pages/community/Community.vue'),
        children: [
          {
            path: '/information',
            name: 'community.index',
            meta: { protected: true},
            // @ts-ignore
            component: () => import('@/views/pages/community/information/Information.vue'),
          },
        ],
      },
      {
        path: '/settings',
        name: 'settings',
        redirect: '/settings/general',
        meta: {
          protected: true,
          clickable: true,
          title: i18n.t('sidebar_item_settings').toString(),
          icon: 'md-settings',
        },
        // @ts-ignore
        component: () => import('@/views/pages/settings/Settings.vue'),
        /// region settings children
        children: [
          {
            path: 'general',
            name: 'settings.general',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_general').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/forms/FormGeneralSettings/FormGeneralSettings.vue'),
          },
          {
            path: 'password-reset',
            name: 'settings.password',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_password').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/forms/FormAccountPasswordUpdate/FormAccountPasswordUpdate.vue'),
          },
          {
            path: 'about',
            name: 'settings.about',
            meta: {
              protected: true,
              title: i18n.t('page_title_settings_about').toString(),
            },
            // @ts-ignore
            component: () => import('@/views/pages/settings/AboutPage/AboutPage.vue'),
          },
        ],
        /// end-region settings children
      },
    ],
    /// end-region PageLayout children
  }, {
    path: '/login',
    name: 'accounts.login',
    meta: { protected: false },
    // @ts-ignore
    component: () => import('@/views/pages/accounts/LoginPage.vue'),
  },
]
