const client = require('../../index');
const request = require('../../src/request');
const { createSandbox, assert } = require('sinon');
const objectPath = require('object-path');

describe('Mimirion-client unit', () => {

    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test('Should export all functions', () => {
        const functions = Object.keys(client);
        expect(functions).toContain(
            'configuration',
            'init',
            'get'
        );
    });

    test('Should fail to get configuration without init', () => {
        expect(() => client.get('test')).toThrow('Mimirion-client not initialized, call init function first!');
    });

    test('Should get configuration property using objectPath', () => {
        const expectedValue = 123;
        sandbox.stub(client, 'configuration').value({});
        const objectPathStub = sandbox.stub(objectPath, 'get').returns(expectedValue);
        const result = client.get('test');
        expect(result).toBe(expectedValue);
        assert.calledOnce(objectPathStub);
    });

    test('Should call fetchConfiguration request method on init', async () => {
        const expectedConfiguration = {
            test: 123
        };
        const requestStub = sandbox.stub(request, 'fetchConfiguration').resolves(expectedConfiguration);

        await client.init();

        assert.calledOnce(requestStub);
        expect(client.configuration).toBe(expectedConfiguration);
        expect(client.get('test')).toBe(123);
    });
});