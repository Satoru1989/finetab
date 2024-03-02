import '@jest/globals'
import "core-js/stable/structured-clone";
import "fake-indexeddb/auto";
import indexedDBStore from './indexedDBStore';

class Test {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

describe("indexedDBStore class", () => {
    const key = "key"
    const firstData = "first entry";
    
    const classData = new Test("a", true);

    function expectReadDataToBe(data) {
        indexedDBStore.readDataFromKey(key).then((retrievedData) =>
            expect(retrievedData).toBe(data));
    }

    it("should create an entry if key doesn't exist", () => {
        indexedDBStore.writeDataByKey(firstData, key);
        expectReadDataToBe(firstData);
    });

    it("should update an entry if key exists", () => {
        const secondData = "second entry";
        indexedDBStore.writeDataByKey(secondData, key);
        expectReadDataToBe(secondData);
    });

    it("should retrive class data", () => {
        indexedDBStore.writeDataByKey(classData, key);
        indexedDBStore.readDataFromKey(key).then((retrievedData) =>
            expect(new Test(
                retrievedData.a,
                retrievedData.b
        )).toStrictEqual(classData));
    });
});