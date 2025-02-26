<template>
  <v-app theme="light">
    <v-main>
      <error-popups
        :error="errorMessage"
        @clear-error="errorMessage = ''"
      >
      </error-popups>
      <v-card
        class="ma-3 pa-3"
        style="width: 800px; height:400px; border-width:2px;"
      >
        <v-card-title class="module-title">
          Create New Print Job
        </v-card-title>
        <v-form
          fast-fail
          @submit.prevent="createPrintSettings"
        >
          <v-text-field
            v-model="printjob.title"
            :rules="titleValidation"
            label="Title"
          />
          <v-text-field
            v-model="printjob.pageCount"
            :rules="pageCountValidation"
            label="Page Count"
            type="number"
          />
          <v-select
            v-model="printjob.RasterizationProfileID"
            :rules="rasterizationProfileValidation"
            :items="rasterizationProfiles"
            label="Rasterization Profile"
            item-title="title"
            item-value="id"
            outlined
          >
            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :subtitle="item.raw.profile"
              ></v-list-item>
            </template>
          </v-select>

          <v-btn
            type="submit"
            class="mb"
            color="primary"
            :disabled="failure || success"
          >
            Create Print Job
          </v-btn>
          <v-btn
            v-if="success && !failure"
            size="x-small"
            icon
            type="submit"
            class="mb-2"
            color="success"
          >
            <v-icon size="medium">
              mdi-check
            </v-icon>
          </v-btn>
          <v-btn
            v-if="!success && failure"
            size="x-small"
            icon
            type="submit"
            class="mb-2"
            color="error"
          >
            <v-icon size="medium">
              mdi-close
            </v-icon>
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { postPrintJob, getCollection } from "./api.js";
import ErrorPopups from "./ErrorPopups.vue";

const errorMessage = ref('');

const router = useRouter();
const routeTo = (where) => {
  router.push(where);
};

const success = ref(false);
const failure = ref(false);
const rasterizationProfiles = ref([]);
const printjob = ref(
  {
    title: '',
    pageCount: '',
    RasterizationProfileID: null,
  }
);

//// METHODS ////
const titleValidation = [
    x => {
 if (x) {
return true;
} return 'Title can not be left empty';
}
];

const pageCountValidation = [
  x => {
 if (x) {
return true;
}
  return 'Page count must be non-zero.';
}
];

const rasterizationProfileValidation = [
  x => {
 if (x || x === 0) {
return true;
} return 'Rasterization Profile can not be left empty.';
}
];

const validateCreatePrintjobSettings = () => {
  const errors = [];

  titleValidation.forEach(rule => {
    const result = rule(printjob.value.title);
    if (typeof result === "string") {
      errors.push(result);
    }
  });

  pageCountValidation.forEach(rule => {
    const result = rule(printjob.value.pageCount);
    if (typeof result === "string") {
      errors.push(result);
    }
  });

  rasterizationProfileValidation.forEach(rule => {
    const result = rule(printjob.value.RasterizationProfileID);
    if (typeof result === "string") {
      errors.push(result);
    }
  });

  if (errors.length > 0) {
      failure.value=true;
      success.value=false;
      setTimeout(() => {
        failure.value=false;
      }, 2000);
      return false;
  }
  return true;
}

//// API CALLS ////
const createPrintSettings = async () => {
  if (!validateCreatePrintjobSettings()){
    return false;
  }

  const response = await postPrintJob(
    String(printjob.value.title),
    Number(printjob.value.pageCount),
    Number(printjob.value.RasterizationProfileID)
  );

  if (!response.ok) {
    errorMessage.value = "Error creating print job";
    console.log("Error creating print job. Response from server: " + String(response.status))
    failure.value=true;
    setTimeout(() => {
      failure.value=false;
    }, 2000);
    return;
  } else {
    failure.value=false;
    success.value=true;
    setTimeout(() => {
      success.value=false;
    }, 2000);
  }
}

const getRasterizationProfiles = async () => {
  const response = await getCollection("RasterizationProfile");
  if (response.ok){
    rasterizationProfiles.value = await response.json();
  }
}

onMounted( async () => {
    await getRasterizationProfiles();
})
</script>

<style>
.exit-button{
  border: none;
  padding: 0;
  box-shadow: none;
  background: transparent;
}

.dashboard-component {
  border: 1px;
  width: 400px;
  height: 400px;
}

.dashboard-container {
  max-width: 400px;
}
</style>
