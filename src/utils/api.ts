import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.1.103:4000',
    timeout: 7 * 1000,
    timeoutErrorMessage: 'Timeout error',
});