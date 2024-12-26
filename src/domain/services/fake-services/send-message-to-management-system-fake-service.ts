import SendMessageToManagementSystemService from "../send-message-to-management-system-service"

export default class SendMessageToManagementSystemFakeService extends SendMessageToManagementSystemService {

    constructor(title?: string, body?: string) {
        super(title, body)
    }


    async send() {

        return true
    }

    get data() {
        return {
            title: this.title,
            body: this.body,
        }
    }

    setTitle(text: string) {
        this.title = text
        return this
    }

    setBody(text: string) {
        this.body = text
        return this
    }

}