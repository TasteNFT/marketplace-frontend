import { AxiosRequestConfig } from 'axios'
import { getJWT } from '../localStorage'

export const standart: AxiosRequestConfig = {
    baseURL: '/api',
    headers: {
        Authorization: `Bearer ${getJWT()}`,
    },
}
