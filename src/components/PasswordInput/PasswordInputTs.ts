import { Vue, Prop, Component } from 'vue-property-decorator';
// @ts-ignore
import PasswordInput from './PasswordInput.vue';

@Component({
    components: { PasswordInput },
})
export default class PasswordInputTs extends Vue {
    @Prop({ default: '' })
    public placeholder: string;
    @Prop({ default: 'input-size input-style' })
    public className: string;

    public updateValue(value) {
        this.$emit('input', value);
    }
}
