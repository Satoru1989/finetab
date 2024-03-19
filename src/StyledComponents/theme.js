import settingStore from "../PersistentStorage/settingsStore";


export default class Theme {
    static instance = null;

    #theme = {
        "backgroundColor": "#14141fbf",
        "primaryColor": "#28283ed9",
        "secondaryColor": "#141414ff",
        "textColor": "#ff66d6d9"
    }

    constructor() {
        if (Theme.instance) {
            return Theme.instance;
        }

        let themeSetting = JSON.parse(settingStore.getSetting("theme"));
        if (!themeSetting) {
            settingStore.setSetting("theme", JSON.stringify(this.#theme));
        } else
            this.#theme = themeSetting;

        Theme.instance = this;
    }

    setTheme(newTheme) {
        this.#theme = newTheme;
        settingStore.setSetting("theme", JSON.stringify(newTheme));
    }

    getTheme = () => this.#theme;
}