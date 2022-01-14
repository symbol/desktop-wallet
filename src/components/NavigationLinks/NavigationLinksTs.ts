import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class NavigationLinksTs extends Vue {
    @Prop({ default: () => [] }) items: string[];
    @Prop({ default: 0 }) currentItemIndex: number;
    @Prop({ default: 'vertical' }) direction: string;
    @Prop({ default: 'settings_tab_' }) translationPrefix: string;
    private activeLinkCssClass: string[] = ['active-item'];
    private inactiveLinkCssClass: string[] = ['inactive-item'];
    private borderCssClass: string = 'border';
    private activeBorder: string = '';
    private inActiveBorder: string = '';
    created() {
        if (this.translationPrefix === 'tab_contact_') {
            this.activeLinkCssClass = ['active-item-contact', 'contact-header-font-size'];
            this.inactiveLinkCssClass = ['inactive-item-contact', 'contact-header-font-size'];
            this.activeBorder = 'active-border';
            this.inActiveBorder = 'inactive-border';
            this.borderCssClass = '';
        }
    }
}
