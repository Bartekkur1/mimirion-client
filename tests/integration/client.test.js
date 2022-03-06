const client = require('../../index');
const { createSandbox } = require('sinon');
const axios = require('axios');

const createStore = async (name) => {
    const result = await axios.put(process.env.MIMIRION_URL + `/store/${name}`);
    return result.data;
};

const createConfig = async (config) => {
    return axios.put(process.env.MIMIRION_URL + '/config', config, {
        headers: {
            'x-access-key': process.env.MIMIRION_ACCESS_KEY
        }
    });
};

const publishConfig = async (version) => {
    return axios.patch(process.env.MIMIRION_URL + `/config/publish/${version}`, {}, {
        headers: {
            'x-access-key': process.env.MIMIRION_ACCESS_KEY
        }
    });
};

describe('Mimirion-client integration', () => {

    const sandbox = createSandbox();
    let keys = undefined;

    afterEach(() => {
        sandbox.restore();
    });

    const stubEnvVar = (url = 123, key = 'key') => {
        sandbox.stub(process, 'env').value({
            MIMIRION_URL: url,
            MIMIRION_ACCESS_KEY: key
        });
    };

    it('Should fail to fetch config with invalid accesskey', async () => {
        stubEnvVar();
        await expect(client.init()).rejects.toThrow('Error! Configuration request rejected!');
    });

    it('Should fail to fetch not published config', async () => {
        stubEnvVar('http://localhost:8123');

        const result = await createStore('test123');
        const { accessKey, restoreKey } = result;

        this.keys = {
            accessKey, restoreKey
        };

        expect(accessKey).not.toBeUndefined();
        expect(restoreKey).not.toBeUndefined();
        expect(typeof accessKey).toBe('string');
        expect(typeof restoreKey).toBe('string');
    });

    it('Should fetch published configuration', async () => {
        stubEnvVar('http://localhost:8123', this.keys.accessKey);
        const expectedConfig = {
            test: 123
        };

        const createConfigRes = await createConfig(expectedConfig);
        expect(createConfigRes.status).toBe(200);
        const publishConfigRes = await publishConfig(1);
        expect(publishConfigRes.status).toBe(200);

        await client.init();
        expect(client.configuration).toStrictEqual(expectedConfig);
    });

});