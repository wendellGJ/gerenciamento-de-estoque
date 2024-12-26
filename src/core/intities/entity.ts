import UniqueEntityId from "../../domain/entities/value-objects/unique-entity-id"

export default class Entity<Props> {
    protected _id: UniqueEntityId
    protected props: Props

    protected constructor(props: Props, id?: string) {
        this.props = props
        this._id = new UniqueEntityId(id)
    }
}