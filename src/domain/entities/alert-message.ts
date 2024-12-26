import Entity from "@/core/intities/entity";
import { Optional } from "@/core/types/optional";

export interface AlertMessageProps {
    createdAt: Date,
    title: string,
    message: string,
    alertReceived: Date | null,
}

export default class AlertMessage extends Entity<AlertMessageProps> {

    static create(props: Optional<AlertMessageProps, 'createdAt' | 'alertReceived'>, id?: string) {
        return new AlertMessage(
            {
            ...props,
            createdAt: new Date(),    
            alertReceived: null,        
            },
            id
        )
    }

    get id() {
        return this._id
    }

    get createdAt() {
        return this.props.createdAt
    }

    get title() {
        return this.props.title
    }

    get message() {
        return this.props.message
    }

    get alertReceived() {
        return this.props.alertReceived
    }

    receiveAlert() {
        if (!this.alertReceived) {
            this.props.alertReceived = new Date()
        } else {
            throw new Error('this alert has already been received')
        }
    }

}