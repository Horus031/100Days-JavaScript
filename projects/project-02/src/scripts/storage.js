export const storage = {

    getConfig: (key) => JSON.parse(localStorage.getItem(key)) || {},

    saveConfig: (key, value) => {
        const config = JSON.parse(localStorage.getItem(key)) || {};
        config[key] = value;
        localStorage.setItem(key, JSON.stringify(config));
    },
}