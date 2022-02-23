import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { EventContext } from '../ctx/event'
import { Popup, PopupSubmit } from '../hoc/Popup'
import { useRedirect } from '../hooks/useRedirect'
import { useTypedSelector } from '../hooks/useTypedSelector'
import {
    actionLocalStorageContractsAdd,
    actionLocalStorageContractsRemove,
} from '../store/actions/localStorage'
import { ImportedMetaData, SavedContracts, State } from '../types/app'
import { auth as authAPI } from '../utils/api'
import { errors } from '../utils/notification'
import { createConfigWithEnvType } from '../utils/wallet/metamask/methods'
import { MetamaskMethods } from '../utils/wallet/metamask/provider'
import { Empty } from './Empty'
import { PaginationLoader } from './Loader'
import { Button } from './UI/Buttons'
import { Editor } from './UI/Card/Editor'
import { InputWithState } from './UI/Input'
import { ISelectOption, Select } from './UI/Select'

export const ImportedCardsWrapper: FC = () => {
    const imported = useTypedSelector((s) => s.localStorage.importedContract)
    const [importedTokens, setImportedTokens] =
        useState<{ [contract: string]: string[] }>()

    const getImportedData = useCallback(() => {
        authAPI
            .importedOriginalTokens()
            .then((res) => setImportedTokens(res.data))
    }, [])

    useEffect(() => {
        getImportedData()
    }, [getImportedData])
    return (
        <EventContext.Provider value={{ onImportedToken: getImportedData }}>
            {!!importedTokens &&
                imported?.map((i, index) => (
                    <ImportedCards
                        importedTokens={importedTokens}
                        savedContracts={i}
                        key={i.tag || index}
                    ></ImportedCards>
                ))}
        </EventContext.Provider>
    )
}

export const ImportedCards: FC<{
    savedContracts: SavedContracts
    importedTokens: { [contract: string]: string[] | null }
}> = ({ savedContracts, importedTokens }) => {
    const [imported, setImported] = useState<ImportedMetaData[]>([])
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        const { contract } = savedContracts
        if (!contract) return

        const start = async () => {
            setLoading(true)
            try {
                const { getOwnedItems } = await MetamaskMethods()
                const owned = await getOwnedItems(contract, 1)

                setImported(
                    owned.filter((o) => {
                        const tokens = importedTokens[o.contract] || []
                        return tokens.indexOf(o.id || '') < 0
                    })
                )
            } catch (error) {}
            setLoading(false)
        }
        start()
    }, [savedContracts, importedTokens])

    function removeContract() {
        if (!savedContracts.tag) return
        dispatch(actionLocalStorageContractsRemove(savedContracts.tag))
    }

    return (
        <div className="import-token">
            <div className="import-token-header">
                <div className="import-token-header__title">
                    {savedContracts.tag || ''}
                </div>
                <div className="import-token-header__line"></div>
                <Button size="large" onClick={() => removeContract()}>
                    Delete
                </Button>
            </div>
            {loading ? (
                <PaginationLoader></PaginationLoader>
            ) : (
                <div className="import-token__items">
                    {imported.length ? (
                        imported.map((i, index) => (
                            <ImportedCard
                                imported={i}
                                key={index}
                            ></ImportedCard>
                        ))
                    ) : (
                        <Empty></Empty>
                    )}
                </div>
            )}
        </div>
    )
}

export const ImportedFile: FC<{ imported: ImportedMetaData }> = ({
    imported,
}) => {
    if (!imported.image) return <></>
    return <img src={imported.image} alt="alt" />
}

export const ImportedCard: FC<{ imported: ImportedMetaData }> = ({
    imported,
}) => {
    const [showEditor, setShowEditor] = useState(false)

    return (
        <>
            <div
                className="import-token__item"
                onClick={() => setShowEditor(true)}
            >
                <div className="import-token__image">
                    <ImportedFile imported={imported}></ImportedFile>
                </div>
                <div className="import-token__title">{imported.name || ''}</div>
            </div>
            <Popup showState={[showEditor, setShowEditor]} title="Edit NFT">
                <Editor imported={imported}></Editor>
            </Popup>
        </>
    )
}

export const ImportPopup: FC<{
    showState: State<boolean>
}> = ({ showState }) => {
    const [importer, setImporter] = showState
    const [contract, setContract] = useState('')
    const [tag, setTag] = useState('')
    const redirect = useRedirect()
    const dispatch = useDispatch()

    const options: ISelectOption[] = useMemo(
        () => [
            {
                label: 'Bakeryswap',
                value: '0x5bc94e9347f3b9be8415bdfd24af16666704e44f',
            },
            {
                label: 'Enter.art',
                value: '0x8f943aa9df1f6bf333497ee8a01d06314ea3af55',
            },
            {
                label: 'Naftyart',
                value: '0xb751841b27ef085e1a92b10fe3976b4a7904e176',
            },
            {
                label: 'Treasureland',
                value: '0xe85d7b8f4c0c13806e158a1c9d7dcb33140cdc46',
            },
            {
                label: 'Binance NFT',
                value: '0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec',
            },
            {
                label: 'Refinable',
                value: '0x43db8ea81074b31cf2665b600a4086cf36b59445',
            },
            {
                label: 'Nafter',
                value: '0x8db570d5c156097b6c22cf6ba9eaa076e6ae4f08',
            },
        ],
        []
    )

    // const [optOrig, setOptOrig] = useState(_.head(options))

    function setOptOrig(e: ISelectOption | undefined) {
        setContract(e?.value.toString() || '')
    }

    const opt = useMemo(
        () => options.find((o) => o.value === contract),
        [contract, options]
    )

    const disabled = useMemo(() => {
        return createConfigWithEnvType().main.addresses.factory === contract
    }, [contract])

    useEffect(() => {
        setTag(opt?.label || '')
    }, [opt])

    async function importToken() {
        if (!tag.length || !contract.length) {
            errors.fillRequireFields()
            return
        }
        dispatch(actionLocalStorageContractsAdd({ tag, contract }))
        setImporter(false)
        redirect.toProfile({ thirdPartyNFT: true })
    }

    return (
        <Popup
            showState={[importer, setImporter]}
            title="Import NFT from contract"
        >
            <InputWithState
                state={[tag, setTag]}
                title="Enter the desired tag:"
            ></InputWithState>
            <InputWithState
                state={[contract, setContract]}
                title="Enter the desired BSC NFT contract address:"
            ></InputWithState>
            <Select
                unknownValue="Select..."
                options={options}
                onChange={setOptOrig}
                title="...or select predefined marketplace from this list"
            ></Select>
            <PopupSubmit>
                <Button size="large" onClick={importToken} disabled={disabled}>
                    Import
                </Button>
            </PopupSubmit>
        </Popup>
    )
}
