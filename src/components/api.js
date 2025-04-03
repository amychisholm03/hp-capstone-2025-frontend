export const API_URL = import.meta.env.API_URL
export const API_PORT = import.meta.env.API_PORT

export async function getCollection(coll) {
  return await fetch(`${API_URL}:${API_PORT}/${coll}`, {
    method: 'GET',
    mode: 'cors'
  });
}

export async function getPrintJob(id) {
  return await fetch(`${API_URL}:${API_PORT}/${'PrintJob'}/${id}`, {
    method: 'GET',
    mode: 'cors'
  });
}

export async function getErrorLogs() {
  return fetch(`${API_URL}:${API_PORT}/${'Log'}/${'Error'}`, {
    method: 'GET',
    mode: 'cors'
  });
}

export async function getWorkflow(id) {
  return await fetch(`${API_URL}:${API_PORT}/${'Workflow'}/${id}`, {
    method: 'GET',
    mode: 'cors'
  })
}

export async function getWorkflowTimes(id) {
  return await fetch(`${API_URL}:${API_PORT}/${'SimulationReport'}/${id}/WorkflowStep/Time`, {
    method: 'GET',
    mode: 'cors'
  })
}

async function postNewDocument(coll, doc) {
  return await fetch(`${API_URL}:${API_PORT}/${coll}`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc)
  });
}


export async function postPrintJob(Title, PageCount, RasterizationProfileID) {
  return await postNewDocument("PrintJob", {
    Title: Title,
    PageCount: PageCount,
    RasterizationProfileID: RasterizationProfileID
  });
}

/**
 * Posts a new workflow.
 * @param {string} Title - The title of the workflow
 * @param {Array} WorkflowSteps - The array of workflow steps after formatting
 * @returns
 */
export async function postWorkflow(Title, WorkflowSteps) {
  return await postNewDocument("Workflow", {
    Title: Title,
    WorkflowSteps: WorkflowSteps
  });
}

/**
 * Adds step IDs to an array of Workflow Steps
 * with additional attributes if necessary
 *
 * @param {Array} steps - Array of step IDs
 * @param {Number} numOfRIPs - Number of RIPs to use
 * @returns {Array} - Array of objects with step IDs and additional attributes (e.g. NumCores)
*/
export function formatSteps(steps, numOfRIPs) {
  let output = [];
  for (let i = 0; i < steps.length; i++) {
    // If step is Rasterization, add num_cores field
    if (steps[i] === 5) {
      output.push({
        WorkflowStepID: steps[i],
        NumCores: numOfRIPs
      });
    } else {
      output.push({
        WorkflowStepID: steps[i]
      });
    }
  }
  return output
}

export async function postSimulationReport(PrintJobID, WorkFlowID) {
  return await postNewDocument("SimulationReport", {
    PrintJobID: PrintJobID,
    WorkflowID: WorkFlowID
  });
}


