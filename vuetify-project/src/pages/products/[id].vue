<template>
    <v-container>
      <v-col cols="12">
        <h1 class="text-center">{{ product.name }}</h1>
      </v-col>
      <v-col cols="12">
        <v-img :src="product.image" height="200"></v-img>
      </v-col>
      <v-col cols="12">
        <p>${{ product.price }}</p>
        <p>{{ product.description }}</p>
      </v-col>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { definePage } from 'vue-router/auto'
  import { useRoute } from 'vue-router'
  import { useApi } from '@/composables/axios'
  import { useSnackbar } from 'vuetify-use-dialog'
  
  definePage({
    meta: {
      title: '購物網 | 商品',
      login: false,
      admin: false
    }
  })
  
  const { api } = useApi()
  const route = useRoute()
  const createSnackbar = useSnackbar()
  
  const product = ref({
    _id: '',
    name: '',
    price: 0,
    description: '',
    image: '',
    sell: true,
    category: ''
  })
  
  const load = async () => {
    try {
      const { data } = await api.get('/product/' + route.params.id)
      product.value._id = data.result._id
      product.value.name = data.result.name
      product.value.price = data.result.price
      product.value.description = data.result.description
      product.value.image = data.result.image
      product.value.sell = data.result.sell
      product.value.category = data.result.category
  
      document.title = '購物網 | ' + product.value.name
    } catch (error) {
      console.log(error)
      createSnackbar({
        text: error?.response?.data?.message || '發生錯誤',
        snackbarProps: {
          color: 'red'
        }
      })
    }
  }
  load()
  </script>
  