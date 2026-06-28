import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";

function TaskForm()
{
    const rTitle = useRef();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [dueDate, setDueDate] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    const hTitle = (event) => { setTitle(event.target.value); }
    const hDescription = (event) => { setDescription(event.target.value); }
    const hStatus = (event) => { setStatus(event.target.value); }
    const hDueDate = (event) => { setDueDate(event.target.value); }

    const handleSubmit = (event) =>
    {
        event.preventDefault();

        if (title === "")
        {
            toast.error("title cannot be empty",{autoClose:1000});
            setMsg("");
            rTitle.current.focus();
            return;
        }

        if (title.trim() === "")
        {
            toast.error("title cannot be blank spaces",{autoClose:1000});
            setMsg("");
            setTitle("");
            rTitle.current.focus();
            return;
        }

        if (title.length < 3)
        {
            toast.error("title must be atleast 3 characters",{autoClose:1000});
            setMsg("");
            rTitle.current.focus();
            return;
        }

        if (dueDate === "")
        {
            toast.error("please select a due date",{autoClose:1000});
            setMsg("");
            return;
        }

        const doc = { "title": title, "description": description, "status": status, "dueDate": dueDate };

        fetch("http://localhost:9000/tasks",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doc)
        })
        .then(response => response.json())
        .then(data =>
        {
            setMsg("Task added successfully!");
            setTitle("");
            setDescription("");
            setStatus("pending");
            setDueDate("");
            setTimeout(() => { navigate("/"); }, 1000);
        })
        .catch(error =>
        {
            console.log("issue " + error);
        });
    }

    return (
        <div className="taskform-container">
            <ToastContainer/>
            <h1>Add New Task</h1>
            <form onSubmit={ handleSubmit }>

                <div className="form-group">
                    <label>Task Title</label>
                    <input type="text" placeholder="enter task title"
                        ref={ rTitle }
                        onChange={ hTitle }
                        value={ title }
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="enter task description"
                        onChange={ hDescription }
                        value={ description }
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select onChange={ hStatus } value={ status }>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Due Date</label>
                    <input type="date"
                        onChange={ hDueDate }
                        value={ dueDate }
                        min={ today }
                    />
                </div>

                <input type="submit" value="Add Task" className="btn btn-submit"/>
            </form>
            <p className="form-success-msg">{ msg }</p>
        </div>
    );
}

export default TaskForm;