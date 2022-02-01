import React from 'react';
import './App.css'; 

// import firebase from "firebase";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore/lite';
import Chat from './ChatUser/Chat'
import ChatExpert from './ChatExpert/Chat'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ChatList from './ChatList/ChatList';

const firebaseConfig = {
    apiKey: "AIzaSyCTDCkTO6M0vaRCeRtya0rJRLrGlPzzm-A",
    authDomain: "indiaclan-c7514.firebaseapp.com",
    projectId: "indiaclan-c7514",
    storageBucket: "indiaclan-c7514.appspot.com",
    messagingSenderId: "150190999843",
    appId: "1:150190999843:web:af5fef7f4bb8df919e6496",
    measurementId: "G-JG08LS1HBW"
};
 
const firebaseApp = firebase.initializeApp(firebaseConfig);

// const firebaseApp = initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

const App = () => {
    const [userId,setUserId] = React.useState(false);
    
    React.useEffect(() => {
        let value = prompt("Enter USER ID");
        setUserId(value)
    },[])
    return (
        <div className='main-container'>
            {userId &&
                <React.Fragment>
                    <ChatExpert userId={userId} />
                    <Chat userId={userId}/>  
                    {/* <ChatList /> */}
                </React.Fragment>
            }
        </div>
    )
}
export default App;
