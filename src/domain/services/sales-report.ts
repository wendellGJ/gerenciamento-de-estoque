import Sale from "../entities/sale";


export type SalesReportServiceMetrics = {count:number, profit: number, cost: number, revenue: number}

export type SalesReportAggregationResponse = {
    aggregation: Record<string, SalesReportServiceMetrics & {
        productPerformance: Record<string, SalesReportServiceMetrics>;
    }>;
    total: SalesReportServiceMetrics & {
        productPerformance: Record<string, SalesReportServiceMetrics>;
    };
}


export default abstract class SalesReportService {

    constructor(sales?: Sale[]) {}

    abstract get sales(): Record<string, Sale>
    protected abstract salesByYear(sales: Sale[]): Record<string, Sale[]>
    protected abstract salesByMonth(sales: Sale[]): Record<string, Sale[]>
    protected abstract salesByDay(sales: Sale[]): Record<string, Sale[]>
    protected abstract filterPeriod({ from, to, compareTo }: { from: Date; to: Date; compareTo: Date; }): boolean
    protected abstract getProfit(sales: Sale[]): number
    protected abstract getCost(sales: Sale[]): number
    protected abstract getRevenue(sales: Sale[]): number
    protected abstract getProductPerformance(sales: Sale[]): Record<string, SalesReportServiceMetrics>
    protected abstract aggregate(data: Record<string, Sale[]>): SalesReportAggregationResponse
    abstract byYear({ period, aggregate }: { period: 'ALL' | { from: Date; to: Date; }; aggregate?: boolean; }): Record<string, Sale[]> | SalesReportAggregationResponse
    abstract byMonth({ period, aggregate }: { period: 'ALL' | { from: Date; to: Date; }; aggregate?: boolean; }): Record<string, Sale[]> | SalesReportAggregationResponse
    abstract byDay({ period, aggregate }: { period: 'ALL' | { from: Date; to: Date; }; aggregate?: boolean; }): Record<string, Sale[]> | SalesReportAggregationResponse
    abstract setSales(sales: Sale[]): void

}