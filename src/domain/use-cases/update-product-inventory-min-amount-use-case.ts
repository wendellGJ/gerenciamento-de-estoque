import ProductOnLowInventoryEvent, { ProductOnLowInventoryEventTriggerActionProps } from "../events/product-on-low-inventory-event"
import AlertMessagesRepository from "../repositories/alert-messages-repository"
import ProductRepository from "../repositories/products-repository"
import PurchaseOrdersRepository from "../repositories/purchase-orders-repository"
import SendEmailService from "../services/send-email-service"
import SendMessageToManagementSystemService from "../services/send-message-to-management-system-service"


export interface UpdateProductInventoryAmountUseCaseRequest {
    productId: string,
    minAmount: number,
    lowInventoryTriggerAction?:ProductOnLowInventoryEventTriggerActionProps,
}

export default class UpdateProductInventoryMinAmountUseCase {

    constructor(
        protected productRepository: ProductRepository,
        
        protected alertMessagesRepository: AlertMessagesRepository,
        protected sendMessageToManagementSystem: SendMessageToManagementSystemService,
        protected sendEmailService: SendEmailService,
        protected purchaseOrdersRepository: PurchaseOrdersRepository,
    ) {}

    async execute({ productId, minAmount, lowInventoryTriggerAction }: UpdateProductInventoryAmountUseCaseRequest) {        
        const resp = await this.productRepository.getById(productId)

        if (!resp) throw new Error("invalid product");  
        
        const { product } = resp

        let actionsReport = { wasEmailSent:false, wasPurchaseOrderCreated:false, wasSystemAlertSent:false }
        
        const { isOnMinAmount } = product.inventory.updateMinAmount(minAmount)

        const productOnLowInventoryEvent = new ProductOnLowInventoryEvent(
            product,
            this.alertMessagesRepository,
            this.sendMessageToManagementSystem,
            this.sendEmailService,
            this.purchaseOrdersRepository,
        )

        actionsReport = await productOnLowInventoryEvent.triggerAction(lowInventoryTriggerAction ?? {})

        await this.productRepository.updateUnique(productId, product)

        return { product, actionsReport }
    }
    
}