import AlertMessage from "../entities/alert-message";

export default interface AlertMessagesRepository {
    create(alertMessage: AlertMessage): Promise<{ alertMessage: AlertMessage }>,
    updateUnique(id: string, data: AlertMessage): Promise<{ alertMessage: AlertMessage }>,
}