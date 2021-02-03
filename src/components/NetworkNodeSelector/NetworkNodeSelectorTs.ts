// external dependencies
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NodeInfo, RoleType } from 'symbol-sdk';

// internal dependencies
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { NodeModel } from '@/core/database/entities/NodeModel';

@Component({
    components: {
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            repositoryFactory: 'network/repositoryFactory',
            harvestingPeerNodes: 'network/harvestingPeerNodes',
        }),
    },
})
export class NetworkNodeSelectorTs extends Vue {
    @Prop({ default: () => [RoleType.PeerNode, RoleType.VotingNode] }) includeRoles: number[];

    @Prop()
    value: NodeModel;

    @Prop({
        default: false,
    })
    disabled: boolean;

    public harvestingPeerNodes: NodeInfo[];
    /**
     * Form items
     */
    protected formNodeUrl = '';

    protected formNodePublicKey = '';

    public customNodeData = [];

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
        const peerNode = this.filteredNodes.find((p) => p.host === value);
        if (peerNode && peerNode?.nodePublicKey) {
            const nodeModel = new NodeModel(value, peerNode.friendlyName, false, peerNode.publicKey, peerNode.nodePublicKey);
            Vue.set(this, 'showInputPublicKey', false);
            this.$emit('input', nodeModel);
            return;
        }
    }

    public async created() {
        this.customNodeData = this.filteredNodes.map((n) => n.host);
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

    protected get filteredNodes() {
        if (this.includeRoles && this.includeRoles.length > 0) {
            return this.harvestingPeerNodes.filter((node) => node.roles?.some((role) => this.isIncluded(role)));
        }
        return this.harvestingPeerNodes;
    }

    private isIncluded(role: RoleType) {
        return this.includeRoles?.some((includedRole) => includedRole === role);
    }
}
