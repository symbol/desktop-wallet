import { networkConfig } from '@/config';
import { NetworkType } from 'symbol-sdk';

export interface NodeApiNodeInfo {
    endpoint: string;
    friendlyName: string;
    mainPublicKey: string;
    nodePublicKey: string;
    isSslEnabled: boolean;
    isHealthy: boolean;
    restVersion: string;
    wsUrl: string;
}

export class NodeWatchService {
    private readonly url: string;

    constructor(networkType: NetworkType) {
        this.url = networkConfig[networkType].nodeWatchServiceUrl;
    }

    private mapResponseToNodeApiInfo(response: any): NodeApiNodeInfo {
        const endpoint = response.endpoint.replace('http', 'https').replace('3000', '3001');
        const wsUrl = endpoint.replace('https', 'wss') + '/ws';

        return {
            endpoint,
            friendlyName: response.name,
            mainPublicKey: response.mainPublicKey,
            nodePublicKey: response.nodePublicKey,
            isSslEnabled: response.isSslEnabled,
            isHealthy: response.isHealthy,
            restVersion: response.restVersion,
            wsUrl,
        };
    }

    async getNodes(onlySSL = true, limit = 0, order = null): Promise<NodeApiNodeInfo[]> {
        const params = `only_ssl=${onlySSL}&limit=${limit}${order ? `&order=${order}` : ''}`;

        const [apiNodesResponse, peerNodesResponse] = await Promise.all([
            this.get(`/api/symbol/nodes/api?${params}`),
            this.get(`/api/symbol/nodes/peer?${params}`),
        ]);

        return [...apiNodesResponse, ...peerNodesResponse].map((node: any) => this.mapResponseToNodeApiInfo(node));
    }

    async getNodeByMainPublicKey(mainPublicKey: string): Promise<NodeApiNodeInfo | undefined> {
        try {
            const response = await this.get(`/api/symbol/nodes/mainPublicKey/${mainPublicKey}`);
            return this.mapResponseToNodeApiInfo(response);
        } catch (error) {
            return undefined;
        }
    }

    async getNodeByNodePublicKey(nodePublicKey: string): Promise<NodeApiNodeInfo | undefined> {
        try {
            const response = await this.get(`/api/symbol/nodes/nodePublicKey/${nodePublicKey}`);
            return this.mapResponseToNodeApiInfo(response);
        } catch (error) {
            return undefined;
        }
    }

    async get(route: string) {
        const response = await fetch(`${this.url}${route}`, {});
        if (!response.ok) {
            throw new Error(`Node watch response was not ok: ${response.statusText}`);
        }
        return await response.json();
    }
}
