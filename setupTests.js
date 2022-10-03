import Vue from 'vue';

console.log('Setting up global test stubs...');
document.createRange = () => ({
    setStart: () => {
        return;
    },
    setEnd: () => {
        return;
    },
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    },
});

// eslint-disable-next-line no-undef
Vue.$toast = jest.fn();
