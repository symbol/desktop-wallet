import {Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class ImportMnemonicTs extends Vue {
  @Prop({
    default: '1',
  })
  mnemonicType: string

  hashCode: string = 'NaN...'

  mnemonicContent: string = ''

  submitData() {
    this.$emit('finish-data', {content: this.mnemonicContent, type: this.mnemonicType})
  }
}
