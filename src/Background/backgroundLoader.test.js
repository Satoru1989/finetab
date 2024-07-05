
import "core-js/stable/structured-clone";
import 'fake-indexeddb/auto'
import { BackgroundLoader } from "./backgroundLoader";
import indexedDBStore from "../PersistentStorage/indexedDBStore";
import { BackgroundBean, backgroundIndexedDBStoreKey } from "./backgroundBean";


global.URL.createObjectURL = jest.fn((arg) => "mock-object-url");
global.window.alert = jest.fn((arg) => "window alert mock");


describe('Background loader class', () => {
    let backgroundLoader = new BackgroundLoader();

    test("should retrive file BackgroundBean transforming file data into blob", async () => {
        let expectedFileBean = new BackgroundBean(
            new Blob(['image data'], { type: 'image/jpeg' }),
            "image", 
            true); 
        
        await indexedDBStore.writeDataByKey(expectedFileBean, backgroundIndexedDBStoreKey);
        
        expectedFileBean.data = URL.createObjectURL(expectedFileBean.data);

        let responsePromise = backgroundLoader.getBackgroundBeanPromise();
        const data = await responsePromise;
        expect(data).toStrictEqual(expectedFileBean);
    });

    test("should retrieve url BackgroundBean", async () => {
        let expectedUrlBean = new BackgroundBean(
            "https://something.jpg",
            "image", 
            false
        );
    
        await indexedDBStore.writeDataByKey(expectedUrlBean, backgroundIndexedDBStoreKey);
        
        let responsePromise = backgroundLoader.getBackgroundBeanPromise();

        const data = await responsePromise;
        expect(data).toStrictEqual(expectedUrlBean);
    });

    test("should on error return the default BackgroundBean", async () => {
        let badData = "baddata";

        await indexedDBStore.writeDataByKey(badData, backgroundIndexedDBStoreKey);

        let responsePromise = backgroundLoader.getBackgroundBeanPromise();

        const data = await responsePromise;
        expect(data).toStrictEqual(backgroundLoader.getDefaultBackground());
        expect(alert).toHaveBeenCalled();
    });
}); 
