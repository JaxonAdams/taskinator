var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function() {

    event.preventDefault();

    // Set form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // Reset after info is entered
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // Package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };

    // Has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Add task ID as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // Add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // Add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();

    // Increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // Create container
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Create dropdown menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // Select option array
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (i = 0; i < statusChoices.length; i++) {
        // Create option element
        var statusOptionEl = document.createElement("Option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // Append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    // Edit button clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    // Delete button clicked
    else if (event.target.matches(".delete-btn")) {
        // Get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    console.log("Editing task #" + taskId);

    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // Get content from class name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    // Find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // Loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    alert("Task updated!");

    // Reset form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // Create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // If tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // Reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // Get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // Get the currently selected option's attribute and convert it all to lowercase
    var statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Place task in proper column based on option selected
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // Update tasks in the tasks array
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Get tasks from local storage
// Convert tasks from strings back into an array of objects
// Iterate through a task array and create task elements on the page from it
var loadTasks = function() {
    savedTasks = localStorage.getItem("tasks", tasks);

    if (!savedTasks) {
        return false;
    }

    // Change string values back into object values
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();