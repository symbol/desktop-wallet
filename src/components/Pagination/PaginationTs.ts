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

@Component
export default class PaginationTs extends Vue {
    @Prop({ default: 1 }) readonly current!: number;
    @Prop({ default: 10 }) readonly pageSize!: number;
    @Prop({ default: false }) readonly lastPage!: boolean;
    @Prop({ default: 'ivu-page ivu-page-simple' }) readonly simpleWrapClasses!: string;
    @Prop({ default: 'ivu-page-prev' }) readonly prevClasses!: string;
    @Prop({ default: 'ivu-page-simple-pager' }) readonly simplePagerClasses!: string;
    @Prop({ default: 'ivu-page-next' }) readonly nextClasses!: string;

    public targetPage: number = 0;

    public prefixCls = 'ivu-page';

    public mounted() {
        this.targetPage = this.current;
    }

    public get currentPage() {
        return this.current;
    }

    /**
     * Class names for previous page button
     */
    public get prevCls() {
        return [
            this.prevClasses,
            {
                [`${this.prefixCls}-disabled`]: this.currentPage <= 1,
            },
        ];
    }

    /**
     * Class names for next page button
     */
    public get nextCls() {
        return [
            this.nextClasses,
            {
                [`${this.prefixCls}-disabled`]: this.lastPage,
            },
        ];
    }

    /**
     * Hook called when next page button is clicked
     */
    public next() {
        if (this.lastPage) {
            return;
        }
        this.targetPage = this.currentPage + 1;
        this.$emit('targetPage', this.targetPage);
    }

    /**
     * Hook called when previous page button is clicked
     */
    public prev() {
        if (this.currentPage <= 1) {
            return;
        }
        this.targetPage = this.currentPage - 1;
        this.$emit('targetPage', this.targetPage);
    }

    /**
     * Hook called when key is up
     * @param key event
     */
    public keyUp(e) {
        const key = e.keyCode;
        const val = parseInt(e.target.value);
        if (isNaN(val)) {
            return;
        }
        if (key === 40) {
            this.prev();
        } else if (key === 38) {
            this.next();
        } else if (key === 13) {
            this.$emit('targetPage', val);
        }
    }

    /**
     * Hook called when key is down
     * Prevents the disallowed chars to be typed in
     * @param key event
     */
    public keyDown(e) {
        const key = e.keyCode;
        const condition = (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 37 || key === 39;
        if (!condition) {
            e.preventDefault();
        }
    }
}
