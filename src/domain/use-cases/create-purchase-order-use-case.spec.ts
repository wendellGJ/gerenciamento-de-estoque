import Product from "../entities/product"
import PurchaseOrder from "../entities/purchase-order"
import AlertMessagesRepository from "../repositories/alert-messages-repository"
import InMemoryAlertMessagesRepository from "../repositories/in-memory-repositories/in-memory-alert-messages-repository"
import InMemoryProductRepository from "../repositories/in-memory-repositories/in-memory-product-repository"
import InMemoryPurchaseOrdersRepository from "../repositories/in-memory-repositories/in-memory-purchase-orders-repository"
import ProductRepository from "../repositories/products-repository"
import PurchaseOrdersRepository from "../repositories/purchase-orders-repository"
import SendEmailFakeService from "../services/fake-services/send-email-fake-service"
import SendMessageToManagementSystemFakeService from "../services/fake-services/send-message-to-management-system-fake-service"
import SendEmailService from "../services/send-email-service"
import SendMessageToManagementSystemService from "../services/send-message-to-management-system-service"
import CreatePurchaseOrderUseCase from "./create-purchase-order-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:CreatePurchaseOrderUseCase

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    
    sut = new CreatePurchaseOrderUseCase(
        purchaseOrdersRepository
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Create Purchase Order Use Case', () => {
    
    it('should be able create a purchase order', async () => {       
        
        const { product } = await productRepository.create(Product.create({
            autoPurchaseAmount:30,
            buyPrice:50,
            color:'red',
            description:'oi',
            inventory: { amount: 20, minAmount:3 },
            sellPrice:80,
            size:'70x50',
            title:'teste'
        }))

        console.log('product.color', product.color)

        const sutResp = await sut.execute({ 
            items:[
                {
                    amount:10,
                    product
                }
            ]           
        })

        expect(sutResp.purchaseOrder).toBeInstanceOf(PurchaseOrder)
        expect(sutResp.purchaseOrder.cost).toEqual(50 * 10)
    })    

})