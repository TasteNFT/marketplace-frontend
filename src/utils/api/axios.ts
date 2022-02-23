import Axios from 'axios'
import { IAuthResponse } from '../../types/api'
import { removeAuth, setAuth } from '../localStorage'
import { standart } from './config'
import { errorHandler } from './errors'
import { request_RefreshToken } from './middlewares'

const axios = Axios.create(standart)

export const post = axios.post
export const get = axios.get
export const del = axios.delete

export const setToken = (data: IAuthResponse): void => {
    axios.defaults.headers['Authorization'] = `Bearer ${data.token}`
    setAuth(data)
}

axios.interceptors.request.use(
    async (req) => {
        await request_RefreshToken()
            ?.then(({ data }) => {
                setToken(data)
                req.headers['Authorization'] = `Bearer ${data.token}`
            })
            .catch(() => {
                removeAuth()
            })
        return req
    },
    function (error) {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        errorHandler(error)
        return Promise.reject(error)
    }
)
