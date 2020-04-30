import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
// @ts-ignore
import ModalDebugConsole from '@/views/modals/ModalDebugConsole/ModalDebugConsole.vue'

@Component({
  components: {
    ModalDebugConsole,
  },
})
export class DebugConsoleTs extends Vue {
  public isShowingConsole: boolean = false
  get hasDebugConsoleModal(): boolean {
    return this.isShowingConsole
  }

  set hasDebugConsoleModal(f: boolean) {
    this.isShowingConsole = f
  }
}
