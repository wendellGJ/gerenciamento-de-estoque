import SalesRepository from "../repositories/sales-repository"


export interface FetchSalesHistoryUseCaseRequest {
    from: Date,
    to: Date,
}

export default class FetchSalesHistoryUseCase {

    constructor(
        protected salesRepository: SalesRepository,  
    ) {}

    async execute({ from, to }: FetchSalesHistoryUseCaseRequest) {        
        const { sales } = await this.salesRepository.getManyOnDate(from, to)

        return { sales }
    }
    
}