import React from "react"
import LinkForm from "./Items/Links/linkForm"
import TestItemForm from "./Items/testCreateForm"
import ItemEvent from "./itemEvent"

export default class ItemFormFactory { 
    #nameToItemCreateForm = {
        "testItem": this.#buildComponent(TestItemForm, true),
        "link":  this.#buildComponent(LinkForm, true)
    }   
    #nameToItemEditForm = {
        "link":  this.#buildComponent(LinkForm, false),
        "testItem": this.#buildComponent(TestItemForm, false)
    }

    #onCloseCallback = () => {}

    #buildComponent(Component, isCreateForm) {
        return (json) => { 
            let handleSubmit = isCreateForm ? 
                (itemJson) => this.handleCreateSubmit( {
                    name: json.name,
                    data: itemJson
                }) :
                (itemJson) => { 
                    this.handleEditSubmit({
                    id: json.id,
                    name: json.name,
                    data: {...json.data, ...itemJson}
                } ); }
            
            return <Component defaultData={json.data} onSubmit={handleSubmit} onClosing={this.#onCloseCallback}/>
        }
    }

    setOnCloseCallback(newCallback) {
        this.#onCloseCallback = newCallback;
    }

    handleEditSubmit(json) {
        let itemEvent = new ItemEvent();
        itemEvent.isEditEventType = true;
        itemEvent.itemJson = json;

        itemEvent.dispatchEvent();
    }

    handleCreateSubmit(json) {
        let itemEvent = new ItemEvent();
        itemEvent.isCreateEventType = true;
        itemEvent.itemJson = json;

        itemEvent.dispatchEvent();
    }

    getEditFormByName(json) {
        if (this.#nameToItemEditForm[json.name] === undefined) {
            console.error(`Could not found ${json.name} in nameToItemEditForm register`);
        }

        return this.#nameToItemEditForm[json.name](json);
    }

    getCreateFormByName(name) {
        if (this.#nameToItemCreateForm[name] === undefined) {
            console.error(`Could not found ${name} in nameToItemCreateForm register`);
        }
        return this.#nameToItemCreateForm[name]({name: name});
    }
}