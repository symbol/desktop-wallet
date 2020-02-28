// @ts-ignore
import PageTipDisplay from '@/components/PageTipDisplay/PageTipDisplay.vue'
// @ts-ignore
import FormAccountSetting from '@/views/forms/FormAccountSetting/FormAccountSetting.vue'
import { Component, Vue } from 'vue-property-decorator'
// @ts-ignore
import ButtonStep from '@/components/ButtonStep/ButtonStep.vue'

@Component({
  components: {
    PageTipDisplay,
    FormAccountSetting,
    ButtonStep,
  },
})
export default class AccountInfoTs extends Vue {
  tipContents: string[] = [
    'Set_account_description_tips1',
    'Set_account_description_tips2',
  ]
}
