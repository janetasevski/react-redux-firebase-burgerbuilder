import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://xxx/'
});

export default instance;