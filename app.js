const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const listEl = document.getElementById("todoList");
const countText = document.getElementById("countText");
const clearDoneBtn = document.getElementById("clearDone");
const filterBtns = document.querySelectorAll(".filter");

const STORAGE_KEY = "todo_items_v1";

let todos = loadTodos();
let currentFilter = "all";

function uid() {
  // basit id (yeterli)
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  const clean = text.trim();
  if (!clean) return;
  todos.unshift({ id: uid(), text: clean, done: false, createdAt: Date.now() });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(x => x.id !== id);
  saveTodos();
  render();
}

function clearDone() {
  todos = todos.filter(x => !x.done);
  saveTodos();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
  render();
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter(t => !t.done);
  if (currentFilter === "done") return todos.filter(t => t.done);
  return todos;
}

function render() {
  const visible = getFilteredTodos();
  listEl.innerHTML = "";

  visible.forEach(t => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const checkBtn = document.createElement("button");
    checkBtn.className = "iconBtn";
    checkBtn.textContent = t.done ? "✅" : "⬜";
    checkBtn.addEventListener("click", () => toggleTodo(t.id));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;

    const delBtn = document.createElement("button");
    delBtn.className = "iconBtn";
   delBtn.textContent = "❌";

    delBtn.addEventListener("click", () => deleteTodo(t.id));

    li.append(checkBtn, span, delBtn);
    listEl.append(li);
  });

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  countText.textContent = `${total} görev • ${doneCount} tamamlandı`;
}

// events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

clearDoneBtn.addEventListener("click", clearDone);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

// first paint
render();
