import Product from "../product"

export default class Inventory {

    protected amount: number
    protected minAmount: number
    protected toutch: (instance?: Product) => void
    protected parent?:Product

    constructor(amount: number, minAmount?: number, toutch?: (instance?: Product) => void, parent?: Product) {
        this.amount = amount
        this.minAmount = minAmount ?? 1
        this.parent = parent
        this.toutch = toutch ?? ((instance?: Product) => {})
    }

    get data() {
        return {
            amount:this.amount,
            minAmount:this.minAmount
        }
    }

    subAmount(amount: number) {
        this.amount -= amount
        this.toutch(this.parent)
        
        const isOnMinAmount = this.amount <= this.minAmount
        return { isOnMinAmount }
    }

    addAmount(amount: number) {
        this.amount += amount
        this.toutch(this.parent)
    }

    updateMinAmount(minAmount: number) {
        if (minAmount < 1) throw new Error("min amount must be equal or greater than 1");
        this.minAmount = minAmount
        this.toutch(this.parent)
        
        const isOnMinAmount = this.amount <= this.minAmount
        return { isOnMinAmount }
    }

}