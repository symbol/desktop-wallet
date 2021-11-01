import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Signer } from '@/store/Account';
import { mapGetters } from 'vuex';

export class SignerItem {
    constructor(public parent: boolean, public signer: Signer, public level: number) {}
}
@Component({
    computed: {
        ...mapGetters({
            currentSigner: 'account/currentSigner',
        }),
    },
})
export class SignerBaseFilterTs extends Vue {
    @Prop({ default: null })
    public rootSigner?: Signer;

    @Prop({
        default: false,
    })
    isAggregate: boolean;

    @Prop({
        default: '',
    })
    chosenSigner: string;
    /**
     * Selected signer from the store
     * @protected
     * @type {string}
     */
    public currentSigner: Signer;

    public selectedSigner: string = '';

    public created() {
        if (this.isAggregate && this.chosenSigner) {
            this.selectedSigner = this.chosenSigner;
        } else {
            this.selectedSigner = this.currentSigner.address.plain();
        }
    }

    get multisigSigners(): SignerItem[] {
        return this.getParentSignerItems(this.rootSigner, 0);
    }

    public getParentSignerItems(signer: Signer, level: number): SignerItem[] {
        if (!signer?.parentSigners) {
            return [];
        }
        const signerItems: SignerItem[] = [];
        for (const parentSigner of signer.parentSigners) {
            signerItems.push(new SignerItem(parentSigner.parentSigners?.length > 0, parentSigner, level));
            signerItems.push(...this.getParentSignerItems(parentSigner, level + 1));
        }
        return signerItems;
    }

    /**
     * onAddressChange
     */
    public onSignerChange() {
        this.$emit('signer-change', this.selectedSigner);
    }

    @Watch('currentSigner', { immediate: true })
    public onCurrentSignerChange() {
        this.selectedSigner = this.currentSigner.address.plain();
    }
}
