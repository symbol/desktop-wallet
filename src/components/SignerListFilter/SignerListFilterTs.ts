import Component from 'vue-class-component';
import { SignerBaseFilterTs } from '../SignerBaseFilter/SignerBaseFilterTs';
// @ts-ignore
import SignerBaseFilter from '../SignerBaseFilter/SignerBaseFilter.vue';

@Component({
    components: { SignerBaseFilter },
})
export class SignerListFilterTs extends SignerBaseFilterTs {
    public onListSignerChange(newSigner: string) {
        this.selectedSigner = newSigner;
        this.onSignerChange();
    }
}
