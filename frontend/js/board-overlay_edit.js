/**
 * This function opens the pop-up-edit, renders the html-form, so you can edit the task
 * @param {Number} id - The id of the task
 */
function editTask(id) {
    removeDNone('popUpEdit');
    addDNone('popUpTaskBig');
    renderAllInformationsEditTask(id);
}


/**
 * The edit-part gets closed without saving the changes
 */
async function closeTaskEdit() {
    clearPrioButtonsEdit();
    selectedContactsAssignedTo = [];
    closeTaskBig();
    addDNone('popUpEdit');
}


/**
 * The prio-buttons are getting cleared, so they are set for the next task or addedTask-form
 */
function clearPrioButtonsEdit() {
    for (let i = 0; i < prioButtons.length; i++) {
        let isButtonToggled = prioButtons[i]['toggled'];
        if (isButtonToggled === true) {
            togglePrio(i, 'prioButtonEdit', 'prioColorEdit', 'prioWhiteEdit', 'prioEdit');
        }
    }
}


/**
 * This function filles the input fields in the form
 * @param {Number} id - The id of the task
 */
function renderAllInformationsEditTask(id) {
    const task = tasks.filter(task => task.id == id)[0];
    if (!task) return;
    let popUp = document.getElementById('popUpEdit');
    popUp.innerHTML = renderPopUpCardEdit(task);
    renderTitleEdit(task);
    renderDescriptionEdit(task);
    renderDateEdit(task);
    renderPrioEdit(task);
    renderInitialsSelectedEdit();
    renderSubtasksEdit();
}


/**
 * The title input is getting rendered
 * @param {Task} task - The task of the task
 */
function renderTitleEdit(task) {
    let titleInput = document.getElementById('titleInputEdit');
    let title = task.title;
    titleInput.value = title;
}


/**
 * The description is getting filled
 * @param {Task} task - The task of the task
 */
function renderDescriptionEdit(task) {
    let descriptionInput = document.getElementById('descriptionInputEdit');
    let description = task.description;
    descriptionInput.value = description;
}


/**
 * The date is getting filled
 * @param {Task} task - The task of the task
 */
function renderDateEdit(task) {
    let dateInput = document.getElementById('dateInputEdit');
    let date = task.duedate;
    dateInput.value = date;
    colorFontInput('dateInputEdit');
}


/**
 * The prio is rendered
 * @param {Task} task - The task of the task
 */
function renderPrioEdit(task) {
    let prio = task.priority;
    for (let i = 0; i < prioButtons.length; i++) {
        const prioButtonsName = prioButtons[i]['name'];
        if (prioButtonsName === prio) {
            prioButtons[i]['toggled'] = true;
            setBackgroundColorPrioButton(i);
        }
    }
}


/**
 * The background color of the prio-button is set
 * @param {Number} i - The index of the prio button
 */
function setBackgroundColorPrioButton(i) {
    const selectedButton = getField(`prioButtonEdit${i+1}`);
    const selectedImgPrioColor = getField(`prioColorEdit${i+1}`);
    const selectedImgPrioWhite = getField(`prioWhiteEdit${i+1}`);
    const selectedPrio = getField(`prioEdit${i+1}`);
    const selectedPrioName = selectedPrio.innerHTML.toLowerCase();
    selectedButton.classList.toggle(`${selectedPrioName}`);
    selectedButton.classList.toggle('prioTextWhite');
    selectedImgPrioColor.classList.toggle('d-none');
    selectedImgPrioWhite.classList.toggle('d-none');
}


/**
 * When you click on the ok-button the fields are saved and the board gets rendered new, so the changes are shown
 * @param {Number} id - The id of the task
 */
async function saveAndCloseEdit(id) {
    const inputFields = collectInputFieldsEdit(id);
    renderContactIds();

    let task = createTaskInstanceEdit(inputFields, id);
    try {
        await updateTask(task);
    } catch (error) {
        console.error(error);
    }
    closeTaskEdit();
}


/**
 * The different fields in the form are collected to save the editted task
 * @param {Number} id - The id of the task
 * @returns {{
 * taskId: number,
 * title: string,
 * description: string,
 * category: string,
 * dueDate: string,
 * progress: string,
 * priority: string
 * }}
 */
function collectInputFieldsEdit(id) {
    const task = tasks.filter(t => t.id == id)[0];
    if (!task) return;

    let title = getField('titleInputEdit').value;
    let description = getField('descriptionInputEdit').value;
    let dueDate = getField('dateInputEdit').value;

    let category = task.category;
    let progress = task.progress;
    let priority = getPriority();

    return {id, title, description, category, dueDate, progress, ...(priority && {priority})};
}


/**
 * The array with the new values
 * @param {{
* taskId: number,
* title: string,
* description: string,
* category: string,
* dueDate: string,
* progress: string,
* priority: string
 * }} param0 - The values of the input fields to update the task
 * @returns {{
* taskId: Array<number>,
* title: string,
* description: string,
* category: string,
* subtasks: Array<{
*  name: string,
*  isToggled: boolean
* }>,
* selectedContactsAssignedToIds: Array<number>,
* priority: string,
* progress: string,
* dueDate: string
 * }}
 */
function createTaskInstanceEdit({title, description, category, dueDate, progress, priority}, id) {
    const subs = activeTask.subtasks;
    return {
        "id": id,
        "title": title,
        "description": description,
        "category": category,
        "subtasks": subs,
        "contactids": selectedContactsAssignedToIds,
        "priority": priority,
        "progress": progress,
        "duedate": dueDate
    };
}


