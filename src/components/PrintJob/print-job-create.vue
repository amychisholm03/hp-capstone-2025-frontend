<template>
  <v-form
    fast-fail
    class="mb-5 mt-5"
    @submit.prevent="createPrintSettings"
  >
    <v-text-field
      v-model="printjob.title"
      :rules="titleValidation"
      label="Title"
      class="ml-2 mr-5"
      style="text-transform: none; font-weight: 500;"
    />
    <v-text-field
      v-model="printjob.pageCount"
      :rules="pageCountValidation"
      label="Page Count"
      type="number"
      class="ml-2 mr-5"
      style="text-transform: none; font-weight: 500;"
    />
    <v-select
      v-model="printjob.RasterizationProfileID"
      :rules="rasterizationProfileValidation"
      :items="rasterizationProfiles"
      label="Rasterization Profile"
      item-title="title"
      item-value="id"
      outlined
      class="ml-2 mr-5"
      style="text-transform: none; font-weight: 500;"
    >
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :subtitle="item.raw.profile"
        ></v-list-item>
      </template>
    </v-select>
    <v-row style="height:auto;">
      <v-col class="align-end d-flex justify-end">
        <v-btn
          v-if="success && !failure"
          size="x-small"
          icon
          type="submit"
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
          color="error"
        >
          <v-icon size="medium">
            mdi-close
          </v-icon>
        </v-btn>

        <v-btn
          type="submit"
          class="mr-5"
          color="secondary"
          size="large"
          :disabled="failure || success"
          style="text-transform: none;"
        >
          Create Print Job
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { postPrintJob, getCollection } from "../api.js";

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
    } return 'Page count must be non-zero.';
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
    failure.value = true;
    success.value = false;
    setTimeout(() => {
      failure.value = false;
    }, 2000);
    return false;
  }
  return true;
}

//// API CALLS ////
const createPrintSettings = async () => {
  if (!validateCreatePrintjobSettings()) {
    return false;
  }

  const response = await postPrintJob(
    String(printjob.value.title),
    Number(printjob.value.pageCount),
    Number(printjob.value.RasterizationProfileID)
  );

  if (!response.ok) {
    console.log("Error creating print job: " + String(response.status))
    failure.value = true;
    setTimeout(() => {
      failure.value = false;
    }, 2000);
    return;
  } else {
    failure.value = false;
    success.value = true;
    setTimeout(() => {
      success.value = false;
    }, 2000);
  }
}

const getRasterizationProfiles = async () => {
  const response = await getCollection("RasterizationProfile");
  if (response && response.ok) {
    rasterizationProfiles.value = await response.json();
  }
};

onMounted(async () => {
  await getRasterizationProfiles();
});
</script>
