const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(taskForm["title"].value, taskForm["description"].value);
  App.createTask(taskForm["title"].value, taskForm["description"].value);
});

document.addEventListener("DOMContentLoaded", () => App.init());
