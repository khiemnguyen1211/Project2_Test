import React from 'react';

const Sidebar = () => {
    return (
        <div className="w-full md:w-[104px] bg-white flex flex-col justify-center items-center border-none border-gray-400 pt-[12px]">
            {/* Logo content */}
            <div className="p-4 md:absolute md:top-7">
                <img src="logo.svg" alt="Logo" className="w-[48px] h-[48px]" />
            </div>
            <div className="p-4">
                {/* Small avatar content */}
                <img src="jone-doe.jpg" alt="Avatar" className="w-[48px] h-[48px] rounded-full" />
            </div>
            <div className="p-4 flex flex-col items-center">
                {/* Buttons content */}
                <button className="bg-white text-gray-400 px-4 py-2 mb-[30px] w-37 h-37">
                    <i className="fas fa-chart-line"></i>
                </button>
                <button className="bg-white text-gray-400 px-4 py-2 mb-[30px] w-37 h-37">
                    <i className="fas fa-users"></i>
                </button>
                <button className="bg-white text-gray-400 px-4 py-2 mb-[30px] w-37 h-37">
                    <i className="fas fa-comments"></i>
                </button>
                <button className="bg-white text-gray-400 px-4 py-2 w-37 h-37">
                    <i className="fas fa-cog"></i>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
