import { store } from '../../store'
import { action_setAuth } from '../../store/actions/auth'
import { metamask as metamaskAPI } from '../api'

export async function auth(
    address: string,
    networkVersion: string,
    signMessage: (msg: string) => Promise<string>
) {
    const lowerAddress = address.toLowerCase()
    const {
        data: { metamaskMessage, isSign },
    } = await metamaskAPI.message(lowerAddress)

    const signature = await signMessage(metamaskMessage)
    if (isSign) {
        return await metamaskAPI
            .login(lowerAddress, signature, networkVersion)
            .then(({ data }) => {
                store.dispatch<any>(action_setAuth(data.user))
                return data.user
            })
    }
    return await metamaskAPI
        .register(lowerAddress, signature, networkVersion, metamaskMessage)
        .then(({ data }) => {
            store.dispatch<any>(action_setAuth(data.user))
            return data.user
        })
}

export async function approveTokens() {}
