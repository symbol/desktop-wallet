// @ts-ignore
import ImportMnemonic from '@/components/ImportMnemonic/ImportMnemonic.vue'
// @ts-ignore
import PageTipDisplay from '@/components/PageTipDisplay/PageTipDisplay.vue'
import { MnemonicPassPhrase } from 'nem2-hd-wallets'
import { Component, Vue } from 'vue-property-decorator'
// @ts-ignore
import ButtonStep from '@/components/ButtonStep/ButtonStep.vue'

@Component({
  components: {
    PageTipDisplay,
    ImportMnemonic,
    ButtonStep,
  },
})
export default class ImportMnemonicTs extends Vue {
  tipContents: string[] = [
    'import_mnemonic_tips_comtent_one',
    'import_mnemonic_tips_comtent_two',
  ]

  mnemonicContent: string[]
  mnemonicType: string

  updateMnemonic(data) {
    this.mnemonicContent = data.content
    this.mnemonicType = data.type
  }

  submit() {
    // update state
    this.$store.dispatch('temporary/SET_MNEMONIC', new MnemonicPassPhrase( this.mnemonicContent.toString()))
    this.$store.dispatch('notification/ADD_SUCCESS', this.$t('Generate_entropy_increase_success'))

    // redirect
    return this.$router.push({name: 'accounts.import.accountInfo'})
  }

  jump() {
    this.mnemonicContent = 'panda impact arrow sign escape pluck journey road tunnel work hedgehog clock vast grocery save suggest width dust frost body craft rescue predict rude'.split(' ')
    this.submit()
  }
}
