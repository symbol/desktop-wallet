import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export class ButtonRefreshTs extends Vue {
    @Prop({ default: undefined }) size: string;
}
