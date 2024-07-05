import '@jest/globals'
import "core-js/stable/structured-clone";
import "fake-indexeddb/auto";
import indexedDBStore from '../PersistentStorage/indexedDBStore';
import DesktopModel from './desktopModel';
import ItemFactory from './itemFactory';
import ItemEvent from './itemEvent';


describe( 'Desktop model test suite', () => {

    let desktop0 = {
        items: [ 
            {name: "link", data: { word: "mio"}},
            {name: "testItem",data: { word: "subaru"}}, 
            {name: "link", data: { word: "fubuki"}},
        ],
        id: 'desktop 0'
    }

    let desktop1 = {
        items: [ 
            {name: "link", data: { word: "koone"}},
            {name: "testItem", data: { word: "ogayu"}}, 
        ],
        id: 'desktop 1'
    }

    let desktop2 = {
        items: [ 
            {name: "link", data: { word: "sora"}},
            {name: "testItem", data: { word: "roboco"}}, 
        ],
        id: 'desktop 2'
    }

    let desktopNegative1 = {
        items: [ 
            {name: "link", data: { word: "korone" }},
            {name: "link", data: { word: "okayu"}},
            {name: "testItem", data: { word: "miko"}}, 
        ],
        id: 'desktop -1'
    }

    beforeAll( done => {
        let nrCalled = 0
        function isDone() {
            nrCalled++;
            if (nrCalled >= 4) {
                done()
            }
        }

        indexedDBStore.writeDataByKey(desktop0, desktop0.id).then(isDone);
        indexedDBStore.writeDataByKey(desktop1, desktop1.id).then(isDone);
        indexedDBStore.writeDataByKey(desktop2, desktop2.id).then(isDone);
        indexedDBStore.writeDataByKey(desktopNegative1, desktopNegative1.id).then(isDone);
    }); 

    function matchItemsToDesktopComponents(items, desktop) {
        let itemFactory = new ItemFactory();

        const itemComponents = itemFactory.getItemsAsComponents(desktop.items);
        
        const expectedProps = itemComponents.map(comp => comp.props.children.props);
        const expectedTypes = itemComponents.map(comp => comp.props.children.type);

        const acutalProps = items.map(item => item.props.children.props);
        const acutalTypes = items.map(item => item.props.children.type);

        expect(acutalProps).toStrictEqual(expectedProps);
        expect(acutalTypes).toStrictEqual(expectedTypes);
    }

    function testItemEvent(expectedDesktop, itemEvent, done) {
        let desktopModel = new DesktopModel();

        let nrCalled = 0;
        callback = (items) => {
            nrCalled++;
            // first time called to innit the items when setUpdateItemsCallback is called
            if (nrCalled === 2) {
                matchItemsToDesktopComponents(items, expectedDesktop);
                desktopModel.destructor();
            }
        }

        desktopModel.setUpdateItemsCallback(callback);

        desktopModel.__test__setCalledAfterSavingDesktopCallback( () => {
            indexedDBStore.readDataFromKey(desktop0.id).then( (desktop) => {
                expect(desktop.items).toStrictEqual(expectedDesktop.items);
                done();
            });
            desktopModel.__test__setCalledAfterSavingDesktopCallback(() => {});
        });

        itemEvent.dispatchEvent();
    }

    test('Retrieves home desktop items correctly ', done => {
        let desktopModel = new DesktopModel();

        callback = (items) => {
            matchItemsToDesktopComponents(items, desktop0);
            done()
        }

        desktopModel.setUpdateItemsCallback(callback);
        desktopModel.destructor();
        done();
    });

    test('Switching desktop', done => {
        let desktopModel = new DesktopModel();

        let nrCalled = 0;
        callback = (items) => {
            nrCalled++;
            // default innit
            if (nrCalled === 1)
                matchItemsToDesktopComponents(items, desktop0);
            //go left
            if (nrCalled === 2)
                matchItemsToDesktopComponents(items, desktopNegative1);
            if (nrCalled === 3)
                matchItemsToDesktopComponents(items, {items: [], id: 'desktop -2'});
            // 2 left moves ignored due to the lack of desktops
            //go right
            if (nrCalled === 4)
                matchItemsToDesktopComponents(items, desktopNegative1);
            if (nrCalled === 5)
                matchItemsToDesktopComponents(items, desktop0);
            if (nrCalled === 6)
                matchItemsToDesktopComponents(items, desktop1);
            //go left
            if (nrCalled === 7)
                matchItemsToDesktopComponents(items, desktop0);
            if (nrCalled >= 7) {
                desktopModel.destructor();
                done();
            }
        }

        desktopModel.setUpdateItemsCallback(callback);

        desktopModel.switchToLeftDesktop();
        desktopModel.switchToLeftDesktop();
        desktopModel.switchToLeftDesktop();
        desktopModel.switchToLeftDesktop();
        
        desktopModel.switchToRightDesktop();
        desktopModel.switchToRightDesktop();
        desktopModel.switchToRightDesktop();

        desktopModel.switchToLeftDesktop();
    });

    
    test('Create ItemEvent', done => {
        let newItem = { name: 'link', data: { word: 'koyori' } };
        
        let itemEvent = new ItemEvent();
        itemEvent.isCreateEventType = true;
        itemEvent.itemJson = newItem;

        indexedDBStore.readDataFromKey(desktop0.id).then( (desktop) => {
            desktop.items.push(newItem);
            testItemEvent(desktop, itemEvent, done);
            }
        );
    });

    test('Delete ItemEvent', done => {
        const deleteId = 1;

        let itemEvent = new ItemEvent();
        itemEvent.isDeleteEventType = true;
        itemEvent.itemJson = {name: "testItem", id: deleteId, data: { word: "subaru" }};

        indexedDBStore.readDataFromKey(desktop0.id).then( (desktop) => {
            desktop.items.splice(deleteId, 1);
            testItemEvent(desktop, itemEvent, done);
        });
    });
    
    test('Editing', done => {
        let itemEvent = new ItemEvent();
        itemEvent.isEditEventType = true;
        itemEvent.itemJson = { name: "testItem", id: 1, data: {word: "duck" } }

        indexedDBStore.readDataFromKey(desktop0.id).then( (desktop) => 
            testItemEvent(desktop, itemEvent, done));
    });

    // TODO
    test('Full testing', done => {done()});
});