import '../../../css/app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Sidebar from "@/Components/Sidebar.jsx";
import UserColumn from "@/Components/UserColumn.jsx";
import ChatContent from "@/Components/ChatContent.jsx";
import React, {useEffect, useState} from "react";

export default function Chat(props) {
    console.log(props.recentMessages);
    console.log(props.messages);
    const [newMessage, setNewMessage] = useState('');
    const [recentMessages, setRecentMessages] = useState(props.recentMessages);
    const [oldMessages, setOldMessages] = useState(props.messages);

    const updateMessages = (newMsg) => {
        setNewMessage(newMsg);
    };

    useEffect(() => {
        console.log('newMessage:',newMessage);
        // console.log('Old Messages:', oldMessages);
        // Add new message to old-messages
        setOldMessages((prevState) => [...prevState, newMessage]);

        // Add new message to recent messages
        // dua tren cai receiver_id, de ma update dung cai thang do thoi
        setRecentMessages((prevState) => {
            return prevState.map((message) => {
                if (message.user_id === newMessage.id) {
                    return newMessage;
                } else {
                    return message;
                }
            });
        });
    }, [newMessage]);

    return (
            <div className="flex flex-col md:flex-row h-screen pr-[20px] ">
                <Sidebar />
                <div className="border-grey-300 border-l h-full"></div>
                <UserColumn recentMessages={recentMessages} auth={props.auth}/>
                <ChatContent oldMessages={oldMessages} auth={props.auth} props={props} updateMessages={updateMessages}/>
            </div>
    );
}
{/*<div className="flex items-center justify-start bg-gray-200 p-[12px] rounded-br-xl">*/}
{/*    <input*/}
{/*        type="text"*/}
{/*        placeholder="Type your message"*/}
{/*        className="w-[80%] h-[50px] rounded-l-xl rounded-r-[50px] border border-gray-300 px-4"*/}
{/*    />*/}
{/*    <button className="bg-[#6a65bf] text-white px-4 py-2 rounded-l-[50px] rounded-r-xl ml-2">*/}
{/*        <i className="fas fa-paper-plane"></i>*/}
{/*    </button>*/}
{/*</div>*/}
