const tasks = [
  //   {
  //     title: "Design a website",
  //     completed: false,
  //   },
  //   {
  //     title: "Write project documentation",
  //     completed: false,
  //   },
  //   {
  //     title: "Fix UI bugs on homepage",
  //     completed: false,
  //   },
  //   {
  //     title: "Create user login feature",
  //     completed: false,
  //   },
  //   {
  //     title: "Deploy website to hosting",
  //     completed: false,
  //   },
];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) {
    alert("Please enter somethings");
    return;
  }
  const newTask = {
    title: value,
    completed: false,
  };
  tasks.push(newTask);
  todoInput.value = "";
  render();
});

function render() {
  const html = tasks
    .map(
      (task) => `  <li
          id="task-item"
          class="${
            task.completed ? "completed" : ""
          } flex justify-between p-4 bg-[#8758ff] text-[#fff] text-lg rounded mt-4"
        >
          <span id="task-title">${task.title}</span>
          <div class="task-action flex gap-3">
            <button id="edit" class="text-xl">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button id="done" class="text-xl">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>`
    )
    .join("");
  taskList.innerHTML = html;
}

render();
