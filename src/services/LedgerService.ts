import { DerivationPathValidator } from '@/core/validation/validators';
import { SymbolLedger } from '@/core/utils/Ledger';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { NetworkType } from 'symbol-sdk/dist/src/model/network/NetworkType';
const TransportNodeHid = window['TransportNodeHid'] && window['TransportNodeHid'].default;

export class LedgerService {
    private transport;

    /**
     * constructor
     * @param networkType network type
     */
    constructor(public readonly networkType: NetworkType) {}

    private async openTransport() {
        return TransportNodeHid ? await TransportNodeHid.open() : await TransportWebUSB.create();
    }

    private async closeTransport() {
        TransportNodeHid && this.transport && (await this.transport.close());
    }

    private formatError(error) {
        return error.statusCode || error.id ? { errorCode: error.statusCode || error.id } : error;
    }

    public async isAppSupported() {
        try {
            this.transport = await this.openTransport();
            const symbolLedger = new SymbolLedger(this.transport, 'XYM');
            const result = await symbolLedger.isAppSupported();
            await this.closeTransport();
            return result;
        } catch (error) {
            await this.closeTransport();
            throw this.formatError(error);
        }
    }

    public async getAccount(path: string, display: boolean) {
        try {
            if (!DerivationPathValidator.validate(path, this.networkType)) {
                const errorMessage = 'Invalid derivation path: ' + path;
                throw new Error(errorMessage);
            }
            this.transport = await this.openTransport();
            const symbolLedger = new SymbolLedger(this.transport, 'XYM');
            const result = await symbolLedger.getAccount(path, this.networkType, display, false);
            await this.closeTransport();
            return result;
        } catch (error) {
            await this.closeTransport();
            throw this.formatError(error);
        }
    }

    public async signTransaction(path: string, transferTransaction: any, networkGenerationHash: string, signerPublicKey: string) {
        try {
            if (!DerivationPathValidator.validate(path, this.networkType)) {
                const errorMessage = 'Invalid derivation path: ' + path;
                throw new Error(errorMessage);
            }
            this.transport = await this.openTransport();
            const symbolLedger = new SymbolLedger(this.transport, 'XYM');
            const result = await symbolLedger.signTransaction(path, transferTransaction, networkGenerationHash, signerPublicKey);
            await this.closeTransport();
            return result;
        } catch (error) {
            await this.closeTransport();
            throw this.formatError(error);
        }
    }

    public async signCosignatureTransaction(path: string, cosignatureTransaction: any, signerPublicKey: string) {
        try {
            if (!DerivationPathValidator.validate(path, this.networkType)) {
                const errorMessage = 'Invalid derivation path: ' + path;
                throw new Error(errorMessage);
            }
            this.transport = await this.openTransport();
            const symbolLedger = new SymbolLedger(this.transport, 'XYM');
            const result = await symbolLedger.signCosignatureTransaction(path, cosignatureTransaction, signerPublicKey);
            await this.closeTransport();
            return result;
        } catch (error) {
            await this.closeTransport();
            throw this.formatError(error);
        }
    }
}
