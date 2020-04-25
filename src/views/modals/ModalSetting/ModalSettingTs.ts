import { Vue, Component, Prop } from 'vue-property-decorator'
// @ts-ignore
import FormGeneralSettings from '@/views/forms/FormGeneralSettings/FormGeneralSettings.vue'
// @ts-ignore
import FormAccountPasswordUpdate from '@/views/forms/FormAccountPasswordUpdate/FormAccountPasswordUpdate.vue'
// @ts-ignore
import AboutPage from '@/views/pages/settings/AboutPage/AboutPage.vue'
// @ts-ignore
import SymbolTabs from '@/components/SymbolTabs/SymbolTabs.vue'
// @ts-ignore
import SymbolTabPane from '@/components/SymbolTabs/SymbolTabPane/SymbolTabPane.vue'
@Component({
  components:{
    FormGeneralSettings,
    FormAccountPasswordUpdate,
    AboutPage,
    SymbolTabs,
    SymbolTabPane,
  },
})
export class ModalSettingTs extends Vue {
  @Prop({default:false}) visible: boolean

  public get isShowModal(): boolean {
    return this.visible
  }
  public set isShowModal(newVal: boolean) {
    this.$emit('close')
  }
}
