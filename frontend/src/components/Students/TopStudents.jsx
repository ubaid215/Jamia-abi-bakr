import { FaArrowDown } from "react-icons/fa";


function TopStudents() {
  return (
    <div>
         <div id="performance" className="w-full h-full bg-gray-100 rounded-2xl p-5 shadow-md">
            <div id="performance-top" className="flex items-center justify-between mb-5">
              <h1 className="text-black font-extrabold text-2xl">Top Students</h1>
              <div className="flex gap-1.5 bg-white text-zinc-600 p-2 items-center justify-center rounded-3xl">
                <h5>Class</h5>
                <FaArrowDown size={15} />
              </div>
            </div>
            <div id="performance-bottom" className="flex flex-col gap-3">
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default TopStudents