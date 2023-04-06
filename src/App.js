import logo from './logo.svg';
import './App.css';
import TaskBlock from './components/TaskBlock/TaskBlock';
import Wrapper from './components/Wrapper/Wrapper';
import Backlog from './components/Backlog/Backlog';
import React from 'react';
import Ready from './components/Ready/Ready';
import InProgress from './components/InProgress/InProgress';
import Finished from './components/Finished/Finished';
import { Routes, Route } from 'react-router-dom';
import TaskPage from './components/TaskPage/TaskPage';
import Layout from './components/Layout/Layout';

const backlog1 = {
    dispalayName: 'Backlog',
    taskList: getLocalStorageItem("Backlog")
}

const ready1 = {
    dispalayName: 'Ready',
    taskList:  getLocalStorageItem("Ready")
}

const inprogress1 = {
  dispalayName: "In progress",
  taskList: getLocalStorageItem("In progress")
}

const finished1 = {
  dispalayName: "Finished",
  taskList:  getLocalStorageItem("Finished")
}
  
function getLocalStorageItem(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
 

function App() {
  const [backlog, setBacklog] = React.useState(backlog1);
  const [ready, setReady] = React.useState(ready1);
  const [inprogress, setInprogress] = React.useState(inprogress1);
  const [finished, setFinished] = React.useState(finished1);

  const [isOpen, setIsOpen] = React.useState(false);

  function addTaskToList(prevList, newTask, newStatus) {
    let newList = prevList.taskList.concat({...newTask, status: newStatus});
    setLocalStorageItem(prevList.dispalayName, newList);
    return ({...prevList, taskList: newList});
  }

  function removeTaskFromList(prevList, id) {
    let newList = prevList.taskList.filter(item => item.id != id);
    setLocalStorageItem(prevList.dispalayName, newList)
    return ({...prevList, taskList: newList})
  }

  function insertIntoList(prevList, id, newTask) {
    let newList = prevList.taskList.filter(item => item.id == id);
    newList.push(newTask);
    setLocalStorageItem(prevList.dispalayName, newList);
    return ({...prevList, taskList: newList});
  }

  function addTaskToBacklog(task) {
    console.log(backlog, task);
    setBacklog( addTaskToList(backlog, task, "backlog"));
  }

  function addTaskToReady(taskID) {
    let task = backlog.taskList.find(item => item.id == taskID);
    setBacklog(removeTaskFromList(backlog, taskID));
    setReady( addTaskToList(ready, task, "ready"));
  }

  function addTaskToInProgress(taskID) {
    let task = ready.taskList.find(item => item.id == taskID);
    setReady(removeTaskFromList(ready, taskID));
    setInprogress(addTaskToList(inprogress, task, "inprogress"));
  }

  function addTaskToFinished(taskID) {
    let task = inprogress.taskList.find(item => item.id == taskID);
    setInprogress(removeTaskFromList(inprogress, taskID));
    setFinished(addTaskToList(finished, task, "finished"));
  }

  console.log("backlog: " , backlog, "ready: " , ready, "inprogress: " , inprogress, "finished: " , finished);

  const allTasks = backlog.taskList.concat(ready.taskList).concat(inprogress.taskList).concat(finished.taskList);

  const changeDescription = (id, status, description) => {
    let taskToEdit = allTasks.findIndex(item => item.id == id);
    if(taskToEdit === -1) return;

    let temp = allTasks[taskToEdit];
    temp.description = description;

    switch (status) {
      case "backlog":
        setBacklog(insertIntoList(backlog, id, temp))
        break;
      case "ready":
        setReady(insertIntoList(ready, id, temp))
        break;
      case "inprogress":
        setInprogress(insertIntoList(inprogress, id, temp))
        break;
      case "finished":
        setFinished(insertIntoList(finished, id, temp))
        break;
      default:
        break;
    }
  }


  return (
    <Routes>
      <Route path="/" element={<Layout active={backlog.taskList.length} finished={finished.taskList.length}/>}>
          <Route index element={  
        
            <div className={"blocks__container"}>
              <div className={"block"}>
              <Backlog title={backlog.dispalayName} tasks={backlog.taskList} onAdd={addTaskToBacklog}/>
              </div>
              <div className={"block"}>
                <Ready title={ready.dispalayName} tasks={ready.taskList} backloglist={backlog.taskList} onAdd={addTaskToReady}/>
              </div>
              <div className={"block"}>
                <InProgress title={inprogress.dispalayName} tasks={inprogress.taskList} readyList={ready.taskList} onAdd={addTaskToInProgress}/>
              </div>

              <div className={"block"}>
                <Finished title={finished.dispalayName} tasks={finished.taskList} progressList={inprogress.taskList} onAdd={addTaskToFinished}/>
              </div>
            </div>
          
          }/>
           <Route path="tasks/:id" element={<TaskPage tasks={allTasks} changeDescription={changeDescription}/>}/>
        </Route>
     
    </Routes>
  );
}

export default App;
