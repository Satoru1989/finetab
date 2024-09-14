import ItemFactory from "./itemFactory";
import indexedDBStore from "../PersistentStorage/indexedDBStore";
import settingStore from "../PersistentStorage/settingsStore";
import ItemEvent from "./itemEvent";

export default class DesktopModel {
    #currentDesktop = null;
    #leftDesktop = null;
    #rightDesktop = null;

    constructor() {
        this.currentDesktopItemArrJson = null;
        this.leftDesktopItemArrJson = null;
        this.rightDesktopItemArrJson = null;
        
        this.itemFactory = new ItemFactory( (itemData) => {
            this.currentDesktopItemArrJson[itemData.id] = itemData;
            this.saveCurrentDesktop();
        });
        this.updateItemsCallback = null;

        this.mouseInDesktopArea = false;
        this.isInitialized = false;
        this.initiliazePromise = this.innitialize();

        document.addEventListener(ItemEvent.getEventName(), this.handleItemEvent);
        document.addEventListener('keyup', this.handleOnKeyUp);
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    async retrieveDesktopJson(desktopId) {
        try {
            return (await indexedDBStore.readDataFromKey(desktopId)) ?? 
                            { items: [], id: desktopId };
        } catch (error) {
            console.error('Error retrieving desktop', error);
            return { items: [], id: desktopId }
        }
    }

    /**
     * @param {string} desktopVar possible values 'current', 'left', 'right'
     * @param {string} desktopId format 'desktop(int value)'
     */
    async retrieveDesktopFromDB(desktopVar, desktopId) {
        let desktopJson = await this.retrieveDesktopJson(desktopId);
        
        let desktopItemsArr = desktopJson.items;
        desktopJson.items = this.itemFactory.getItemsAsComponents(desktopItemsArr);

        if (desktopVar === 'current') {
            this.#currentDesktop = desktopJson;
            this.currentDesktopItemArrJson = desktopItemsArr;
        } if (desktopVar === 'left') {
            this.#leftDesktop = desktopJson;
            this.leftDesktopItemArrJson = desktopItemsArr;
        } if (desktopVar === 'right') {
            this.#rightDesktop = desktopJson;
            this.rightDesktopItemArrJson = desktopItemsArr;
        }
    }

    async innitialize() {   
        await this.retrieveDesktopFromDB('current', "desktop 0");

        if (this.updateItemsCallback !== null)
            this.updateItemsCallback();

        await this.retrieveDesktopFromDB('right', 'desktop 1');
        await this.retrieveDesktopFromDB('left', 'desktop -1');

        this.isInitialized = true;
    }

    setUpdateItemsCallback = (callback) => {
        this.updateItemsCallback = () => {
            callback(this.#currentDesktop.items)
        }

        if (this.#currentDesktop !== null)
            this.updateItemsCallback();
    }

    async switchToLeftDesktop() { 
        if (!this.isInitialized) return;
        if (this.leftDesktopItemArrJson.length === 0 && this.currentDesktopItemArrJson.length === 0) 
            return;

        this.#rightDesktop = this.#currentDesktop;
        this.#currentDesktop = this.#leftDesktop;

        this.rightDesktopItemArrJson = this.currentDesktopItemArrJson;
        this.currentDesktopItemArrJson = this.leftDesktopItemArrJson;

        let desktopIdNumberStr = this.#currentDesktop.id.split(' ')[1];
        let nextDesktopId = parseInt(desktopIdNumberStr) - 1;

        await this.retrieveDesktopFromDB('left', 'desktop ' + nextDesktopId.toString());
        this.updateItemsCallback();
    }

    async switchToRightDesktop() {
        if (!this.isInitialized) return;
        if (this.rightDesktopItemArrJson.length === 0 && this.currentDesktopItemArrJson.length === 0) 
            return;

        this.#leftDesktop = this.#currentDesktop;
        this.#currentDesktop = this.#rightDesktop;

        this.leftDesktopItemArrJson = this.currentDesktopItemArrJson;
        this.currentDesktopItemArrJson = this.rightDesktopItemArrJson;

        let desktopIdNumberStr = this.#currentDesktop.id.split(' ')[1];
        let nextDesktopId = parseInt(desktopIdNumberStr) + 1;

        await this.retrieveDesktopFromDB('right', 'desktop ' + nextDesktopId.toString());
        this.updateItemsCallback();
    }

    async saveCurrentDesktop() {
        if(!this.isInitialized) return;

        await indexedDBStore.writeDataByKey(
            {items: this.currentDesktopItemArrJson, id: this.#currentDesktop.id}, 
            this.#currentDesktop.id).then( (desktop) => {
                this.__test__reportOnDesktopSaving(desktop);
            }
        );
    }

    deleteItem = (id) => {
        let itemsCount = this.#currentDesktop.items.length;
        if (id < 0 || id >= itemsCount) return;

        this.#currentDesktop.items.splice(id, 1);
        this.currentDesktopItemArrJson.splice(id, 1);

        for (let i = id; i < itemsCount - 1; i++) {
            this.#currentDesktop.items[i] = this.itemFactory.getItemAsComponent(this.currentDesktopItemArrJson[i], i);
        }
    }

    handleItemEvent = (e) => {
        if(!this.isInitialized) return;

        let itemEvent = new ItemEvent(e.detail);
        
        let item = itemEvent.itemJson;
        
        if (itemEvent.isCreateEventType) {
            this.currentDesktopItemArrJson.push(structuredClone(item));
            let newItem = this.itemFactory.getItemAsComponent(item, this.#currentDesktop.items.length);
            this.#currentDesktop.items.push(newItem);
        } else if (itemEvent.isDeleteEventType) {
            this.deleteItem(item.id);
        } else if (itemEvent.isEditEventType) {
            this.currentDesktopItemArrJson[item.id] = structuredClone(item);
            let newItem = this.itemFactory.getItemAsComponent(item, item.id);
            this.#currentDesktop.items[item.id] = newItem; 
        }

        this.updateItemsCallback();
        this.saveCurrentDesktop();
    }

    handleOnKeyUp = (e) => {
        if (e.key.toLowerCase() === 'a') {
            this.switchToLeftDesktop();
        } else if (e.key.toLowerCase() === 'd') {
            this.switchToRightDesktop();
        } else if (e.key.toLowerCase() === 'arrowleft') {
            this.switchToLeftDesktop();
        } else if (e.key.toLowerCase() === 'arrowright') {
            this.switchToRightDesktop();
        }
    }

    handleMouseMove = (e) => {
        if (settingStore.getSetting("desktopSwitchWithMouseAllowed") === 'off') return;

        if (e.clientX < 5 && !this.mouseInDesktopArea) {
            this.switchToLeftDesktop();
            this.mouseInDesktopArea = true;
        }
        
        if (e.clientX > window.innerWidth - 5 && !this.mouseInDesktopArea) {
            this.switchToRightDesktop();
            this.mouseInDesktopArea = true;
        }

        if (!(e.clientX < 5 || e.clientX > window.innerWidth - 5)) 
            this.mouseInDesktopArea = false;
    }

    destructor() {
        document.removeEventListener(ItemEvent.getEventName(), this.handleItemEvent);
        document.removeEventListener('keyup', this.handleOnKeyUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
    }

    __test__calledAfterSavingDesktop = () => {};
    __test__setCalledAfterSavingDesktopCallback(testCallback) {
        if (testCallback !== null && testCallback !== undefined) {
            this.__test__calledAfterSavingDesktop = testCallback;
        }
    }

    __test__reportOnDesktopSaving(desktop) {
        this.__test__calledAfterSavingDesktop(desktop);
    }
}