import { NodeWatchService } from '@/services/NodeWatchService';
import { networkConfig } from '@/config';

describe('services/NodeWatchService', () => {
    const mockFetch = jest.fn();
    (global as any).fetch = mockFetch;

    const createMockNodeResponse = () => ({
        endpoint: 'http://example.com:3000',
        friendlyName: 'Node1',
        mainPublicKey: 'mainKey1',
        nodePublicKey: 'nodeKey1',
        isSslEnabled: true,
        isHealthy: true,
        restVersion: '1.0.0',
    });

    const mockNetworkType = 104;
    const baseUrl = networkConfig[mockNetworkType].nodeWatchServiceUrl;
    let nodeService;

    beforeEach(() => {
        jest.clearAllMocks();
        nodeService = new NodeWatchService(mockNetworkType);
    });

    describe('getNodes()', () => {
        // Arrange:`
        mockFetch.mockImplementation((url) => {
            if (url.includes('/api/symbol/nodes/api')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve([createMockNodeResponse()]),
                });
            }
            if (url.includes('/api/symbol/nodes/peer')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve([]),
                });
            }
        });

        const runAssertNodes = async (results, { onlySSL, limit, order }) => {
            // Assert:
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                `${baseUrl}` + `/api/symbol/nodes/api?only_ssl=${onlySSL}&limit=${limit}${order ? `&order=${order}` : ''}`,
                {},
            );
            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                `${baseUrl}` + `/api/symbol/nodes/peer?only_ssl=${onlySSL}&limit=${limit}${order ? `&order=${order}` : ''}`,
                {},
            );
            expect(results).toStrictEqual([
                {
                    ...createMockNodeResponse(),
                    endpoint: 'https://example.com:3001',
                    wsUrl: 'wss://example.com:3001/ws',
                },
            ]);
        };

        test('fetches nodes with default parameters', async () => {
            // Act:
            const nodes = await nodeService.getNodes();

            // Assert:
            runAssertNodes(nodes, {
                onlySSL: true,
                limit: 0,
                order: null,
            });
        });

        test('fetches nodes with parameters', async () => {
            // Act:
            const nodes = await nodeService.getNodes(false, 10, 'random');

            // Assert:
            runAssertNodes(nodes, {
                onlySSL: false,
                limit: 10,
                order: 'random',
            });
        });
    });

    const runGetNodeByMethodTest = async (method, paramValue, expectedUrl) => {
        // Arrange:
        const mockResponse = createMockNodeResponse();
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockResponse),
        });

        // Act:
        const node = await nodeService[method](paramValue);

        // Assert:
        expect(mockFetch).toHaveBeenCalledWith(baseUrl + expectedUrl, {});
        expect(node).toEqual({
            ...mockResponse,
            endpoint: 'https://example.com:3001',
            wsUrl: 'wss://example.com:3001/ws',
        });
    };

    const runThrowErrorNodeNotFoundTest = async (method, paramValue, expectedUrl) => {
        // Arrange:
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        // Act:
        const node = await nodeService[method](paramValue);

        // Assert:
        expect(mockFetch).toHaveBeenCalledWith(baseUrl + expectedUrl, {});
        expect(node).toBeUndefined();
    };

    describe('getNodeByMainPublicKey()', () => {
        test('returns node info by main public key', async () => {
            await runGetNodeByMethodTest('getNodeByMainPublicKey', 'mainKey1', '/api/symbol/nodes/mainPublicKey/mainKey1');
        });

        test('returns undefined when node not found', async () => {
            await runThrowErrorNodeNotFoundTest(
                'getNodeByMainPublicKey',
                'nonExistentKey',
                '/api/symbol/nodes/mainPublicKey/nonExistentKey',
            );
        });
    });

    describe('getNodeByNodePublicKey()', () => {
        test('returns node info by node public key', async () => {
            await runGetNodeByMethodTest('getNodeByNodePublicKey', 'nodeKey1', '/api/symbol/nodes/nodePublicKey/nodeKey1');
        });

        test('returns undefined when node not found', async () => {
            await runThrowErrorNodeNotFoundTest(
                'getNodeByNodePublicKey',
                'nonExistentKey',
                '/api/symbol/nodes/nodePublicKey/nonExistentKey',
            );
        });
    });
});
