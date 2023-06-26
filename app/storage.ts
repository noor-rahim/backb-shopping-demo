const get = (key:string) => {
    const val = localStorage.getItem(key);
    if(val) 
    return JSON.parse(val) 
} 

const set = (key:string, rawVal: any) => {
    const val = JSON.stringify(rawVal);
    localStorage.setItem(key, val);
    return true;
}

const remove = (key:string) => {
    localStorage.removeItem(key);
}

export default {get, set, remove};