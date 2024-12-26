import Product from "./product"
import Sale from "./sale"


describe('Sale Entity', () => {

    it('sould create a sale', () => {
        const sale = Sale.create({ 
            clientId:'123',
            salespersonId:'123',
            status:'ORDER PROCESSING',
            items:{
                '13':{
                    amount:2,
                    product: Product.create({ 
                        buyPrice:50,
                        color:'red',
                        description:'oi',
                        inventory: { amount: 5 },
                        sellPrice:80,
                        size:'70x50',
                        title:'teste'
                     }, '13')
                },
                '14':{
                    amount:2,
                    product: Product.create({ 
                        buyPrice:50,
                        color:'red',
                        description:'oi',
                        inventory: { amount: 5 },
                        sellPrice:80,
                        size:'70x50',
                        title:'teste'
                     }, '14')
                },
            }
        })

        expect(sale).toBeInstanceOf(Sale)
        expect(sale.profit).toEqual(60)
        expect(sale.cost).toEqual(100)
        expect(sale.revenue).toEqual(160)

    })

})