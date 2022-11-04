import Vue from 'vue';
import { TextEncoder, TextDecoder } from 'util';

console.log('Setting up global test stubs...');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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
URL.createObjectURL = jest.fn();
