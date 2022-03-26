import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.1.103:5000/',
    timeout: 15 * 1000,
    timeoutErrorMessage: 'Timeout error',
});