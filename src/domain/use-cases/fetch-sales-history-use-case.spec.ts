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
import FetchSalesHistoryUseCase from "./fetch-sales-history-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let salesRepository: SalesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:FetchSalesHistoryUseCase

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    salesRepository = new InMemorySalesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    
    sut = new FetchSalesHistoryUseCase(
        salesRepository
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Fetch Sales History Use Case', () => {
    
    it('should be able fetch sales history', async () => {       
        vi.setSystemTime(new Date(2023, 0))

        await salesRepository.create(
            Sale.create({ clientId:'123', salespersonId:'123', status:'ORDER PROCESSING',
            items:{ 
                '13':{ 
                    amount:2, 
                    product: Product.create({ autoPurchaseAmount:30, buyPrice:50, color:'red', description:'oi', inventory: { amount: 5 }, sellPrice:80,  size:'70x50', title:'teste' }, '13')
                },
                '14':{ 
                    amount:2, 
                    product: Product.create({ autoPurchaseAmount:30, buyPrice:50, color:'red', description:'oi', inventory: { amount: 5 }, sellPrice:80,  size:'70x50', title:'teste' }, '14')
                },
            }
        }))

        vi.setSystemTime(new Date(2023, 7))
        await salesRepository.create(
            Sale.create({ clientId:'123', salespersonId:'123', status:'ORDER PROCESSING',
            items:{ 
                '15':{ 
                    amount:2, 
                    product: Product.create({ autoPurchaseAmount:30, buyPrice:50, color:'red', description:'oi', inventory: { amount: 5 }, sellPrice:80,  size:'70x50', title:'teste' }, '15')
                },
                '16':{ 
                    amount:2, 
                    product: Product.create({ autoPurchaseAmount:30, buyPrice:50, color:'red', description:'oi', inventory: { amount: 5 }, sellPrice:80,  size:'70x50', title:'teste' }, '16')
                },
            }
        }))

        vi.setSystemTime(new Date(2024, 5))

        const sutResp1 = await sut.execute({ 
            from:new Date(2022, 0),
            to: new Date(2023, 2)
        })

        const sutResp2 = await sut.execute({ 
            from:new Date(2022, 0),
            to: new Date()
        })

        expect(sutResp1.sales[0]).toBeInstanceOf(Sale)
        expect(sutResp1.sales).toHaveLength(1)
        expect(sutResp1.sales).toEqual([
            expect.objectContaining({
                items:expect.objectContaining({
                    '13':expect.objectContaining({
                        product:expect.any(Product)
                    })
                })
            }),
        ])
        
        expect(sutResp2.sales[0]).toBeInstanceOf(Sale)
        expect(sutResp2.sales).toHaveLength(2)
        expect(sutResp2.sales).toEqual([
            expect.objectContaining({
                items:expect.objectContaining({
                    '13':expect.objectContaining({
                        product:expect.any(Product)
                    })
                })
            }),
            expect.objectContaining({
                items:expect.objectContaining({
                    '15':expect.objectContaining({
                        product:expect.any(Product)
                    })
                })
            }),
        ])
    })    

})