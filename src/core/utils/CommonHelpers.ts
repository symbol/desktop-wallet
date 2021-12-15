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

export class CommonHelpers {
    /**
     * Helper method to sleep for ms miliseconds
     * @param {string} text
     * @return {boolean}
     */
    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    /**
     * Helper method to retry opening websocket n times asynchronously
     */
    public static async retryNTimes(listener, trials: number, interval: number) {
        if (trials < 1) {
            throw new Error('could not connect');
        }
        let attemptCount = 0;
        while (!listener.isOpen()) {
            try {
                return await listener.open();
            } catch (error) {
                if (++attemptCount >= trials) {
                    throw error;
                }
            }
            await this.sleep(interval);
        }
    }
    /**
     * Traverses the tree object to pick addresses strings.
     * @param {array} array of multisig children
     * @param {parse} function to parse tree and pick children addresses
     */
    public static parseObjectProperties(obj: [], parse): void {
        for (const k in obj) {
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                this.parseObjectProperties(obj[k], parse);
            } else if (Object.prototype.hasOwnProperty.call(obj, k)) {
                parse(k, obj[k]);
            }
        }
    }
    /**
     * Truncates the string if it is too long
     * @protected
     * @param {string} str
     * @returns {string}
     */
    public static truncate(str: string): string {
        const maxStringLength = 15;
        if (str.length <= maxStringLength) {
            return str;
        }
        return `${str.substring(0, 9)}...${str.substring(str.length - 3)}`;
    }
}
