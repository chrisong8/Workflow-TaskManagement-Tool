import { Navbar, Nav} from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { Collapse } from 'reactstrap';
import firebase from 'firebase/app';
import {Route, NavLink} from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {CreateLanding} from './landing';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

// NavBar
export function CreateNav() {
    return(
  <Navbar bg="warning" expand="lg">
    <Navbar.Brand href="/">
      <img src="img/task.png" width="30"
          height="30"
          className="d-inline-block align-top"
          alt="web app icon" />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto" className="nav navbar-nav">
        <NavLink id="top" activeClassName='activeLink' to="/" exact><li>Home</li></NavLink>
        <NavLink id="top" activeClassName='activeLink' to="/landing"><li>Account</li></NavLink>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
    );
  }

// Footer
export function CreateFooter() {
  return(
  <footer>
    <p>This web application was created by a team of five students from INFO 340, client side web development course at the University of Washington.</p>
    <address>
    Contact us at <a href="mailto:me@here.com">address@gmail.com</a>, or at <a href="tel:555-123-4567">(555)
    123-4567</a>.
    </address>
    <p>&copy; 2021 Grace Chen, Chris Ong, Elsa Zhong, Jerry Xu, Ted Kim</p>
  </footer>
  )
}

// Main structure
function CreateHeader(props) {
    return(
      <header>
        <div className="p-5 text-center">
        <h1>Workflow Management Web App</h1>
        <h2>Technology and Business Association</h2>
        <div className="container">
          <div className="row">
            <div className="col-4 col-sm-4 col-md-4">
              <form>
              <NavLink activeClassName='activeLink' to="/" exact>
                <button onClick={props.toDisplay} id="displayButton" type="button" className="btn btn-warning task-button">
                  Display Projects
                </button>
              </NavLink>
              </form>
            </div>
            <div className="col-4 col-sm-4 col-md-4">
              <form>
              <NavLink activeClassName='activeLink' to="/addproject">
                <button onClick={props.toAdd}id="addProjectButton" type="button" className="btn btn-warning">
                  Add project
                </button>
              </NavLink>
              </form>
            </div>
            <div className="col-4 col-sm-4 col-md-4">
              <form>
              <NavLink activeClassName='activeLink' to="/filterproject">
                <button onClick={props.toFilter} id="filterTaskButton" type="button" className="btn btn-warning tex">
                  Filter projects
                </button>
              </NavLink>
              </form>
            </div>
          </div>
        </div>
        </div>
      </header>
    )
  }
  
  // Main body
  export function CreateMain(props) {
    //state for displaying mode
    const [displayMode,setDisplayMode] = useState("display");
    const changeModeDisplay = () => {
      setDisplayMode("display");
    }
    const changeModeAdd = () => {
      setDisplayMode("add");
    }
    const changeModeFilter = () => {
      setDisplayMode("filter");
    }
  
    // Card
    const [projectList, setProjectList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    useEffect(() =>{
      const projectRef = firebase.database().ref('projectData');
      projectRef.on('value', (snapshot) =>{
        const projectObj = snapshot.val();
        let projectKeyArray = Object.keys(projectObj);
        let projectArray = projectKeyArray.map((key) =>{
          let singleProjectObj = projectObj[key];
          singleProjectObj.key = key;
          return singleProjectObj;
        })

        setProjectList(projectArray);
      },[])

      const taskRef = firebase.database().ref('taskData');
      taskRef.on('value', (snapshot) =>{
        const taskObj = snapshot.val();
        let taskKeyArray = Object.keys(taskObj);
        let taskArray = taskKeyArray.map((key) =>{
          let singleTaskObj = taskObj[key];
          singleTaskObj.key = key;
          return singleTaskObj;
        })
        setTaskList(taskArray)
      })
    }, [])

    let cardList = projectList.map((project) => {
      return(
        <CreateCard 
        cardData={taskList}
        cardName={project.project}
        cardTitle={project.title}
        cardDescription={project.description}
        handleUpdate={props.handleUpdate} />
      )
    })
    
  
    return(
    <main>
    <CreateHeader toDisplay ={changeModeDisplay} toAdd = {changeModeAdd} toFilter = {changeModeFilter}/>
    <Route path="/" exact>
      <div id="accordion">
        {cardList}
      </div>
    </Route>
    <Route path="/addproject" exact>
      <CreateAddProjectForm />
    </Route>
    <Route path="/filterproject" exact>
      <CreateFilterView data={taskList}/>
    </Route> 
    <Route path="/landing" exact>
      <CreateLanding />
    </Route>
    <Route path="/landing/:name">
      <CreateProfiles />
    </Route>
    </main>
    );
  }
  
  // "display" view of the page
  function CreateCard(props) {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => setIsOpen(!isOpen);
    
    return(
    <div className="card" >
      <CreateCardHeader cardHeader={props.cardName} toggleCallback={handleToggle} />
      <Collapse isOpen={isOpen}>
        <CreateCardBody 
        cardName={props.cardName}
        cardData={props.cardData}
        cardTitle={props.cardTitle}
        cardDescription={props.cardDescription}
        handleUpdate={props.handleUpdate} />
      </Collapse>
    </div>
    );
  }
  
  function CreateCardHeader(props) {
    return (
    <div className="card-header" id="headingOne">
      <h5 className="mb-0">
        <button onClick={props.toggleCallback}>{props.cardHeader}</button>
      </h5>
    </div>
    );
  }
  
  function CreateCardBody(props) {
    const [name,setName] = useState("");
    const changeName = (newValue) => {
      setName(newValue)
    }
    const [task,setTask] = useState("");
    const changeTask = (newValue) => {
      setTask(newValue);
    }
    const [deadline,setDeadline] = useState("");
    const changeDeadline = (newValue) => {
      setDeadline(newValue);
    }
    const [status, setStatus] = useState("");
    const changeStatus = (newValue) => {
      setStatus(newValue);
    }

    return (
    <div className="card-body">
      <p>{props.cardTitle}</p>
      <p className="project-description">
        {props.cardDescription}
      </p>
      <CreateTable cardData={props.cardData} cardName={props.cardName} 
      handleName={changeName} handleTask={changeTask} handleDeadline={changeDeadline} handleStatus={changeStatus} />
      <CreateTaskButton cardData={props.cardData} cardName={props.cardName} name={name} task={task} deadline={deadline} status={status} handleUpdate={props.handleUpdate} />
    </div>
    );
  }
  
  function CreateDropDown(props) {
    const [title, setTitle] = useState(props.status);

    const handleSelect = (event) => {
      setTitle(event);
      props.changeStatus(event);
    }

    return (
      <DropdownButton title={title} id="dropdown-menu" onSelect={handleSelect}>
        <Dropdown.Item eventKey="Not Started">Not Started</Dropdown.Item>
        <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
        <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
      </DropdownButton>
    )
  }

  function CreateDropDown2(props) {
    const [title, setTitle] = useState(props.status);

    const handleSelect = (event) => {
      setTitle(event);
      props.updateStatus(event);
    }

    return (
      <DropdownButton title={title} id="dropdown-menu" onSelect={handleSelect}>
        <Dropdown.Item eventKey="Not Started">Not Started</Dropdown.Item>
        <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
        <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="remove">Remove</Dropdown.Item>
      </DropdownButton>
    )
  }


  function CreateTable(props) {
    const changeName = (event) => {
      props.handleName(event.target.value);
    }
    const changeTask = (event) => {
      props.handleTask(event.target.value);
    }
    const changeDeadline = (event) => {
      props.handleDeadline(event.target.value);
    }
    const changeStatus = (event) => {
      props.handleStatus(event);
    }

    let filterData = props.cardData.filter(obj =>
      obj.project === props.cardName
    )

    let taskData = filterData.map((taskObj) => {
      const updateStatus = (event) => {
        const taskRef = firebase.database().ref('taskData');
        taskRef.get().then(function(snapshot) {
          const taskObject = snapshot.val();
          let objectKeyArray = Object.keys(taskObject);
          objectKeyArray.forEach((key) => {
            let singleTaskObj = taskObject[key];
            if (event === 'remove' && singleTaskObj.description === taskObj.description) {
              taskRef.child(key).remove();
            }
            else if (singleTaskObj.description === taskObj.description) {
              taskRef.child(key).set({
                name: taskObj.name,
                status: event,
                description: taskObj.description,
                due: taskObj.due,
                project: taskObj.project
              })
            }  
          })
        })
      }
      
      return(
        <tr key={taskObj.description}>
          <th scope="row">{taskObj.name}</th>
          <td>{taskObj.description}</td>
          <td><CreateDropDown2 status={taskObj.status} updateStatus={updateStatus}/></td>
          <td>{taskObj.due}</td>            
        </tr>
      )
    })

    return (
    <table className="displayTable">
      <thead className="thead-light">
        <tr>
          <th scope="col" className="categ">Name</th>
          <th scope="col" className="categ">Task</th>
          <th scope="col" className="categ">Status</th>
          <th scope="col" className="categ">Deadline</th>
        </tr>
      </thead>
  
      <tbody>
        {taskData}
  
        <tr>
          <th scope="row"><input value={props.cardData.name} onChange={changeName} type="text" id="assign-member" className="form-control" /></th>
          <td><input value={props.cardData.description} onChange={changeTask} type="text" id="add-task" className="form-control" /></td>
          <td><CreateDropDown changeStatus={changeStatus} /></td>
          <td><input value={props.cardData.due} onChange={changeDeadline} type="date" id="set-deadline" className="form-control" /></td>
        </tr>
      </tbody>
    </table>
    );
  }
  
  function CreateTaskButton(props) {
    const handleClick = () => {
      const projectRef = firebase.database().ref('taskData');
      let newTask = {};
      newTask.name=props.name;
      newTask.status= props.status;
      newTask.description=props.task;
      newTask.due=props.deadline;
      newTask.project=props.cardName;
      projectRef.push(newTask);
      //prop.cardData.push(newTask);
      props.handleUpdate(newTask);
    }
    return(
      <div className="event-button">
        <button type="button" onClick={handleClick} className="btn btn-warning task-button">Add Task</button>
      </div>
    )
  }

  
  // "add" view of the page
  function CreateAddProjectForm(props) {
    const [success,setSuccess] = useState("");
    const [projectName,setProjectName] = useState("");
    const handleProjectName = (event) => {
      setProjectName(event.target.value);
    }
    const [projectTitle,setProjectTitle] = useState("");
    const handleProjectTitle = (event) => {
      setProjectTitle(event.target.value);
    }
    const [projectDescription,setProjectDescription] = useState("");
    const handleProjectDescription = (event) => {
      setProjectDescription(event.target.value);
    }
    const onSubmit = (event) => {
      event.preventDefault();
    }
    const handleClick = () => {
      let newProjectDetail = {};
      newProjectDetail.project = projectName;
      newProjectDetail.title=projectTitle;
      newProjectDetail.description=projectDescription;
      const projectRef = firebase.database().ref('projectData');
      projectRef.push(newProjectDetail);
      //prop.data.push(newProjectDetail);
      setSuccess("Submitted successfully!");
    }
    
  
    return(
    <section>
      <form id="newprojectform" action="" onSubmit={onSubmit}>
        <legend>Add New Project</legend>
        <div className="mb-3">
          <label htmlFor="project_name">Project Name:</label>
          <input value={props.nameValue} onChange={handleProjectName} type="text" className="form-control" name="project_name" id="project_name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="project_title">Project title:</label>
          <input value={props.titleValue} onChange={handleProjectTitle} type="text" className="form-control" name="project_title" id="project_title" required />
        </div>
        <div className="mb-3">
          <label htmlFor="comment_field">Description:</label>
          <textarea value={props.descriptionValue} onChange={handleProjectDescription} className="form-control" id="comment_field" name="comment"></textarea>
        </div>
        <button type="submit" onClick={handleClick} className="btn btn-warning" id="submit_button">Submit</button>
        <p className="success" onClick={handleClick}>{success}</p>
      </form>
    </section>
    );
  }
  
  // The button needs to be fixed
  // "filter" view of the page
  function CreateFilterView(props){
    const [inputProjectName, setInputProjectName] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const filterProjectName = (event) => {
      let newProjectName = event.target.value;
      setInputProjectName(newProjectName);
    }
  
    const [inputName,setInputName] = useState("");
    const filterName = (event) => {
      let newName = event.target.value;
      setInputName(newName);
    }
    const preventRefresh = (event) => {
      event.preventDefault();
    }
    const whenClicked = () => {
      setIsClicked(true);
    }
  
    return(
      <section>
        <form id="filterprojectform" action="" onSubmit={preventRefresh}>
          <legend>Filter Projects</legend>
          <div className="mb-3">
            <label htmlFor="project_name">Project Name:</label>
            <input type="text" onChange={filterProjectName} value = {inputProjectName} className="form-control" name="project_name" id="project_name" required />
            <label htmlFor="person_name">Name of the person:</label>
            <input type="text" onChange={filterName} value = {inputName} className="form-control" name="person_name" id="person_name" required />
          </div>
          <button type="submit" onClick={whenClicked}className="btn btn-warning" id="submit_button">Submit</button>
        </form>
        {isClicked === true && 
        <CreateFilterResults data={props.data} project={inputProjectName} name={inputName}/>}
      </section>
    )
  }
  function CreateFilterResults(props) {
    let data = props.data;
    let searchProject = props.project;
    let searchName = props.name;
  
    //let testProject = "sample";
    //let testName = "Brandon"
    let firstFilter = data.filter(obj =>
      obj.project.toLowerCase() === searchProject.toLowerCase())
    let secondFilter = firstFilter.filter(obj =>
      obj.name.toLowerCase() === searchName.toLowerCase())
    
    return(
      <table className="resultsTable">
        <thead className="thead-light">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Task</th>
            <th scope="col">Status</th>
            <th scope="col">Deadline</th>
          </tr>
        </thead>
        <CreateResultsTable result = {secondFilter}/>
    </table>
     )
  }
  function CreateResultsTable(props) {
    let row = props.result.map(data => {
      return(
        <tr key={data.description}>
          <td >{data.name}</td>
          <td >{data.description}</td>
          <td >{data.status}</td>
          <td >{data.due}</td>
        </tr>
      )
    })
    return(
      <tbody>
        {row}
      </tbody>
    )
  }

  function CreateProfiles(){
    const urlParam = useParams();
    let profileName = urlParam.name;
    

    const [intro,setIntro] = useState("");
    useEffect(() =>{
      const userRef = firebase.database().ref('profile').child(profileName);
      const userProfileRef = userRef.child('intro');
      userProfileRef.on('value', (snapshot) => {
      let data = snapshot.val();
      setIntro(data);
      })
    },[])

    return(
      <CreatePersonalProfile name={profileName} content={intro} />
    )
  }

  // Create profile based on url parameter (which card is clicked)
  function CreatePersonalProfile(props){
    let str = props.name.replace(/\s/g, '');
    return(
      <div>
        <p>{props.name}</p>
        <p>{props.content}</p>
        <p>Contact me at <a>{str}@tba.com</a></p>
      </div>
    )
  }