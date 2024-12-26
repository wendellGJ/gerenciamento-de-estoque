import Product from "@/domain/entities/product";
import Sale from "@/domain/entities/sale";

export default function createSaleObject() {
    const sale = Sale.create({ 
        clientId:'123',
        salespersonId:'123',
        status:'ORDER PROCESSING',
        items:{
            '13':{
                amount:2,
                product: Product.create({ 
                    autoPurchaseAmount:30,
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
                    autoPurchaseAmount:30,
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

    return sale
}