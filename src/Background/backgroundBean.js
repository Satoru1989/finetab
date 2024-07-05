
export class BackgroundBean {
    /**
     * @param data
     * @param {string} type "video", "image", "youtubeUrl"
     * @param {bool} isFile
     */
    constructor(data, type, isFile) {
        this.data = data;
        this.type = type;
        this.isFile = isFile;
    }
}

export const backgroundIndexedDBStoreKey = "background";
export const newBackgroundUploadedEventName = "NewBackgroundUploaded";

export function isValidURL(url) {
    try {
        new URL(url);
        return true; 
    } catch (error) {
        return false;
    }
}
