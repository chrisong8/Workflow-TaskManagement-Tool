import React, { useEffect, useState } from "react";
import firebase from 'firebase/app';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';


function CreateCard(props){
	// handle route when clicking on the cards
	const [redirectTo,setRedirectTo] = useState(undefined);
	const handleClick=() =>{
		console.log("You clicked " + props.name)
		setRedirectTo("/landing/"+props.name )
	}
	if(redirectTo){
		return(<Redirect push to={redirectTo} />)
	}
	let classStyle = "";
	if(props.title === "HR"){
		classStyle = "title hr";
	} else if (props.title === "Marketing"){
		classStyle = "title mkt";
	} else if (props.title === "PR"){
		classStyle = "title pr";
	} else if (props.title === "Finance"){
		classStyle = "title fin";
	}else {
		classStyle = "title";
	}
	return(
		<div class="col" onClick={handleClick}> 
			<img src={"img/avatars/" + props.name + ".svg"} alt="Avatar" />
			<p class="member">{props.name}</p>
			<p class={classStyle}>{props.title}</p>
		</div>
	)
}
export function CreateLanding() {
	
	// handle firebase data
	const [workerList, setWorkerList] = useState([]);
	useEffect(() =>{
		const workerRef = firebase.database().ref('landingData');
		workerRef.on('value', (snapshot) =>{
		  const workerObj = snapshot.val();
		  let workerKeyArray = Object.keys(workerObj);
		  let workerArray = workerKeyArray.map((key) =>{
			let singleWorkerObj = workerObj[key];
			singleWorkerObj.key = key;
			return singleWorkerObj;
		  })
  
		  setWorkerList(workerArray);
		})
	},[])

	let workerCard = workerList.map((worker) =>{
		return(<CreateCard name={worker.name} title={worker.title}/>)
	})

	return (	
		<main>
			<section>
				<header><h2>About Us</h2></header>
				<p>The Technology and Business Association was founded in Seattle as a non-profit organization in March 2013 by a group of UW students. Currently, we have about 1600 members in the Seattle area and 400 members in Minnesota. We aim to promote connections between UW students and the professionals in the Great Seattle Area and to offer smooth transitions between academic and different industries. In particular, we want to explore the possibilities and philosophies resulting from the collision between technology and business. We are here to help everyone improve their leadership skills, to provide professional education and various internship opportunities, and to foster future leaders within a variety of disciplines.</p>
			</section>
    
			<section>
      	<header><h2>Member Information</h2></header>

      	<h3>Members</h3>
		<p>(Click on the images to learn more about our officers!)</p>

				<div className="container eb">
					<div className="row">
						{workerCard}
					</div>
				</div>
			</section>
		</main>
	)
}
