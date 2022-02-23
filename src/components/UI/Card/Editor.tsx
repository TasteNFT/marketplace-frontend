import { useMemo, useState } from 'react'
import { ICard } from '../../../types/card'
import { EMediaType } from '../../../types/lot'
import { originalToken as originalTokenAPI } from '../../../utils/api/index'
import { sendFiles } from '../../../utils/lot'
import { errors, notifications } from '../../../utils/notification'
import { File } from '../File'
import { InputWithState } from '../../UI/Input'
import { Checkbox } from '../../UI/Checkbox'
import { Counter } from '../../UI/Counter'
import { useDispatch } from 'react-redux'
import { action_setLoading } from '../../../store/actions/popup'
import { useValidateHelper } from '../../../hooks/useValidate'
import { useContext } from 'react'
import { EventContext } from '../../../ctx/event'
import { Button } from '../Buttons'
import { ISelectOption, Select } from '../Select'
import { PopupSubmit } from '../../../hoc/Popup'
import { ImportedMetaData } from '../../../types/app'
// import { MetamaskMethods } from '../../../utils/wallet/metamask/provider'

interface IPropsLotEditor {
    card?: ICard
    imported?: ImportedMetaData
}

export function Editor({ card, imported }: IPropsLotEditor) {
    const [name, setName] = useState(card?.name || imported?.name || '')
    const [description, setDescription] = useState(
        card?.description || imported?.description || ''
    )
    const [copiesTotal, setCopiesTotal] = useState(card?.copiesTotal || 1)
    const [censored, setCensored] = useState(false)
    const [commercial, setCommercial] = useState(false)
    const [showErrors, setShowErrors] = useState(false)
    const [step, setStep] = useState(imported ? 2 : 1)
    const dispatch = useDispatch()
    const { onEditorCreated, onEditorErrorSendFile, onImportedToken } =
        useContext(EventContext)
    const [file, setFile] = useState<File>()

    const percentOptions: ISelectOption[] = useMemo(() => {
        return [
            { label: '0%', value: 0 },
            { label: '5%', value: 5 },
            { label: '10%', value: 10 },
            { label: '15%', value: 15 },
        ]
    }, [])
    const [percent, setPercent] = useState(
        percentOptions.find((o) => o.value === 10)
    )

    const nameError = useValidateHelper(
        'Artwork name is required',
        !!name.length
    )
    const descriptionError = useValidateHelper(
        'Artwork description is required',
        !!description.length
    )

    function nextStep() {
        setStep(step + 1)
    }

    async function sendData() {
        if (nameError || descriptionError) {
            errors.fillRequireFields()
            setShowErrors(true)
            return
        }

        dispatch(action_setLoading(true))
        try {
            if (imported) {
                // const { approveNFT } = await MetamaskMethods()
                // const contract = importContractStorage.get()
                if (!imported.image || !imported.id) return Promise.reject('')
                // await approveNFT(imported.id, contract)

                const { data } = await originalTokenAPI.import({
                    name,
                    description,
                    copiesTotal,
                    isUseCensored: censored,
                    isCommercial: commercial,
                    creatorReward: (percent?.value || 10) as 0 | 5 | 10 | 15,
                    contract: imported.contract,
                    tokenId: imported.id,
                    image: imported.image,
                })
                dispatch(action_setLoading(false))
                if (onImportedToken) onImportedToken(imported)
                if (onEditorCreated) onEditorCreated(data)
                notifications.NFTSendToModeration()
                return
            }

            if (!file) {
                errors.pickTheFile()
                throw new Error('File is undefined')
            }

            const contentType = (() => {
                if (file.type.match(/video/)) return EMediaType.VIDEO
                else if (file.type.match(/image/)) return EMediaType.IMAGE
                else return EMediaType.AUDIO
            })()

            const toServer = {
                name,
                description,
                copiesTotal,
                isUseCensored: censored,
                contentType,
                isCommercial: commercial,
                creatorReward: (percent?.value || 10) as 0 | 5 | 10 | 15,
            }

            const { data } = card?.id
                ? await originalTokenAPI.update(card.id, toServer)
                : await originalTokenAPI.create(toServer)

            await sendFiles(data.id, file).catch((e) => {
                if (onEditorErrorSendFile) onEditorErrorSendFile(data)

                errors.sendFile()
                return Promise.reject(e)
            })
            await originalTokenAPI.complete(data.id)
            notifications.NFTSendToModeration()
            if (onEditorCreated) onEditorCreated(data)
        } catch (e) {
            console.error(e)
        }

        dispatch(action_setLoading(false))
    }

    // useEffect(() => {
    //     // if (!imported || !imported.image) return
    //     // const initFile = async () => {
    //     //     const gotFile = await FileHelper.getFileFromUrl(imported.image!)
    //     //     console.log('adfsdfsf');
    //     //     setFile(gotFile)
    //     // }
    //     // initFile()
    // }, [imported])

    return (
        <div className="popup__tokeneditor">
            {card?.moderatorMessage ? (
                <div className="popup__exception">{card?.moderatorMessage}</div>
            ) : null}
            {!imported && (
                <div className="popup-progress">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`popup-progress__item ${
                                step >= s ? 'popup-progress__item-active' : ''
                            }`}
                            onClick={() => setStep(s)}
                        ></div>
                    ))}
                </div>
            )}
            <div className="popup__step">Step {step} from 2</div>
            {step === 1 ? (
                <>
                    <File
                        state={[file, setFile]}
                        accept={[
                            '.jpg',
                            '.png',
                            '.mp4',
                            '.jpeg',
                            '.aac',
                            '.mp3',
                            'wav',
                        ]}
                        minHeight={200}
                        minWidth={200}
                        maxSize={100}
                        title="Upload the artwork you will be selling"
                    ></File>
                    <PopupSubmit>
                        <Button onClick={nextStep} size="large">
                            Next step
                        </Button>
                    </PopupSubmit>
                </>
            ) : null}
            {step === 2 ? (
                <>
                    <InputWithState
                        state={[name, setName]}
                        title="Artwork name"
                        errorMessage={showErrors ? nameError : ''}
                    ></InputWithState>
                    <InputWithState
                        state={[description, setDescription]}
                        title="Description"
                        textarea
                        errorMessage={showErrors ? descriptionError : ''}
                    ></InputWithState>
                    <Select
                        options={percentOptions}
                        onChange={setPercent}
                        title="Constant royalties amount"
                    ></Select>
                    <Checkbox
                        state={[censored, setCensored]}
                        title="Censored"
                    ></Checkbox>
                    <Checkbox
                        state={[commercial, setCommercial]}
                        title="This NFT comes with commercial rights"
                    ></Checkbox>
                    <Counter
                        state={[copiesTotal, setCopiesTotal]}
                        title="Copies"
                        min={1}
                        max={10}
                    ></Counter>
                    <PopupSubmit>
                        <Button size="large" onClick={sendData}>
                            Create
                        </Button>
                    </PopupSubmit>
                </>
            ) : null}
        </div>
    )
}
