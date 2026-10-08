// Load todos from LocalStorage
let allTodos = JSON.parse(localStorage.getItem("todos")) || [];
let currentEditId = null;
let currentPriority = null; // Default is null (No priority selected)
let toastTimeout = null;

// Priority sorting weights
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

// Format timestamp to Persian date and time string
const formatPersianDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const dayName = date.toLocaleDateString("fa-IR", { weekday: "long" });
  const day = date.toLocaleDateString("fa-IR", { day: "numeric" });
  const month = date.toLocaleDateString("fa-IR", { month: "long" });
  const year = date.toLocaleDateString("fa-IR", { year: "numeric" });
  const time = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dayName} ${day} ${month} ${year} - ${time}`;
};

// Save to LocalStorage
const saveTodosToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(allTodos));
};

// DOM Elements
const formContainer = document.getElementById("add-task-form");
const inputs = formContainer
  ? formContainer.querySelectorAll("input[type='text']")
  : [];
const titleInput = inputs[0];
const descInput = inputs[1];

const submitBtn = formContainer
  ? formContainer.querySelector("button[type='submit']")
  : null;
const cancelFormBtn = submitBtn ? submitBtn.previousElementSibling : null;

const toggleTagsBtn = document.getElementById("toggle-tags-btn");
const tagsContainer = document.getElementById("tags-container");
const selectedTagBadge = document.getElementById("selected-tag-badge");
const selectedTagLabel = document.getElementById("selected-tag-label");
const removeTagBtn = document.getElementById("remove-tag-btn");
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

// Toast error elements
const errorToast = document.getElementById("error-toast");
const errorToastMessage = document.getElementById("error-toast-message");

// Helper function to show error toast for 3 seconds
const showError = (message) => {
  if (!errorToast || !errorToastMessage) return;

  errorToastMessage.textContent = message;
  errorToast.classList.remove("hidden");
  errorToast.classList.add("flex");

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    errorToast.classList.add("hidden");
    errorToast.classList.remove("flex");
  }, 3000);
};

// Priority styles configuration
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

// Reset form location to default top position under showAddBtn
const resetFormPosition = () => {
  if (showAddBtn && formContainer) {
    showAddBtn.after(formContainer);
  }
};

// Show add task form
if (showAddBtn) {
  showAddBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearInputs();
    resetFormPosition();
    formContainer.classList.remove("hidden");
    formContainer.classList.add("flex");
    if (emptyState) {
      emptyState.classList.remove("flex");
      emptyState.classList.add("hidden");
    }
  });
}

// Update priority tag UI state
const updatePriorityUI = () => {
  const svgIcon = toggleTagsBtn ? toggleTagsBtn.querySelector("svg") : null;

  if (!currentPriority) {
    if (toggleTagsBtn) toggleTagsBtn.classList.remove("hidden");
    if (tagsContainer) {
      tagsContainer.classList.add("hidden");
      tagsContainer.classList.remove("flex");
    }
    if (selectedTagBadge) {
      selectedTagBadge.classList.add("hidden");
      selectedTagBadge.classList.remove("flex");
    }
    if (svgIcon) {
      svgIcon.classList.add("-rotate-90");
      svgIcon.setAttribute("fill", "none");
    }
  } else {
    const config = prioritiesConfig[currentPriority];
    if (toggleTagsBtn) toggleTagsBtn.classList.add("hidden");
    if (tagsContainer) {
      tagsContainer.classList.add("hidden");
      tagsContainer.classList.remove("flex");
    }
    if (selectedTagBadge && selectedTagLabel) {
      selectedTagLabel.textContent = config.label;
      selectedTagBadge.className = `flex items-center gap-2 px-3 py-1.5 rounded-xl w-max text-xs font-bold ${config.bg} ${config.text}`;
      selectedTagBadge.classList.remove("hidden");
    }
  }
};

// Reset inputs
const clearInputs = () => {
  if (titleInput) titleInput.value = "";
  if (descInput) descInput.value = "";
  currentEditId = null;
  currentPriority = null;
  if (submitBtn) submitBtn.textContent = "اضافه کردن تسک";
  updatePriorityUI();
};

// Hide form and move back to original place
const closeForm = () => {
  clearInputs();
  resetFormPosition();
  if (formContainer) {
    formContainer.classList.remove("flex");
    formContainer.classList.add("hidden");
  }

  const uncompletedTodos = allTodos.filter((t) => !t.completed);
  if (uncompletedTodos.length === 0 && emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex");
  }
};

if (cancelFormBtn) {
  cancelFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeForm();
  });
}

// Toggle priority tags menu
if (toggleTagsBtn && tagsContainer) {
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

// Priority button selection click
priorityBtns.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const types = ["high", "medium", "low"];
    currentPriority = types[index];
    updatePriorityUI();
  });
});

// Remove selected priority tag button (cross button)
if (removeTagBtn) {
  removeTagBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentPriority = null;
    updatePriorityUI();
  });
}

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
    });
  }
});

// Toggle single dropdown
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

// Render tasks
const renderTodosHandler = () => {
  if (!uncompletedContainer || !completedContainer) return;

  // Move form back to top before clearing containers to prevent DOM node loss
  resetFormPosition();

  uncompletedContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  // Sort uncompleted by priority
  const uncompletedTodos = allTodos
    .filter((t) => !t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Sort completed by priority
  const completedTodos = allTodos
    .filter((t) => t.completed)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  if (uncompletedCount)
    uncompletedCount.textContent =
      uncompletedTodos.length.toLocaleString("fa-IR");
  if (completedCount)
    completedCount.textContent = completedTodos.length.toLocaleString("fa-IR");

  // Check if form is currently open
  const isFormOpen =
    formContainer && !formContainer.classList.contains("hidden");

  // Show empty state ONLY when no uncompleted tasks exist AND the form is closed
  if (uncompletedTodos.length === 0 && !isFormOpen) {
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

  // Render uncompleted
  uncompletedTodos.forEach((todo) => {
    const config = prioritiesConfig[todo.priority || "low"];
    const createdDateStr = formatPersianDate(todo.createdAt || todo.id);

    uncompletedContainer.insertAdjacentHTML(
      "beforeend",
      `
        <article id="todo-item-${todo.id}" class="flex items-start gap-4 p-4 bg-[var(--card)] border border-[var(--btn-bg-muted)] rounded-xl relative group">
            <div class="absolute right-0 top-3 bottom-3 w-[4px] rounded-l-md ${config.border}"></div>
            <div class="relative flex items-center justify-center shrink-0 w-5 h-5 mt-0.5">
                <input type="checkbox" onchange="completeTodoHandler(${todo.id})" class="peer appearance-none w-5 h-5 border-2 border-[var(--color-tertiary-muted)] rounded cursor-pointer checked:bg-[var(--color-primary-blue)] checked:border-[var(--color-primary-blue)] transition-colors"/>
                <svg class="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-2.5 flex-wrap">
                    <h3 class="font-bold text-sm text-[var(--color-primary)] truncate">${todo.title}</h3>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded ${config.bg} ${config.text} shrink-0">${config.label}</span>
                    <span class="text-[10px] font-medium text-[var(--color-tertiary-muted)] shrink-0">${createdDateStr}</span>
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

  // Render completed
  completedTodos.forEach((todo) => {
    const config = prioritiesConfig[todo.priority || "low"];
    const createdDateStr = formatPersianDate(todo.createdAt || todo.id);

    completedContainer.insertAdjacentHTML(
      "beforeend",
      `
        <article id="todo-item-${todo.id}" class="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--btn-bg-muted)] rounded-xl relative group opacity-85 transition-opacity">
            <div class="absolute right-0 top-3 bottom-3 w-[4px] rounded-l-md ${config.border}"></div>
            <div class="relative flex items-center justify-center shrink-0 w-5 h-5">
                <input type="checkbox" checked onchange="completeTodoHandler(${todo.id})" class="peer appearance-none w-5 h-5 border-2 border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] rounded cursor-pointer transition-colors"/>
                <svg class="absolute w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <div class="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap">
                <h3 class="font-bold text-sm text-[var(--color-primary-muted)] line-through truncate">${todo.title}</h3>
                <span class="text-[10px] font-medium text-[var(--color-tertiary-muted)] shrink-0">${createdDateStr}</span>
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

  // If in edit mode, re-attach form under the active task card
  if (currentEditId) {
    const targetArticle = document.getElementById(`todo-item-${currentEditId}`);
    if (targetArticle) {
      targetArticle.after(formContainer);
    }
  }
};

// Add or Edit task
const addTodoHandler = (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  // Show error if ANY of the fields is missing
  if (!title || !desc || !currentPriority) {
    showError("لطفاً نام تسک، توضیحات و اولویت را وارد کنید.");
    return;
  }

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
      createdAt: Date.now(),
    });
  }

  saveTodosToLocalStorage();
  closeForm();
  renderTodosHandler();
};

if (formContainer) {
  formContainer.addEventListener("submit", addTodoHandler);
}

// Delete task
const deleteTodoHandler = (todoId) => {
  allTodos = allTodos.filter((todo) => todo.id !== todoId);
  saveTodosToLocalStorage();
  renderTodosHandler();
};

// Toggle complete status
const completeTodoHandler = (todoId) => {
  const todo = allTodos.find((t) => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToLocalStorage();
    renderTodosHandler();
  }
};

// Edit task - Moves form directly under the selected todo card
const editTodoHandler = (todoId) => {
  const todo = allTodos.find((t) => t.id === todoId);
  if (todo) {
    titleInput.value = todo.title;
    descInput.value = todo.desc;
    currentPriority = todo.priority;
    currentEditId = todoId;

    updatePriorityUI();

    // Move form element directly after the selected todo item
    const targetArticle = document.getElementById(`todo-item-${todoId}`);
    if (targetArticle) {
      targetArticle.after(formContainer);
    }

    formContainer.classList.remove("hidden");
    formContainer.classList.add("flex");
    if (emptyState) {
      emptyState.classList.remove("flex");
      emptyState.classList.add("hidden");
    }
    submitBtn.textContent = "ویرایش تسک";
    formContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// Init
document.addEventListener("DOMContentLoaded", () => {
  closeForm();
  renderTodosHandler();
});
