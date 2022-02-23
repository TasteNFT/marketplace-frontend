import { ParamsBasic } from '../../types/api'

export interface AuthLots extends ParamsBasic {
    sortBy?: 'id' | 'name' | 'updatedAt' | 'createdAt'

    // filters:
    name?: string
    categoryId?: string // bigint
}
