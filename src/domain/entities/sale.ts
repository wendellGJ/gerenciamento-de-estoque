import { Optional } from "@/core/types/optional";
import Entity from "../../core/intities/entity";
import Product from "./product";
import UniqueEntityId from "./value-objects/unique-entity-id";

export interface SaleProps {
    salespersonId: UniqueEntityId,
    clientId: UniqueEntityId,
    items: Record<string, {product: Product, amount: number}>,
    status: 'ORDER PROCESSING' | 'ORDER FULFILLMENT' | 'SHIPPING' | 'INVOICING' | 'CUSTOMER FEEDBACK' | 'CLOSED' | 'RETURNS',
    createdAt: Date,
    updatedAt?: Date,
}

export type SaleCreateProps = (Omit<Optional<SaleProps, 'createdAt'>, 'clientId' | 'salespersonId'>) & { clientId: string, salespersonId: string }

export default class Sale extends Entity<SaleProps> {

    static create(props: SaleCreateProps, id?: string) {
        return new Sale(
            {
                ...props,
                createdAt: new Date(),
                clientId: new UniqueEntityId(props.clientId),
                salespersonId: new UniqueEntityId(props.salespersonId),
            },
            id
        )
    }

    get id() {
        return this._id
    }
    
    get items() {
        return this.props.items
    }

    get profit() {
        return Object.values(this.items).reduce((acc, item) => {
            acc += item.product.profit
            return acc
        }, 0)
    }

    get cost() {
        return Object.values(this.items).reduce((acc, item) => {
            acc += item.product.buyPrice
            return acc
        }, 0)
    }

    get revenue() {
        return Object.values(this.items).reduce((acc, item) => {
            acc += item.product.sellPrice
            return acc
        }, 0)
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    protected toutch() {
        this.props.updatedAt = new Date()
    }

    addItem(product: Product, amount: number) {
        this.props.items[product.id.value] = { product, amount }
        this.toutch()
    }

    deleteItem(productId: string) {
        delete this.props.items[productId]
        this.toutch()
    }

    updateItemAmount(productId: string, amount: number) {
        this.props.items[productId] = {
            ...this.props.items[productId],
            amount
        }
        this.toutch()
    }

    updateItemProduct(productId: string, product: Product) {
        this.props.items[productId] = {
            ...this.props.items[productId],
            product
        }
        this.toutch()
    }

    productPerformance() {
        return Object.values(this.items).reduce((acc:Record<string, {count:number, profit: number, cost: number, revenue: number}>, item) => {
            const value = {
                count: item.amount,
                profit: item.product.profit,
                cost:item.product.buyPrice,
                revenue:item.product.sellPrice,
            }
            acc[item.product.id.value] = value
            return acc
        }, {})
    }
    

}