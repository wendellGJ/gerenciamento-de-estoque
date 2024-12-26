import Product from "../entities/product"
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
import UpdateProductInventoryAmountUseCase from "./update-product-inventory-amount-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:UpdateProductInventoryAmountUseCase

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    
    sut = new UpdateProductInventoryAmountUseCase(
        productRepository,
        alertMessagesRepository,
        sendMessageToManagementSystem,
        sendEmailService,
        purchaseOrdersRepository
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Update Product Inventory Amount UseCase', () => {
    
    it('should be able to update a product inventory amount', async () => {       
        
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
            productId:product.id.value,
            amountToAddOrRemove:10,            
        })

        expect(sutResp.product.inventory.data.amount).toEqual(30)
    })

    it('should send an alert by email and an alert to the system, finally create a purchase order when the min inventory amount is smaller then the product stored amount', async () => {       
        
        const { product } = await productRepository.create(Product.create({
            autoPurchaseAmount:30,
            buyPrice:50,
            color:'red',
            description:'oi',
            inventory: { amount: 20, minAmount:5 },
            sellPrice:80,
            size:'70x50',
            title:'teste'
        }))

        console.log('product.color', product.color)

        const sutResp = await sut.execute({ 
            productId:product.id.value,
            amountToAddOrRemove:-17,            
        })

        expect(sutResp.actionsReport).toEqual(expect.objectContaining({
            wasEmailSent: true,
            wasPurchaseOrderCreated: true,
            wasSystemAlertSent: true,
        }))        
    })

    it('should not send an alert by email and an alert to the system, finally create a purchase order when the min inventory amount is greater then the product stored amount', async () => {       
        
        const { product } = await productRepository.create(Product.create({
            autoPurchaseAmount:30,
            buyPrice:50,
            color:'red',
            description:'oi',
            inventory: { amount: 50, minAmount:3 },
            sellPrice:80,
            size:'70x50',
            title:'teste'
        }))

        console.log('product.color', product.color)

        const sutResp = await sut.execute({ 
            productId:product.id.value,
            amountToAddOrRemove:-40,            
        })
        
        expect(sutResp.actionsReport).toEqual(expect.objectContaining({
            wasEmailSent: false,
            wasPurchaseOrderCreated: false,
            wasSystemAlertSent: false,
        }))        
    })

})