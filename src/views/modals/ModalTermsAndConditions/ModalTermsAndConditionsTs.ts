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
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { ProfileService } from '@/services/ProfileService';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export class ModalTermsAndConditionsTs extends Vue {
    @Prop({ default: false }) visible: boolean;

    /**
     * Controls submit button for terms and conditions
     * @type {boolean}
     */
    private marked: boolean = false;
    /**
     * Current Profile
     * @type {ProfileModel}
     */
    private currentProfile: ProfileModel;
    /**
     * Internal visibility state
     * @type {boolean}
     */
    protected get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    protected set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    /**
     * update profile with new terms and conditions status
     */
    private approveTermsAndConditions() {
        return new ProfileService().updateProfileTermsAndConditionsStatus(this.currentProfile, true);
    }
}
