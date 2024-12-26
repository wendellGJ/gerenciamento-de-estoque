

export interface SendEmailServiceProps {
    to: string[],
    title: string,
    body: string,
}

export default abstract class SendEmailService {

    protected to: string[]
    protected title: string
    protected body: string

    constructor(to?: string[], title?: string, body?: string) {
        this.to = to ?? []
        this.title = title ?? ''
        this.body = body ?? ''
    }


    abstract send(): Promise<boolean>
    abstract get data():{ to:string[], title: string, body: string, }

    abstract setTitle(text: string):SendEmailService
    abstract setTo(text: string[]):SendEmailService
    abstract setBody(text: string):SendEmailService

}