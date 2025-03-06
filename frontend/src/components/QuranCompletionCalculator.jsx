import  { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const QuranCompletionCalculator = () => {
  const [linesPerDay, setLinesPerDay] = useState(0);
  const totalLines = 288; // One Quran Para has 288 lines

  // Calculate days needed (y)
  const daysNeeded = linesPerDay > 0 ? Math.ceil(totalLines / linesPerDay) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Quran Para Completion Calculator</h2>

      {/* Input Field for Lines Per Day */}
      <input
        type="number"
        className="w-64 px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter lines recited per day"
        value={linesPerDay}
        onChange={(e) => setLinesPerDay(Number(e.target.value))}
      />

      {/* Circular Progress Bar */}
      <div style={{ width: 150, height: 150 }} className="mb-4">
        <CircularProgressbar
          value={linesPerDay > 0 ? (totalLines / daysNeeded) : 0}
          text={`${daysNeeded} Days`}
          styles={buildStyles({
            textColor: "#2563eb",
            pathColor: "#2563eb",
            trailColor: "#d6d6d6",
            textSize: "16px"
          })}
        />
      </div>

      {/* Display Calculation Result */}
      <p className="text-lg font-medium">
        If student recite <span className="text-blue-600 font-bold">{linesPerDay}</span> lines per day, you will complete 1 Para in <span className="text-green-600 font-bold">{daysNeeded}</span> days.
      </p>
    </div>
  );
};

export default QuranCompletionCalculator;
