import { Vue, Component, Prop } from 'vue-property-decorator'
// @ts-ignore
import FormGeneralSettings from '@/views/forms/FormGeneralSettings/FormGeneralSettings.vue'
// @ts-ignore
import FormProfilePasswordUpdate from '@/views/forms/FormProfilePasswordUpdate/FormProfilePasswordUpdate.vue'
// @ts-ignore
import AboutPage from '@/views/pages/settings/AboutPage/AboutPage.vue'
// @ts-ignore
import SymbolTabs from '@/components/SymbolTabs/SymbolTabs.vue'
// @ts-ignore
import SymbolTabPane from '@/components/SymbolTabs/SymbolTabPane/SymbolTabPane.vue'
//@ts-ignore
import FormNodeEdit from '@/views/forms/FormNodeEdit/FormNodeEdit.vue'
@Component({
  components: {
    FormGeneralSettings,
    FormProfilePasswordUpdate,
    AboutPage,
    FormNodeEdit,
    SymbolTabs,
    SymbolTabPane,
  },
})
export class ModalSettingsTs extends Vue {
  @Prop({ default: false }) visible: boolean

  public get isShowModal(): boolean {
    return this.visible
  }
  public set isShowModal(newVal: boolean) {
    this.$emit('close')
  }
}
