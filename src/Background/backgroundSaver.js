import {isValidURL, BackgroundBean, 
        backgroundIndexedDBStoreKey, newBackgroundUploadedEventName} from "./backgroundBean";
import indexedDBStore from "../PersistentStorage/indexedDBStore";

export default class BackgroundSaver {
    #allowedImageTypes = [".jpg", ".jpeg", ".png", ".gif"];

    onErrorCallback = (err) => {}

    #getYoutubeEmbedUrlFormYoutubeUrl(stringUrl) {
        let url = new URL(stringUrl);
        return `https://www.youtube.com/embed/${url.searchParams.get("v")}?mute=1&;autoplay=1&;controls=0&;modestbranding=0&;loop=1&;showinfo=0&;autohide=1&;rel=0;`;
    }

    #getMediaTypeFromString(url) {
        if      (url.indexOf("youtube") !== -1) return "not found";//"youtubeUrl";
        else if (url.indexOf(".mp4") !== -1) return "video";
        else if (this.#allowedImageTypes.some(v => url.includes(v))) return "image";
        return "not found";
    }

    #getMediaTypePromise(url) {
        if (!isValidURL(url)) {
            this.onErrorCallback("Must be a valid url");
            return "not found";
        }
    
        let mediaType = this.#getMediaTypeFromString(url);
        if (mediaType === "not found")
            this.onErrorCallback("Wrong format of url must be " + this.#allowedImageTypes.toString() + 
                    ", mp4 or a youtube url");
    
        return mediaType;
    }

    async #save(backgroundBean) {
        await indexedDBStore.writeDataByKey(
            backgroundBean,
            backgroundIndexedDBStoreKey
        );
    }

    #dispatchNewBackgroundEvent(backgroundBean) {
        const event = new CustomEvent(newBackgroundUploadedEventName, {detail: backgroundBean});
        window.dispatchEvent(event);
    }

    saveUrl(url) {
        let mediaType = this.#getMediaTypePromise(url);
        let sourceUrl = url;

        if (mediaType === "not found") return;
        if (mediaType === "youtubeUrl") 
            sourceUrl = this.#getYoutubeEmbedUrlFormYoutubeUrl(url);

        let backgroundBean = new BackgroundBean(
            sourceUrl,
            mediaType,
            false
        );

        this.#save(backgroundBean);
        this.#dispatchNewBackgroundEvent(backgroundBean);
    }

    async saveBlob(blob) {
        if ( !(blob instanceof Blob)) {
            this.onErrorCallback("Bad file");
            return;
        }

        let mediaType = blob.type.toString();
        if (mediaType.startsWith("video")) mediaType = "video";
        if (mediaType.startsWith("image")) mediaType = "image";

        let backgroundBean = new BackgroundBean(
            blob,
            mediaType,
            true
        );

        await this.#save(backgroundBean);

        backgroundBean.data = URL.createObjectURL(backgroundBean.data);
        this.#dispatchNewBackgroundEvent(backgroundBean);
    }
}