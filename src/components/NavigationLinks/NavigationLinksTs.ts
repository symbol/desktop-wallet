import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class NavigationLinksTs extends Vue {
    @Prop({ default: () => [] }) items: string[];
    @Prop({ default: 0 }) currentItemIndex: number;
    @Prop({ default: 'vertical' }) direction: string;
    @Prop({ default: 'settings_tab_' }) translationPrefix: string;
}
