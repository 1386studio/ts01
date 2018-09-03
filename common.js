const axios = require('axios');
const api = {
    async get (url, data, onEnd) {
        try {
            const response = await axios.get(url);
            return response.data;
          } catch (error) {
            console.error(error);
          }
    }
  }
  module.exports = api;