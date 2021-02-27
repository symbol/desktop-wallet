import { Vue, Component } from 'vue-property-decorator';

@Component({})
export class LogoutButtonTs extends Vue {
    public async logout() {
        await this.$store.dispatch('profile/LOG_OUT');
        this.$router.push({ name: 'profiles.login' });
    }
}
