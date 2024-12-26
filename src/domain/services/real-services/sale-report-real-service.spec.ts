import createSaleObject from "@/utils/test/create-sale-object"
import { SalesReportAggregationResponse } from "../sales-report"
import SalesReportRealService from "./sale-report-real-service"


beforeAll(() => {
    vi.useFakeTimers()
})

afterAll(() => {
    vi.useRealTimers()
})


describe('Sale Report Service', () => {
    
    it('sould create a sale report aggregating by day', () => {
        
        vi.setSystemTime(new Date(2022, 0, 20, 10, 0, 0))

        const sale1 = createSaleObject()

        vi.setSystemTime(new Date(2022, 0, 21, 10, 0, 0))

        const sale2 = createSaleObject()

        const sales = [sale1, sale2]

        // each profit 60
        // each cost 100
        // each revenue 160

        const saleReport = new SalesReportRealService(sales)

        expect(saleReport).toBeInstanceOf(SalesReportRealService)
        expect(saleReport.byDay({ period:'ALL', aggregate:true })).toEqual(expect.objectContaining(<SalesReportAggregationResponse>{
            aggregation:expect.objectContaining({
                ['20-0-2022']: expect.objectContaining({
                    cost:100,
                    profit:60,
                    revenue:160,
                    count:1,
                    productPerformance:expect.objectContaining({
                        '13':{
                            cost:50,
                            count:2,
                            profit:30,
                            revenue:80,                                                            
                        }
                    })
                })
            }),
            total: expect.objectContaining({
                cost:200,
                count:2,
                profit:120,
                revenue:320,
                productPerformance: expect.objectContaining({
                    '13':{
                        cost:100,
                        count:4,
                        profit:60,
                        revenue:160,                                                            
                    },
                })
            })         
        }))

    })

    it('sould create a sale report aggregating by month', () => {
        
        vi.setSystemTime(new Date(2022, 0, 20, 10, 0, 0))

        const sale1 = createSaleObject()

        vi.setSystemTime(new Date(2022, 1, 20, 10, 0, 0))

        const sale2 = createSaleObject()

        const sales = [sale1, sale2]

        // each profit 60
        // each cost 100
        // each revenue 160

        const saleReport = new SalesReportRealService(sales)

        expect(saleReport).toBeInstanceOf(SalesReportRealService)
        expect(saleReport.byMonth({ period:'ALL', aggregate:true })).toEqual(expect.objectContaining(<SalesReportAggregationResponse>{
            aggregation:expect.objectContaining({
                ['0-2022']: expect.objectContaining({
                    cost:100,
                    profit:60,
                    revenue:160,
                    count:1,
                    productPerformance:expect.objectContaining({
                        '13':{
                            cost:50,
                            count:2,
                            profit:30,
                            revenue:80,                                                            
                        }
                    })
                })
            }),
            total: expect.objectContaining({
                cost:200,
                count:2,
                profit:120,
                revenue:320,
                productPerformance: expect.objectContaining({
                    '13':{
                        cost:100,
                        count:4,
                        profit:60,
                        revenue:160,                                                            
                    },
                })
            })         
        }))
        

    })

    it('sould create a sale report aggregating by year', () => {
        
        vi.setSystemTime(new Date(2022, 0, 20, 10, 0, 0))

        const sale1 = createSaleObject()

        vi.setSystemTime(new Date(2023, 0, 20, 10, 0, 0))

        const sale2 = createSaleObject()

        const sales = [sale1, sale2]

        // each profit 60
        // each cost 100
        // each revenue 160

        const saleReport = new SalesReportRealService(sales)

        expect(saleReport).toBeInstanceOf(SalesReportRealService)
        expect(saleReport.byYear({ period:'ALL', aggregate:true })).toEqual(expect.objectContaining(<SalesReportAggregationResponse>{
            aggregation:expect.objectContaining({
                ['2022']: expect.objectContaining({
                    cost:100,
                    profit:60,
                    revenue:160,
                    count:1,
                    productPerformance:expect.objectContaining({
                        '13':{
                            cost:50,
                            count:2,
                            profit:30,
                            revenue:80,                                                            
                        }
                    })
                })
            }),
            total: expect.objectContaining({
                cost:200,
                count:2,
                profit:120,
                revenue:320,
                productPerformance: expect.objectContaining({
                    '13':{
                        cost:100,
                        count:4,
                        profit:60,
                        revenue:160,                                                            
                    },
                })
            })         
        }))

    })

})