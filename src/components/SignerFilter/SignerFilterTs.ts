import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Signer } from '@/store/Account';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
        }),
    },
})
export class SignerFilterTs extends Vue {
    @Prop({ default: [] })
    public signers: Signer[];

    /**
     * Selected signer from the store
     * @protected
     * @type {string}
     */
    public currentSigner: Signer;

    public selectedSigner: string = '';

    created() {
        if (this.signers?.length > 0) {
            const signer: Signer[] = this.signers.filter((s) => s.address.plain() === this.currentSigner.address.plain());
            if (signer.length) {
                this.selectedSigner = signer[0].address.plain();
            } else {
                this.selectedSigner = this.signers[0].address.plain();
            }
        }
    }
    /**
     * onAddressChange
     */
    public onSignerChange() {
        this.$emit('signer-change', this.selectedSigner);
    }

    @Watch('currentSigner', { immediate: true })
    onCurrentSignerChange() {
        this.selectedSigner = this.currentSigner.address.plain();
    }
}
