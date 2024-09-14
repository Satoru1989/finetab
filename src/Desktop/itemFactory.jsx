import React from "react";
import TestItem from "./Items/testItem"
import Link from "./Items/Links/link";

export default class ItemFactory {
    #nameToItemClass = {}
    static #key = 0;

    constructor(saveDesktopCallback) {
        this.saveDesktopCallback = saveDesktopCallback;

        this.#nameToItemClass = {
            'testItem': this.#getBuildComponentFunction(TestItem),
            'link': this.#getBuildComponentFunction(Link)
        } 
    }

    #getBuildComponentFunction = (Component) =>
        (json, id) => this.#buildComponent(json, Component, id)

    #buildComponent = (json, Component, id) => {
        ItemFactory.#key++;
        return (
            <div key={ItemFactory.#key} onContextMenu={ (e) => { 
                e.detail = json;
                e.detail["id"] = id;
            }}>
                <Component saveItemState={(newItemData) => {
                    this.saveDesktopCallback( {
                        id: id,
                        name: json.name,
                        data: newItemData
                    });
                }} 
                    id={id} name={json.name} data={json.data}/>
            </div>
        )
    }

    getItemAsComponent(dataJson, id) {
        if (typeof dataJson !== 'object') {
            console.error(`itemFactory getItemAsComponent: dataJson(${dataJson}) is not an object.`);
            return;
        }

        let copyJson;
        try {
            copyJson = structuredClone(dataJson);
        } catch (error) {
            console.error('itemFactory getItemAsComponent: Error in copying JSON', error);
            return;
        }

        if (!('name' in copyJson)) {
            throw new Error('itemFactory getItemAsComponent: Invalid JSON; missing "name" property.');
        } if (!(copyJson.name in this.#nameToItemClass)) {
            throw new Error(`itemFactory getItemAsComponent: The name "${copyJson.name}" wasn't found.`);
        }

        return this.#nameToItemClass[copyJson.name](copyJson, id);
    }

    getItemsAsComponents(itemsJson) {
        return itemsJson.map( (item, index) => {
            return this.getItemAsComponent(item, index);
        });
    }
}