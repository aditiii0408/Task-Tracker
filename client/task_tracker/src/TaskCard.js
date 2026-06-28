import { useState, useRef } from "react";
import {ToastContainer, toast} from "react-toastify";

function TaskCard(props)
{
    const { task, onDelete, onUpdate } = props;

    const rTitle = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate);

    const hTitle = (event) => { setTitle(event.target.value); }
    const hDescription = (event) => { setDescription(event.target.value); }
    const hStatus = (event) => { setStatus(event.target.value); }
    const hDueDate = (event) => { setDueDate(event.target.value); }

    const today = new Date().toISOString().split("T")[0];

    const handleDelete = () =>
    {
        if (window.confirm("are you sure you want to delete this task?"))
        {
            onDelete(task._id);
        }
    }

    const handleUpdate = (event) =>
    {
        event.preventDefault();

        if (title === "")
        {
            toast.error("title cannot be empty",{autoClose:1000});
            rTitle.current.focus();
            return;
        }

        if (title.trim() === "")
        {
            toast.error("title cannot be blank spaces",{autoClose:1000});
            setTitle("");
            rTitle.current.focus();
            return;
        }

        if (title.length < 3)
        {
            toast.error("title must be atleast 3 characters",{autoClose:1000});
            rTitle.current.focus();
            return;
        }

        const doc = { "title": title, "description": description, "status": status, "dueDate": dueDate };
        onUpdate(task._id, doc);
        setIsEditing(false);
    }

    const getStatusClass = () =>
    {
        if (status === "completed") return "status-completed";
        if (status === "in-progress") return "status-in-progress";
        return "status-pending";
    }

    if (isEditing)
    {
        return (
            <div className="task-card">
                <form onSubmit={ handleUpdate } className="edit-form">
                    <input type="text"
                        ref={ rTitle }
                        onChange={ hTitle }
                        value={ title }
                        placeholder="task title"
                    />
                    <textarea
                        onChange={ hDescription }
                        value={ description }
                        placeholder="description"
                    />
                    <select onChange={ hStatus } value={ status }>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <input type="date"
                        onChange={ hDueDate }
                        value={ dueDate }
                        min={ today }
                    />
                    <div className="edit-buttons">
                        <input type="submit" value="Save" className="btn btn-save"/>
                        <button type="button" onClick={() => { setIsEditing(false); }} className="btn btn-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="task-card">
            <ToastContainer/>
            <h3>{ task.title }</h3>
            <p>{ task.description }</p>
            <p>Status: <span className={`status-badge ${getStatusClass()}`}>{ task.status }</span></p>
            <p>Due: { task.dueDate }</p>
            <div className="card-buttons">
                <button onClick={() => { setIsEditing(true); }} className="btn btn-edit">Edit</button>
                <button onClick={ handleDelete } className="btn btn-delete">Delete</button>
            </div>
        </div>
    );
}

export default TaskCard;


