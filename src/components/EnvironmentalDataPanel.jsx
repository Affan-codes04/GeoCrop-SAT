// import React from 'react';

// const EnvironmentalDataPanel = ({ location, temp, rain, elevation, ph, sand, clay, onCheckSuitability }) => {
//   const fallback = "NA";

//   const formatNumber = (value, decimals = 2) => {
//     return typeof value === "number" ? value.toFixed(decimals) : fallback;
//   };

//   return (
//     <div className="mx-auto bg-white rounded-2xl shadow-lg p-6 mt-4 border border-gray-200">
//       <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//         Environmental Data
//         <div className="text-sm text-gray-500 mt-1">
//           for <span className="font-medium">{location || "Unknown location"}</span>
//         </div>
//       </h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-800">
//         <div>
//           <span className="font-semibold">Temperature:</span>
//           <div className="text-blue-600">
//             {temp !== null ? `${temp} K` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Rainfall:</span>
//           <div className="text-blue-600">
//             {rain !== null ? `${formatNumber(rain, 2)} mm` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Elevation:</span>
//           <div className="text-gray-700">
//             {elevation !== null ? `${formatNumber(elevation, 2)} m` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Soil pH:</span>
//           <div className="text-green-600">{ph !== null ? ph : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Sand %:</span>
//           <div className="text-yellow-600">{sand !== null ? `${sand}%` : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Clay %:</span>
//           <div className="text-red-500">{clay !== null ? `${clay}%` : fallback}</div>
//         </div>
//       </div>

//       {/* Suitability Button */}
//       <div className="mt-6 text-center bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md">
//         <button onClick={onCheckSuitability}>
//           🌱 Check Suitability
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EnvironmentalDataPanel;


// import React from "react";
// import { useNavigate } from "react-router-dom";

// const EnvironmentalDataPanel = ({ location, temp, rain, elevation, ph, sand, clay }) => {
//   const navigate = useNavigate();
//   const fallback = "NA";

//   const formatNumber = (value, decimals = 2) => {
//     return typeof value === "number" ? value.toFixed(decimals) : fallback;
//   };

//   const handleCheckSuitability = () => {
//     navigate("/suitability"); // 🔥 navigates to new page
//   };

//   return (
//     <div className="mx-auto bg-white rounded-2xl shadow-lg p-6 mt-4 border border-gray-200">
//       <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//         Environmental Data
//         <div className="text-sm text-gray-500 mt-1">
//           for <span className="font-medium">{location || "Unknown location"}</span>
//         </div>
//       </h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-800">
//         <div>
//           <span className="font-semibold">Temperature:</span>
//           <div className="text-blue-600">
//             {temp !== null ? `${temp} K` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Rainfall:</span>
//           <div className="text-blue-600">
//             {rain !== null ? `${formatNumber(rain, 2)} mm` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Elevation:</span>
//           <div className="text-gray-700">
//             {elevation !== null ? `${formatNumber(elevation, 2)} m` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Soil pH:</span>
//           <div className="text-green-600">{ph !== null ? ph : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Sand %:</span>
//           <div className="text-yellow-600">{sand !== null ? `${sand}%` : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Clay %:</span>
//           <div className="text-red-500">{clay !== null ? `${clay}%` : fallback}</div>
//         </div>
//       </div>

//       {/* Suitability Button */}
//       <div className="mt-6 text-center">
//         <button
//           onClick={handleCheckSuitability}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
//         >
//           🌱 Check Suitability
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EnvironmentalDataPanel;


// import React from "react";
// import { useNavigate } from "react-router-dom";

// const EnvironmentalDataPanel = ({ envData, setRecommendedCrops }) => {
//   const navigate = useNavigate();
//   const fallback = "NA";

//   const formatNumber = (value, decimals = 2) =>
//     typeof value === "number" ? value.toFixed(decimals) : fallback;

//   const handleCheckSuitability = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/suggest_crops/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           temperature: envData.temp,
//           rainfall: envData.rain,
//           ph: envData.ph,
//           altitude: envData.elevation,
//           texture: `${envData.sand}% sand, ${envData.clay}% clay`,
//         }),
//       });

//       const data = await res.json();
//       console.log("Crop recommendations fetched:", data);
//       setRecommendedCrops(data.recommended_crops || []);

//       // Navigate only after fetching
//       navigate("/suitability");
//     } catch (err) {
//       console.error("Error fetching crops:", err);
//     }
//   };

