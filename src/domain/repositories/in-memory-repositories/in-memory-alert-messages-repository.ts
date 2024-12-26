import AlertMessage from "@/domain/entities/alert-message";
import AlertMessagesRepository from "../alert-messages-repository";

export default class InMemoryAlertMessagesRepository implements AlertMessagesRepository {

    alertMessages:AlertMessage[] = []
    
    async create(alertMessage: AlertMessage): Promise<{ alertMessage: AlertMessage; }> {
        this.alertMessages.push(alertMessage)

        return { alertMessage }
    }
    
    async updateUnique(id: string, data: AlertMessage): Promise<{ alertMessage: AlertMessage; }> {
        const index = this.alertMessages.findIndex(item => item.id.value === id)
        const alertMessage = this.alertMessages[index]
        
        if (!alertMessage) throw new Error("inexistent alert message");    
        
        this.alertMessages[index] = data
        
        
        return { alertMessage }
    }

    

}