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

    function expectReadDataToBe(data, done) {
        indexedDBStore.readDataFromKey(key).then((retrievedData) => {
            expect(retrievedData).toBe(data);
            done();
        });
    }

    it("should create an entry if key doesn't exist", done => {
        indexedDBStore.writeDataByKey(firstData, key);
        expectReadDataToBe(firstData, done);
    });

    it("should update an entry if key exists", done => {
        const secondData = "second entry";
        indexedDBStore.writeDataByKey(secondData, key);
        expectReadDataToBe(secondData, done);
    });

    it("should retrive class data", done => {
        indexedDBStore.writeDataByKey(classData, key);
        indexedDBStore.readDataFromKey(key).then((retrievedData) => {
                expect(new Test(
                retrievedData.a,
                retrievedData.b
            )).toStrictEqual(classData)
            done();
        });
    });

    it("should resolve on successefull write", done => {
        indexedDBStore.writeDataByKey(key, firstData).then( (data) => {
            expect(data).toBe(firstData)
            done();
        })
    });
});