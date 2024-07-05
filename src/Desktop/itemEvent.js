

export default class ItemEvent {
    static #eventName = 'ItemEvent'

    constructor(copy) {
        this.isDeleteEventType = this.isCreateEventType = this.isEditEventType = false;
        this.itemJson = null;

        if (copy && typeof copy === 'object') {
            this.isDeleteEventType = copy.isDeleteEventType ?? this.isDeleteEventType;
            this.isCreateEventType = copy.isCreateEventType ?? this.isCreateEventType;
            this.isEditEventType = copy.isEditEventType ?? this.isEditEventType;
            this.itemJson = copy.itemJson ?? this.itemJson;
        }
    }

    static getEventName = () => ItemEvent.#eventName; 

    dispatchEvent() {
        if (!(this.isDeleteEventType ^ this.isCreateEventType ^ this.isEditEventType) ||
            (this.isDeleteEventType && this.isCreateEventType && this.isEditEventType))
            throw Error('Invalid ItemEvent types only one eventType can be true')

        const event = new CustomEvent(ItemEvent.#eventName, {
            detail: {
                isCreateEventType: this.isCreateEventType,
                isDeleteEventType: this.isDeleteEventType,
                isEditEventType: this.isEditEventType,
                itemJson: this.itemJson
            },
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    }
}