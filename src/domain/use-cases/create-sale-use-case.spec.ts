import Product from "../entities/product"
import Sale from "../entities/sale"
import AlertMessagesRepository from "../repositories/alert-messages-repository"
import InMemoryAlertMessagesRepository from "../repositories/in-memory-repositories/in-memory-alert-messages-repository"
import InMemoryProductRepository from "../repositories/in-memory-repositories/in-memory-product-repository"
import InMemoryPurchaseOrdersRepository from "../repositories/in-memory-repositories/in-memory-purchase-orders-repository"
import InMemorySalesRepository from "../repositories/in-memory-repositories/in-memory-sales-repository"
import ProductRepository from "../repositories/products-repository"
import PurchaseOrdersRepository from "../repositories/purchase-orders-repository"
import SalesRepository from "../repositories/sales-repository"
import SendEmailFakeService from "../services/fake-services/send-email-fake-service"
import SendMessageToManagementSystemFakeService from "../services/fake-services/send-message-to-management-system-fake-service"
import SendEmailService from "../services/send-email-service"
import SendMessageToManagementSystemService from "../services/send-message-to-management-system-service"
import CreateSaleUseCase from "./create-sale-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let salesRepository: SalesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:CreateSaleUseCase

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    salesRepository = new InMemorySalesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    
    sut = new CreateSaleUseCase(
        salesRepository
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Create Sale Use Case', () => {
    
    it('should be able create a sale', async () => {       
        
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
            clientId:'123',
            salespersonId:'123',
            status:'ORDER PROCESSING',
            items:{
                '13':{
                    amount:2,
                    product: Product.create({ 
                        autoPurchaseAmount:30,
                        buyPrice:50,
                        color:'red',
                        description:'oi',
                        inventory: { amount: 5 },
                        sellPrice:80,
                        size:'70x50',
                        title:'teste'
                     }, '13')
                },
                '14':{
                    amount:2,
                    product: Product.create({ 
                        autoPurchaseAmount:30,
                        buyPrice:50,
                        color:'red',
                        description:'oi',
                        inventory: { amount: 5 },
                        sellPrice:80,
                        size:'70x50',
                        title:'teste'
                     }, '14')
                },
            }
        })

        expect(sutResp.sale).toBeInstanceOf(Sale)
        expect(sutResp.sale.profit).toEqual(60)
    })    

})