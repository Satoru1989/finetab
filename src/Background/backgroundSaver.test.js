import "core-js/stable/structured-clone";
import 'fake-indexeddb/auto'
import indexedDBStore from "../PersistentStorage/indexedDBStore";
import { BackgroundBean, backgroundIndexedDBStoreKey } from "./backgroundBean";
import BackgroundSaver from "./backgroundSaver";
import { BackgroundLoader } from "./backgroundLoader";

global.URL.createObjectURL = jest.fn((arg) => "mock-object-url");
global.window.alert = jest.fn((arg) => console.log("BackgroundSaver error: ", arg))


describe("BackgroundSaver test suite", () => {
    let backgroundSaver = new BackgroundSaver();
    let mockOnErrorCallback = jest.fn();

    beforeAll( () =>
        backgroundSaver.onErrorCallback = mockOnErrorCallback
    );

    it("Calls onErrorCallback when blob isn't the instance of Blob", () => {
        backgroundSaver.saveBlob("Bad blob");
        expect(mockOnErrorCallback).toHaveBeenCalledWith("Bad file");
    });

    it("Calls onErrorCallback when url has a bad format", () => {
        backgroundSaver.saveUrl("badurl.png");
        expect(mockOnErrorCallback).toHaveBeenCalledWith("Must be a valid url");
    });

    it("Calls onErrorCallback when url has a wrong file extension", () => {
        backgroundSaver.saveUrl("https://badurl.BadExtension");
        expect(mockOnErrorCallback).toHaveBeenCalledWith(
            expect.stringMatching(/^Wrong format of url must be .*, mp4 or a youtube url$/)
        );
    });


    let goodUrl = "https://goodUrl.png";
    it("Saves the url in index db", async () => {
        backgroundSaver.saveUrl(goodUrl);

        expect(mockOnErrorCallback).not.toHaveBeenCalled();
        
        let data = await indexedDBStore.readDataFromKey(backgroundIndexedDBStoreKey);
        let expectedData = JSON.parse(JSON.stringify((new BackgroundBean(goodUrl, "image", false))));

        expect(data).toStrictEqual(expectedData);
    });

    test("Saved data can be retrieved by BackgroundLoader", async () => {
        backgroundSaver.saveUrl(goodUrl);

        const loader = new BackgroundLoader();
        let backgroundBean = await loader.getBackgroundBeanPromise();

        expect(backgroundBean).toStrictEqual(
            new BackgroundBean(goodUrl, "image", false)
        );
    });
});