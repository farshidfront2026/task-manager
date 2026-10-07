let allTodos = [];
let currentEditId = null;
let currentPriority = "low";

// تعریف ترتیب اولویت‌ها برای مرتب‌سازی (بالا -> متوسط -> پایین)
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

// انتخاب المان‌های DOM
const formContainer = document.getElementById("add-task-form");
const inputs = formContainer.querySelectorAll("input[type='text']");
const titleInput = inputs[0];
const descInput = inputs[1];

// انتخاب دقیق دکمه‌های ذخیره و لغو
const submitBtn = formContainer.querySelector("button[type='submit']");
const cancelFormBtn = submitBtn ? submitBtn.previousElementSibling : null;

// انتخاب دقیق دکمه تگ‌ها و کانتینر اولویت‌ها
const toggleTagsBtn = document.getElementById("toggle-tags-btn");
const tagsContainer = toggleTagsBtn ? toggleTagsBtn.nextElementSibling : null;
const priorityBtns = tagsContainer
  ? tagsContainer.querySelectorAll("button")
  : [];

const showAddBtn = document.getElementById("show-add-task-btn");
const uncompletedContainer = document.getElementById(
  "uncompleted-tasks-container",
);
const completedContainer = document.getElementById("completed-tasks-container");
const uncompletedCount = document.getElementById("uncompleted-count");
const completedCount = document.getElementById("completed-count");
const emptyState = document.getElementById("empty-state");

const prioritiesConfig = {
  high: {
    label: "بالا",
    text: "text-[var(--color-primary-red)]",
    bg: "bg-[var(--color-secondary-red)]",
    border: "bg-[var(--color-primary-red)]",
  },
  medium: {
    label: "متوسط",
    text: "text-[var(--color-primary-yellow)]",
    bg: "bg-[var(--color-secondary-yellow)]",
    border: "bg-[var(--color-primary-yellow)]",
  },
  low: {
    label: "پایین",
    text: "text-[var(--color-primary-green)]",
    bg: "bg-[var(--color-secondary-green)]",
    border: "bg-[var(--color-primary-green)]",
  },
};

// نمایش فرم افزودن تسک و بستن empty state
if (showAddBtn) {
  showAddBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("hidden");
    formContainer.classList.add("flex");
    if (emptyState) {
      emptyState.classList.remove("flex");
      emptyState.classList.add("hidden");
    }
  });
}

const clearInputs = () => {
  titleInput.value = "";
  descInput.value = "";
  currentEditId = null;
  currentPriority = "low";
  submitBtn.textContent = "اضافه کردن تسک";
  updatePriorityUI();
};

// بستن فرم و بررسی وضعیت empty state
const closeForm = () => {
  clearInputs();
  formContainer.classList.remove("flex");
  formContainer.classList.add("hidden");

  const uncompletedTodos = allTodos.filter((t) => !t.completed);
  if (uncompletedTodos.length === 0 && emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex");
  }
};

// دکمه بستن فرم (ضربدر)
if (cancelFormBtn) {
  cancelFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeForm();
  });
}

// مدیریت کلیک روی دکمه تگ‌ها
if (toggleTagsBtn && tagsContainer) {
  tagsContainer.classList.remove("flex");
  tagsContainer.classList.add("hidden");

  toggleTagsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = tagsContainer.classList.contains("hidden");
    const svgIcon = toggleTagsBtn.querySelector("svg");

    if (isHidden) {
      tagsContainer.classList.remove("hidden");
      tagsContainer.classList.add("flex");
      if (svgIcon) {
        svgIcon.classList.remove("-rotate-90");
        svgIcon.setAttribute("fill", "currentColor");
      }
    } else {
      tagsContainer.classList.add("hidden");
      tagsContainer.classList.remove("flex");
      if (svgIcon) {
        svgIcon.classList.add("-rotate-90");
        svgIcon.setAttribute("fill", "none");
      }
    }
  });
}

const updatePriorityUI = () => {
  priorityBtns.forEach((btn, index) => {
    const types = ["high", "medium", "low"];
    const pType = types[index];
    const config = prioritiesConfig[pType];

    btn.className = `px-3 py-1.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${config.text}`;
    if (pType === currentPriority) {
      btn.classList.add(config.bg);
    } else {
      btn.classList.add(`hover:${config.bg}`);
    }
  });
};

// مدیریت کلیک روی دکمه‌های اولویت
priorityBtns.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const types = ["high", "medium", "low"];
    currentPriority = types[index];
    updatePriorityUI();
  });
});

// بستن منوهای کباب با کلیک در بیرون آن‌ها
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
    });
  }
});

const toggleMenu = (todoId) => {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (menu.id !== `menu-${todoId}`) {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
    }
  });
  const menu = document.getElementById(`menu-${todoId}`);
  if (menu) {
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
  }
};

