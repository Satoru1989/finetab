
class SettingsStore {
    constructor() {
        this.subscribers = {};
    }

    getSetting(settingName) {
        return localStorage.getItem(settingName);
    }

    setSetting(settingName, value) {
        localStorage.setItem(settingName, value);
        if (this.subscribers[settingName]) {
            this.subscribers[settingName].forEach(callback => callback(value));
        }
    }

    subscribeToSettingChange(settingName, callback) {
        if (!this.subscribers[settingName])
            this.subscribers[settingName] = [];

        this.subscribers[settingName].push(callback);
    } 
}

const settingStore = new SettingsStore();
export default settingStore;