export const useLocalStorage = () => {
    const storage = window.localStorage;
    const getItem = (key: string) => {
        const value = storage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    };
    const setItem = (key: string, value: any) => {
        storage.setItem(key, JSON.stringify(value));
    }
    const removeItem = (key: string) => {
        storage.removeItem(key);
    }
    const clear = () => {
        storage.clear();
    }
    return { getItem, setItem, removeItem, clear };

}
