import SendEmailService from "../send-email-service"


export default class SendEmailFakeService extends SendEmailService {

    constructor(to?: string[], title?: string, body?: string) {
        super(to, title, body)
    }


    async send() {

        return true
    }

    get data() {
        return {
            to:this.to,
            title: this.title,
            body: this.body,
        }
    }

    setTitle(text: string) {
        this.title = text
        return this
    }

    setTo(text: string[]) {
        this.to = text
        return this
    }

    setBody(text: string) {
        this.body = text
        return this
    }

}