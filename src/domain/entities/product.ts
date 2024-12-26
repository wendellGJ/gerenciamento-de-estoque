import { Optional } from "@/core/types/optional";
import Entity from "../../core/intities/entity";
import Inventory from "./value-objects/inventory";

export interface ProductProps {
    inventory: Inventory,
    createdAt: Date,
    updatedAt?: Date,
    size: string,
    color: string,
    title: string,
    description: string,
    buyPrice: number,
    sellPrice: number,
    autoPurchaseAmount: number,
}

export type ProductCreateProps = Omit<Optional<ProductProps, 'createdAt'>, 'inventory'> & { inventory: { amount: number, minAmount?: number } }

export default class Product extends Entity<ProductProps> {

    static create(props: ProductCreateProps, id?: string) {
        return new Product(
            {
            ...props,
            inventory: new Inventory(props.inventory.amount > 1 ? props.inventory.amount : 1, props.inventory.minAmount),
            createdAt: new Date(),

            },
            id
        )
    }

    get inventory() {
        this.props.inventory = new Inventory(this.props.inventory.data.amount, this.props.inventory.data.minAmount, (instance?: Product) => this.toutch(instance), this)
        return this.props.inventory
    }

    get isOnMinAmount() {
        const isOnMinAmount = this.inventory.data.amount <= this.inventory.data.minAmount
        return isOnMinAmount
    }

    get autoPurchaseAmount() {
        return this.props.autoPurchaseAmount
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get size() {
        return this.props.size
    }

    get color() {
        return this.props.color
    }

    get id() {
        return this._id
    }

    get title() {
        return this.props.title
    }

    get description() {
        return this.props.description
    }

    get buyPrice() {
        return this.props.buyPrice
    }

    get sellPrice() {
        return this.props.sellPrice
    }

    get profit() {
        return this.sellPrice - this.buyPrice
    }

    protected toutch(instance?: Product) {
        if (instance) {
            instance.props.updatedAt = new Date()
        } else {
            this.props.updatedAt = new Date()
        }
    }

    set buyPrice(price: number) {
        this.props.buyPrice = price
        this.toutch()
    }

    set sellPrice(price: number) {
        this.props.sellPrice = price
        this.toutch()
    }
    
    set size(text: string) {
        this.props.size = text
        this.toutch()
    }

    set color(text: string) {
        this.props.color = text
        this.toutch()
    }

}