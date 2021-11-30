/*
 * (C) Symbol Contributors 2021
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

export class UIHelpers {
    /**
     * Helper method to copy text to clipboard
     * @param {string} text
     * @return {boolean}
     */
    public static copyToClipboard(text: string): boolean {
        try {
            // create ghost element
            const input = document.createElement('input');
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', text);
            document.body.appendChild(input);

            // use DOM commands
            input.select();
            document.execCommand('copy');

            // flush
            document.body.removeChild(input);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Helper method to download byte array as a file
     *
     * @param {Uint8Array | string} bytes Byte array to be downloaded as a file
     * @param {string} fileName
     * @param {string} fileMimeType
     * @return {Observable<boolean>}
     */
    public static downloadBytesAsFile(bytes: Uint8Array | string, fileName: string, fileMimeType: string): Promise<boolean> {
        return new Promise((resolve) => {
            const blob = new Blob([bytes], {
                type: fileMimeType,
            });
            const url = window.URL.createObjectURL(blob);

            // - create link (<a>)
            const a = document.createElement('a');
            const event = new MouseEvent('click');
            a.download = fileName;
            a.href = url;
            // - start download
            a.dispatchEvent(event);
            resolve(true);
        });
    }
}
