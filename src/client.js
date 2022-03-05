const objectPath = require('object-path');
const request = require('./request');

module.exports = {
    configuration: undefined,
    init: async function () {
        this.configuration = await request.fetchConfiguration();
    },
    get: function (path) {
        if (this.configuration === undefined) {
            throw new Error('Mimirion-client not initialized, call init function first!');
        }
        return objectPath.get(this.configuration, path);
    }
}