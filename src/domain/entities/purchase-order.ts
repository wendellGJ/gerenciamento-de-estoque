import { Optional } from "@/core/types/optional";
import Entity from "../../core/intities/entity";
import Product from "./product";

export interface PurchaseOrderProps {
    items:{product: Product, amount: number}[],
    createdAt: Date,
    updatedAt?: Date,
    status: "PENDING" | "RECEIPT" | "PROCESSING" | "APPROVAL" | "SHIPPING" | "DELIVERY",
}

export type PurchaseOrderCreateProps = Optional<PurchaseOrderProps, 'createdAt' | 'status'>

export default class PurchaseOrder extends Entity<PurchaseOrderProps> {

    static create(props: PurchaseOrderCreateProps, id?: string) {
        return new PurchaseOrder(
            {
            ...props,
            createdAt: new Date(),
            status:'PENDING'
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

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get status() {
        return this.props.status
    }

    get cost() {
        return Object.values(this.items).reduce((acc, item) => {
            acc += (item.product.buyPrice * item.amount)
            return acc
        }, 0)
    }

}