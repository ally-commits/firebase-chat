import React from 'react'
import firebase from 'firebase/compat/app';
import {db} from '../App'
import ScrollableFeed from "react-scrollable-feed";

let channelId = 'channel-101'
let unSubscribe;
const Chat = (props) => {
    const [value,setValue] = React.useState("");
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => { 
            unSubscribe && unSubscribe();

            unSubscribe = db
                .collection(`channel/${channelId}/messages`)
                .orderBy("timeStamp")
                .onSnapshot((querySnapshot) => {
                    var arr = [];
                    querySnapshot.forEach((doc) => {
                        arr.push(doc.data());
                    });
                    setMessages([...arr]);
                });
    }, []);

    const addMessage = () => {
        let name = props.userId + "NAME";
        if (value != "") {
            let messageValue = value;
            setValue("");
            db.collection(`channel/${channelId}/messages`)
                .add({
                    name: name,
                    createdAt: new Date().toString().substr(0, 21),
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                    messageFrom: "USER",
                    userId: props.userId,
                    message: messageValue,
                    serviceProviderViewed: false,
                    userViewed: true,
                })
                .then((docRef) => {
                     console.log(docRef)
                })
                .catch((error) => {
                    console.error("Error addding document: ", error);
                });
        }
    }
    return (
        <div className="chat-container">
            <div className="chat-content">
                <ScrollableFeed forceScroll>
                    {messages.map(msg => {
                        if(msg.userId == props.userId) {
                            return (
                                <div className="chat-right" key={Math.random()}>
                                    <span>
                                        {msg.message} 
                                        <small>{msg.userId}</small>
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