<template>
    <div class="container">
        <h1 class="title">Terms of Service</h1>
        <p class="sub-title">Effective date: October 01, 2019</p>
        <p class="paragraph">
            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service
            and the choices you have associated with that data.
        </p>
        <p class="paragraph">
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in
            accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same
            meanings as in our Terms and Conditions, accessible from http://www.nem.io/
        </p>
        <h2 class="second-sub-title">Information Collection And Use</h2>
        <p class="paragraph">
            We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>
        <h4 class="third-sub-title">Usage Data</h4>
        <p class="paragraph">
            We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information
            such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service
            that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic
            data.
        </p>
        <h4 class="third-sub-title">Tracking &amp; Cookies Data</h4>
        <p class="paragraph">
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
        </p>
        <p class="paragraph">
            Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser
            from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track
            information and to improve and analyze our Service.
        </p>
        <p class="paragraph">Examples of Cookies we use:</p>
        <ul class="un-list">
            <li class="list-item"><b>Session Cookies.</b> We use Session Cookies to operate our Service.</li>
            <li class="list-item">
                <b>Preference Cookies.</b> We use Preference Cookies to remember your preferences and various settings.
            </li>
            <li class="list-item"><b>Security Cookies.</b> We use Security Cookies for security purposes.</li>
        </ul>
        <h2 class="second-sub-title">Changes To This Privacy Policy</h2>
        <p class="paragraph">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this
            page.
        </p>
        <p class="paragraph">
            We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update
            update the "effective date" at the top of this Privacy Policy.
        </p>
        <p class="paragraph">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when
            they are posted on this page.
        </p>
        <h2 class="second-sub-title">Contact Us</h2>
        <p class="paragraph">If you have any questions about this Privacy Policy, please contact us:</p>
        <ul class="un-list">
            <li class="list-item"><b>By email:</b> contact@nem.io</li>
        </ul>
        <button class="link" @click="backToLogin">{{ $t('back') }}</button>
    </div>
</template>
<script>
import TermsAndConditionsTs from './TermsAndConditionsTs';
export default class TermsAndConditions extends TermsAndConditionsTs {}
</script>

<style lang="less" scoped>
@import './TermsAndConditions.less';
</style>
