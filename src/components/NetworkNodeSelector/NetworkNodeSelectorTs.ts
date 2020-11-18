// external dependencies
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { URLHelpers } from '@/core/utils/URLHelpers';

// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { NodeInfo, RepositoryFactoryHttp } from 'symbol-sdk';
import { NodeModel } from '@/core/database/entities/NodeModel';

@Component({
    components: {
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            peerNodes: 'network/peerNodes',
            repositoryFactory: 'network/repositoryFactory',
        }),
    },
})
export class NetworkNodeSelectorTs extends Vue {
    @Prop({ default: () => [] }) excludeRoles: number[];

    @Prop()
    value: NodeModel;

    /**
     * Validation rules
     */
    public validationRules = ValidationRuleset;

    public peerNodes: NodeInfo[];

    /**
     * Form items
     */
    protected formNodeUrl = '';

    protected formNodePublicKey = '';

    public customNodeData = [];

    public isFetchingNodeInfo = false;

    public showInputPublicKey = false;

    /**
     * Checks if the given node is eligible for harvesting
     * @protected
     * @returns {Promise<void>}
     */
    protected async fetchNodePublicKey(value) {
        if (!value) {
            return '';
        }

        // first check it in peer nodes
        const peerNode = this.peerNodes.find((p) => p.host === value);
        if (peerNode && peerNode?.nodePublicKey) {
            const nodeModel = new NodeModel(value, peerNode.friendlyName, false, peerNode.publicKey, peerNode.nodePublicKey);
            Vue.set(this, 'showInputPublicKey', false);
            this.$emit('input', nodeModel);
            return;
        }

        this.isFetchingNodeInfo = true;
        try {
            const nodeUrl = URLHelpers.getNodeUrl(value);
            const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
            const nodeRepository = repositoryFactory.createNodeRepository();
            const nodeInfo = await nodeRepository.getNodeInfo().toPromise();
            this.formNodeUrl = value;
            if (nodeInfo.nodePublicKey) {
                const nodeModel = new NodeModel(value, nodeInfo.friendlyName, false, nodeInfo.publicKey, nodeInfo.nodePublicKey);
                Vue.set(this, 'showInputPublicKey', false);
                this.$emit('input', nodeModel);
            } else {
                Vue.set(this, 'showInputPublicKey', true);
            }
        } catch (error) {
            console.log(error);
            Vue.set(this, 'showInputPublicKey', true);
            throw new Error('Node_connection_failed');
        } finally {
            this.isFetchingNodeInfo = false;
        }
    }

    public async created() {
        await this.$store.dispatch('network/LOAD_PEER_NODES');
        this.customNodeData = this.peerNodes.map((n) => n.host);
    }

    @Watch('value', { immediate: true })
    protected valueWatcher(newVal: NodeModel) {
        if (newVal) {
            this.formNodeUrl = newVal.url;
            if (!this.formNodeUrl) {
                this.formNodePublicKey = newVal.nodePublicKey;
            }
            if (this.formNodePublicKey) {
                this.showInputPublicKey = !this.formNodeUrl;
            }
        } else {
            this.formNodeUrl = '';
        }
    }

    public filterUrls(value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    }

    public onChangeFormNodePublicKey(event) {
        const nodeModel = { nodePublicKey: event.target.value };
        this.$emit('input', nodeModel);
    }

    public onClear() {
        // @ts-ignore
        this.$refs.nodeUrlInput.$el.focus();
        this.$emit('input', { nodePublicKey: '' });
    }
}
