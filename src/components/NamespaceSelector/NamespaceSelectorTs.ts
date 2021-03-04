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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// child components
import { ValidationProvider } from 'vee-validate';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
import { NamespaceModel } from '@/core/database/entities/NamespaceModel';

@Component({
    components: {
        ValidationProvider,
        ErrorTooltip,
        FormRow,
    },
    computed: {
        ...mapGetters({
            namespaces: 'namespace/ownedNamespaces',
        }),
    },
})
export class NamespaceSelectorTs extends Vue {
    /**
     * Field label
     * @type {string}
     */
    @Prop({ default: '' }) label: string;

    /**
     * Value set by the parent component's v-model
     * @type {string}
     */
    @Prop({ default: null }) value: string;

    /**
     * Namespaces that are not linked
     * @type {boolean}
     */
    @Prop({ default: false }) disableLinked: boolean;

    /**
     * Namespaces that are linked to an alias
     * @type {boolean}
     */
    @Prop({ default: false }) disableUnlinked: boolean;

    /**
     * Level 1,2 namespace
     * @type {boolean}
     */
    @Prop({ default: false }) parentNamespace: boolean;

    /**
     * Level 3 namespace
     * @type {boolean}
     */
    @Prop({ default: false }) nonParentNamespace: boolean;

    /**
     * Disabled namespace selector
     */
    @Prop({ default: false }) disabled: boolean;

    /**
     * Namespaces names
     * @type {[h: string]: string}
     */
    public namespaces: NamespaceModel[];

    /**
     * Filter Namespaces
     */
    get filteredNamespaces() {
        if (this.disableLinked) {
            return this.linkableNamespaces;
        }
        if (this.disableUnlinked) {
            return this.unlinkableNamespaces;
        }
        if (this.parentNamespace) {
            return this.parentNamespaces;
        }
        if (this.nonParentNamespace) {
            return this.nonParentNamespaces;
        }
        return this.allNamespaces;
    }

    /**
     * Namespaces that are not linked
     */
    get linkableNamespaces() {
        return this.namespaces.filter((n) => n.aliasType === 0);
    }

    /**
     * Namespaces that are linked to an alias
     */
    get unlinkableNamespaces() {
        return this.namespaces.filter((n) => n.aliasType !== 0);
    }

    /**
     * Filter out of level 3 when creating a subnamespace
     */
    get parentNamespaces() {
        return this.namespaces.filter((n) => n.depth !== 3);
    }

    /**
     * Filter level 3 subnamespace
     */
    get nonParentNamespaces() {
        return this.namespaces.filter((n) => n.depth === 3);
    }

    /**
     * all namespaces
     */
    get allNamespaces() {
        return this.namespaces;
    }

    /// region computed properties getter/setter
    /**
     * Value set by the parent component
     * @type {string}
     */
    get chosenValue(): string {
        return this.value;
    }

    /**
     * Emit value change
     */
    set chosenValue(newValue: string) {
        this.$emit('input', newValue);
    }

    /// end-region computed properties getter/setter
    /**
     * Helper method to read namespace name if available
     * @param {NamespaceModel} info
     * @return {string}
     */
    public getName(info: NamespaceModel): string {
        return info.name || info.namespaceIdHex;
    }

    /**
     * Hook called when the layout is mounted
     * @return {void}
     */
    public mounted(): void {
        // set default value to the first namespace in the list
        if (this.filteredNamespaces.length) {
            this.chosenValue = this.getName(this.filteredNamespaces[0]);
        }
    }
}
