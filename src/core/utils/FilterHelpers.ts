/**
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class FilterHelpers {
    /**
     * replace all tags
     * @param inputStr
     */
    public static stripFilter(inputStr: string, allowed: string = '') {
        // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

        const tags = /<\/?([a-z0-9]*)\b[^>]*>?/gi;
        const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        // removes tha '<' char at the end of the string to replicate PHP's behaviour
        let after = inputStr;
        after = after.substring(after.length - 1) === '<' ? after.substring(0, after.length - 1) : after;

        // recursively remove tags to ensure that the returned string doesn't contain
        // forbidden tags after previous passes (e.g. '<<bait/>switch/>')
        let before;
        do {
            before = after;
            after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });

            // return once no more tags are removed
            if (before === after) {
                return after;
            }
        } while (before !== after);
    }
}
