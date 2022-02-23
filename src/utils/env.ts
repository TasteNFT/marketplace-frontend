import { ContractVersion } from './modules/contract/types'

export const isProd = process.env.REACT_APP_CONTRACT_TYPE === 'prod'
export const envContranctVer = +(
    process.env.REACT_APP_CONTRACT_VER || '1'
) as ContractVersion
export const isDebug = process.env.REACT_APP_DEBUG_FUNCTIONS === 'true'
