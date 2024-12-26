import Sale from "@/domain/entities/sale";
import dayjs from "dayjs";
import SalesReportService, { SalesReportServiceMetrics } from "../sales-report";



export default class SalesReportRealService extends SalesReportService {

    protected _sales: Record<string, Sale>

    constructor(sales?: Sale[]) {
        super(sales)
        this._sales = (sales ?? []).reduce((acc:Record<string, Sale>, item) => {
            acc[item.id.value] = item
            return acc
        }, {})
    }
    
    get sales() {
        return this._sales
    }


    protected salesByYear(sales: Sale[]) {
        const years = sales.map(item => dayjs(item.createdAt).get('year'))
        const byYears = years.reduce((acc:Record<string, Sale[]>, item) => {
            acc[item] = sales.filter(s => item === dayjs(s.createdAt).get('year'))
            return acc
        }, {})
        return byYears
    }

    protected salesByMonth(sales: Sale[]) {
        const monthAndYears = sales.map(item => `${dayjs(item.createdAt).get('month')}-${dayjs(item.createdAt).get('year')}`)
        const byMonthAndYears = monthAndYears.reduce((acc:Record<string, Sale[]>, item) => {
            acc[item] = sales.filter(s => item === `${dayjs(s.createdAt).get('month')}-${dayjs(s.createdAt).get('year')}`)
            return acc
        }, {})
        return byMonthAndYears
    }

    protected salesByDay(sales: Sale[]) {
        const monthAndYears = sales.map(item => `${dayjs(item.createdAt).get('date')}-${dayjs(item.createdAt).get('month')}-${dayjs(item.createdAt).get('year')}`)
        const byMonthAndYears = monthAndYears.reduce((acc:Record<string, Sale[]>, item) => {
            acc[item] = sales.filter(s => item === `${dayjs(s.createdAt).get('date')}-${dayjs(s.createdAt).get('month')}-${dayjs(s.createdAt).get('year')}`)
            return acc
        }, {})
        return byMonthAndYears
    }

    protected filterPeriod({ from, to, compareTo }:{ from:Date, to:Date, compareTo:Date }) {
        const dateFrom = dayjs(from)
        const dateTo = dayjs(to)

        const dateFromIsBefore = dateFrom.isBefore(compareTo)
        const dateToIsAfter = dateTo.isAfter(compareTo)

        return dateFromIsBefore && dateToIsAfter
    }

    protected getProfit(sales: Sale[]) {
        return sales.reduce((acc, item) => {
            acc += item.profit
            return acc
        }, 0)
    }

    protected getCost(sales: Sale[]) {
        return sales.reduce((acc, item) => {
            acc += item.cost
            return acc
        }, 0)
    }

    protected getRevenue(sales: Sale[]) {
        return sales.reduce((acc, item) => {
            acc += item.revenue
            return acc
        }, 0)
    }

    protected getProductPerformance(sales: Sale[]) {
        return sales.reduce((acc: Record<string, SalesReportServiceMetrics>, item) => {
            const prodPerformance = item.productPerformance()
            for (let prod in prodPerformance) {
                if (prod in acc) {
                    acc[prod].count += prodPerformance[prod].count
                    acc[prod].profit += prodPerformance[prod].profit
                    acc[prod].cost += prodPerformance[prod].cost
                    acc[prod].revenue += prodPerformance[prod].revenue
                } else {
                    acc[prod] = prodPerformance[prod]
                }
            }
            return acc
        }, {})
    }

    protected aggregate(data: Record<string, Sale[]>) {
        const aggregation = Object.entries(data).reduce((acc: Record<string, SalesReportServiceMetrics & {productPerformance: Record<string, SalesReportServiceMetrics>}>, item) => {                                
            const value = {
                cost:this.getCost(item[1]),
                profit:this.getProfit(item[1]),
                revenue:this.getRevenue(item[1]),
                count:item[1].length,
                productPerformance:this.getProductPerformance(item[1])
            }
            acc[item[0]] = value
            return acc
        }, {})        

        const aggregationCopy = JSON.parse(JSON.stringify(aggregation)) as Record<string, SalesReportServiceMetrics & {productPerformance: Record<string, SalesReportServiceMetrics>}>

        const total = Object.values(aggregationCopy).reduce((acc:SalesReportServiceMetrics & {productPerformance: Record<string, SalesReportServiceMetrics>}, item) => {
            acc.count += item.count
            acc.profit += item.profit
            acc.cost += item.cost
            acc.revenue += item.revenue

            for (let key in item.productPerformance) {
                if (key in acc.productPerformance) {
                    acc.productPerformance[key].count += item.productPerformance[key].count
                    acc.productPerformance[key].profit += item.productPerformance[key].profit
                    acc.productPerformance[key].cost += item.productPerformance[key].cost
                    acc.productPerformance[key].revenue += item.productPerformance[key].revenue
                } else {
                    acc.productPerformance[key] = item.productPerformance[key]
                }
            }
            return acc
        }, { cost:0, count:0, profit:0, revenue:0, productPerformance:{} })

        return { aggregation, total }
    }

    byYear({ period, aggregate }:{period: 'ALL' | { from:Date, to:Date }, aggregate?:boolean}) {
        if (period === 'ALL') {
            const sales = Object.values(this.sales)
            if (aggregate) {
                const report = this.aggregate(this.salesByYear(sales))
                return report
            }
            return this.salesByYear(sales)
        } 

        const sales = Object.values(this.sales).filter(item => {
            const { from, to } = period
            return this.filterPeriod({ from, to, compareTo:item.createdAt })
        })
        if (aggregate) {
            return this.aggregate(this.salesByYear(sales))
        }
        return this.salesByYear(sales)        
    }

    byMonth({ period, aggregate }:{period: 'ALL' | { from:Date, to:Date }, aggregate?:boolean}) {
        if (period === 'ALL') {
            const sales = Object.values(this.sales)
            if (aggregate) {
                return this.aggregate(this.salesByMonth(sales))
            }
            return this.salesByMonth(sales)
        } 

        const sales = Object.values(this.sales).filter(item => {
            const { from, to } = period
            return this.filterPeriod({ from, to, compareTo:item.createdAt })
        })
        if (aggregate) {
            return this.aggregate(this.salesByMonth(sales))
        }
        return this.salesByMonth(sales)        
    }

    byDay({ period, aggregate }:{period: 'ALL' | { from:Date, to:Date }, aggregate?:boolean}) {
        if (period === 'ALL') {
            const sales = Object.values(this.sales)
            if (aggregate) {
                return this.aggregate(this.salesByDay(sales))
            }
            return this.salesByDay(sales)
        } 

        const sales = Object.values(this.sales).filter(item => {
            const { from, to } = period
            return this.filterPeriod({ from, to, compareTo:item.createdAt })
        })
        if (aggregate) {
            return this.aggregate(this.salesByDay(sales))
        }
        return this.salesByDay(sales)        
    }


    setSales(sales: Sale[]) {
        this._sales = sales.reduce((acc:Record<string, Sale>, item) => {
            acc[item.id.value] = item
            return acc
        }, {})
    }
    

}