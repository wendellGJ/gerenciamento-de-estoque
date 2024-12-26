import Product from "../entities/product"
import UniqueEntityId from "../entities/value-objects/unique-entity-id"
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
import GetProductByIdUseCase from "./get-product-by-id-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:GetProductByIdUseCase

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    
    sut = new GetProductByIdUseCase(
        productRepository
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Get Product By Id Use Case', () => {
    
    it('should be able to get a product by id', async () => {  
        
        const { product:prodCreated } = await productRepository.create(Product.create({ 
            autoPurchaseAmount:30,
            buyPrice:50,
            color:'red',
            description:'oi',
            inventory: { amount: 5 },
            sellPrice:80,
            size:'70x50',
            title:'teste'
        }))
        
        const { product } = await sut.execute({ productId:prodCreated.id.value })

        expect(product).toBeInstanceOf(Product)
        expect(product).toEqual(expect.objectContaining({
            id:expect.any(UniqueEntityId),
            title:'teste'
        }))
    })

})