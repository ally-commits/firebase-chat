import React from 'react'

import firebase from 'firebase/compat/app';
import { db } from '../App'


let expertId = 'expert-101'
let unSubscribe = false;


const ChatList = () => {
    React.useEffect(() => {
        unSubscribe && unSubscribe();

        unSubscribe = db
            .collection(`experts/${expertId}/users/`)
            .orderBy("timeStamp")
            .onSnapshot((querySnapshot) => {
                var arr = [];
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data()); 
                });

                // setMessages([...arr]);
            });
    }, []);
    return (
        <div>

        </div>
    )
}

export default ChatList;