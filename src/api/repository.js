import axios from "axios";
var apiBaseUrl;
if (import.meta.env.MODE == 'development') {
    apiBaseUrl = 'http://localhost:8000/'
}else{
    apiBaseUrl = 'https://app.itsconsigliere.com/'
}

let instance = axios.create({
    withCredentials:true,
    xsrfHeaderName: 'X-XSRF-TOKEN',
    baseURL: apiBaseUrl,
    headers: {
        'X-Requested-With' : 'XMLHttpRequest',
        "Content-type": "application/json",
        "Accept": "application/json",
    }
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("user");
            return error.response
        }
        else if (error.response.status === 500) {
            return error.response
        }
        else if (error.response.status === 422) {
            return error.response;
        }
        else {
            return Promise.reject(error);
        }
    }
);

export default {
    getToken(){
        return instance.get('/sanctum/csrf-cookie');
    },
    login(params){
        return instance.post('api/login', params);
    },
    logout(){
        return instance.get('api/logout');
    },
    getTags(params){
        return instance.post('api/dashboard/tag/all',params)
    },
    getRoles(){
        return instance.get('api/dashboard/role')
    },
    getCurrencies(){
        return instance.get('api/dashboard/currency')
    },  
    getNonVirtualClasses(id){
        return instance.get('api/dashboard/price/create/'+id)
    },
    getClassPrices(params ,page = 1){
        return instance.post('api/dashboard/price/all?page='+ page ,params )
    },
    getUsers(params ,page = 1){
        return instance.post('api/dashboard/user/all?page='+ page ,params )
    },
    addUser(params){
        return instance.post('api/dashboard/user' ,params )
    },
    addClassPrice(params){
        return instance.post('api/dashboard/price' ,params )
    },
    addTag(params){
        return instance.post('api/dashboard/tag', params)
    },
    deleteTag(params){
        return instance.delete('api/dashboard/tag/'+params )
    },
    updateTag(params){
        return instance.put('api/dashboard/tag/'+params.id ,params)
    },
    getSpecificTag(id){
        return instance.get('api/dashboard/tag/' + id)
    },
    getLabels(){
        return instance.get('api/dashboard/label')
    },
    getDataTable(link, params = ''){
        return instance.get(link + params)
    },
    postDataTable(link, params){
        return instance.post(link , params)
    },
    postHeaderDataTable(link, params){
        return instance.post(link , params)
    },
    getLabels(params){
        return instance.post('api/dashboard/label/all', params)
    },
    getAllLabels(){
        return instance.get('api/dashboard/label')
    },
    createLabel(params){
        return instance.post('api/dashboard/label', params)
    },
    getUnits(params){
        return instance.post('api/dashboard/unit/all', params)
    },
    addUnit(params){
        return instance.post('api/dashboard/unit', params)
    },
    deleteUnit(params){
        return instance.delete('api/dashboard/unit/'+params )
    },
    updateUnit(params){
        return instance.put('api/dashboard/unit/'+params.id ,params)
    },
    getSpecificUnit(id){
        return instance.get('api/dashboard/unit/' + id)
    },

    getSpecificCurrency(id){
        return instance.get('api/dashboard/currency/' + id)
    },
    getCurrency(params){
        return instance.post('api/dashboard/currency/all', params)
    },

    getLanguages(params){
        return instance.post('api/dashboard/language/all', params)
    },
    getSpecificLanguage(id){
        return instance.get('api/dashboard/language/' + id)
    },

    getTaxes(params){
        return instance.post('api/dashboard/tax/all', params)
    },
    getComponentsTaxList(params){
        return instance.get('api/dashboard/tax/create')
    },
    addTax(params){
        return instance.post('api/dashboard/tax', params)
    },
    updateTax(params){
        return instance.put('api/dashboard/tax/' + params.id, params)
    },
    getSpecificTax(id){
        return instance.get('api/dashboard/tax/' + id)
    },
    deleteTax(params){
        return instance.delete('api/dashboard/tax/'+params )
    },

    addField(params){
        return instance.post('api/dashboard/field', params)
    },
    deleteField(params){
        return instance.delete('api/dashboard/field/'+params )
    },
    updateField(params){
        return instance.put('api/dashboard/field/'+params.id ,params)
    },
    getSpecificField(id){
        return instance.get('api/dashboard/field/' + id)
    },

    updateSettings(params){
        return instance.put('api/dashboard/setting/' + params.key, params)
    },

    getAllFields(){
        return instance.get('api/dashboard/field')
    },
    getCountries(params){
        return instance.post('api/dashboard/country/all', params)
    },
    createCountry(params){
        return instance.post('api/dashboard/country', params)
    },
    getCategories(params){
        return instance.post('api/dashboard/category/all', params)
    },
    getProductData(){
        return instance.get('api/dashboard/product/create')
    },
    getSpecificProduct(id){
        return instance.get('api/dashboard/product/'+ id)
    },
    getProducts(params){
        return instance.post('api/dashboard/product/bundle', params)
    },
    getProductsOrder(params){
        return instance.get('api/dashboard/product/get-products-for-order', params)
    },
    getSpecificOrder(params){
        return instance.get('api/dashboard/order/'+params)
    },
    updateOrder(params){
        return instance.put('api/dashboard/order/'+params.code ,params)
    },
    getCouponOrder(params){
        return instance.post('api/dashboard/coupon/get-coupon-by-code/'+ params)
    },
    createCategory(params){
        return instance.post('api/dashboard/category', params)
    },
    updateCategory(params){
        return instance.put('api/dashboard/category/'+params.id ,params)
    },
    deleteCategory(params){
        return instance.delete('api/dashboard/category/'+params )
    },
    getBrands(params){
        return instance.post('api/dashboard/brands/all', params)
    },
    createBrand(params){
        return instance.post('api/dashboard/brands', params)
    },
    getProductReq(params){
        return instance.post('api/dashboard/product/add', params)
    },
    updateProduct(id, params){
        return instance.post('api/dashboard/product/'+id, params)
    },
    createProduct(params){
        return instance.post('api/dashboard/product', params)
    },
    getRoles(params ,page = 1){
        return instance.post('api/dashboard/role/all?page='+ page ,params )
    },
    getRolesList(id){
        return instance.get('api/dashboard/role/create/'+id)
    },
    addRole(params){
        return instance.post('api/dashboard/role' ,params )
    },
    deleteRole(params){
        return instance.delete('api/dashboard/role/'+params )
    },
    getParentPermissions(params){
        return instance.post('api/dashboard/role/get-nested-permissions-for-role',params )
    },
    deleteUser(params){
        return instance.delete('api/dashboard/user/'+params )
    },
    updateUser(params){
        return instance.put('api/dashboard/user/'+params.id ,params)
    },
    getSpecificUser(params){
        return instance.get('api/dashboard/user/'+params )
    },
    updatePriceClass(params){
        return instance.put('api/dashboard/price/'+params.id ,params)
    },
    updateRole(params){
        return instance.put('api/dashboard/role/'+params.id ,params)
    },
    getSpecificPriceClass(params){
        return instance.get('api/dashboard/price/'+params )
    },
    getSpecificRole(params){
        return instance.get('api/dashboard/role/'+params )
    },
    getSpecificCountry(params){
        return instance.get('api/dashboard/country/'+params )
    },
    getSpecificBrand(params){
        return instance.get('api/dashboard/brand/'+params )
    },
    deleteCountry(param){
        return instance.delete('api/dashboard/country/'+param )
    },
    deleteLabel(param){
        return instance.delete('api/dashboard/label/'+param )
    },
    deleteBrand(param){
        return instance.delete('api/dashboard/brand/'+param )
    },
    getSpecificLabel(params){
        return instance.get('api/dashboard/label/'+params )
    },
    getSpecificCategory(params){
        return instance.get('api/dashboard/category/'+params )
    },
    getFieldsAndLabels(){
        return instance.get('api/dashboard/brand/create')
    },
    getFieldsAndLabelsAndParents(){
        return instance.get('api/dashboard/category/create')
    },
    deleteProduct(params){
        return instance.delete('api/dashboard/product/'+params )
    },
    getClassPricesList(){
        return instance.get('api/dashboard/price/get-list')
    },
    updatePriceList(params){
        return instance.put('api/dashboard/price_list' ,params)
    },

    createOrderData(){
        return instance.get('api/dashboard/order/create')
    },
    createOrder(params){
        return instance.post('api/dashboard/order', params)
    },
    addCoupon(params){
        return instance.post('api/dashboard/coupon', params)
    },
    deleteCoupon(params){
        return instance.delete('api/dashboard/coupon/'+params )
    },
    updateCoupon(params){
        return instance.put('api/dashboard/coupon/'+params.id ,params)
    },
    getSpecificCoupon(params){
        return instance.get('api/dashboard/coupon/'+params )
    },
    getDefaultCurrency(){
        return instance.get('api/dashboard/coupon/create')
    },
    createBrand(params){
        return instance.post('api/dashboard/brand', params);
    },
    updateBrand(params){
        return instance.put('api/dashboard/brand/'+params.id ,params)
    },
    createCountry(params){
        return instance.post('api/dashboard/country', params);
    },
    updateCountry(params){
        return instance.put('api/dashboard/country/'+params.id ,params)
    },
    addCurrency(params){
        return instance.post('api/dashboard/currency', params)
    },
    updateCurrency(params){
        return instance.put('api/dashboard/currency/'+params.id ,params)
    },
    createLabel(params){
        return instance.post('api/dashboard/label', params);
    },
    updateLabel(params){
        return instance.put('api/dashboard/label/'+params.id ,params)
    },
    addLanguage(params){
        return instance.post('api/dashboard/language', params)
    },
    updateLanguage(params){
        return instance.put('api/dashboard/language/'+params.id ,params)
    },
    getDasboardData(){
        return instance.get('api/dashboard/home')
    },
    getUniqueCode(){
        return instance.get('api/dashboard/generate-unique-code')
    },
    checkUniqueCode(params){
        return instance.post('api/dashboard/product/check-code-if-unique', params)
    },
}
