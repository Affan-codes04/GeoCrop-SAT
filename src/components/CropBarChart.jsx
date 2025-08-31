// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// const CropBarChart = ({ data }) => {
//   // Normalize the incoming data
//   const formattedData = data.map((crop, idx) => {
//     if (typeof crop === "string") {
//       return { name: crop, score: 0 };
//     } else if (typeof crop === "object") {
//       return {
//         name: crop.crop_name ?? `Crop ${idx + 1}`,
//         score: typeof crop.score === "number" ? crop.score : 0,
//       };
//     }
//     return { name: `Crop ${idx + 1}`, score: 0 };
//   });

//   // Function to decide bar color based on score
//   const getBarColor = (score) => {
//     if (score < 40) return "#f87171"; // red-400
//     if (score < 70) return "#facc15"; // yellow-400
//     return "#4ade80"; // green-400
//   };

//   return (
//     <div className="w-full h-96 p-4 bg-white shadow-lg rounded-2xl">
//       <h2 className="text-xl font-bold mb-4 text-center">
//         Crop Suitability Scores
//       </h2>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={formattedData}
//           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis domain={[0, 100]} />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="score" barSize={50}>
//             {formattedData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CropBarChart;


import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CropRadarChart from "./CropRadarChart";

const CropBarChart = ({ data }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropParams, setCropParams] = useState(null);

  // Normalize the incoming data
  const formattedData = data.map((crop, idx) => {
    if (typeof crop === "string") {
      return { name: crop, score: 0 };
    } else if (typeof crop === "object") {
      return {
        name: crop.crop_name ?? `Crop ${idx + 1}`,
        score: typeof crop.score === "number" ? crop.score : 0,
      };
    }
    return { name: `Crop ${idx + 1}`, score: 0 };
  });

  // Function to decide bar color based on score
  const getBarColor = (score) => {
    if (score < 40) return "#f87171"; // red-400
    if (score < 70) return "#facc15"; // yellow-400
    return "#4ade80"; // green-400
  };

  // Handle crop click
  const handleBarClick = async (cropName) => {
    setSelectedCrop(cropName);
    try {
      const res = await fetch(`http://localhost:8000/crop-params/${cropName}`);
      const json = await res.json();
      setCropParams(json); // backend response directly
    } catch (err) {
      console.error("Error fetching crop params:", err);
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4 text-center">
        Crop Suitability Scores
      </h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" barSize={50} onClick={(data) => handleBarClick(data.name)}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart Section */}
      {cropParams && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-center mb-4">
            Radar Chart for {selectedCrop}
          </h3>
          <CropRadarChart cropData={cropParams} />
        </div>
      )}
    </div>
  );
};

export default CropBarChart;
