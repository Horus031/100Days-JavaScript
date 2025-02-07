export const storage = {
    setConfig: (key, value) => localStorage.setItem(key, JSON.stringify(value)),

    getConfig: (key) => {
        const config = JSON.parse(localStorage.getItem('config')) || {};
        return config[key];
    },
    
    saveConfig: (key, value) => {
        const config = JSON.parse(localStorage.getItem('config')) || {};
        config[key] = value;
        localStorage.setItem('config', JSON.stringify(config));
    },
}