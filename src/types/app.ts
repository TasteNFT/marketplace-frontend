import React from 'react'

export type ImportedMetaData = {
    contract: string
    id?: string
    name?: string
    description?: string
    image?: string
}

export type SavedContracts = {
    tag?: string
    contract?: string
}

export type State<T> = [T, React.Dispatch<React.SetStateAction<T>>]
