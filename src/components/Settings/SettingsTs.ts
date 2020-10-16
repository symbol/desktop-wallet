import { Vue, Component } from 'vue-property-decorator';
// @ts-ignore
import ModalSettings from '@/views/modals/ModalSettings/ModalSettings.vue';
import { mapGetters } from 'vuex';

@Component({
    components: { ModalSettings },
    computed: {
        ...mapGetters({
            isSettingsVisible: 'profile/isSettingsVisible',
        }),
    },
})
export class SettingsTs extends Vue {
    public isSettingsVisible: boolean;
    public toggleSettings() {
        this.$store.commit('profile/toggleSettings');
    }
}
