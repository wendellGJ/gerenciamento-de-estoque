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
import SalesReportRealService from "../services/real-services/sale-report-real-service"
import SalesReportService, { SalesReportAggregationResponse } from "../services/sales-report"
import SendEmailService from "../services/send-email-service"
import SendMessageToManagementSystemService from "../services/send-message-to-management-system-service"
import GenerateSalesReportUseCase from "./generate-sales-report-use-case"

let productRepository:ProductRepository
let alertMessagesRepository: AlertMessagesRepository
let salesRepository: SalesRepository
let sendMessageToManagementSystem: SendMessageToManagementSystemService
let sendEmailService: SendEmailService
let purchaseOrdersRepository: PurchaseOrdersRepository
let sut:GenerateSalesReportUseCase
let salesReport: SalesReportService

beforeAll(() => {
    productRepository = new InMemoryProductRepository()
    alertMessagesRepository = new InMemoryAlertMessagesRepository()
    salesRepository = new InMemorySalesRepository()
    sendMessageToManagementSystem = new SendMessageToManagementSystemFakeService()
    sendEmailService = new SendEmailFakeService()
    purchaseOrdersRepository = new InMemoryPurchaseOrdersRepository()
    salesReport = new SalesReportRealService()
    
    sut = new GenerateSalesReportUseCase(
        salesRepository,
        salesReport
    )

    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Generate Sales Report Use Case', () => {
    
    it('should be able generate sales report', async () => {       
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

        const sutResp = await sut.execute({ 
            from:new Date(2022, 0),
            to: new Date(),
            by:'month'
        })

        expect(sutResp.report.aggregation).toEqual(expect.objectContaining(<SalesReportAggregationResponse['aggregation']>{
            '0-2023': expect.objectContaining(<SalesReportAggregationResponse['aggregation'][0]>{
                cost:100,
            }),
            '7-2023':expect.objectContaining(<SalesReportAggregationResponse['aggregation'][0]>{
                cost:100,
            }),
        }))
        
        
    })    

})