import Sale, { SaleCreateProps } from "../entities/sale"
import SalesRepository from "../repositories/sales-repository"


export interface CreateSaleUseCaseRequest extends SaleCreateProps {

}

export default class CreateSaleUseCase {

    constructor(
        protected salesRepository: SalesRepository
    ) {}

    async execute(props: CreateSaleUseCaseRequest) {        
        const sale = Sale.create(props)

        await this.salesRepository.create(sale)

        return { sale }
    }
    
}