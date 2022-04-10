import axios from 'axios';

//https://dfl-detector-de-focos-de-lixo.herokuapp.com/

export const api = axios.create({
    baseURL: 'http://192.168.1.102:4000',
    timeout: 15 * 1000,
    timeoutErrorMessage: 'Timeout error',
});