import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { AccountModel } from '@/core/database/entities/AccountModel'
import { WalletModel } from '@/core/database/entities/WalletModel'
// @ts-ignore
import ModalFormSubWalletCreation from '@/views/modals/ModalFormSubWalletCreation/ModalFormSubWalletCreation.vue'
// @ts-ignore
import ModalMnemonicExport from '@/views/modals/ModalMnemonicExport/ModalMnemonicExport.vue'
// @ts-ignore
import ModalChangePassword from '@/views/modals/ModalChangePassword/ModalChangePassword.vue'
@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      currentWallet: 'wallet/currentWallet',
    }),
  },
  components:{
    ModalFormSubWalletCreation,
    ModalMnemonicExport,
    ModalChangePassword,
  },
})
export class ProfileInfoTs extends Vue {
  public currentAccount: AccountModel
  public currentWallet: WalletModel
  public isAddingAccount: boolean=false
  public isExportingMnemonic: boolean=false
  public isChangingPassword: boolean=false
  
  public get isShowingAccountCreationModal(): boolean{
    return this.isAddingAccount
  }
  public set isShowingAccountCreationModal(val: boolean){
    this.isAddingAccount = val
  }
  public get isShowingExportMnemonicModal(): boolean{
    return this.isExportingMnemonic
  }
  public set isShowingExportMnemonicModal(val: boolean){
    this.isExportingMnemonic = val
  }
  public get isShowingChangePasswordModal(): boolean{
    return this.isChangingPassword
  }
  public set isShowingChangePasswordModal(val: boolean){
    this.isChangingPassword = val
  }
  public async logout() {
    await this.$store.dispatch('account/LOG_OUT')
    this.$router.push({name: 'accounts.login'})
  }
}
