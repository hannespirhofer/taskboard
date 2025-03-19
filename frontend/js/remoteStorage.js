// New functions for Django backend communication
// Contacts

async function getContacts() {
    const token = localStorage.getItem('authToken');
    try {
        data = await fetch(`http://127.0.0.1:8000/api/contacts/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        data = await data.json()
        return data
    } catch (error) {
        console.error(error);
    }
}

async function saveContact(contact) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/contacts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(contact)
        })
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}

async function updateContact(contact) {
    const token = localStorage.getItem('authToken');
    try {
        const contactid = contact.contactid;
        if (!contactid) throw new Error('Contact Id not found.')
        const res = await fetch(`http://127.0.0.1:8000/api/contacts/${contactid}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(contact)
        })
        const user = await res.json()
        return user
    } catch (error) {
        return null
    }
}

async function deleteContact(contactid) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/contacts/${contactid}/`, {
            method: 'DELETE',
            'Authorization': `Token ${token}`
        })
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}

//Board and Task

async function getTasks() {
    const token = localStorage.getItem('authToken');
    try {
        data = await fetch(`http://127.0.0.1:8000/api/tasks/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        data = await data.json()
        return data
    } catch (error) {
        console.error(error);
    }
}

async function saveTask(task) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(task)
        })
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}

async function updateTask(task) {
    const token = localStorage.getItem('authToken');
    try {
        const taskid = task.id;
        if (!taskid) throw new Error('Task id not found.')
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskid}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(task)
        })
        const taskdata = await res.json()
        return taskdata
    } catch (error) {
        return null
    }
}

async function patchTask(task) {
    const token = localStorage.getItem('authToken');
    try {
        const taskid = task.id;
        const newprogress = task.progress;

        if (!taskid) throw new Error('Task id not found.')
        const res = await fetch(`http://127.0.0.1:8000/api/taskdrop/${taskid}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                "progress": newprogress
            })
        })
        const taskdata = await res.json()
        return taskdata
    } catch (error) {
        return null
    }
}

async function deleteTask(taskid) {
    const token = localStorage.getItem('authToken');
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskid}/`, {
            method: 'DELETE',
            'Authorization': `Token ${token}`
        })
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}

async function patchSubTask(subtask) {
    const token = localStorage.getItem('authToken');
    try {
        const id = subtask.id;
        if (!id) throw new Error('Subtask not found.')
        const res = await fetch(`http://127.0.0.1:8000/api/subtasks/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(subtask)
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error(console.error);
        return error
    }
}