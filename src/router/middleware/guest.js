import { useRootStore } from "@/stores/root.js"


export default (to, from, next) => {
    const root = useRootStore();

    if (root.authenticated){
        next({name:'Home'});
    } else {
        next();
    }
}