import SalesRepository from "../repositories/sales-repository"
import SalesReportService, { SalesReportAggregationResponse } from "../services/sales-report"


export interface GenerateSalesReportUseCaseRequest {
    from: Date,
    to: Date,
    by:'day' | 'month' | 'year'
}

export default class GenerateSalesReportUseCase {

    constructor(
        protected salesRepository: SalesRepository,        
        protected salesReport: SalesReportService,        
    ) {}

    async execute({ from, to, by }: GenerateSalesReportUseCaseRequest) {        
        const { sales } = await this.salesRepository.getManyOnDate(from, to)

        this.salesReport.setSales(sales)
        let report:SalesReportAggregationResponse
        
        if (by === 'day') {
            report = this.salesReport.byDay({ period:'ALL', aggregate:true }) as SalesReportAggregationResponse
        } else if (by == 'month') {
            report = this.salesReport.byMonth({ period:'ALL', aggregate:true }) as SalesReportAggregationResponse
        } else {
            report = this.salesReport.byYear({ period:'ALL', aggregate:true }) as SalesReportAggregationResponse
        }


        return { report }
    }
    
}