const renderTodosHandler = () => {
  if (!uncompletedContainer || !completedContainer) return;

  uncompletedContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  // جداسازی و مرتب‌سازی تسک‌های انجام‌نشده بر اساس اولویت
  const uncompletedTodos = allTodos
    .filter((t) => !t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // جداسازی و مرتب‌سازی تسک‌های انجام‌شده بر اساس اولویت
  const completedTodos = allTodos
    .filter((t) => t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  if (uncompletedCount)
    uncompletedCount.textContent =
      uncompletedTodos.length.toLocaleString("fa-IR");
  if (completedCount)
    completedCount.textContent = completedTodos.length.toLocaleString("fa-IR");

  if (uncompletedTodos.length === 0) {
    if (emptyState) {
      emptyState.classList.remove("hidden");
      emptyState.classList.add("flex");
    }
  } else {
    if (emptyState) {
      emptyState.classList.remove("flex");
      emptyState.classList.add("hidden");
    }
  }

  // رندر تسک‌های انجام نشده
  uncompletedTodos.forEach((todo) => {
    const config = prioritiesConfig[todo.priority];
    uncompletedContainer.insertAdjacentHTML(
      "beforeend",
      `
        <article class="flex items-start gap-4 p-4 bg-[var(--card)] border border-[var(--btn-bg-muted)] rounded-xl relative group">
            <div class="absolute right-0 top-3 bottom-3 w-[4px] rounded-l-md ${config.border}"></div>
            <div class="relative flex items-center justify-center shrink-0 w-5 h-5 mt-0.5">
                <input type="checkbox" onchange="completeTodoHandler(${todo.id})" class="peer appearance-none w-5 h-5 border-2 border-[var(--color-tertiary-muted)] rounded cursor-pointer checked:bg-[var(--color-primary-blue)] checked:border-[var(--color-primary-blue)] transition-colors"/>
                <svg class="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-2.5">
                    <h3 class="font-bold text-sm text-[var(--color-primary)] truncate">${todo.title}</h3>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded ${config.bg} ${config.text} shrink-0">${config.label}</span>
                </div>
                ${todo.desc ? `<p class="text-[11px] font-medium text-[var(--color-primary-muted)] truncate">${todo.desc}</p>` : ""}
            </div>
            <div class="relative shrink-0 dropdown-container">
                <button type="button" onclick="toggleMenu(${todo.id})" class="p-1 text-[var(--color-tertiary-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                </button>
                <div id="menu-${todo.id}" class="dropdown-menu hidden absolute left-6 top-0 items-center gap-1 p-1 bg-[var(--card)] border border-[var(--btn-bg-muted)] shadow-md rounded-lg z-10">
                    <button type="button" onclick="editTodoHandler(${todo.id})" title="ویرایش" class="p-1.5 text-[var(--color-primary-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover-primary)] rounded-md transition-colors cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>
                    </button>
                    <div class="w-[1px] h-4 bg-[var(--btn-bg-muted)]"></div>
                    <button type="button" onclick="deleteTodoHandler(${todo.id})" title="حذف" class="p-1.5 text-[var(--color-primary-muted)] hover:text-[var(--error)] hover:bg-[var(--bg-hover-primary)] rounded-md transition-colors cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                    </button>
                </div>
            </div>
        </article>
      `,
    );
  });

  // رندر تسک‌های انجام شده
  completedTodos.forEach((todo) => {
    const config = prioritiesConfig[todo.priority];
    completedContainer.insertAdjacentHTML(
      "beforeend",
      `
        <article class="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--btn-bg-muted)] rounded-xl relative group opacity-85 transition-opacity">
            <div class="absolute right-0 top-3 bottom-3 w-[4px] rounded-l-md ${config.border}"></div>
            <div class="relative flex items-center justify-center shrink-0 w-5 h-5">
                <input type="checkbox" checked onchange="completeTodoHandler(${todo.id})" class="peer appearance-none w-5 h-5 border-2 border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] rounded cursor-pointer transition-colors"/>
                <svg class="absolute w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
                <h3 class="font-bold text-sm text-[var(--color-primary-muted)] line-through truncate">${todo.title}</h3>
            </div>
            <div class="relative shrink-0 dropdown-container">
                <button type="button" onclick="toggleMenu(${todo.id})" class="p-1 text-[var(--color-tertiary-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                </button>
                <div id="menu-${todo.id}" class="dropdown-menu hidden absolute left-6 top-0 items-center gap-1 p-1 bg-[var(--card)] border border-[var(--btn-bg-muted)] shadow-md rounded-lg z-10">
                    <button type="button" onclick="editTodoHandler(${todo.id})" title="ویرایش" class="p-1.5 text-[var(--color-primary-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover-primary)] rounded-md transition-colors cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/></svg>
                    </button>
                    <div class="w-[1px] h-4 bg-[var(--btn-bg-muted)]"></div>
                    <button type="button" onclick="deleteTodoHandler(${todo.id})" title="حذف" class="p-1.5 text-[var(--color-primary-muted)] hover:text-[var(--error)] hover:bg-[var(--bg-hover-primary)] rounded-md transition-colors cursor-pointer">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                    </button>
                </div>
            </div>
        </article>
      `,
    );
  });
};

const addTodoHandler = (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return;

  if (currentEditId) {
    const index = allTodos.findIndex((t) => t.id === currentEditId);
    if (index > -1) {
      allTodos[index].title = title;
      allTodos[index].desc = desc;
      allTodos[index].priority = currentPriority;
    }
  } else {
    allTodos.push({
      id: Date.now(),
      title,
      desc,
      priority: currentPriority,
      completed: false,
    });
  }

  closeForm();
  renderTodosHandler();
};

if (formContainer) {
  formContainer.addEventListener("submit", addTodoHandler);
}

const deleteTodoHandler = (todoId) => {
  allTodos = allTodos.filter((todo) => todo.id !== todoId);
  renderTodosHandler();
};

const completeTodoHandler = (todoId) => {
  const todo = allTodos.find((t) => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodosHandler();
  }
};

const editTodoHandler = (todoId) => {
  const todo = allTodos.find((t) => t.id === todoId);
  if (todo) {
    titleInput.value = todo.title;
    descInput.value = todo.desc;
    currentPriority = todo.priority;
    currentEditId = todoId;

    updatePriorityUI();
    formContainer.classList.remove("hidden");
    formContainer.classList.add("flex");
    if (emptyState) {
      emptyState.classList.remove("flex");
      emptyState.classList.add("hidden");
    }
    submitBtn.textContent = "ویرایش تسک";
    formContainer.scrollIntoView({ behavior: "smooth" });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  closeForm();
  renderTodosHandler();
});
