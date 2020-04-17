/*
 * Copyright 2020 NEM Foundation (https://nem.io)
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

// external dependencies
import { Component, Vue, Prop } from 'vue-property-decorator'

// internal dependencies
import { TabEntry } from '@/router/TabEntry'
import { mapGetters } from 'vuex'
import { AccountModel } from '@/core/database/entities/AccountModel'

@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      isPrivateKeyProfile: 'profile/isPrivateKeyProfile',
    }),
  },
})
export class NavigationTabsTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountModel

  public isPrivateKeyProfile: boolean
  /**
   * Parent route name
   * @var {string}
   */
  @Prop({ default: '' }) parentRouteName: string

  public get tabEntries(): TabEntry[] {
    // @ts-ignore
    const tabEntries = this.$router.getTabEntries(this.parentRouteName)
    return this.isPrivateKeyProfile
      ? tabEntries.filter((tabEntry) => {
          return tabEntry.title != 'page_title_account_backup'
        })
      : tabEntries
  }

  @Prop({ default: 'horizontal' }) direction: 'horizontal' | 'vertical'
}
