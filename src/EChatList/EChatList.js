import React from 'react'
import firebase from 'firebase/compat/app';
import { db } from '../App' 

let expertId = 'expert-101'


const EChatList = (props) => {
    const [list,setList] = React.useState([{},{},{}]);
    React.useEffect(() => { 
        db
            .collection(`experts/${expertId}/users`)
            .orderBy("timeStamp")
            .onSnapshot((querySnapshot) => {
                var arr = [];
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data()); 
                });

                arr.sort((a,b) => {
                    return b.timeStamp - a.timeStamp;
                })

                setList([...arr]);
            });
    }, []); 
    return (
        <div className="container-list">
            {list.map(chat => {
                return (
                    <div className={`chat-box ${props.active == chat.userId ? ' active' : ''}`} key={chat.timeStamp}
                        onClick={() => props.setActive(chat.userId)}
                    >
                        <p>{chat.name}</p>

                        {chat.expertNotificationCount > 0 && <span>{chat.expertNotificationCount}</span>}
                    </div>
                )
            })}
        </div>
    )
}

export default EChatList;