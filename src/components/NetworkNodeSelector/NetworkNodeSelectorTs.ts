// external dependencies
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeHttp, NodeInfo } from 'symbol-sdk';
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
            knowNodes: 'network/knowNodes',
            repositoryFactory: 'network/repositoryFactory',
        }),
    },
})
export class NetworkNodeSelectorTs extends Vue {
    @Prop({ default: () => [] }) excludeRoles: number[];

    /**
     * Validation rules
     */
    public validationRules = ValidationRuleset;

    public knowNodes: NodeModel[];

    /**
     * Form items
     */
    protected formItems = { nodeUrl: '' };

    public customNodeData = [];
    public isFetchingNodeInfo = false;

    /**
     * Hook called when the submit button is clicked
     * @protected
     * @returns {Promise<void>}
     */
    protected async handleInput(): Promise<void> {
        try {
            const nodeUrl = URLHelpers.getNodeUrl(this.formItems.nodeUrl);
            new URL(nodeUrl);

            const publicKey = await this.fetchNodePublicKey();

            if (publicKey && publicKey.length) {
                this.$emit('input', publicKey);

                const associationValues: Array<string> = /.+\u003a\d{2,}/.test(nodeUrl) ? [nodeUrl] : [nodeUrl + ':3000'];
                this.customNodeData = associationValues;
            }
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
    protected async fetchNodePublicKey(): Promise<string> {
        if (!this.formItems.nodeUrl.length) {
            return '';
        }

        let nodeInfo: NodeInfo;
        this.isFetchingNodeInfo = true;
        try {
            const nodeUrl = URLHelpers.getNodeUrl(this.formItems.nodeUrl);
            nodeInfo = await new NodeHttp(nodeUrl).getNodeInfo().toPromise();
        } catch (error) {
            console.log(error);
            throw new Error('Node_connection_failed');
        } finally {
            this.isFetchingNodeInfo = false;
        }

        // if (this.excludeRoles.length && this.excludeRoles.includes(nodeInfo.roles))
        //   throw new Error('harvesting_node_not_eligible')

        return nodeInfo.publicKey;
    }

    public created() {
        this.customNodeData = this.knowNodes.map((n) => n.url);
    }
}
