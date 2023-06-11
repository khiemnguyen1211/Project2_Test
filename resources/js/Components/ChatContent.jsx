import React, {useEffect, useState} from 'react';
import axios from 'axios';
import echo from "@/Components/echo.jsx";
import useWebSocket from "react-use-websocket";

const ChatContent = ({ oldMessages, auth, updateMessages }) => {
    console.log('ChatContent re-render');
    const [newMessage, setNewMessage] = useState('');
    const [mergedMessages, setMergedMessages] = useState([]);

    useEffect(() => {
        transformOldToMerged();

        // Subscribe to the channel when the component mounts
        const channel = window.Echo.private(`messenger.1.2`);

        channel.listen('.MessageSent',(data) => {
            console.log('Received new message:', data.message);
            let newMsg = data.message;
            // You can update your state or perform any other actions here
            updateMessages({
                id: newMsg.id,
                message:  newMsg.message,
                sender_id: newMsg.sender_id,
                receiver_id: newMsg.receiver_id,
                created_at: newMsg.created_at,
                updated_at: newMsg.updated_at
            });
        });

        // Unsubscribe from the channel when the component unmounts
        return () => {
            channel.stopListening('MessageSent');
        };
    }, []);

    useEffect(() => {
        transformOldToMerged();
    }, [oldMessages.length]);


    const receiverId = window.location.pathname.split('/').pop();

    const formatDate = (timestamp) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedTime = new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Bangkok',
        });
        const dayOfWeek = daysOfWeek[new Date(timestamp).getDay()]; // Get the day of the week

        return `${dayOfWeek} ${formattedTime}`;
    };
    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // console.log({newMessage});
        // console.log({receiverId});
        const url = `/chat/${receiverId}`;
        const data = {
            message: newMessage,
        };
        const headers = {
            'X-CSRF-TOKEN': getCsrfToken(),
        };

        axios
            .post(url, data, { headers: headers })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Message sent successfully');
                    setNewMessage('');

                } else {
                    console.error('Failed to send message:', response);
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
        // window.location.reload();
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const transformOldToMerged = () => {
        // old => merged
        let currentSender = null;
        let currentReceiver = null;
        let mergedMessage = null;
        oldMessages.forEach((message) => {
            if (message.sender_id && message.receiver_id) {
                if (message.sender_id === currentSender && message.receiver_id === currentReceiver) {
                    mergedMessage.messages.push(message);
                    mergedMessage.messages.push({
                        created_at: "2023-06-11T13:56:58.000000Z",
                        id: 298,
                        message: "For Testing Only",
                        receiver_id: 1,
                        sender_id: 4,
                        updated_at: "2023-06-11T13:56:58.000000Z"
                    });
                } else {
                    // Create a new merged message
                    mergedMessage = {
                        sender_id: message.sender_id,
                        receiver_id: message.receiver_id,
                        sender_name: message.sender ? message.sender.name : '', // Retrieve sender's name
                        sender_avatar: message.sender_avatar,
                        receiver_name: message.receiver_name,
                        receiver_avatar: message.receiver_avatar,
                        messages: [message],
                    };

                    mergedMessages.push(mergedMessage);

                    // Update current sender and receiver
                    currentSender = message.sender_id;
                    currentReceiver = message.receiver_id;
                }
            }
        });
    };

    return (
        <div className="w-full bg-white flex flex-col pt-[12px] pb-[25px] rounded-lg">
            {/* Chat content */}
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-200 h-[115px] pl-[35px] rounded-tl-xl rounded-tr-xl ">
                <h1 className="text-[#6a65bf] text-[22px]">Chat</h1>
                <div className="p-[51px]">
                    <button className="bg-[#7dd6b4] text-white text-[19px] px-4 py-2 rounded-xl">Messages</button>
                </div>
            </div>
            {/* Chat Content */}
            <div className="p-4 flex-grow bg-gray-100 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {mergedMessages.map((mergedMessage, index) => {
                    const isSentByCurrentUser = mergedMessage.sender_id === auth.user.id;
                    const messageContainerClass = isSentByCurrentUser ? 'justify-end' : 'justify-start';
                    const messageContentClass = isSentByCurrentUser ? 'bg-[#6a65bf] text-white' : 'bg-white text-black';

                    return (
                        <div key={index} className={`flex items-end ${messageContainerClass}`}>
                            {!isSentByCurrentUser && (
                                <img src={mergedMessage.sender_avatar} alt="Avatar" className="w-8 h-8 rounded-full ml-2" />
                            )}
                            <div className="max-w-[60%] h-auto flex flex-col py-2 px-4 ml-2">
                                {mergedMessage.messages.map((message, index) => (
                                    <div key={index} className={`mb-2 ${isSentByCurrentUser ? 'pl-20' : 'pr-20'}`}>
                                        {index === 0 && (
                                            <p className="text-[12px] text-[#6a65bf] font-semibold mb-1">
                                                {isSentByCurrentUser ? 'You' : mergedMessage.sender_name},
                                                {formatDate(message.created_at)}
                                            </p>
                                        )}
                                        <div
                                            className={`inline-block relative rounded-lg py-[20px] px-[20px] ${messageContentClass}`}
                                        >
                                            <p className="text-[17px] font-semibold">{message.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isSentByCurrentUser && (
                                <img src={mergedMessage.sender_avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Messages Box */}
            <div className="p-[35px] bg-gray-100 rounded-bl-2xl rounded-br-2xl">
                <div className="relative">
                    <input
                        type="text"
                        className="bg-white text-[17px] font-semibold w-full h-[78px] px-[20px] border border- bg-gray-100 rounded-2xl pr-10"
                        placeholder="Write your message...."
                        onKeyDown={handleKeyDown}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <span className="absolute inset-y-0 right-[30px] flex items-center">
            <button className="text-gray-400 w-[23px]" onClick={handleSubmit} >
                Send
            </button>
        </span>
                </div>
            </div>
        </div>
    );
};

export default ChatContent;
