import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import {ToastContainer, toast} from "react-toastify";


function TaskList()
{
    const [tasks, setTasks] = useState([]);
    const [msg, setMsg] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("none");

    const hFilterStatus = (event) => { setFilterStatus(event.target.value); }
    const hSortBy = (event) => { setSortBy(event.target.value); }

    const loadTasks = () =>
    {
        fetch("https://task-tracker-wwlk.onrender.com/tasks")
        .then(response => response.json())
        .then(data =>
        {
            setTasks(data);
        })
        .catch(error =>
        {
            console.log("issue " + error);
        });
    }

    useEffect(() =>
    {
        loadTasks();
    }, []);

    const handleDelete = (id) =>
    {
        fetch("https://task-tracker-wwlk.onrender.com/tasks/" + id,
        {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data =>
        {
            setMsg("Task deleted successfully!");
            loadTasks();
            setTimeout(() => { setMsg(""); }, 2000);
        })
        .catch(error =>
        {
            console.log("issue " + error);
        });
    }

    const handleUpdate = (id, doc) =>
    {
        fetch("https://task-tracker-wwlk.onrender.com/tasks/" + id,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doc)
        })
        .then(response => response.json())
        .then(data =>
        {
            setMsg("Task updated successfully!");
            loadTasks();
            setTimeout(() => { setMsg(""); }, 2000);
        })
        .catch(error =>
        {
            console.log("issue " + error);
        });
    }

    const getFilteredAndSortedTasks = () =>
    {
        let result = [...tasks];

        if (filterStatus !== "all")
        {
            result = result.filter(task => task.status === filterStatus);
        }

        if (sortBy === "date-asc")
        {
            result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        else if (sortBy === "date-desc")
        {
            result.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        }
        else if (sortBy === "title-asc")
        {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if (sortBy === "title-desc")
        {
            result.sort((a, b) => b.title.localeCompare(a.title));
        }

        return result;
    }

    const finalTasks = getFilteredAndSortedTasks();

    return (
        <div className="tasklist-container">
            <ToastContainer/>
            <h1>All Tasks</h1>
            { msg && <p className="success-msg">{ msg }</p> }

            <div className="filter-sort-bar">
                <div className="filter-group">
                    <label>Filter by Status</label>
                    <select onChange={ hFilterStatus } value={ filterStatus }>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Sort By</label>
                    <select onChange={ hSortBy } value={ sortBy }>
                        <option value="none">Default</option>
                        <option value="date-asc">Due Date (Nearest First)</option>
                        <option value="date-desc">Due Date (Farthest First)</option>
                        <option value="title-asc">Title (A - Z)</option>
                        <option value="title-desc">Title (Z - A)</option>
                    </select>
                </div>
            </div>

            {
                finalTasks.length === 0
                ?
                <p className="no-tasks">no tasks found.</p>
                :
                <div className="cards-wrapper">
                    {
                        finalTasks.map(task =>
                        (
                            <TaskCard key={ task._id } task={ task } onDelete={ handleDelete } onUpdate={ handleUpdate }/>
                        ))
                    }
                </div>
            }
        </div>
    );
}

export default TaskList;