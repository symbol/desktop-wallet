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