//   return (
//     <div className="mx-auto bg-white rounded-2xl shadow-lg p-6 mt-4 border border-gray-200">
//       <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//         Environmental Data
//         <div className="text-sm text-gray-500 mt-1">
//           for <span className="font-medium">{envData.location || "Unknown location"}</span>
//         </div>
//       </h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-800">
//         <div>
//           <span className="font-semibold">Temperature:</span>
//           <div className="text-blue-600">{envData.temp ?? fallback} K</div>
//         </div>
//         <div>
//           <span className="font-semibold">Rainfall:</span>
//           <div className="text-blue-600">{envData.rain ?? fallback} mm</div>
//         </div>
//         <div>
//           <span className="font-semibold">Elevation:</span>
//           <div className="text-gray-700">{envData.elevation ?? fallback} m</div>
//         </div>
//         <div>
//           <span className="font-semibold">Soil pH:</span>
//           <div className="text-green-600">{envData.ph ?? fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Sand %:</span>
//           <div className="text-yellow-600">{envData.sand ?? fallback}%</div>
//         </div>
//         <div>
//           <span className="font-semibold">Clay %:</span>
//           <div className="text-red-500">{envData.clay ?? fallback}%</div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default EnvironmentalDataPanel;


// import React from 'react';

// const EnvironmentalDataPanel = ({ location, temp, rain, elevation, ph, sand, clay }) => {
//   const fallback = "NA";

//   const formatNumber = (value, decimals = 2) => {
//     return typeof value === "number" ? value.toFixed(decimals) : fallback;
//   };

//   return (
//     <div className="mx-auto bg-white rounded-2xl shadow-lg p-6 mt-4 border border-gray-200">
//       <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//         Environmental Data
//         <div className="text-sm text-gray-500 mt-1">
//           for <span className="font-medium">{location || "Unknown location"}</span>
//         </div>
//       </h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-800">
//         <div>
//           <span className="font-semibold">Temperature:</span>
//           <div className="text-blue-600">
//             {temp !== null ? `${temp} K` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Rainfall:</span>
//           <div className="text-blue-600">
//             {rain !== null ? `${formatNumber(rain, 2)} mm` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Elevation:</span>
//           <div className="text-gray-700">
//             {elevation !== null ? `${formatNumber(elevation, 2)} m` : fallback}
//           </div>
//         </div>
//         <div>
//           <span className="font-semibold">Soil pH:</span>
//           <div className="text-green-600">{ph !== null ? ph : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Sand %:</span>
//           <div className="text-yellow-600">{sand !== null ? `${sand}%` : fallback}</div>
//         </div>
//         <div>
//           <span className="font-semibold">Clay %:</span>
//           <div className="text-red-500">{clay !== null ? `${clay}%` : fallback}</div>
//         </div>
//       </div>
//       <div className="mt-6 text-center">
//         <button
//           className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
//         >
//           🌱 Check Suitability
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EnvironmentalDataPanel;


import React from 'react';
import { useNavigate } from 'react-router-dom';

const EnvironmentalDataPanel = ({ location, temp, rain, elevation, ph, sand, clay }) => {
  const navigate = useNavigate();
  const fallback = "NA";

  const formatNumber = (value, decimals = 2) => {
    return typeof value === "number" ? value.toFixed(decimals) : fallback;
  };

  const handleCheckSuitability = async () => {
    // Prepare payload for backend
    const payload = {
      temperature: temp,
      rainfall: rain,
      ph: ph,
      altitude: elevation,
      texture: `${sand ?? 0}% sand, ${clay ?? 0}% clay`
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/suggest_crops/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      // Navigate to results page with fetched data
      navigate("/crop-results", { state: { recommendedCrops: data.recommended_crops, env: payload } });

    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      alert("Failed to fetch crop recommendations. Check console for details.");
    }
  };

  return (
    <div className="mx-auto bg-white rounded-2xl shadow-lg p-6 mt-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Environmental Data
        <div className="text-sm text-gray-500 mt-1">
          for <span className="font-medium">{location || "Unknown location"}</span>
        </div>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-800">
        <div>
          <span className="font-semibold">Temperature:</span>
          <div className="text-blue-600">{temp !== null ? `${temp} K` : fallback}</div>
        </div>
        <div>
          <span className="font-semibold">Rainfall:</span>
          <div className="text-blue-600">{rain !== null ? `${formatNumber(rain, 2)} mm` : fallback}</div>
        </div>
        <div>
          <span className="font-semibold">Elevation:</span>
          <div className="text-gray-700">{elevation !== null ? `${formatNumber(elevation, 2)} m` : fallback}</div>
        </div>
        <div>
          <span className="font-semibold">Soil pH:</span>
          <div className="text-green-600">{ph !== null ? ph : fallback}</div>
        </div>
        <div>
          <span className="font-semibold">Sand %:</span>
          <div className="text-yellow-600">{sand !== null ? `${sand}%` : fallback}</div>
        </div>
        <div>
          <span className="font-semibold">Clay %:</span>
          <div className="text-red-500">{clay !== null ? `${clay}%` : fallback}</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleCheckSuitability}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
        >
          🌱 Check Suitability
        </button>
      </div>
    </div>
  );
};

export default EnvironmentalDataPanel;
