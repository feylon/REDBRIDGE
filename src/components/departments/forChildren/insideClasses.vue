<template>
  <div class="container-fluid">
    <button class="btn btn-success rounded-pill w-25 my-5" @click="this.$router.go(-1)">
      <i class="far fa-circle-left"></i> back
    </button>

    <table class="table table-striped table-hover mt-4">
      <tr class="fw-bolder">
        <th scope="col">#</th>
        <th scope="col" v-for="subject in subjects" :key="subject.id">
          {{ subject.name }}
        </th>
      </tr>

      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>
            {{ student.firstName }}
          </td>

          <td v-for="subject in subjects" :key="subject.id">
            <span
              @click="toggleModal(scores.find(
                  (el) => el.subjectId == subject.id && el.studentId == student.id
                ))"
              class="p-3 rounded position-relative text-white"
              :class="{
                'bg-danger':
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage <= 75
                    ? true
                    : false,
                'bg-warning':
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage >= 76 &&
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage < 80
                    ? true
                    : false,
                'bg-success':
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage >= 80 &&
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage <= 100
                    ? true
                    : false,
              }"
            >
              {{
                scores.find(
                  (el) => el.subjectId == subject.id && el.studentId == student.id
                ).totalScore
              }}

              <span
                class="badge bg-info position-absolute"
                style="top: 0"
                v-if="
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage >= 0
                "
              >
                {{
                  scores.find(
                    (el) => el.subjectId == subject.id && el.studentId == student.id
                  ).procentage + "%"
                }}
              </span>
            </span>

            <n-modal v-model:show="showModal">
              <n-card
                style="width: 600px"
                title="Information"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
              >
                <template #footer>
                
                </template>
              </n-card>
            </n-modal>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../../../store/store.js";
import base from "../../../reusables/getInfos.js";



let students = ref([]);
let subjects = ref([]);
let scores = ref([]);
const route = useRoute();
const showModal = ref(false);

let toggleModal = (scores)=>{
  showModal.value = true;
  store.state.info = scores
}

onMounted(async () => {
  let student = await axios.get(
    `${import.meta.env.VITE_BASE_URL}Admin/Journal/ClassInfo?id=${route.params.id}`
  );

  student.data.students.forEach((stud) => {
    students.value.push(stud);
  });

  console.log(student);

  let sub = await axios.get(
    `${import.meta.env.VITE_BASE_URL}Admin/Journal/ClassInfo?id=${route.params.id}`
  );
  console.log(sub.data);

  sub.data.subjects.forEach((subj) => {
    subjects.value.push(subj);
  });
  console.log(subjects.value);

  students.value.forEach(async (x) => {
    subjects.value.forEach(async (p) => {
      let score = await axios.get(
        `${import.meta.env.VITE_BASE_URL}Admin/Journal/GetScore?studentId=${
          x.id
        }&subjectId=${p.id}`
      );

      scores.value.push(score.data);
    });
  });
});
</script>

<style lang="scss" scoped></style>
