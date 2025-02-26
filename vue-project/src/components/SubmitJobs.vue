<!-- Not Used? -->
<template>
  <v-app theme="light">
    <v-toolbar class="toolbar">
      <v-toolbar-title class="header">
        Submit Print Jobs
      </v-toolbar-title>
    </v-toolbar>
    <v-main>
      <v-card
        class="ma-3 pa-3"
        style="width:85vw; height:350px; border-width:2px;"
      >
        <v-card-title>Submit Print Job for Simulation</v-card-title>
        <v-form
          fast-fail
          @submit.prevent="submitPrintJob"
        >
          <v-text-field
            v-model="printJobTitle"
            :rules="printJobTitleValidation"
            label="Print Job Title"
          />
          <v-select
            v-model="selectedWorkflow"
            :rules="selectedWorkflowValidation"
            :items="previousWorkflows"
            label="Select Workflow"
            item-title="Title"
            item-value="WorkflowID"
            outlined
          >
            <template #item="{ props }">
              <v-list-item v-bind="props"></v-list-item>
            </template>
          </v-select>
          <v-btn
            type="submit"
            class="mb-2"
            color="light-blue-lighten-1"
          >
            Submit Print Job
          </v-btn>
          <v-btn
            class="mb-2"
            color="light-blue-lighten-1"
            @click="routeTo('/SimulationReports')"
          >
            View Simulation Report
          </v-btn>
          <v-btn
            class="mb-2"
            color="light-blue-lighten-1"
            @click="routeTo('/Workflows')"
          >
            Create New Workflow
          </v-btn>
          <v-alert
            class="mt-2"
            style="background-color:white;"
          >
            {{ message1 }}
          </v-alert>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from 'vue-router';
    import { API_URL, API_PORT } from "./api.js";

    const router = useRouter();
    const routeTo = (where) => {
        router.push(where);
    };

    const message1 = ref('');

    const selectedWorkflow = ref(null);
    const previousWorkflows = ref([]);
    const printJobTitle = ref('');

    //// METHODS ////
    const printJobTitleValidation = [
        x => {
 if (x) {
return true;
} return 'Print job title cannot not be left empty'
}
    ];

    const selectedWorkflowValidation = [
        x => {
 if (x) {
return true;
} return 'Workflow must be selected';
}
    ];

    const validateSubmitJob = () => {
        const errors = [];
        printJobTitleValidation.forEach(rule => {
            const result = rule(printJobTitle.value);
            if (typeof result === "string"){
                errors.push(result);
            }
        })
        selectedWorkflowValidation.forEach(rule => {
            const result = rule(selectedWorkflow.value);
            if (typeof result === "string"){
                errors.push(result);
            }
        });
        if (errors.length > 0){
            return false;
        }
        return true;
    }

//// API CALLS ////
    onMounted( async () => {
        getWorkflows()

    })

    const getWorkflows = async () => {
        try {
            const url = `${API_URL}:${API_PORT}/getWorkflowList`;
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                }
            );
            if (response.ok){
                previousWorkflows.value = await response.json();
            } else {
                console.log("Error fetching data")
                console.log("Response from server: " + response)
            }
        } catch (error) {
            console.log('Error fetching list of workflows');
        }
    }

    const submitPrintJob = async () => {
        if (!validateSubmitJob()){
            return false;
        }

        // once API is made this will make api call to backend to generate report
        const workflow = previousWorkflows.value.find(workflow => {
return workflow.WorkflowID === selectedWorkflow.value
})
        message1.value = printJobTitle.value + " has been submitted using the workflow: " + workflow.Title;
        setTimeout(() => {
          message1.value = '';
        }, 3000);

    }
</script>

<style>
    .exit-button{
    border:none;
    padding:0;
    box-shadow: none;
    background: transparent;
    }


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
