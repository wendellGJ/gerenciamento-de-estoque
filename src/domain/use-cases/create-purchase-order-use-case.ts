import PurchaseOrder, { PurchaseOrderCreateProps } from "../entities/purchase-order"
import PurchaseOrdersRepository from "../repositories/purchase-orders-repository"


export interface CreatePurchaseOrderUseCaseRequest extends PurchaseOrderCreateProps {

}

export default class CreatePurchaseOrderUseCase {

    constructor(
        protected purchaseOrdersRepository: PurchaseOrdersRepository
    ) {}

    async execute(props: CreatePurchaseOrderUseCaseRequest) {                
        const purchaseOrder = PurchaseOrder.create(props)

        await this.purchaseOrdersRepository.create(purchaseOrder)

        return { purchaseOrder }
    }
    
}