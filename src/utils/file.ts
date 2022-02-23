import axios from 'axios'
import _ from 'lodash'

export const FileHelper = {
    getBase64(file: File): Promise<string> {
        const reader = new FileReader()

        return new Promise((res, rej) => {
            reader.readAsDataURL(file)
            reader.onload = () => {
                res(reader.result as string)
            }
            reader.onerror = (e) => {
                rej(e)
            }
        })
    },
    getFileFromUrl(src: string) {
        return axios(src, { responseType: 'arraybuffer' }).then(function (res) {
            return new File([res.data], _.random(100000).toString(), {
                type: res.headers['content-type'],
            })
        })
    },
}
