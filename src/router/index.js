import { createRouter, createWebHistory } from 'vue-router'
import middleware from "./middleware";


import HomePage from '@/views/HomePage.vue'
import AddUserPage from '@/views/AddUserPage.vue'
import AddClassPricePage from '@/views/AddClassPrices.vue'
import AddRoles from '@/views/AddRoles.vue'
import SignIn from '@/views/SignIn.vue'
import AddTagsPage from '@/views/AddTagsPage.vue'
import AddLabelsPage from '@/views/AddLabelPage.vue'
import AddUnitsPage from '@/views/AddUnitPage.vue'
import AddLanguagePage from '@/views/AddLanguagesPage.vue'
import AddTaxPage from '@/views/AddTaxPage.vue'
import AddFieldsPage from '@/views/AddFieldPage.vue'
import AddCountriesPage from '@/views/AddCountriesPage.vue'
import AddCategoryPage from '@/views/AddCategoryPage.vue'
import AddBrandsPage from '@/views/AddBrandPage.vue'
import AddCurrencyPage from '@/views/AddCurrencyPage.vue'
import AddProductPage from '@/views/AddProductPage.vue'
import EditProductPage from '@/views/EditProductPage.vue'
import SettingsPage from '@/views/settings.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import PriceListPage from '@/views/PriceList.vue'
import OrderPage from '@/views/AddOrderPage.vue'
import EditOrderPage from '@/views/EditOrderPage.vue'
import OrderDataTablePage from '@/views/OrdersPage.vue'
import couponPage from '@/views/AddCoupon.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      beforeEnter: middleware.user

    },
    {
      path: '/login',
      name: 'SignIn',
      component: SignIn,
      beforeEnter: middleware.guest
    },
    {
      path: '/users',
      name: 'Users',
      component: AddUserPage,
      beforeEnter: middleware.user
    },
    {
      path: '/product/create',
      name: 'CreateProduct',
      component: AddProductPage,
      beforeEnter: middleware.user
    },
    {
      path: '/product/edit/:id',
      name: 'EditProduct',
      component: EditProductPage,
      beforeEnter: middleware.user
    },
    {
      path: '/tags',
      name: 'Tags',
      component: AddTagsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/labels',
      name: 'Labels',
      component: AddLabelsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/currency',
      name: 'Currency',
      component: AddCurrencyPage,
      beforeEnter: middleware.user
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/pricing-classes',
      name: 'ClassPrice',
      component: AddClassPricePage,
      beforeEnter: middleware.user
    },
    {
      path: '/pricing-list',
      name: 'PriceList',
      component: PriceListPage,
      beforeEnter: middleware.user
    },
    {
      path: '/order/create',
      name: 'OrderPage',
      component: OrderPage,
      beforeEnter: middleware.user
    },
    {
      path: '/order/edit/:id',
      name: 'EditOrderPage',
      component: EditOrderPage,
      beforeEnter: middleware.user
    },
    {
      path: '/orders',
      name: 'OrderDataTablePage',
      component: OrderDataTablePage,
      beforeEnter: middleware.user
    },
    {
      path: '/product',
      name: 'ProductsPage',
      component: ProductsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/coupon',
      name: 'couponPage',
      component: couponPage,
      beforeEnter: middleware.user
    },
    {
      path: '/units',
      name: 'Units',
      component: AddUnitsPage,
      beforeEnter: middleware.user
    },
    { 
      path: '/language',
      name: 'Languages',
      component: AddLanguagePage,
      beforeEnter: middleware.user
    },
    {
      path: '/taxes',
      name: 'Taxes',
      component: AddTaxPage,
      beforeEnter: middleware.user
    },
    {
      path: '/fields',
      name: 'Fields',
      component: AddFieldsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/countries',
      name: 'Countries',
      component: AddCountriesPage,
      beforeEnter: middleware.user
    },
    {
      path: '/categories',
      name: 'Categories',
      component: AddCategoryPage,
      beforeEnter: middleware.user
    },
    {
      path: '/brands',
      name: 'Brands',
      component: AddBrandsPage,
      beforeEnter: middleware.user
    },
    {
      path: '/roles',
      name: 'Roles',
      component: AddRoles,
      beforeEnter: middleware.user
    },
  ]
})

export default router
