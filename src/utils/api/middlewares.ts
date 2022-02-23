import Axios from 'axios'
import { IAuthResponse, TRes } from '../../types/api'
import { getLoginDate, getRefreshToken } from '../localStorage'
import { differenceHours } from '../moment'
import { standart } from './config'

const axios = Axios.create(standart)

export function request_RefreshToken(): TRes<IAuthResponse> | undefined {
    const refreshToken = getRefreshToken()

    if (differenceHours(getLoginDate()) >= 1 && refreshToken) {
        return axios.post('/refresh_token', { refreshToken })
    }
}
