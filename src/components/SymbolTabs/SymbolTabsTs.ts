import { Vue, Component, Prop } from 'vue-property-decorator'


@Component
export class SymbolTabsTs extends Vue {
  @Prop({ default: 'direction' }) direction: string
  public tabPaneNavigators: Array<any> = []
  public activeNavIndex: number = 0
  public contentStyle = {
    transform: 'translateX(0)',
  }

  /**
   *  Get the tabPane list
   * */
  public getTabPaneComponents() {
    const tabPanes = []
    this.$children.forEach((pane,index) => {
      if (pane.$options.name === 'SymbolTabPaneTs') {
        tabPanes.push(pane)
        pane['currentIndex'] = index
      }
    })
    return tabPanes
  }
  public onTabChange(index) {
    this.activeNavIndex = index = parseInt(index)
    this.contentStyle.transform = index === 0 ? `translateX(${index})` : `translateX(-${index}00%)`
  }
  mounted() {
    this.tabPaneNavigators = this.getTabPaneComponents()
  }
}
