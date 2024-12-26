import Sale from "@/domain/entities/sale";
import dayjs from "dayjs";
import SalesRepository from "../sales-repository";

export default class InMemorySalesRepository implements SalesRepository {

    sales:Sale[] = []
    
    async create(sale: Sale): Promise<{ sale: Sale; }> {
        this.sales.push(sale)

        return { sale }
    }
    
    async updateUnique(id: string, data: Sale): Promise<{ sale: Sale; }> {
        const index = this.sales.findIndex(item => item.id.value === id)
        const sale = this.sales[index]
        
        if (!sale) throw new Error("inexistent purchase order")   
        
        this.sales[index] = data
        
        
        return { sale }
    }
    
    async getById(id: string): Promise<{ sale: Sale; } | null> {
        const index = this.sales.findIndex(item => item.id.value === id)
        const sale = this.sales[index]
        
        if (!sale) return null 

        return { sale }
    }
    
    async getManyOnDate(from: Date, to: Date): Promise<{ sales: Sale[]; }> {
        const fromDate = dayjs(from)
        const toDate = dayjs(to)

        const sales = this.sales.filter(item => {
            const afterFrom = fromDate.isBefore(item.createdAt)
            const beforeTo = toDate.isAfter(item.createdAt)

            return afterFrom && beforeTo
        })

        return { sales }
    }

}