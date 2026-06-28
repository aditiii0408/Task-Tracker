import { Link } from "react-router-dom";

function NavBar()
{
    return (
        <nav className="navbar">
            <h2>Task Tracker</h2>
            <div>
                <Link to="/">All Tasks</Link>
                <Link to="/add">Add Task</Link>
            </div>
        </nav>
    );
}

export default NavBar;