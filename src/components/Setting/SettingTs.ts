import { Vue, Component } from 'vue-property-decorator'
// @ts-ignore
import ModalSetting from '@/views/modals/ModalSetting/ModalSetting.vue'

@Component({
  components: { ModalSetting },
})
export class SettingTs extends Vue {
  public isShowModal: boolean = false
  public toggleSetting(){
    this.isShowModal = !this.isShowModal
  }
  onClose(){
    this.isShowModal = false
  }
}
