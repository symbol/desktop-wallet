import { Vue, Component, Prop } from 'vue-property-decorator'
// @ts-ignore
import FormAccountPasswordUpdate from '@/views/forms/FormAccountPasswordUpdate/FormAccountPasswordUpdate.vue'
@Component({
  components: { FormAccountPasswordUpdate },
})
export class ModalChangePasswordTs extends Vue {
  @Prop({default:false}) visible: boolean

  public get isShowModal(): boolean {
    return this.visible
  }
  public set isShowModal(newVal: boolean) {
    this.$emit('close')
  }
}
