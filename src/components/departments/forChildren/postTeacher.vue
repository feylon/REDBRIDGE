<template>
  <div>
    <div class="container py-5">
      <h1 class="mt-5">Add teachers</h1>
      <div class="row">
        <div class="col-6">
          <input
            type="text"
            class="form-control-lg w-100"
            placeholder="Firstname"
            v-model="firstName"
          />
        </div>

        <div class="col-6">
          <input
            type="text"
            class="form-control-lg w-100"
            placeholder="Lastname"
            v-model="lastName"
          />
        </div>

        <div class="col-6">
          <input
            type="text"
            class="form-control-lg w-100"
            placeholder="Fathername"
            v-model="fatherName"
          />
        </div>

        <div class="col-6">
          <input
            type="text"
            class="form-control-lg  w-100"
            placeholder="Username"
            v-model="userName"
            ref = 'user'
          />
        </div>

        <div class="col-12">
          <input
            type="password"
            class="form-control-lg w-100"
            placeholder="password"
            v-model="password"
          />
        </div>

        <div class="col-12">
          <button
            class="
              btn btn-dark
              d-flex
              align-items-center
              gap-3
              bg-gradient
              w-25
              float-start
            "
            @click="backOneStep()"
          >
            <i class="fas fa-backspace fa-2x"></i> back
          </button>
          <button
            class="btn btn-success bg-gradient w-25 float-end"
            @click="PostTeachers"
            ref="send"
          >
            Add teacher <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <Transition name="bounce">
      <div class="card w-50 m-auto bg-success p-3" v-if="show">
        <h3 class="text-center text-white">
          Teacher success added <i class="far fa-check-circle"></i>
        </h3>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import base from '../../../reusables/getInfos'

let user = ref()
let show = ref(false);
let firstName = ref();
let lastName = ref();
let fatherName = ref();
let userName = ref();
let password = ref();
let send = ref();
let router = useRouter();
let backOneStep = () => {
  router.go(-1);
};

let PostTeachers = async () => {
  let response = await axios.post(
    `${base}Authentication/registrate`,
    {
      firstName: firstName.value,
      lastName: lastName.value,
      fatherName: fatherName.value,
      userName: userName.value,
      password: password.value,
    },
    {
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  if (response.data) {
    show.value = true;
    firstName.value = "";
    lastName.value = "";
    fatherName.value = "";
    userName.value = "";
    password.value = "";

    setTimeout(() => {
      show.value = false;
    }, 3000);
  }

  console.log(response);
};

watch(userName, () => {
  if (userName.value == "admin") {
    send.value.setAttribute("disabled", "");
    send.value.setAttribute("class", "btn btn-danger text-white bg-gradient w-25 float-end");
    send.value.innerHTML = 'addition is prohibited !'
user.value.setAttribute('class', 'border border-danger form-control-lg  w-100')

  } else {
    send.value.removeAttribute("disabled", "");
    send.value.setAttribute("class", "btn btn-success text-white text-dark bg-gradient w-25 float-end");
    send.value.innerHTML = 'Add Teacher'
    user.value.setAttribute('class', 'form-control-lg  w-100')
  }
});
</script>

<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.btn {
  transition: 0.1s;
}
</style>