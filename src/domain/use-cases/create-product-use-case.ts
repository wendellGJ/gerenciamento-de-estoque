import Product, { ProductCreateProps } from "../entities/product"
import ProductRepository from "../repositories/products-repository"


export interface CreateProductUseCaseRequest extends ProductCreateProps {

}

export default class CreateProductUseCase {

    constructor(
        protected productRepository: ProductRepository
    ) {}

    async execute(props: CreateProductUseCaseRequest) {        
        const product = Product.create(props)

        await this.productRepository.create(product)

        return { product }
    }
    
}