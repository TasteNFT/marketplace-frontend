import { logout } from '../auth'

// async function reAuth() {
//     await logout()
//     await loginAsMetamask()
// }

export const init = (function () {
    let inited = 0

    return () => {
        if (inited || !window.ethereum) {
            return
        }
        // console.log('inited')

        inited = 1
        window.ethereum.on('accountsChanged', logout)
        window.ethereum.on('chainChanged', logout)
    }
})()
