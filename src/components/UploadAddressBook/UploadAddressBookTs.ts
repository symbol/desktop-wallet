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
import { AddressBook } from 'symbol-address-book';

@Component({
    components: {},
})
export default class UploadAddressBookTs extends Vue {
    @Prop({ default: true })
    public uploadEnabled: boolean;

    @Prop({ default: true })
    readonly showExplanation: boolean;

    @Prop({ default: 'upload_file_message' })
    readonly uploadFileMessage!: string;

    /**
     * Preview uploaded addressBook
     */
    addressBook: AddressBook = null;

    /**
     * Error uploading
     */
    showError: boolean = false;

    /**
     * Uploaded file name
     */
    fileName = '';

    /**
     * Hook for handling file before upload completes
     * @param file uploaded
     */
    public onBeforeUpload(file) {
        this.fileName = file.name;
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (event) => {
            // called once readAsDataURL is completed
            const jsonData = event.target.result as string;
            try {
                this.addressBook = AddressBook.fromJSON(jsonData);
                this.showError = false;
            } catch (e) {
                this.showError = true;
            }
        };

        return false; //return false now since we have the file passed to qrcodeCapture component
    }

    /**
     * Import address book handler
     */
    public async importAddressBook() {
        this.$store.commit('addressBook/setAddressBook', this.addressBook);
        await this.$store.dispatch('addressBook/SAVE_ADDRESS_BOOK');
        this.$emit('uploadComplete');
    }
}
