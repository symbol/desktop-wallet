import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';
import { ProfileService } from '@/services/ProfileService';

@Component({
    components: {
        ModalConfirm,
    },
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
        }),
    },
})
export class DeleteProfileButtonTs extends Vue {
    public showConfirmationModal = false;
    public currentProfile: ProfileModel;

    private profileService: ProfileService = new ProfileService();

    public async deleteProfile() {
        this.profileService.deleteProfile(this.currentProfile.profileName);
        this.$emit('logout');
    }
}