/**
 * The html-template to edit the task
 * @param {Number} task - The task of the task
 * @returns The html-template gets returned
 */
function renderPopUpCardEdit(task) {
    return `
        <div class="close-icon">
            <img class="close-button-pu-edit" src="./assets/img/close-img.png" onclick="closeTaskEdit()">
        </div>
        <form class="editForm" onsubmit="saveAndCloseEdit(${task.id}); return false">
            <div class="field-container-pu-edit">

                <div class="title edit-item">
                    <label class="title-label-pu-edit">Title<span class="star">*</span></label>
                        <input id="titleInputEdit" class="inputField focus title-input-pu-edit" type="text" placeholder="Enter a title" onkeyup="checkValueTitle('titleInputEdit', 'titleRequiredContainerEdit')" required>

                    <div id="titleRequiredContainerEdit" class="title-required d-none">This field is required</div>
                </div>

                <div class="description desc-pu-edit edit-item">
                    <label class="description-label-pu-edit">Description</label>
                        <div class="desc-input-container desc-input-container-pu-edit">
                            <textarea id="descriptionInputEdit" class="focus" placeholder="Enter a Description"></textarea>
                        </div>
                </div>

                <div class="due-date edit-item">
                    <label>Due date<span class="star">*</span></label>
                        <div class="d-d-input-container d-d-input-container-pu-edit" id="dateInputContainer">
                            <input id="dateInputEdit" type="date" class="inputField focus color-date-input-gray date-input-pu-edit" onclick="minMaxDate('dateInputEdit')" onkeyup="checkValueDueDate('dateInputEdit', 'dateRequiredContainerEdit')" onchange="colorFontInput('dateInputEdit'), checkValueDueDate('dateInputEdit', 'dateRequiredContainerEdit')" required>
                        </div>
                    <div id="dateRequiredContainerEdit" class="date-required d-none">This field is required</div>
                </div>

                <div class="prio edit-item">
                    <label>Priority</label>
                        <div class="button-prio-container button-prio-container-edit">
                            <div class="button-prio" id="prioButtonEdit1" onclick="setPrio(1, 'prioButtonEdit', 'prioColorEdit', 'prioWhiteEdit', 'prioEdit')"><span class="prio-name" id="prioEdit1">Urgent</span><img src="./assets/img/img-urgent.png" id="prioColorEdit1"><img class="d-none" src="./assets/img/img-urgent-white.png" id="prioWhiteEdit1"></div>
                            <div class="button-prio" id="prioButtonEdit2" onclick="setPrio(2, 'prioButtonEdit', 'prioColorEdit', 'prioWhiteEdit', 'prioEdit')"><span class="prio-name" id="prioEdit2">Medium</span><img src="./assets/img/img-medium.png" id="prioColorEdit2"><img class="d-none" src="./assets/img/img-medium-white.png" id="prioWhiteEdit2"></div>
                            <div class="button-prio" id="prioButtonEdit3" onclick="setPrio(3, 'prioButtonEdit', 'prioColorEdit', 'prioWhiteEdit', 'prioEdit')"><span class="prio-name" id="prioEdit3">Low</span><img src="./assets/img/img-low.png" id="prioColorEdit3"><img class="d-none" src="./assets/img/img-low-white.png" id="prioWhiteEdit3"></div>
                        </div>

                </div>

                <div class="assigned-to assigned-to-edit edit-item">
                    <label>Assigned to</label>
                        <div class="a-t-input-container a-t-input-container-edit" id="aTInputContainerEdit">
                            <input class="inputField" placeholder="Select contacts to assign" id="assignedToInputEdit" onfocus="inputAssignedToFocus('aTInputContainerEdit')" onblur="inputAssignedToBlur('aTInputContainerEdit')" onkeyup="filterNamesEdit()">
                            <img src="./assets/img/arrow-drop-down.png" class="arrow-drop-down" id="arrowAssignedToEdit" onclick="toggleAssignedToDropDownEdit()">
                        </div>

                    <div id="assignedToDropDownEdit" class="assigned-to-drop-down at-drop-down-edit d-none">
                        <div id="assignedToDropDownWrapperEdit" class="assigned-to-drop-down-wrapper">
                        </div>
                    </div>
                    <div id="contactsSelectedContainerEdit" class="contacts-selected-container contacts-selected-container-edit">
                    </div>
                </div>

                <div class="subtasks subtasks-edit edit-item">
                    <label>Subtasks</label>
                        <div class="subtasks-container subtasks-container-edit" id="subtaskContainerEdit">
                        <input type="text" placeholder="Add new Subtask" class="inputField input-field-subtask-edit" id="subtaskInputEdit" onfocus="inputSubtaskFocusEdit()" oninput="inputSubtaskEdit()" onblur="inputSubtaskBlurEdit()">
                        <img src="./assets/img/plus-black.png" class="plus-img" id="plusImgEdit">
                        <div class="insert-subtask-tool-container d-none" id="insertSubtaskToolContainerEdit">
                            <img src="./assets/img/close-img.png" class="close-img" onclick="deleteInputSubtaskEdit()">
                            <div class="tool-separator"></div>
                            <img src="./assets/img/check-black.png" class="check-black-img" onclick="addSubtaskEdit()">
                        </div>
                        </div>

                    <div id="addedSubtasksContainerEdit" class="added-subtasks-container added-subtasks-container-edit">
                    </div>
                </div>

            </div>
            <div class="ok-button-container">
                <button class="button-dark btn-ok" type="submit">Ok<img src="./assets/img/check.png"></button>
            </div>
        </form>
    `;
}