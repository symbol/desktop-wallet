// external dependencies
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { NetworkType, NodeInfo, RepositoryFactoryHttp, RoleType } from 'symbol-sdk';
import { NotificationType } from '@/core/utils/NotificationType';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

@Component({
    components: {
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            repositoryFactory: 'network/repositoryFactory',
            peerNodes: 'network/peerNodes',
            networkType: 'network/networkType',
            currentProfile: 'profile/currentProfile',
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

    public peerNodes: NodeInfo[];
    public isFetchingNodeInfo = false;
    public networkType: NetworkType;
    /**
     * Form items
     */
    protected formNodeUrl = '';

    protected formNodePublicKey = '';

    public customNodeData = [];

    public showInputPublicKey = false;

    public currentProfile: ProfileModel;
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
            const nodeModel = new NodeModel(
                value,
                peerNode.friendlyName,
                false,
                this.networkType,
                peerNode.publicKey,
                peerNode.nodePublicKey,
            );
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
                const nodeModel = new NodeModel(
                    value,
                    nodeInfo.friendlyName,
                    false,
                    this.networkType,
                    nodeInfo.publicKey,
                    nodeInfo.nodePublicKey,
                );
                Vue.set(this, 'showInputPublicKey', false);
                this.$emit('input', nodeModel);
            } else {
                Vue.set(this, 'showInputPublicKey', true);
            }
        } catch (error) {
            this.$store.dispatch('notification/ADD_ERROR', NotificationType.INVALID_NODE);
            console.log(error);
            Vue.set(this, 'showInputPublicKey', true);
            throw new Error('Node_connection_failed');
        } finally {
            this.isFetchingNodeInfo = false;
        }
    }

    public async created() {
        await this.$store.dispatch('network/LOAD_PEER_NODES');
        this.customNodeData = this.filteredNodes.map((n) => n.host);
        const currentNodeUrl = this.currentProfile.selectedNodeUrlToConnect.replace(/http:|:3000|\//g, '');
        if (this.customNodeData.includes(currentNodeUrl) && !this.value.url) {
            this.fetchNodePublicKey(currentNodeUrl);
        }
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
            // exclude ngl nodes that doesn't support harvesting
            return this.peerNodes.filter(
                (node) =>
                    node.roles?.some((role) => this.isIncluded(role)) &&
                    !node.host?.includes('ap-southeast-1.testnet') &&
                    !node.host.includes('us-east-1.testnet') &&
                    !node.host.includes('eu-central-1.testnet') &&
                    node.networkIdentifier === this.networkType,
            );
        }
        return this.peerNodes;
    }

    private isIncluded(role: RoleType) {
        return this.includeRoles?.some((includedRole) => includedRole === role);
    }
}
