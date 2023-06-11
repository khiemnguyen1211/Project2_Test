import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
export default function UserColumn  ( {recentMessages,auth} ) {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
        return formattedTime;
    };

    return (
        <div className="w-full md:w-[442px] bg-white">
            {/* User column content */}
            {/* user header */}
            <div className="flex items-center px-4 pt-[52px]">
                <div className="flex items-center justify-center w-[38px] h-[38px] rounded-xl hover:bg-gray-300">
                    <i className="fa-solid fa-angle-left fa-lg"></i>
                </div>
                <h2 className="text-[22px] text-[#6a65bf] ml-[12px]">Chat</h2>
            </div>
            <div className="border-b border-gray-300 pt-[42px] mx-[33px] "></div>
            {/* user info */}
            <div className="flex flex-col justify-center items-center">
                <div className="pt-[38px]">
                    <img src="jone-doe.jpg" alt="Large Avatar" className="w-[125px] h-[125px] rounded-full"/>
                </div>

                <div className="p-[20px]">
                    <p className="font-bold text-[23px] text-[#6a65bf]">
                        {auth && auth.user && auth.user.name ? auth.user.name : 'N/A'}
                    </p>
                </div>


                <div className="relative">
                    <select
                        id="status-select"
                        className="text-[15px] text-white bg-[#7dd6b4] justify-center flex w-[131px] h-[34px]"
                    >
                        <option value="available">
                            Available
                        </option>
                        <option value="invisible">
                            Invisible
                        </option>
                        <option value="busy">
                            Busy
                        </option>
                    </select>
                </div>
            </div>
            {/* Search bar */}
            <div className="p-[33px]">
                <div className="relative">
                    <input
                        type="text"
                        className="text-lg w-[376px] h-[58px] px-[20px] border border-gray-300 bg-gray-100 rounded-2xl pr-10"
                        placeholder="Search"
                    />
                    <span className="absolute inset-y-0 right-[40px] flex items-center">
                <i className="fas fa-search text-gray-400 w-[23px] "></i>
              </span>
                </div>
            </div>
            {/* Last chat*/}
            <div>
                <div className="flex items-center justify-between pl-[33px] pr-[78px]">
                    <h2 className="text-[15px] text-base text-[#6a65bf]">Last chats</h2>
                    <div className="w-[38px] h-[38px] flex items-center justify-center bg-[#7dd6b4] rounded-xl">
                        <i className="fas fa-plus text-white"></i>
                    </div>
                </div>
            </div>
            <div className="pl-[28px] pt-[28px] pr-[33px]">
                <ul>
                    {recentMessages.map((user, index) => (
                        <a key={index} href={`/chat/${user.user_id}`}>
                            <li className="flex items-center hover:bg-gray-100 relative w-[376px] h-[93px]  pl-[33px] py-[20px] space-x-[20px] rounded-2xl">
                                <img src="jone-doe.jpg" alt="Avatar" className="w-[48px] h-[48px] rounded-full"/>
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <p className="text-[#6a65bf] font-bold text-lg">{user.name.length > 0 ? user.name : 'N/A'}</p>
                                            <p className="text-gray-400 text-sm font-bold absolute top-[50%] right-[22px] transform translate-y-[-50%]">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm font-bold">{user.message}</p>
                                </div>
                            </li>
                        </a>
                    ))}
                </ul>
            </div>
        </div>
    );
}


