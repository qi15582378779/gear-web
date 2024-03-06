declare const localStorage: any;
export const Storage = {
  setItem: (key: string, value: any) => {
    localStorage[key] = value;
  },
  getItem: (key: string) => {
    return localStorage[key] === undefined ? '' : localStorage[key];
  },
  setObject(key: string, value: any) {
    try {
      localStorage[key] = JSON.stringify(value);
    } catch (e: any) {
      alert(e.message);
    }
  },
  getObject(key: string) {
    // const result = localStorage[key] || '{}'
    // return JSON.parse(result);
  },
  getArray(key: string) {
    // const result = localStorage[key] || '[]'
    // return JSON.parse(result);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};
