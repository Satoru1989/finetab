
export class IndexDBObjectStore {
    #storeName = "FineTabStore";
    #dbName = "FineTabDataBase";
    #dbPromise = null;
    
    #throwOnDBOpenError(errorEvent) {
        throw new Error("Failed to open database: ", errorEvent.error);
    }

    #openIndexDB(resolve) {
        const request = window.indexedDB.open(this.#dbName);

        request.onerror = this.#throwOnDBOpenError;
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) =>
            event.target.result.createObjectStore(this.#storeName);
    }

    #getIndexedDbPromise() {
        return new Promise((resolve, reject) => {
            this.#openIndexDB(resolve);
        });
    }

    constructor() {
        this.#dbPromise = this.#getIndexedDbPromise();
    }

    async #getTransaction(rwMode) {
        const db = await this.#dbPromise;
        return db.transaction(this.#storeName, rwMode);
    }

    #throwOnTransactionAbort(errorEvent) {
        throw new Error("Transactions aborted ", errorEvent.error);
    }

    /**
     * @param {string} rwMode types are read readwrite write 
    */
    async getObjectStore(rwMode) {
        const transaction = await this.#getTransaction(rwMode);
        transaction.onabort = this.#throwOnTransactionAbort;

        return transaction.objectStore(this.#storeName);
    }
}