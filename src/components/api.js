export const API_URL = "http://api.wsuv-hp-capstone.com"
export const API_PORT = "80"
//export const API_URL = "http://localhost"
//export const API_PORT = "5040"


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
  // return await fetch(`${API_URL}:${API_PORT}/${'Logs'}/${'Error'}`, {
  //   method: 'GET',
  //   mode: 'cors'
  // });
  return [
    {
      date: '03/04/2025',
      status: '402',
      domain: 'api.wsuv-hp-capstone.com/PrintJobs',
      request: '(empty)',
      method: "GET",
      response: 'Server Error: Endpoint "PrintJobs" does not exist.',
    },
    {
      date: '03/05/2025',
      status: '401',
      domain: 'api.wsuv-hp-capstone.com/PrintJob',
      request: '{...}',
      method: "POST",
      response: 'SQL error: no such column: "scrum".',
    },
    {
      date: '03/04/2025',
      status: '400',
      domain: 'api.wsuv-hp-capstone.com/Workflow/5',
      request: '(empty)',
      method: "GET",
      response: 'Server Error: Workflow with id 5 not found.',
    },
    {
      date: '03/03/2025',
      status: '405',
      domain: 'api.wsuv-hp-capstone.com/SimulationReport',
      request: '{...}',
      method: "POST",
      response: 'SQL error: primary key constraint failed.',
    },
    {
      date: '03/03/2025',
      method: 'POST',
      status: '400',
      domain: 'api.wsuv-hp-capstone.com/PrintJob',
      request: '{...}',
      response: 'SQL error: foreign key constraint failed.',
    },
    {
      date: '03/01/2025',
      status: '400',
      method: 'GET',
      domain: 'api.wsuv-hp-capstone.com/Workflowz',
      request: '(empty)',
      response: 'Server error: Endpoint "Workflowz" does not exist.',
    },
    {
      date: '03/02/2025',
      status: '400',
      method: 'GET',
      domain: 'api.wsuv-hp-capstone.com/;drop table *;--',
      request: '(empty)',
      response: 'Server error: malformed input.',
    },
  ];

  // return await fetch(`${API_URL}:${API_PORT}/${'Logs'}/${'API'}`, {
  //   method: 'GET',
  //   mode: 'cors'
  // });

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


