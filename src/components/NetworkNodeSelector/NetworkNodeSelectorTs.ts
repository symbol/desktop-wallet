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
import { NetworkType, RepositoryFactoryHttp } from 'symbol-sdk';
import { NotificationType } from '@/core/utils/NotificationType';
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { NodeService } from '@/services/NodeService';
@Component({
    components: {
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            peerNodes: 'network/peerNodes',
            networkType: 'network/networkType',
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export class NetworkNodeSelectorTs extends Vue {
    @Prop()
    value: NodeModel;

    @Prop({
        default: false,
    })
    disabled: boolean;

    @Prop({
        default: false,
    })
    isAccountKeyLinked: boolean;
    @Prop({
        default: false,
    })
    isVrfKeyLinked: boolean;

    @Prop({
        default: false,
    })
    missingKeys: boolean;

    public peerNodes: NodeModel[];
    public isFetchingNodeInfo = false;
    public networkType: NetworkType;
    /**
     * Form items
     */
    protected formNodeUrl = '';

    protected customNodeUrl = '';

    protected formNodePublicKey = '';

    public customNodeData = [];

    public filteredData = [];

    public showInputPublicKey = false;

    public currentProfile: ProfileModel;

    private hideList: boolean = false;

    /**
     * Checks if the given node is eligible for harvesting
     * @protected
     * @returns {Promise<void>}
     */
    protected async fetchNodePublicKey(url) {
        if (!url) {
            return '';
        }

        // first check it in peer nodes
        const peerNode = this.peerNodes.find((p) => p.url === url);
        if (peerNode && peerNode?.nodePublicKey) {
            Vue.set(this, 'showInputPublicKey', false);
            this.$emit('input', peerNode);
            return;
        }
        this.isFetchingNodeInfo = true;
        try {
            const nodeUrl = URLHelpers.getNodeUrl(url);
            const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
            const nodeRepository = repositoryFactory.createNodeRepository();
            const nodeInfo = await nodeRepository.getNodeInfo().toPromise();
            this.formNodeUrl = url;
            if (nodeInfo.nodePublicKey) {
                const nodeModel = new NodeModel(
                    url,
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
            this.filteredData = this.customNodeData;
            Vue.set(this, 'showInputPublicKey', true);
            throw new Error('Node_connection_failed');
        } finally {
            this.isFetchingNodeInfo = false;
        }
    }

    protected async fetchAndSetNodeModel(networkType: NetworkType, nodePublicKey: string) {
        const nodeModel = await new NodeService().getNodeFromNodeWatchServiceByNodePublicKey(networkType, nodePublicKey);
        if (nodeModel) {
            this.formNodeUrl = nodeModel.url;
            Vue.set(this, 'showInputPublicKey', false);
            this.$emit('input', nodeModel);
        } else {
            Vue.set(this, 'showInputPublicKey', true);
        }
    }

    public async created() {
        // try to find the node with selected nodePublicKey
        if (this.value?.nodePublicKey) {
            this.fetchAndSetNodeModel(this.networkType, this.value.nodePublicKey);
        }

        await this.$store.dispatch('network/LOAD_PEER_NODES');
    }

    @Watch('peerNodes', { immediate: true })
    protected async watchPeerNodes(newVal: NodeModel[]) {
        // add selected nodes
        const currentNodeUrl = this.currentProfile.selectedNodeUrlToConnect;
        this.customNodeData = [...new Set(newVal.map((n) => n.url).concat(currentNodeUrl))];
        this.filteredData = this.customNodeData;
    }

    @Watch('value', { immediate: true })
    protected async valueWatcher(newVal: NodeModel, oldVal: NodeModel) {
        if (newVal?.nodePublicKey) {
            if (!oldVal || newVal?.nodePublicKey !== oldVal?.nodePublicKey) {
                await this.fetchAndSetNodeModel(this.networkType, newVal.nodePublicKey);
            }
        } else {
            this.formNodeUrl = '';
        }
    }
    @Watch('formNodeUrl', { immediate: true })
    protected async nodeUrlWatcher(newInput: string, oldInput: string) {
        if (newInput === oldInput) {
            return;
        }
        this.hideList = false;
        this.customNodeUrl = newInput;
        if (newInput) {
            this.filteredData = this.customNodeData.filter((n) => n.toLowerCase().includes(newInput.toLowerCase()));
            if (this.filteredData?.length === 1) {
                await this.fetchNodePublicKey(this.filteredData[0]);
                this.hideList = true;
            }
        }
        if (!this.formNodeUrl) {
            this.filteredData = this.customNodeData;
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

    public async handleSelectCustomNode() {
        if (this.customNodeUrl !== '') {
            this.hideList = true;
            await this.fetchNodePublicKey(this.customNodeUrl);
            this.customNodeUrl = '';
        }
    }

    get nodeExistsInList() {
        return this.filteredData.includes(this.customNodeUrl);
    }
}
