export const events = {
    handleDarkMode: function(button, htmlElement, configHandler) {
        button.addEventListener('click', () => {
            const isDark = htmlElement.classList.toggle('dark');
            configHandler.saveConfig('isDark', isDark);
        });
        let darkMode = configHandler.getConfig('isDark');
        if (darkMode.isDark) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    },

    handleGridSelect: function(gridSelect) {
        gridSelect.addEventListener('change', () => {
            
        })
    }
} 