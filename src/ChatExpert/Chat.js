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
                                .update({expertViewed: true});
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
                    userId: expertId,
                    message: messageValue,
                    expertViewed: true,
                    userViewed: false,
                })
                .then((docRef) => {
                     console.log(docRef)
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
                        name: "EXPERT NAME",
                        profile: "SOME CONTENT",
                        userNotificationCount: 1,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        userNotificationCount: 0,
                    });
                } else {
                    userRef.update({
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        userNotificationCount: (doc.data().userNotificationCount ? doc.data().userNotificationCount : 0) + 1
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
                        name: "ALWIN",
                        profile: "SOME CONTENT",
                        expertNotificationCount: 0,
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                } else {
                    userRef.update({
                        expertNotificationCount: 0,
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
                    <p>EXPERT [{expertId}] -- USER [{props.userId}]</p>
                    {messages.map(msg => {
                        if(msg.userId == expertId) {
                            return (
                                <div className="chat-right" key={Math.random()}>
                                    <span>
                                        {msg.message} 
                                        <small>{msg.userId}</small>
                                        {msg.userViewed && <div className='dot'>&nbsp;</div>}
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