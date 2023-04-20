   
export default{
    methods: {
        isNumber (evt) {
            const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
            const keyPressed = evt.key;
            
            if (!keysAllowed.includes(keyPressed)) {
                   evt.preventDefault()
            }
        }
    },

}