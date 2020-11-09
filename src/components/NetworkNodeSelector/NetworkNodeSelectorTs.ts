// external dependencies
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset';
import { URLHelpers } from '@/core/utils/URLHelpers';
import { NodeModel } from '@/core/database/entities/NodeModel';

// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';

@Component({
    components: {
        FormWrapper,
        FormRow,
    },
    computed: {
        ...mapGetters({
            knownNodes: 'network/knowNodes',
        }),
    },
})
export class NetworkNodeSelectorTs extends Vue {
    @Prop({ default: () => [] }) excludeRoles: number[];
    @Prop()
    value: string;

    /**
     * Validation rules
     */
    public validationRules = ValidationRuleset;

    public knownNodes: NodeModel[];

    /**
     * Form items
     */
    protected formNodeUrl = '';

    public customNodeData = [];

    public isFetchingNodeInfo = false;

    /**
     * Hook called when the submit button is clicked
     * @protected
     * @returns {Promise<void>}
     */
    protected async handleInput(): Promise<void> {
        try {
            const nodeUrl = URLHelpers.getNodeUrl(this.formNodeUrl);
            new URL(nodeUrl);

            await this.fetchNodePublicKey();
        } catch (error) {
            // set error in the error tooltip
            this.$emit('error', error.message);
        }
    }

    /**
     * Checks if the given node is eligible for harvesting
     * @protected
     * @returns {Promise<void>}
     */
    protected async fetchNodePublicKey() {
        if (!this.formNodeUrl?.length) {
            return '';
        }

        this.isFetchingNodeInfo = true;
        try {
            const nodeUrl = URLHelpers.getNodeUrl(this.formNodeUrl);
            await this.$store.dispatch('network/UPDATE_PEER', nodeUrl);
        } catch (error) {
            console.log(error);
            throw new Error('Node_connection_failed');
        } finally {
            this.isFetchingNodeInfo = false;
        }
    }

    public created() {
        this.customNodeData = this.knownNodes.map((n) => n.url);
    }

    @Watch('knownNodes')
    protected knownNodesWatcher(nodes: NodeModel[]) {
        const selectedNode = nodes.find((n) => n.url === this.formNodeUrl);
        if (selectedNode) {
            this.$emit('input', selectedNode.publicKey);
        }
    }

    @Watch('value', { immediate: true })
    protected valueWatcher(newVal) {
        if (newVal) {
            this.formNodeUrl = this.knownNodes.find((n) => n.publicKey === this.value)?.url;
        } else {
            this.formNodeUrl = '';
        }
    }
}
