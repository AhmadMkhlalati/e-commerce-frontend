import { useRootStore } from "@/stores/root.js"


export default (to, from, next) => {
    const root = useRootStore();

    if (root.authenticated == false){
        next({name:'SignIn'})
    } else {
        next()
    }
}