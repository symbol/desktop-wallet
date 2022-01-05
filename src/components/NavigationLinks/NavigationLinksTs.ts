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
    created() {
        if (this.translationPrefix === 'tab_contact_') {
            this.activeLinkCssClass = ['active-item-contact', 'active-border', 'contact-header-font-size'];
            this.inactiveLinkCssClass = ['inactive-item-contact', 'inactive-border', 'contact-header-font-size'];
            this.borderCssClass = '';
        }
    }
}
