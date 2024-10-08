"use client"; 

export default function Soon() {
  return (
    <div className={`flex justify-center items-center h-screen`}>
      <div className="w-[65vw] h-[35vh] lg:h-[45vh] lg:w-[45vw] border-black border-4 shadow-[-10px_10px_0_0_#000000] lg:shadow-[-20px_20px_0_0_#000000]">
        <div className="bg-[#28B6BA] h-[2vh] lg:h-[3vh] flex items-center border-black border-b-2 pl-[0.5vw] ">
          <img src="/yellow-circles.svg" alt="Yellow Circles" className="h-[1vh] lg:h-[2vh]" />
        </div>
        <div className="flex flex-col items-center h-[38vh] font-pixeboy text-[3vh] lg:text-[5vh]">
          <p className="py-[5vh] [text-shadow:2px_2px_4px_var(--tw-shadow-color)] shadow-[#3EB85D]"></p>
          <div className="bg-[#FFC642] w-[50vw] lg:w-[35vw] flex items-center justify-center text-white border-black border-2 rounded-lg glow-text mx-auto">
  <p className="text-center">Registrations Opening Soon</p>
</div>

          <button className="bg-[#3E8BFF] mt-[5vh] px-[2vw] text-white border-black border-2">Stay Tuned !</button>
        </div>
      </div>
    </div>
  );
}
