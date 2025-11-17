const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isDuplicateTask(newTitle, excludeIndex = -1) {
  const isDuplicate = tasks.some(
    (task, index) =>
      task.title.toLowerCase() === newTitle.toLowerCase() &&
      excludeIndex !== index
  );
  return isDuplicate;
}

function handleTaskActions(e) {
  const taskItem = e.target.closest("#task-item");
  if (!taskItem) return;
  const taskIndex = +taskItem.dataset.index;
  const task = tasks[taskIndex];

  if (e.target.closest("#edit")) {
    let newTitle = prompt("Enter the new task title:", task.title);
    if (newTitle === null) return;

    newTitle = newTitle.trim();

    if (!newTitle) {
      alert("Task title cannot be empty");
      return;
    }
    const safeNewTitle = escapeHTML(newTitle);
    if (isDuplicateTask(safeNewTitle, taskIndex)) {
      alert("Task is available");
      return;
    }
    task.title = safeNewTitle;
    renderTasks();
    saveTasks();
    return;
  }
  if (e.target.closest("#delete")) {
    if (confirm(`Are you sure you want to delete ${task.title}`)) {
      tasks.splice(taskIndex, 1);
      renderTasks();
      saveTasks();
    }
    return;
  } else if (e.target.closest(".title")) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function addTask(e) {
  e.preventDefault();
  const value = todoInput.value.trim();
  const safeValue = escapeHTML(value);
  if (!safeValue) {
    return alert("Please enter somethings");
  }
  const newTask = {
    title: safeValue,
    completed: false,
  };

  if (isDuplicateTask(safeValue)) {
    alert("Task is available");
    return;
    5;
  }

  tasks.push(newTask);
  todoInput.value = "";
  renderTasks();
  saveTasks();
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML =
      '<li class="empty-message text-[#fff] text-center opacity-35 text-2xl italic">No tasks available.</li>';
    return;
  }
  const html = tasks
    .map(
      (task, index) => `  <li
          id="task-item"
          data-index=${index} 
          class="${
            task.completed ? "completed" : ""
          } flex justify-between p-4 bg-[#8758ff] text-[#fff] text-lg rounded mt-4"
        >
          <span id="task-title" class="title cursor-pointer">${escapeHTML(
            task.title
          )}</span>
          <div class="task-action flex gap-3">
            <button id="edit" class="text-xl cursor-pointer">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button id="delete" class="text-xl cursor-pointer">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>`
    )
    .join("");
  taskList.innerHTML = html;
}

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);
renderTasks();
