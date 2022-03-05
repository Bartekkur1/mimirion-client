const request = require('../../src/request');
const { createSandbox, assert } = require('sinon');
const axios = require('axios');

describe('Request', () => {

    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const stubEnvVar = () => {
        sandbox.stub(process, 'env').value({
            MIMIRION_URL: 123,
            MIMIRION_ACCESS_KEY: 'key'
        });
    };

    test('Should throw error in case of missing env variable', async () => {
        await expect(request.fetchConfiguration()).rejects.toThrow(`Missing mimirion-client configuration! MIMIRION_URL`);
        sandbox.stub(process, 'env').value({
            MIMIRION_URL: 123
        });
        await expect(request.fetchConfiguration()).rejects.toThrow(`Missing mimirion-client configuration! MIMIRION_ACCESS_KEY`);
    });

    test('Should call axios get method', async () => {
        const expectedConfiguration = {
            test: 123
        };
        const axiosStub = sandbox.stub(axios, 'get').resolves({
            data: expectedConfiguration
        });
        stubEnvVar();
        const config = await request.fetchConfiguration();
        expect(config).toBe(expectedConfiguration);
        assert.calledOnce(axiosStub);
    });

    test('Should throw error on request reject', async () => {
        const axiosStub = sandbox.stub(axios, 'get').rejects();
        stubEnvVar();
        await expect(request.fetchConfiguration).rejects.toThrow('Configuration request rejected!');
        assert.calledOnce(axiosStub);
    });

    test('Should throw error when response doesnt not contain data', async () => {
        const axiosStub = sandbox.stub(axios, 'get').resolves({});
        stubEnvVar();
        await expect(request.fetchConfiguration).rejects.toThrow('Error! Configuration response missing data!');
        assert.calledOnce(axiosStub);
    });

    test('Should fail to request invalid address', async () => {
        stubEnvVar();
        await expect(request.fetchConfiguration).rejects.toThrow('Configuration request rejected!');
    });
});