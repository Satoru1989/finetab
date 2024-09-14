

class IconExtractor {
    isValidUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    getIconFromGoogleApi(domain) {
        return this.isValidUrl("https://www.google.com/s2/favicons?domain=" + domain).then(
                    (isValid) => isValid ? ("https://www.google.com/s2/favicons?domain=" + domain) : ""
                ).catch( () => "");
    }

    async getIconUrl(url) {
        let domain = (new URL(url)).hostname;

        let isValid = await this.isValidUrl("https://" + domain + "/apple-touch-icon.png"); 
        return (isValid) ? 
            ("https://" + domain + "/apple-touch-icon.png"): ""
            //this.getIconFromGoogleApi(domain);
    }
}

const iconExtractor = new IconExtractor();
export default iconExtractor;