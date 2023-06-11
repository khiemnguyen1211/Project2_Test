import React, {useState} from 'react';
import axios from 'axios';


const ChatContent = ({ messages, auth, receiverId }) => {
    // const [dataMessage,setDataMessage] = useState(messages);
    // const [text, setText] = useState('');
    // console.log(dataMessage);

    const mergedMessages = [];
    const [message, setMessage] = useState('');

    const formatDate = (timestamp) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
        const dayOfWeek = daysOfWeek[new Date(timestamp).getDay()]; // Get the day of the week

        return `${dayOfWeek} ${formattedTime}`;
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `/chat/${receiverId}`;
        const data = { message };

        axios
            .post(url, data, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Message sent successfully');
                    setMessage('');
                } else {
                    console.error('Failed to send message:', response);
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    };


    // const sendMessage = () => {
    //     const url = `/chat/${receiverId}/store`;
    //     const data = { message };
    //
    //     axios
    //         .post(url, data)
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 console.log('Message sent successfully');
    //                 setMessage('');
    //             } else {
    //                 console.error('Failed to send message:', response);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error sending message:', error);
    //         });
    // };


    // const handleSubmit = () => {
    //     setDataMessage([...messages,{id: 11, messages: text}])
    // }

    // const handleOnChangeMessage = (event) => {
    //     setText(event.target.value)
    // }

    let currentSender = null;
    let currentReceiver = null;
    let mergedMessage = null;

    messages.forEach((message) => {
        if (message.sender_id === currentSender && message.receiver_id === currentReceiver) {
            // Merge with previous message
            mergedMessage.messages.push(message);
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
    });

    return (
        <div className="w-full bg-white flex flex-col pt-[12px] pb-[25px] rounded-lg">
            {/* Chat content */}
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-200 h-[115px] pl-[35px] rounded-tl-xl rounded-tr-xl ">
                <h1 className="text-[#6a65bf] text-[22px]">Chat</h1>
                <div className="p-[51px]">
                    <button className="bg-[#7dd6b4] text-white text-[19px] px-4 py-2 rounded-xl">
                        Messages
                    </button>
                </div>
            </div>
            {/* Chat Content */}
            <div className="p-4 flex-grow bg-gray-100">
                {mergedMessages.map((mergedMessage, index) => {
                    const isSentByCurrentUser = mergedMessage.sender_id === auth.user.id;
                    const messageContainerClass = isSentByCurrentUser ? 'justify-end' : 'justify-start';
                    const messageContentClass = isSentByCurrentUser ? 'bg-[#6a65bf] text-white' : 'bg-white text-black';

                    return (
                        <div key={index} className={`flex items-end ${messageContainerClass}`}>
                            {!isSentByCurrentUser && (
                                <img
                                    src={mergedMessage.sender_avatar}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full ml-2"
                                />
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
                                <img
                                    src={mergedMessage.sender_avatar}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Messages Box */}
            <form onSubmit={handleSubmit}>
            <div className="p-[35px] bg-gray-100 rounded-bl-2xl rounded-br-2xl">
                <div className="relative">
                    <input
                        type="text"
                        className="bg-white text-[17px] font-semibold w-full h-[78px] px-[20px] border border- bg-gray-100 rounded-2xl pr-10"
                        placeholder="Write your message...."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <span className="absolute inset-y-0 right-[30px] flex items-center">
                         <button className="text-gray-400 w-[23px]" type={"submit"} > Send</button>
                     </span>
                </div>
            </div>
            </form>
        </div>
    );
};

export default ChatContent;




// import React from 'react';
//
// const ChatContent = () => {
//     return (
//         <div className="w-full bg-white flex flex-col pt-[12px] pb-[25px] rounded-lg">
//             {/* Chat content */}
//             {/* Header */}
//             <div className="flex items-center justify-between bg-gray-200 h-[115px] pl-[35px] rounded-tl-xl rounded-tr-xl ">
//                 <h1 className="text-[#6a65bf] text-[22px]">Chat</h1>
//                 <div className="p-[51px]">
//                     <button className="bg-[#7dd6b4] text-white text-[19px] px-4 py-2 rounded-xl">Messages</button>
//                 </div>
//             </div>
//             {/* Chat Content */}
//             <div className="p-4 flex-grow bg-gray-100">
//                 <div className="flex items-end justify-start overflow-y-auto">
//                     <img src="jone-doe.jpg" alt="Avatar" className="w-8 h-8 rounded-full" />
//                     <div className="max-w-[60%] h-auto flex flex-col py-2 px-4 ml-2">
//                         <p className="text-[12px] text-[#6a65bf] font-semibold mb-1">User 1, 12:34 PM</p>
//                         <div className="inline-block relative bg-white text-black rounded-lg py-3 px-2">
//                             <p className="text-[17px] font-semibold">
//                                 Hello! sasf as dgf fdgfdhg dsg dsgdfgsdddddd dfgfgfhghgfhgfh
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex items-end justify-end">
//                     <div className="max-w-[60%] h-auto flex flex-col py-2 px-4 ml-2">
//                         <p className="text-[12px] text-[#6a65bf] font-semibold mb-1">User 1, 12:34 PM</p>
//                         <div className="inline-block relative h-auto bg-[#6a65bf] text-white rounded-lg py-3 px-2">
//                             <p className="text-[17px] font-semibold">
//                                 Hey! How can I help you? sdfdg dsgdsgfsd gfdsgfdg
//                             </p>
//                         </div>
//                     </div>
//                     <img src="jone-doe.jpg" alt="Avatar" className="w-8 h-8 rounded-full" />
//                 </div>
//                 <div className="flex items-end justify-start overflow-y-auto">
//                     <img src="jone-doe.jpg" alt="Avatar" className="w-8 h-8 rounded-full" />
//                     <div className="max-w-[60%] h-auto flex flex-col py-2 px-4 ml-2">
//                         <p className="text-[12px] text-[#6a65bf] font-semibold mb-1">User 1, 12:34 PM</p>
//                         <div className="inline-block relative bg-white text-black rounded-lg py-3 px-2">
//                             <p className="text-[17px] font-semibold">
//                                 Hello! How can I help you? sdfgf dsgfdsg dsgdsgf
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Messages Box */}
//             <div className="p-[35px] bg-gray-100 rounded-bl-2xl rounded-br-2xl">
//                 <div className="relative">
//                     <input type="text"
//                            className="bg-white text-[17px] font-semibold w-full h-[78px] px-[20px] border border- bg-gray-100 rounded-2xl pr-10"
//                            placeholder="Write your message...." />
//                     <span className="absolute inset-y-0 right-[30px] flex items-center">
//                                     <i className="fa-regular fa-paper-plane fa-xl text-gray-400 w-[23px]"></i>
//                                 </span>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ChatContent;
