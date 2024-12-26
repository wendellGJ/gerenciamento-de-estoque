import ProductRepository from "../repositories/products-repository";


export interface GetProductByIdUseCaseRequest {
    productId: string,
}

export default class GetProductByIdUseCase {

    constructor(
        protected productRepository: ProductRepository
    ) {}

    async execute({ productId }: GetProductByIdUseCaseRequest) {        
        const resp = await this.productRepository.getById(productId)

        if (!resp) throw new Error("invalid product");  
        
        const { product } = resp

        return { product }
    }
    
}