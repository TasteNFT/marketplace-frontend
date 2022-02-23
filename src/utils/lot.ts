import { originalToken as originalTokenAPI, user as userAPI } from './api/index'

export async function sendFiles(id: string, file: File) {
    await originalTokenAPI.upload(id, file)
}

export async function removeToken(id: string) {
    const yes = window.confirm('Are you really sure that you want to proceed?')
    if (!yes) return Promise.reject()
    await originalTokenAPI.delete(id)
}
export async function hideToken(id: string) {
    const yes = window.confirm(
        'This NFT will be hidden forever. You will not be able to restore it. Are you really sure that you want to proceed?'
    )
    if (!yes) return Promise.reject()
    await userAPI.tokenOriginal.hidden.create(id)
}
