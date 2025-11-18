const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isDuplicateTask(newTitle, excludeIndex = -1) {
  return tasks.some(
    (task, index) =>
      task.title.toLowerCase() === newTitle.toLowerCase() &&
      index !== excludeIndex
  );
}

function buildTaskHTML(title) {
  return `
    <span class="title cursor-pointer break-word mr-4">${escapeHTML(
      title
    )}</span>
    <div class="task-action flex gap-3">
      <button class="edit" class="text-xl cursor-pointer">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="delete" class="text-xl cursor-pointer">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;
}

function handleTaskActions(e) {
  const taskItem = e.target.closest(".task-item");
  if (!taskItem) return;

  const taskIndex = +taskItem.dataset.index;
  const task = tasks[taskIndex];

  if (e.target.closest(".edit")) {
    const form = document.createElement("form");
    form.className =
      "flex text-[#ffffffc6] -m-4 border border-[#8758ff] rounded pl-4 w-full bg-[#1a1a40]";

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.title;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.className =
      "input w-full text-lg border-none outline-none text-[16px] bg-[#1a1a40] mr-4";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = "Save";
    saveBtn.className =
      "cursor-pointer select-none w-[97.52px] shrink-0 ml-auto bg-[#8758ff] font-semibold text-lg px-1 py-3 -mr-8";

    taskItem.innerHTML = "";
    taskItem.appendChild(form);
    form.appendChild(input);
    form.appendChild(saveBtn);

    input.focus();

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const newTitle = input.value.trim();
      if (!newTitle) {
        alert("Task title cannot be empty");
        return;
      }

      if (isDuplicateTask(newTitle, taskIndex)) {
        alert("Task is available");
        return;
      }

      task.title = newTitle;
      saveTasks();

      taskItem.innerHTML = buildTaskHTML(task.title);
      if (task.completed) taskItem.classList.add("completed");
      else taskItem.classList.remove("completed");
    });

    return;
  }

  if (e.target.closest(".delete")) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
    return;
  }

  if (e.target.closest(".title")) {
    task.completed = !task.completed;
    saveTasks();
    taskItem.classList.toggle("completed");
  }
}

function addTask(e) {
  e.preventDefault();

  const raw = todoInput.value.trim();
  if (!raw) {
    alert("Please enter somethings");
    return;
  }

  if (isDuplicateTask(raw)) {
    alert("Task is available");
    return;
  }

  tasks.push({
    title: raw,
    completed: false,
  });

  todoInput.value = "";
  saveTasks();
  renderTasks();
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML =
      '<li class="empty-message text-[#fff] text-center opacity-35 text-2xl italic">No tasks available.</li>';
    return;
  }

  taskList.innerHTML = tasks
    .map(
      (task, index) => `
      <li
        class="task-item ${
          task.completed ? "completed" : ""
        } flex w-full justify-between p-4 bg-[#8758ff] text-[#fff] text-lg rounded mt-4"
        data-index="${index}"
      >
        ${buildTaskHTML(task.title)}
      </li>`
    )
    .join("");
}

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);

renderTasks();
