const axios = require('axios');
const { get } = require('object-path');

const fetchConfiguration = async () => {
    const { MIMIRION_URL, MIMIRION_ACCESS_KEY } = process.env;

    if (MIMIRION_URL === undefined || MIMIRION_ACCESS_KEY === undefined) {
        throw new Error(`Missing mimirion-client configuration! ${MIMIRION_URL === undefined ? 'MIMIRION_URL' : 'MIMIRION_ACCESS_KEY'}`);
    }

    try {
        const { data } = await axios.get(`${MIMIRION_URL}/config`, {
            headers: {
                'x-access-key': MIMIRION_ACCESS_KEY
            }
        }).catch(() => {
            throw new Error('Configuration request rejected!');
        });

        if (data === undefined) {
            throw new Error('Configuration response missing data!');
        }

        return data;
    } catch (err) {
        const message = get(err, 'response.data.error', err.message);
        throw new Error(`Error! ${message}`);
    }
};

module.exports = { fetchConfiguration };