export const API_URL = "http://api.wsuv-hp-capstone.com"
export const API_PORT = "80"
// export const API_URL = "http://localhost"
// export const API_PORT = "5040"


export async function getCollection(coll){
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

async function postNewDocument(coll, doc){
	return await fetch(`${API_URL}:${API_PORT}/${coll}`, {
      method: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(doc)
    });
}


export async function postPrintJob(Title, PageCount, RasterizationProfileID){
	return await postNewDocument("PrintJob", {
		Title: Title,
		PageCount: PageCount,
		RasterizationProfileID: RasterizationProfileID
	});
}


export async function postWorkflow(Title, WorkflowSteps, Enabled, ParallelSteps, NumberOfRips){
	return await postNewDocument("Workflow", {
        Title: Title,
        WorkflowSteps: WorkflowSteps,
		Parallelizable: Enabled,
		numOfRIPs: NumberOfRips
    });
}


// Takes a list of steps and formats them as a graph, where each step's
// prev step is the one before it in the array, and the next step
// is the one after it, for compatibility with previous implementation
export function formatSteps(steps){
	let output = [];
	for(let i = 0; i < steps.length; i++){
    console.log(steps[i]);
		output.push({
			WorkflowStepID: steps[i],
			Prev: [],
			Next: []
		});
	}
	return output
}


export async function postSimulationReport(PrintJobID, WorkFlowID){
	return await postNewDocument("SimulationReport", {
    PrintJobID: PrintJobID,
    WorkflowID: WorkFlowID
  });
}


