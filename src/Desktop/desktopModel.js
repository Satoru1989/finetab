import ItemFactory from "./itemFactory";
import indexedDBStore from "../PersistentStorage/indexedDBStore";
import ItemEvent from "./itemEvent";


/**
 * TODO 
 * Stop the madness with children of props of children props
 * 1) Separate representing item json data from the item components
 * 2) 
 * 
 * <Component data> I need to dinamicaly save
 *      I want data to be separate from ? 
 * 
 * 
 */

/**
    1) during innit
        ctor -> async retrive 

    2) during switching
    Retrive desktop by id.then(

    )
 */


export default class DesktopModel {
    #currentDesktop = null;
    #leftDesktop = null;
    #rightDesktop = null;

    currentDesktopItemJson = null;
    leftDesktopItemJson = null;
    rightDesktopItemJson = null;

    constructor() {
        this.itemFactory = new ItemFactory();
        this.updateItemsCallback = null;

        this.areDesktopsInitialized = this.initializeDesktopVariables().then(
            () => this.areDesktopsInitialized = true
        );

        document.addEventListener(ItemEvent.getEventName(), this.handleItemEvent);
    }

    async retrieveDesktopJson(desktopId) {
        let desktop = null;
        try {
            desktop = await indexedDBStore.readDataFromKey(desktopId);
        } catch (error) {
            console.error('Error retrieving desktop', error);
        }
 
        if (desktop === undefined || desktop === null)
            desktop = { items: [], id: desktopId }

        return desktop;
    }

    initializeDesktopVariables = async () => {
        this.#currentDesktop = await this.retrieveDesktopJson('desktop 0');
        this.currentDesktopItemsJson = this.#currentDesktop.items;
        this.#currentDesktop = this.itemFactory.getItemsAsComponents(this.currentDesktopItemsJson);
    
        if (this.updateItemsCallback !== null)
            this.updateItemsCallback();
        else 
            this.updateItemsCallback = () => {throw new Error('desktopModel: updateItemsCallback is not set');}

        this.#leftDesktop = this.retrieveDesktopJson('desktop -1').then(
            (desktop) => {
                this.#leftDesktop = desktop;
                this.leftDesktopItemJson = this.#leftDesktop.items;
                this.#leftDesktop = this.itemFactory.getItemsAsComponents(this.leftDesktopItemsJson);
            }
        );
        this.#rightDesktop = this.retrieveDesktopJson('desktop 1').then(
            (desktop) => {
                this.#rightDesktop = desktop;
                this.rightDesktopItemJson = this.#rightDesktop.items;
                this.#rightDesktop = this.itemFactory.getItemsAsComponents(this.rightDesktopItemJson);
            }
        );
    }

    setUpdateItemsCallback = (callback) => {
        this.updateItemsCallback = () => 
            callback(this.#currentDesktop.items)

        if (this.#currentDesktop !== null)
            this.updateItemsCallback();
    }

    deferCallbackUntilResourcesLoaded = (callback) => {
        if (this.areDesktopsInitialized instanceof Promise) {
            this.areDesktopsInitialized.then(callback);
            return true;
        } if (this.#rightDesktop instanceof Promise) {
            this.#rightDesktop.then(callback);
            return true;
        } if (this.#leftDesktop instanceof Promise) {
            this.#leftDesktop.then(callback);
            return true;
        }

        return false;
    }

    switchDesktop = (isSwitchingLeft) => {
        if (this.deferCallbackUntilResourcesLoaded(
            () => this.switchDesktop(isSwitchingLeft)))
            return;

        let nextDesktopIsEmpty =  isSwitchingLeft ? this.#leftDesktop.items.length === 0 : this.#rightDesktop.items.length === 0;
        if (this.#currentDesktop.items.length === 0 && nextDesktopIsEmpty) 
            return;

        if (isSwitchingLeft) {
            this.#rightDesktop = this.#currentDesktop;
            this.#currentDesktop = this.#leftDesktop;
        } else {
            this.#leftDesktop = this.#currentDesktop;
            this.#currentDesktop = this.#rightDesktop;
        }

        let desktopIdNumberStr = this.#currentDesktop.id.split(' ')[1];
        let nextDesktopIdNumber = parseInt(desktopIdNumberStr) + (isSwitchingLeft ? -1 : 1);
        
        if (isSwitchingLeft) {
            this.#leftDesktop = this.retrieveDesktopJson('desktop ' + nextDesktopIdNumber).then(
                (desktop) => 
                    this.#leftDesktop = desktop                
            );
        } else {
            this.#rightDesktop = this.retrieveDesktopJson('desktop ' + nextDesktopIdNumber).then(
                (desktop) => 
                    this.#rightDesktop = desktop
            );
        }

        this.updateItemsCallback();
    }

    switchToLeftDesktop = () => 
        this.switchDesktop(true)

    switchToRightDesktop = () =>
        this.switchDesktop(false)

    saveCurrentDesktop() {
        let desktopItemsJson = this.#currentDesktop.items.map( (itemComponent) => {
            let props = itemComponent.props.children.props;
            return { 
                name: props.name,
                data: props.data 
            };
        });

        console.log("Saving... ", desktopItemsJson);
        
        indexedDBStore.writeDataByKey(
            {items: desktopItemsJson, id: this.#currentDesktop.id}, 
            this.#currentDesktop.id).then( (desktop) => {
                console.log("Saved: " , desktop);
                this.__test__reportOnDesktopSaving(desktop);
            });
    }
    
    deleteItem = (id) => {
        let items = this.#currentDesktop.items;
        if (id < 0 || id >= items.length) return;

        items.splice(id, 1);
        for (let i = id; i < items.length; i++)
            items[i] = this.itemFactory.getItemAsComponent(items[i].props.children.props, i);
    }

    handleItemEvent = (e) => {
        if(this.deferCallbackUntilResourcesLoaded(
            () => this.handleItemEvent(e)))
            return;

        let itemEvent = new ItemEvent(e.detail);
        let item = itemEvent.itemJson;

        if (itemEvent.isCreateEventType) {
            /**
             * ISSUE
             * For some reason getItemAsComponent transforms the file blob inside link into {}
             * json copying it is inside getItemAsComponent
             * but if no copy edit no work
             * oh no
             */
            let newItem = this.itemFactory.getItemAsComponent(item, this.#currentDesktop.items.length);
            this.#currentDesktop.items.push(newItem);
        } else if (itemEvent.isDeleteEventType) {
            this.deleteItem(item.id);
        } else if (itemEvent.isEditEventType) {
            let newItem = this.itemFactory.getItemAsComponent(item, item.id);
            this.#currentDesktop[item.id] = newItem; 
        }

        this.updateItemsCallback();
        this.saveCurrentDesktop();
    }

    destructor() {
        document.removeEventListener(ItemEvent.getEventName(), this.handleItemEvent);
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