import Product from "@/domain/entities/product";
import ProductRepository from "../products-repository";

export default class InMemoryProductRepository implements ProductRepository {

    products:Product[] = []
    
    async create(product: Product): Promise<{ product: Product; }> {
        this.products.push(product)
        
        return { product }
    }
    
    async updateUnique(id: string, data: Product): Promise<{ product: Product; }> {
        const index = this.products.findIndex(item => item.id.value === id)
        const product = this.products[index]
        
        if (!product) throw new Error("inexistent product");    
        
        this.products[index] = data
        
        
        return { product }
    }
    
    async getById(id: string): Promise<{ product: Product } | null> {
        const index = this.products.findIndex(item => item.id.value === id)
        const product = this.products[index]

        if (!product) return null
        
        return { product }
    }

}