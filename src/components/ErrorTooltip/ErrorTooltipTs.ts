import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export class ErrorTooltipTs extends Vue {
    /**
     * Tooltip placement
     * @type {string}
     */
    @Prop({ default: 'top-end' }) placementOverride!: string;

    /**
     * Errors returned by the Validation Provider
     * @type {string[]}
     */
    @Prop() errors!: string[];

    /**
     * The string representation of the error messages
     * i.e.
     * * Error 1
     * * Error 2
     * @readonly
     * @type {string}
     */
    get displayedError(): string | null {
        if (!this.errors) {
            return null;
        }
        if (!this.errors.length) {
            return null;
        }
        const filteredList = this.errors.filter((err) => err.trim() !== '');
        if (!filteredList.length) {
            return null;
        }
        return filteredList.map((err) => `* ${err}`).join('\n');
    }

    /**
     * Errored state
     * @readonly
     * @type {boolean}
     */
    get errored(): boolean {
        return this.displayedError !== null;
    }
}
