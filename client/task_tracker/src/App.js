import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import NavBar from "./NavBar";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";

function App()
{
    return (
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route path="/" element={<TaskList/>}/>
                <Route path="/add" element={<TaskForm/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;