App = {
  contracts: {},
  async init() {
    console.log("Loaded");
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
    App.render();
    await App.renderTasks();
  },

  async loadEthereum() {
    console.log("loadEthereum");
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvieder);
    } else {
      console.log("No Ethereum browser is installed, Try installing Metamask");
    }
  },

  async loadAccount() {
    console.log("loadAccount");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
    console.log(App.account);
  },

  async loadContracts() {
    console.log("loadContracts");
    const res = await fetch("TasksContract.json");
    const tasksContractJson = await res.json();
    App.contracts.TasksContract = TruffleContract(tasksContractJson);
    App.contracts.TasksContract.setProvider(App.web3Provider);
    App.tasksContract = await App.contracts.TasksContract.deployed();
  },

  render() {
    document.getElementById("account").textContent = App.account;
  },

  async renderTasks() {
    const taskCounter = await App.tasksContract.taskCounter();
    const taskCounterNumber = taskCounter.toNumber();
    console.log(taskCounterNumber);

    let html = "";
    for (let i = 0; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      
      const taskId = task[0];
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreated = task[4];
      let taskElement = //Html
      `
      <div class="card bg-dark mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${taskTitle}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(this)" />
          </div>
        </div>
        <div class="card-body">
          <span>${taskDescription}</span>
          <p class="text-muted">Task was created at: ${new Date (taskCreated * 1000).toLocaleDateString()}</p>
        </div>
      </div>
      `;
      html += taskElement;
    }
    document.getElementById("taskList").innerHTML = html;
  },

  async createTask(title, description) {
    console.log("createTask");
    const result = await App.tasksContract.createTask(title, description, {
      from: App.account,
    });
    console.log(result.logs[0].args);
  },
  async toggleDone(element) {
    const taskId = element.dataset.id;
    await App.tasksContract.toggleDone(taskId, {
      from: App.account
    })
    window.location.reload()
  }
};
