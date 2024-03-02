import { IndexDBObjectStore } from './indexDBObjectStore'

class IndexedDBStore {
    #objectStore = new IndexDBObjectStore();

    /** Creates an entry if key doesn't exist
    * @param {any} data
    * @param {string} keys
    */
    async writeDataByKey(data, key) {
        const objectStore = await this.#objectStore.getObjectStore("readwrite");
        const request = objectStore.put(data, key);

        request.onerror = (errorEvent) => {
            throw new Error("Error during writing ", errorEvent.error);
        }
    }

    /** 
    * @param {sting} key 
    * @returns {Promise}
    */
    async readDataFromKey(key) {
        const objectStore = await this.#objectStore.getObjectStore("readonly");
        const request = objectStore.get(key);

        return new Promise((resolve, reject) => { 
            request.onsuccess = () => {
                resolve(request.result);
            }

            request.onerror = () => reject(`Error reading from key: ${key}.\n ${request.error}`);
        });
    }
}

const indexedDBStore = new IndexedDBStore();
export default indexedDBStore;