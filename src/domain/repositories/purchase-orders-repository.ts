import PurchaseOrder from "../entities/purchase-order";

export default interface PurchaseOrdersRepository {
    create(purchaseOrder: PurchaseOrder): Promise<{ purchaseOrder: PurchaseOrder }>,
    updateUnique(id: string, data: PurchaseOrder): Promise<{ purchaseOrder: PurchaseOrder }>,
    getById(id: string): Promise<{ purchaseOrder: PurchaseOrder } | null>,
    getManyOnDate(from: Date, to: Date): Promise<{ purchaseOrders: PurchaseOrder[] }>,
}