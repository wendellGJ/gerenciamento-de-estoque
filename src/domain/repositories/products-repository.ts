import Product from "../entities/product";

export default interface ProductRepository {
    create(product: Product): Promise<{ product: Product }>,
    updateUnique(id: string, data: Product): Promise<{ product: Product }>,
    getById(id: string): Promise<{ product: Product } | null>,
}