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
import { Address } from 'symbol-sdk';
import { decode } from 'utf8';

export class Formatters {
    public static formatNumber = (number: number, fractionDigits = 0): string => {
        if (number <= 1) {
            return `${number}`;
        }
        if (number === Number(number.toFixed(0))) {
            return number.toLocaleString('en-US', { minimumFractionDigits: fractionDigits });
        }

        const stringOfNumber = `${number}`;
        const minimumFractionDigits = stringOfNumber.length - stringOfNumber.indexOf('.') - 1;
        return number.toLocaleString('en-US', { minimumFractionDigits: fractionDigits || minimumFractionDigits });
    };

    public static formatAddress = function (address: string): string {
        if (!address) {
            return;
        }
        return Address.createFromRawAddress(address).pretty();
    };

    public static miniAddress = (address: Address): string => {
        const string = address.pretty();
        return `${string.substring(0, 13).toUpperCase()}***${string.substring(28).toUpperCase()}`;
    };

    public static miniHash = (hash: string): string => {
        return `${hash.substring(0, 18).toLowerCase()}***${hash.substring(42).toLowerCase()}`;
    };

    public static tinyHash = (hash: string): string => {
        return `${hash.substring(0, 6).toLowerCase()}***${hash.substring(58).toLowerCase()}`;
    };

    public static formatDate = (timestamp) => {
        const now = new Date(Number(timestamp));
        const year = now.getFullYear();
        let month = `${now.getMonth() + 1}`;
        month = Number(month) < 10 ? `0${month}` : month;
        let date = `${now.getDate()}`;
        date = Number(date) < 10 ? `0${date}` : date;
        let hour = `${now.getHours()}`;
        hour = Number(hour) < 10 ? `0${hour}` : hour;
        let minute = `${now.getMinutes()}`;
        minute = Number(minute) < 10 ? `0${minute}` : minute;
        let second = `${now.getSeconds()}`;
        second = Number(second) < 10 ? `0${second}` : second;
        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    };

    public static hexToUtf8(hex: string): string {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        try {
            return decode(str);
        } catch (e) {
            return str;
        }
    }

    public static configurationNumberAsString(value: string | undefined): string {
        return value ? value.replace(/'/g, '') : '0';
    }

    public static configurationStringAsString(value: string | undefined): string {
        return value ? value.replace(/'/g, '').substring(2) : '';
    }

    public static configurationNumberAsNumber(value: string | undefined): number {
        return parseInt(this.configurationNumberAsString(value));
    }
    public static splitArrayByDelimiter(arr: Array<string>, delimiter?: string) {
        delimiter = delimiter ? delimiter : ' ';
        if (!Array.isArray(arr)) {
            throw Error(`${arr} is not an Array`);
        }
        if (arr.some((e) => typeof e !== 'string')) {
            throw Error(`Type of the element in ${arr} should be string`);
        }
        return arr.join(delimiter);
    }

    /**
     * Checks current locale separator
     * @private
     * @return {string}
     */
    public static getDecimalSeparator(locale): string {
        // testing against current locale to figure out separator
        const numberWithDecimalSeparator = 1.1;
        return Intl.NumberFormat(locale)
            .formatToParts(numberWithDecimalSeparator)
            .find((part) => part.type === 'decimal').value;
    }
}
