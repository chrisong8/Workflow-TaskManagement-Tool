import React, { useState } from "react";
import {CreateNav} from './page';
import {CreateFooter} from './page';
import {CreateMain} from './page';
import {Route} from 'react-router-dom';

function App(props) {
  let project_data = props.projectData;
  let project_detail = props.projectDetail;

  const [data, setUpdated] = useState(project_data);

  function handleUpdate(newTask) {
    let copy = data.map( (datum) => datum );
    copy.push(newTask);

    setUpdated(copy);
  }

  return(
  <div>
    <CreateNav />
    <Route path="/">
      <CreateMain data={data} detail={project_detail} handleUpdate={handleUpdate} />
    </Route>
    <CreateFooter />
  </div>
  );
}



export default App;