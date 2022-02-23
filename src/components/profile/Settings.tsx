import { useTypedSelector } from '../../hooks/useTypedSelector'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { auth as authAPI } from '../../utils/api/index'
import { useDispatch } from 'react-redux'
import { action_authFetch } from '../../store/actions/auth'
import { File } from '../UI/File'
import { Input } from '../UI/Input'
import { img } from '../../assets/assets'
import {
    useValidateHelper,
    useValidate,
    useValidateHasMistake,
} from '../../hooks/useValidate'
import { errors } from '../../utils/notification'
import { getUserAvatar } from '../../utils/methods'
import { Margin } from '../../hoc/Margin'
import { Button } from '../UI/Buttons'
import { PopupHalf, PopupHalfItem, PopupSubmit } from '../../hoc/Popup'
import { useFileChanger } from '../../hooks/useFileChander'
import { action_setLoading } from '../../store/actions/popup'

const initialInstagram = 'https://instagram.com/'
const initialOnlyFans = 'https://onlyfans.com/'
const initialTwitter = 'https://twitter.com/'
const initialTwitch = 'https://twitch.tv/'

export const Settings = ({ onUpdate }: { onUpdate?: () => void }) => {
    const auth = useTypedSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [authState, setAuthState] = useState(auth)
    const [showErrors, setShowErrors] = useState(false)

    const avatar = useFileChanger(auth.avatar, getUserAvatar(auth.avatar))
    const background = useFileChanger(
        auth.background,
        getUserAvatar(auth.background)
    )

    const validate = useValidate()
    const validateHasMistake = useValidateHasMistake()

    function inputHundler(e: React.ChangeEvent<HTMLInputElement>) {
        const obj = { [e.target.name]: e.target.value }
        setAuthState({
            ...authState,
            ...obj,
        })
    }

    const initSocial = useCallback(async () => {
        setAuthState((oldAuthState) => ({
            ...oldAuthState,
            socialInstagram: !oldAuthState.socialInstagram
                ? initialInstagram
                : oldAuthState.socialInstagram,
            socialOnlyfans: !oldAuthState.socialOnlyfans
                ? initialOnlyFans
                : oldAuthState.socialOnlyfans,
            socialTwitch: !oldAuthState.socialTwitch
                ? initialTwitch
                : oldAuthState.socialTwitch,
            socialTwitter: !oldAuthState.socialTwitter
                ? initialTwitter
                : oldAuthState.socialTwitter,
        }))
    }, [])

    useEffect(() => {
        // initFile()
        initSocial()
    }, [initSocial])

    const errorEmail = useValidateHelper(
        'Email field has errors',
        validate.isEmail(authState.email || '')
    )
    const errorMetaName = useValidateHelper(
        'This field is required',
        !!authState.metaName?.length
    )
    const errorInstagram = useValidateHelper(
        "This field is't a ",
        validate.url.isInstagram(authState.socialInstagram)
    )
    const errorOnlyfans = useValidateHelper(
        "This field is't a ",
        validate.url.isOnlyfans(authState.socialOnlyfans)
    )
    const errorTwitch = useValidateHelper(
        "This field is't a ",
        validate.url.isTwitch(authState.socialTwitch)
    )
    const errorTwitter = useValidateHelper(
        "This field is't a ",
        validate.url.isTwitter(authState.socialTwitter)
    )

    async function updateUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (
            validateHasMistake([
                errorEmail,
                errorMetaName,
                errorInstagram,
                errorOnlyfans,
                errorTwitch,
                errorTwitter,
            ])
        ) {
            errors.fieldsHaveErrors()
            setShowErrors(true)
            return
        }
        dispatch(action_setLoading(true))

        try {
            if (avatar.changed) {
                avatar.file
                    ? await authAPI.updateAvatar(avatar.file)
                    : await authAPI.deleteAvatar()
            }
            if (background.changed) {
                background.file
                    ? await authAPI.updateBackground(background.file)
                    : await authAPI.deleteBackground()
            }
            await authAPI.update({
                name: authState.name,
                metaName: authState.metaName,
                description: authState.description,
                email: authState.email,
                socialInstagram:
                    authState.socialInstagram === initialInstagram
                        ? ''
                        : authState.socialInstagram,
                socialOnlyfans:
                    authState.socialOnlyfans === initialOnlyFans
                        ? ''
                        : authState.socialOnlyfans,
                socialTwitch:
                    authState.socialTwitch === initialTwitch
                        ? ''
                        : authState.socialTwitch,
                socialTwitter:
                    authState.socialTwitter === initialTwitter
                        ? ''
                        : authState.socialTwitter,
            })
            dispatch(action_authFetch())
            if (onUpdate) {
                onUpdate()
            }
        } catch (error) {
            console.error(error)
        }
        dispatch(action_setLoading(false))
    }

    return (
        <form onSubmit={updateUser}>
            <PopupHalf>
                <PopupHalfItem>
                    <Input
                        name="name"
                        title="Name"
                        // errorMessage={errorName}
                        value={authState.name}
                        onChange={inputHundler}
                    ></Input>
                </PopupHalfItem>
                <PopupHalfItem>
                    <Input
                        icon={<i className="fas fa-at"></i>}
                        errorMessage={showErrors ? errorMetaName : ''}
                        title="Username"
                        name="metaName"
                        value={authState.metaName || ''}
                        onChange={inputHundler}
                    ></Input>
                </PopupHalfItem>
            </PopupHalf>
            <PopupHalf>
                <PopupHalfItem>
                    <Input
                        title="Email"
                        name="email"
                        errorMessage={showErrors ? errorEmail : ''}
                        value={authState.email || ''}
                        onChange={inputHundler}
                    ></Input>
                </PopupHalfItem>
                <PopupHalfItem>
                    <div className="popup__text popup__text-grey popup__text-little">
                        Add your email address to receive notifications about
                        your activity on TasteNFT. This will not be shown on
                        your profile.
                    </div>
                </PopupHalfItem>
            </PopupHalf>
            <Margin margin={{ top: 20 }}>
                <PopupHalf>
                    <PopupHalfItem>
                        {avatar.show ? (
                            <File
                                name="Profile image"
                                accept={['.jpg', '.png', '.jpeg']}
                                minHeight={10}
                                minWidth={10}
                                maxSize={15}
                                state={[avatar.file, avatar.setFile]}
                                onFile={() => avatar.setChanged(true)}
                            ></File>
                        ) : null}
                    </PopupHalfItem>
                    <PopupHalfItem>
                        {avatar.show ? (
                            <File
                                name="Profile cover"
                                accept={['.jpg', '.png', '.jpeg']}
                                minHeight={10}
                                minWidth={10}
                                maxSize={15}
                                state={[background.file, background.setFile]}
                                onFile={() => background.setChanged(true)}
                            ></File>
                        ) : null}
                    </PopupHalfItem>
                </PopupHalf>
            </Margin>

            <Margin margin={{ top: 20 }}>
                <Input
                    textarea={true}
                    title="BIO"
                    name="description"
                    value={authState.description || ''}
                    onChange={inputHundler}
                ></Input>
            </Margin>
            <Margin margin={{ top: 10 }}>
                <Input
                    title="Contacts"
                    iconTitle="Twitch"
                    name="socialTwitch"
                    icon={<img src={img.twitch} alt="" />}
                    value={authState.socialTwitch}
                    onChange={inputHundler}
                    errorMessage={showErrors ? errorTwitch : ''}
                ></Input>
            </Margin>
            <Margin margin={{ top: 10 }}>
                <Input
                    iconTitle="Instagram"
                    name="socialInstagram"
                    icon={<img src={img.instagram} alt="" />}
                    value={authState.socialInstagram}
                    errorMessage={showErrors ? errorInstagram : ''}
                    onChange={inputHundler}
                ></Input>
            </Margin>
            <Margin margin={{ top: 10 }}>
                <Input
                    iconTitle="Twitter"
                    name="socialTwitter"
                    icon={<img src={img.twitter} alt="" />}
                    value={authState.socialTwitter}
                    onChange={inputHundler}
                    errorMessage={showErrors ? errorTwitter : ''}
                ></Input>
            </Margin>
            <Margin margin={{ top: 10 }}>
                <Input
                    iconTitle="Onlyfans"
                    name="socialOnlyfans"
                    icon={<img src={img.onlyfans} alt="" />}
                    value={authState.socialOnlyfans}
                    onChange={inputHundler}
                    errorMessage={showErrors ? errorOnlyfans : ''}
                ></Input>
            </Margin>
            <PopupSubmit>
                <Button type="submit" size="large">
                    Save changes
                </Button>
            </PopupSubmit>
        </form>
    )
}
