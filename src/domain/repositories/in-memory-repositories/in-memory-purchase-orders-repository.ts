import PurchaseOrder from "@/domain/entities/purchase-order";
import dayjs from "dayjs";
import PurchaseOrdersRepository from "../purchase-orders-repository";

export default class InMemoryPurchaseOrdersRepository implements PurchaseOrdersRepository {

    purchaseOrders: PurchaseOrder[] = []
    
    async create(purchaseOrder: PurchaseOrder): Promise<{ purchaseOrder: PurchaseOrder; }> {
        this.purchaseOrders.push(purchaseOrder)

        return { purchaseOrder }
    }
    
    async updateUnique(id: string, data: PurchaseOrder): Promise<{ purchaseOrder: PurchaseOrder; }> {
        const index = this.purchaseOrders.findIndex(item => item.id.value === id)
        const purchaseOrder = this.purchaseOrders[index]
        
        if (!purchaseOrder) throw new Error("inexistent purchase order")   
        
        this.purchaseOrders[index] = data
        
        
        return { purchaseOrder }
    }
    
    async getById(id: string): Promise<{ purchaseOrder: PurchaseOrder; } | null> {
        const index = this.purchaseOrders.findIndex(item => item.id.value === id)
        const purchaseOrder = this.purchaseOrders[index]
        
        if (!purchaseOrder) return null 

        return { purchaseOrder }
    }
    
    async getManyOnDate(from: Date, to: Date): Promise<{ purchaseOrders: PurchaseOrder[]; }> {
        const fromDate = dayjs(from)
        const toDate = dayjs(to)

        const purchaseOrders = this.purchaseOrders.filter(item => {
            const afterFrom = fromDate.isBefore(item.createdAt)
            const beforeTo = toDate.isAfter(item.createdAt)

            return afterFrom && beforeTo
        })

        return { purchaseOrders }
    }

    

}