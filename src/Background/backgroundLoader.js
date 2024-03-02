import indexedDBStore from "../PersistentStorage/indexedDBStore";
import { BackgroundBean, backgroundIndexedDBStoreKey } from './backgroundBean';

export class BackgroundLoader {
    #defaultBackground = new BackgroundBean(
        "../../resources/defaultBackground/waterfall.mp4",
        "video",
        true
    );
    #background = this.#defaultBackground;

    #transformBlobIntoObjectUrl() {
        this.#background.data = URL.createObjectURL(this.#background.data);
    }
     
    getDefaultBackground = () => this.#defaultBackground;

    /**
     * @returns {Promise}
     */
    getBackgroundBeanPromise() {       
        return new Promise( (resolve) => {
            indexedDBStore.readDataFromKey(backgroundIndexedDBStoreKey).then( 
                (backgroundData) => {
                    if ([backgroundData.data, backgroundData.type, backgroundData.isFile].includes(undefined))
                        throw Error("Retrieved data is undefined");

                    this.#background = new BackgroundBean(
                        backgroundData.data,
                        backgroundData.type,
                        backgroundData.isFile
                    );

                    if (this.#background.isFile)
                        this.#transformBlobIntoObjectUrl();     
                    
                    resolve(this.#background);    
                }
            ).catch((error) => {
                window.alert("Error retrieving background using defaults\n" + error);        
                resolve(this.#defaultBackground);
            });
        });
    } 
}