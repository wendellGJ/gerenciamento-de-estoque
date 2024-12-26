import Sale from "../entities/sale";

export default interface SalesRepository {
    create(sale: Sale): Promise<{ sale: Sale }>,
    updateUnique(id: string, data: Sale): Promise<{ sale: Sale }>,
    getById(id: string): Promise<{ sale: Sale } | null>,
    getManyOnDate(from: Date, to: Date): Promise<{ sales: Sale[] }>,
}