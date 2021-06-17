/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TransactionQR } from 'symbol-qr-library';
import { NetworkType, TransferTransaction, Address, MosaicId } from 'symbol-sdk';

import { QRCodeDetailItem } from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRActionTs';
// @ts-ignore
import TemplateQRAction from '@/components/QRCode/QRCodeActions/TemplateQRAction/TemplateQRAction.vue';
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';
import { mapGetters } from 'vuex';
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel';
@Component({
    components: { TemplateQRAction, MosaicAmountDisplay, MaxFeeSelector },
    computed: {
        ...mapGetters({
            networkCurrency: 'mosaic/networkCurrency',
        }),
    },
})
export default class TransactionQRActionTs extends Vue {
    @Prop({ default: null }) readonly qrCode!: TransactionQR;

    @Prop({ default: null }) readonly onSuccess: () => void;

    /**
     * TransferTransaction read from QR
     */
    tran: TransferTransaction;
    private networkCurrency: NetworkCurrencyModel;
    private mosaicAmount: string = '';
    private mosaicIdHex: string = '';
    private fees: string = '';
    private mosaicId: MosaicId = undefined;
    /**
     * Get QR Code detail items
     *
     * @returns QRCodeDetailItem[]
     */
    public get detailItems(): QRCodeDetailItem[] {
        const items: QRCodeDetailItem[] = [];
        items.push(
            new QRCodeDetailItem(
                this.$t('qrcode_detail_item_type').toString(),
                this.$t('qrcode_detail_item_type_transactionqr').toString(),
                true,
            ),
        );
        items.push(new QRCodeDetailItem(this.$t('qrcode_detail_item_network_type').toString(), NetworkType[this.qrCode.networkType], true));
        this.tran = (this.qrCode.transaction as unknown) as TransferTransaction;
        items.push(new QRCodeDetailItem(this.$t('to').toString(), (this.tran.recipientAddress as Address).plain(), true));
        this.mosaicIdHex = !!this.tran.mosaics?.length ? this.tran.mosaics[0].id.id.toHex() : this.networkCurrency.mosaicIdHex.toString();
        this.mosaicId = new MosaicId(this.mosaicIdHex);
        items.push(new QRCodeDetailItem(this.$t('mosaic_id').toString(), this.mosaicIdHex, true));
        this.mosaicAmount = !!this.tran.mosaics?.length ? this.tran.mosaics[0].amount.toString() : '0';
        items.push(new QRCodeDetailItem(this.$t('amount').toString(), this.mosaicAmount, true));
        items.push(new QRCodeDetailItem(this.$t('message').toString(), this.tran.message.payload, true));
        this.fees = this.tran.maxFee ? this.tran.maxFee.toString() : '0';
        items.push(new QRCodeDetailItem(this.$t('fee').toString(), this.fees, true));
        return items;
    }

    public onSubmit() {
        const tran = (this.qrCode.transaction as unknown) as TransferTransaction;
        this.onSuccess();
        this.$router.push({
            name: 'dashboard.transfer',
            // @ts-ignore
            params: { transaction: tran, recipientAddress: (tran.recipientAddress as Address).plain() },
        });
    }
}
