<template>
  <v-app theme="light">
    <!--
      <v-toolbar class="toolbar">
      <v-toolbar-title class="header">Workflows</v-toolbar-title>
      </v-toolbar>  
    -->
    <v-main>
      <error-popups
        :error="errorMessage"
        @clear-error="errorMessage = ''"
      >
      </error-popups>
      <v-card
        class="ma-3 pa-3"
        style="width:700px; height:390px; border-width:2px;"
      >
        <v-card-title class="module-title">
          Create New Workflow
        </v-card-title>
        <v-form
          fast-fail
          @submit.prevent="createWorkflow"
        >
          <v-text-field
            v-model="workflowTitle"
            :rules="workflowTitleValidation"
            label="Workflow Title"
          />
          <v-select
            v-model="selectedSteps"
            :rules="selectedStepsValidation"
            :items="workflowSteps"
            label="Select Workflow Steps"
            item-title="Title"
            return-object
            multiple
          >
            <template #selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span>{{ item.title }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="align-self-center text-caption text-grey"
              >
                (+{{ selectedSteps.length - 2 }} others)
              </span>
            </template>
          </v-select>
          <div class="d-flex pa-4">
            <v-row>
              <v-col
                cols="auto"
                class="align-center d-flex"
              >
                <v-checkbox-btn
                  v-model="enabled"
                  class="pe-2"
                ></v-checkbox-btn>
              </v-col>
              <v-col
                cols="100"
                class="align-center d-flex"
              >
                <v-select
                  v-model="parallelSteps"
                  :disabled="!enabled"
                  :rules="parallelStepsValidation"
                  :items="selectedSteps ? selectedSteps : []"
                  label="Parallelize Workflow Steps"
                  item-title="Title"
                  item-value="id"
                  multiple
                  class="custom-field"
                >
                  <template #selection="{ item, index }">
                    <v-chip v-if="index < 2">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span
                      v-if="index === 2"
                      class="align-self-center text-caption text-grey"
                    >
                      (+{{ parallelSteps.length - 2 }} others)
                    </span>
                  </template>
                </v-select>
              </v-col>

              <v-col
                cols="100"
                class="align-center d-flex"
              >
                <v-text-field
                  v-model="numberOfRips"
                  class="custom-field"
                  :disabled="!enabled"
                  :rules="numberOfRipsValidation"
                  label="Number of Rips"
                />
              </v-col>
            </v-row>
          </div>
          <v-btn
            type="submit"
            class="mb"
            color="primary"
            :disabled="failure || success"
          >
            Create Workflow
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
    import { ref, onMounted, toRaw } from "vue";
    import { useRouter } from 'vue-router';
    import { getCollection, formatLinearSteps, postWorkflow } from "./api.js";
    import ErrorPopups from "./ErrorPopups.vue";

    const errorMessage = ref('');

    const router = useRouter();
    const routeTo = (where) => {
        router.push(where);
    };

    const success = ref(false);
    const failure = ref(false);

    const enabled = ref(false);
    const parallelSteps = ref(null);
    const numberOfRips = ref("1");

    const workflowTitle = ref('');
    const selectedSteps = ref(null);
    const selectedStepsIDs = ref(null);
    const workflowSteps = ref([]);


    //// METHODS ////
    const workflowTitleValidation = [
        x => {
            if (x) {
                return true;
            } return 'Workflow title cannot not be left empty'
        }
    ];

    const selectedStepsValidation = [
        x => {
            if (x && x.length !== 0) {
                return true;
            } return 'Workflow must contain at least one step'
        }
    ];

    const parallelStepsValidation = [
        x => {
 if (x && x.length !== 0) {
return true;
} return 'At least one step must be selected'
}
    ]

    const numberOfRipsValidation = [
        x => {
 if (Number(x) > 0 && Number(x) <= 10) {
return true;
} return 'Number of Rips must be greater than 0 and less than 10'
}
    ]

    const validateCreatedWorkflow = () => {
        const errors = [];
        workflowTitleValidation.forEach(rule => {
            const result = rule(workflowTitle.value);
            if (typeof result === "string"){
                errors.push(result);
            }
        })

        selectedStepsValidation.forEach(rule => {
            const result = rule(selectedSteps.value);
            if (typeof result === "string"){
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
    const getWorkflowSteps = async () => {
        try {
          const response = await getCollection("WorkflowStep");
          if (response.ok) {
            workflowSteps.value = await response.json();
          } else {
            throw new Error(String(response.status));
          }
        } catch (error) {
            errorMessage.value = "Error fetching list of workflow steps";
            console.log(`Error fetching list of WorkflowSteps: ${error}`);
        }
    }

    onMounted( async () => {
        await getWorkflowSteps();
    })


    const createWorkflow = async () => {
        if (!validateCreatedWorkflow()){
            return false;
        }
        selectedStepsIDs.value = selectedSteps.value.map(stepID => {
return stepID.id
})
        let steps = formatLinearSteps(toRaw(selectedStepsIDs.value));
        const response = await postWorkflow(workflowTitle.value.toString(), steps, enabled.value, parallelSteps.value, Number(numberOfRips.value));

        if (!response.ok) {
            errorMessage.value = "Error posting data to server"
            console.log("Error posting data. Response from server: " + String(response.status))
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
</script>

<style>
    .dashboard-component{
    border:1px;
    width: 400px;
    height: 400px;
    }

    .dashboard-container{
    max-width: 400px;
    }

    .v-btn{
        margin: 0 5px;
    }
</style>
