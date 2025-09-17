export const saveToLocalStorage = (key,data) => {
    localStorage.setItem(key,JSON.stringify(data))
}

export const getFromLocalStorage = (key) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null
}

export const testLog = () => {
  console.log("LocalStorage file çalışıyor");
};
