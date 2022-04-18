import axios from 'axios';

//https://dfl-detector-de-focos-de-lixo.herokuapp.com/
//http://192.168.1.102:4000

export const api = axios.create({
    baseURL: 'https://dfl-detector-de-focos-de-lixo.herokuapp.com/',
    timeout: 15 * 1000,
    timeoutErrorMessage: 'Timeout error',
});