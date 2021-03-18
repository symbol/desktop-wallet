import { Vue, Prop } from 'vue-property-decorator';

export default class PasswordInputTs extends Vue {
    @Prop({ default: '' })
    public value: string;

    public placeholder: string;

    public updateValue(value) {
        this.$emit('input', value);
    }
}
