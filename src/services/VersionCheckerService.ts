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
import { appConfig } from '@/config';
import fetch from 'node-fetch';

export type LatestVersionObject = {
    versionTag: string;
    downloadUrl: string;
};

export class VersionCheckerService {
    /**
     * Request github api for latest release
     * @return {Promise<LatestVersionObject>}
     */
    public async getNewerVersionTag(): Promise<LatestVersionObject> {
        const [versionTag, downloadUrl] = await fetch(appConfig.repositoryDataUrl)
            .then((response) => response.json()) //Converting the response to a JSON object
            .then((data) => [data.tag_name.substring(1), data.html_url])
            .catch((error) => console.error(error));
        if (!versionTag || !downloadUrl || versionTag === process.env.PACKAGE_VERSION) {
            return;
        }
        return { versionTag, downloadUrl };
    }
}
