import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://dfl-detector-de-focos-de-lixo.herokuapp.com/',
    timeout: 15 * 1000,
    timeoutErrorMessage: 'Timeout error',
});