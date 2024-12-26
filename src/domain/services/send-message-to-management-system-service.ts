

export interface SendMessageToManagementSystemServiceProps {
    title: string,
    body: string,
}

export default abstract class SendMessageToManagementSystemService {

    protected title: string
    protected body: string

    constructor(title?: string, body?: string) {
        this.title = title ?? ''
        this.body = body ?? ''
    }


    abstract send(): Promise<boolean>
    abstract get data():{ title: string, body: string, }

    abstract setTitle(text: string):SendMessageToManagementSystemService
    abstract setBody(text: string):SendMessageToManagementSystemService

}