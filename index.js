import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import data from "./Sample data.json";
import detail from "./project details.json";

import firebase from "firebase";
import 'firebase/database';

import {BrowserRouter} from 'react-router-dom';


const firebaseConfig = {
  apiKey: "AIzaSyANr6kyvKZg3-SJCjTVwpys9AHOZkkeJjs",
  authDomain: "workflow-management-web-9bdb4.firebaseapp.com",
  databaseURL: "https://workflow-management-web-9bdb4-default-rtdb.firebaseio.com",
  projectId: "workflow-management-web-9bdb4",
  storageBucket: "workflow-management-web-9bdb4.appspot.com",
  messagingSenderId: "208335016228",
  appId: "1:208335016228:web:18abcff79e093c8317a3b1",
  measurementId: "G-6ZVHJT2ZD8"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App projectData={data} projectDetail = {detail} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

