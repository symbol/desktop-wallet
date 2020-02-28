import {Vue, Component} from 'vue-property-decorator'
// @ts-ignore
import StepBar from '@/components/StepBar/StepBar.vue'
// @ts-ignore
import ButtonStep from '@/components/ButtonStep/ButtonStep.vue'

@Component({
  components: {
    StepBar,
    ButtonStep,
  },
})
export default class ImportPageTs extends Vue {
  stepList = [
    {
      index: 1,
      text: 'bar_step_one',
      isChild: false,
    },
    {
      index: 2,
      text: 'bar_step_two',
      isChild: false,
    },
    {
      index: 3,
      text: 'bar_step_three',
      isChild: false,
    },
  ]
}
