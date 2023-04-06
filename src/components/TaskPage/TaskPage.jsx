import React from "react";
import s from "./TaskPage.module.css";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const TaskPage = ({tasks, changeDescription}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [input, setInput] = React.useState("");
    let { id } = useParams();
    console.log(tasks, id);
    const taskToRender = tasks.find(task => task.id == id);
    const navigate = useNavigate();

    const handler = () => {
        navigate(`/`, {replace: true});
    }

    const handlesubmit = ( event) => {
        event.preventDefault();
        changeDescription(id, taskToRender.status, input)
        setIsEditing(false);
    }

    return (
        <div className={s.wrapper}>
            <h2>{taskToRender.title} </h2>
            <span>{taskToRender.status}</span> 

       
            {isEditing ? 
                 <form onSubmit={handlesubmit}>
                    <input value={input} onChange={e => setInput(e.target.value)}/> 
                    <button>отправить</button>
                </form>
                : <p>{taskToRender.description} <button onClick={() => setIsEditing(true)}>реадактировать задачу</button></p>}

            
            <button onClick={handler}>exit</button></div>
    )
}

export default TaskPage