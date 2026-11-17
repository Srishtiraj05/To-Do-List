// Get HTML elements
let tasks = [];
const list = document.getElementById("list");
const form = document.getElementById("form");
const input = document.getElementById("text");
const filterButtons = document.querySelector(".filters");
const clearCompleted = document.getElementById("clearCompleted");
let currentFilter = "all";


// Load tasks from LocalStorage
function load() {
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        return [];
    }
}

// Save tasks to LocalStorage
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks on screen
function render() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
});

filteredTasks.forEach(function(task) {
        const li = document.createElement("li");
        li.dataset.id = task.id;
        li.className = task.done ? "done" : "";

        const label = document.createElement("span");
        label.textContent = task.text;

        const toggle = document.createElement("button");
        toggle.textContent = task.done ? "Undo" : "Done";
        toggle.dataset.action = "toggle";

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.dataset.action = "delete";

        li.append(label, toggle, del);
        list.append(li);
    });

    document.getElementById("count").textContent =
        tasks.filter(function(task) {
            return !task.done;
        }).length + " left";
}

// Add new task
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    input.value = "";

    save();
    render();
});

// Complete or delete tasks
list.addEventListener("click", function(e) {
    const action = e.target.dataset.action;

    if (!action) return;

    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (action === "delete") {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });
    }

    if (action === "toggle") {
        tasks.forEach(function(task) {
            if (task.id === id) {
                task.done = !task.done;
            }
        });
    }

    save();
    render();
});

// Start application
tasks = load();
render();

filterButtons.addEventListener("click", function(e) {
    const filter = e.target.dataset.filter;

    if (!filter) return;

    currentFilter = filter;
    render();
});

clearCompleted.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return !task.done;
    });

    save();
    render();
});
