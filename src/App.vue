<script setup>
import Authorization from "./components/Authorization.vue";

import { ref, onMounted, onUpdated } from "vue";
</script>
<template>
  <div id="App">
    <router-view v-slot="{ Component }">
      <transition name="fade" >
        <component :is="Component" />
      </transition>
    </router-view>

  
  </div>

  <div style="height: 100vh" class="d-flex align-items-center" id="text">
    <h1 class="text-center">
      The application cannot be accessed from a device of this size
    </h1>
  </div>
</template>

<style lang="scss">
body {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23FFFFFF' stroke-width='3.3' stroke-opacity='0.18' %3E%3Ccircle fill='%23FFFFFF' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23fefefe' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23fcfcfc' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%23fbfbfb' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23fafafa' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23f9f9f9' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23f7f7f7' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23f6f6f6' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23f5f5f5' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23f3f3f3' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23f2f2f2' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23f1f1f1' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%23efefef' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%23eeeeee' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%23ededed' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%23ececec' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%23eaeaea' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23E9E9E9' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  font-family: "Quicksand", sans-serif;

  cursor: url("./assets/double-click.png") 4 12, auto;
}

::-webkit-scrollbar {
  display: none;
}

.fade-enter-active {
  transition: all 0.5s linear;

  transform: scale(1);
  filter: blur(0px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(3px);
}

.router-link-exact-active {
  box-shadow: 0 10px 10px rgb(204, 205, 205);
  background: #a5acb7;
  color: white;
}

@media (max-width: 800px) {
  #App {
    display: none !important ;
  }

  #text {
    display: block !important;
  }
}

@media (min-width: 900px) {
  #text {
    display: none !important;
  }
}

input[data-key="search"] {
  background: white
    url("https://cdn0.iconfinder.com/data/icons/ikonate/48/search-256.png");
  background-size: contain;
  background-position: 98%;
  background-size: 31px 31px;
  background-repeat: no-repeat;
  border-radius: 5px;
  transition: 0.5s;
}

input[data-key="search"]:focus {
  transform: translateY(-10px);
  box-shadow: 10px 15px 10px #c5c5c6 !important;
  outline: 1px rgba(98, 34, 202, 0.348) solid;
}

@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap");
</style>
