import React from 'react'
import firebase from 'firebase/compat/app';
import {db} from '../App'
import ScrollableFeed from "react-scrollable-feed";

let expertId = 'expert-101'
let unSubscribe = false;

const Chat = (props) => {
    const [value,setValue] = React.useState("");
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => { 
            unSubscribe && unSubscribe();

            unSubscribe = db
                .collection(`experts/${expertId}/users/${props.userId}/messages`)
                .orderBy("timeStamp")
                .onSnapshot((querySnapshot) => {
                    var arr = [];
                    querySnapshot.forEach((doc) => {
                        arr.push(doc.data()); 
                        doc
                            .ref
                            .update({ userViewed: true });
                    });
                    setMessages([...arr]);
                    viewNotification();
                });
    }, [props.userId]);

    const addMessage = async () => {
        let name = props.userId + "NAME";
        if (value != "") {
            let messageValue = value;
            setValue("");
            
            incrementUserNotification();
            db.collection(`experts/${expertId}/users/${props.userId}/messages`)
                .add({
                    name: name,
                    createdAt: new Date().toString().substr(0, 21),
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    messageFrom: "USER",
                    userId: props.userId,
                    message: messageValue,
                    expertViewed: false,
                    userViewed: true,
                })
                .then((docRef) => { 
                })
                .catch((error) => {
                    console.error("Error addding document: ", error);
                });
        }
    } 
    const incrementUserNotification = () => {
        const userRef = db.collection(`experts/${expertId}/users`).doc(props.userId);
        userRef
            .get()
            .then(doc => {
                console.log(doc.data())
                if (!doc.exists) {
                    userRef.set({ 
                        name: props.userId,
                        profile: "SOME CONTENT",
                        userNotificationCount: 0,
                        timeStamp: new Date().getTime(),
                        expertNotificationCount: 1,
                        userId: props.userId
                    });
                } else {
                    userRef.update({
                        timeStamp: new Date().getTime(),
                        expertNotificationCount: (doc.data().expertNotificationCount ? doc.data().expertNotificationCount : 0) + 1
                    });
                }
            })
            .catch(err => {
                console.log(`[LOGIN] ${err}`);
            });
    }
    const viewNotification = () => {
        const userRef = db.collection(`experts/${expertId}/users`).doc(props.userId);
        userRef
            .get()
            .then(doc => { 
                if (!doc.exists) {
                    userRef.set({
                        name: props.userId,
                        profile: "SOME CONTENT",
                        userId: props.userId,
                        userNotificationCount: 0,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                } else {
                    userRef.update({ 
                        userNotificationCount: 0,
                    });
                }
            })
            .catch(err => {
                console.log(`[LOGIN] ${err}`);
            });
    }
    return (
        <div className="chat-container">
            <div className="chat-content">
                <ScrollableFeed forceScroll>
                    <p>USER [{props.userId}] -- EXPERT [{expertId}]</p>
                    {messages.map(msg => {
                        if(msg.userId == props.userId) {
                            return (
                                <div className="chat-right" key={Math.random()}>
                                    <span>
                                        {msg.message} 
                                        <small>{msg.userId}</small>
                                        {msg.expertViewed && <div className='dot'>&nbsp;</div>}
                                    </span>
                                </div>
                            );
                        } else {
                            return (
                                <div className="chat-left" key={Math.random()}>
                                    <span>
                                        {msg.message}
                                        <small>{msg.userId}</small> 
                                    </span>
                                </div>
                            )
                        }
                    })}
                </ScrollableFeed>
            </div>
            <div className="footer-content">
                <input 
                    type="text" 
                    type="text"
                    placeholder={"Type Something"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        e.key == "Enter" && addMessage();
                    }}
                />

                <button>SEND</button>
            </div>
        </div>
    )
}

export default Chat;