// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const CropResults = () => {
//   const locationHook = useLocation();
//   const navigate = useNavigate();

//   // Get state passed from previous page
//   const { recommendedCrops, env } = locationHook.state || { recommendedCrops: [], env: {} };

//   if (!recommendedCrops) {
//     return (
//       <div className="text-center mt-20">
//         <p>No recommendations found. Go back and try again.</p>
//         <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
//       <h1 className="text-3xl font-bold text-green-700 text-center mb-6">🌱 Recommended Crops</h1>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Environmental Parameters Used:</h2>
//         <ul className="list-disc list-inside text-gray-700">
//           {Object.entries(env).map(([key, value]) => (
//             <li key={key}><strong>{key}:</strong> {value ?? "NA"}</li>
//           ))}
//         </ul>
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold mb-2">Crops:</h2>
//         <ul className="list-decimal list-inside text-gray-800">
//           {recommendedCrops.length > 0 ? (
//             recommendedCrops.map((crop, idx) => <li key={idx}>{crop}</li>)
//           ) : (
//             <li>No suitable crops found</li>
//           )}
//         </ul>
//       </div>

//       <div className="mt-6 text-center">
//         <button onClick={() => navigate(-1)} className="px-4 py-2 bg-green-600 text-white rounded-lg">
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CropResults;

// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const CropResults = () => {
//   const locationHook = useLocation();
//   const navigate = useNavigate();

//   // Get state passed from previous page
//   const { recommendedCrops, env } = locationHook.state || { recommendedCrops: [], env: {} };

//   if (!recommendedCrops) {
//     return (
//       <div className="text-center mt-20">
//         <p>No recommendations found. Go back and try again.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
//       <h1 className="text-3xl font-bold text-green-700 text-center mb-6">🌱 Recommended Crops</h1>

//       {/* Environmental Parameters */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Environmental Parameters Used:</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Object.entries(env).map(([key, value]) => (
//             <div
//               key={key}
//               className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm"
//             >
//               <strong>{key}:</strong>{" "}
//               {typeof value === "object" && value !== null
//                 ? Object.entries(value)
//                     .map(([subKey, subVal]) => `${subKey}: ${subVal ?? "NA"}`)
//                     .join(", ")
//                 : value ?? "NA"}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recommended Crops */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Crops:</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {recommendedCrops.length > 0 ? (
//             recommendedCrops.map((crop, idx) => {
//               const cropName = typeof crop === "string" ? crop : crop.crop_name ?? "Unknown Crop";
//               const score = typeof crop === "object" ? crop.score : null;
//               const limiting = typeof crop === "object" ? crop.limiting_factor : null;

//               return (
//                 <div
//                   key={idx}
//                   className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
//                 >
//                   <h3 className="text-lg font-bold text-green-700">{cropName}</h3>
//                   {score !== null && <p className="text-gray-700 mt-1">Score: {score}</p>}
//                   {limiting && <p className="text-gray-600 mt-1">Limiting Factor: {limiting}</p>}
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-700">No suitable crops found</p>
//           )}
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CropResults;

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const CropResults = () => {
//   const locationHook = useLocation();
//   const navigate = useNavigate();

//   // Get state passed from previous page
//   const { recommendedCrops, env } = locationHook.state || {
//     recommendedCrops: [],
//     env: {},
//   };

//   // State for crop selection + backend response
//   const [selectedCrop, setSelectedCrop] = useState("");
//   const [customCrop, setCustomCrop] = useState("");
//   const [checkResult, setCheckResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Round numbers helper
//   const formatValue = (val) => {
//     if (typeof val === "number") {
//       return val.toFixed(2);
//     }
//     return val;
//   };

//   // Handle crop check
//   const handleCheckCrop = async () => {
//     const cropToCheck = customCrop.trim() || selectedCrop;
//     if (!cropToCheck) {
//       alert("Please select or enter a crop.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         crop_name: cropToCheck,
//         environment: env,
//       };

//       const response = await fetch("http://127.0.0.1:8000/check_crop/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Backend error: ${response.status}`);
//       }

//       const data = await response.json();
//       setCheckResult(data);
//     } catch (error) {
//       console.error("Error checking crop:", error);
//       alert("Failed to fetch suitability score. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!recommendedCrops) {
//     return (
//       <div className="text-center mt-20">
//         <p>No recommendations found. Go back and try again.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
//       <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
//         🌱 Recommended Crops
//       </h1>

//       {/* Environmental Parameters */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           Environmental Parameters Used:
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Object.entries(env).map(([key, value]) => (
//             <div
//               key={key}
//               className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm"
//             >
//               <strong>{key}:</strong>{" "}
//               {typeof value === "object" && value !== null
//                 ? Object.entries(value)
//                     .map(
//                       ([subKey, subVal]) =>
//                         `${subKey}: ${formatValue(subVal) ?? "NA"}`
//                     )
//                     .join(", ")
//                 : formatValue(value) ?? "NA"}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recommended Crops */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Crops:</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {recommendedCrops.length > 0 ? (
//             recommendedCrops.map((crop, idx) => {
//               const cropName =
//                 typeof crop === "string" ? crop : crop.crop_name ?? "Unknown";
//               const score =
//                 typeof crop === "object" ? formatValue(crop.score) : null;
//               const limiting =
//                 typeof crop === "object" ? crop.limiting_factor : null;

//               return (
//                 <div
//                   key={idx}
//                   onClick={() => setSelectedCrop(cropName)}
//                   className={`cursor-pointer ${
//                     selectedCrop === cropName
//                       ? "bg-green-200 border-green-500"
//                       : "bg-green-50 border-green-200"
//                   } border rounded-xl p-4 shadow-md hover:shadow-lg transition-all`}
//                 >
//                   <h3 className="text-lg font-bold text-green-700">
//                     {cropName}
//                   </h3>
//                   {score !== null && (
//                     <p className="text-gray-700 mt-1">Score: {score}</p>
//                   )}
//                   {limiting && (
//                     <p className="text-gray-600 mt-1">
//                       Limiting Factor: {limiting}
//                     </p>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-700">No suitable crops found</p>
//           )}
//         </div>
//       </div>

//       {/* Custom Crop Input */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Or Enter a Crop:</h2>
//         <input
//           type="text"
//           value={customCrop}
//           onChange={(e) => setCustomCrop(e.target.value)}
//           className="border rounded-lg px-4 py-2 w-full"
//           placeholder="Type crop name..."
//         />
//       </div>

//       {/* Check Button */}
//       <div className="text-center">
//         <button
//           onClick={handleCheckCrop}
//           disabled={loading}
//           className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
//         >
//           {loading ? "Checking..." : "Check Suitability Score"}
//         </button>
//       </div>

//       {/* Result */}
//       {checkResult && (
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
//           <h2 className="text-2xl font-bold text-blue-700 mb-4">
//             🌾 Crop Suitability Result
//           </h2>
//           <p>
//             <strong>Crop:</strong> {checkResult.crop_name}
//           </p>
//           <p>
//             <strong>Suitability Score:</strong>{" "}
//             {formatValue(checkResult.score)}
//           </p>
//           <p>
//             <strong>Class:</strong> {checkResult.class}
//           </p>
//           <p>
//             <strong>Limiting Factor:</strong>{" "}
//             {checkResult.limiting_factor || "None"}
//           </p>
//           <p>
//             <strong>Suggested Remedial Action:</strong>{" "}
//             {checkResult.suggested_remedial_action}
//           </p>
//         </div>
//       )}

//       {/* Back Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CropResults;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CropResults = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();

  // Get state passed from previous page
  const { recommendedCrops, env } = locationHook.state || {
    recommendedCrops: [],
    env: {},
  };

  // State for crop selection + backend response
  const [selectedCrop, setSelectedCrop] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allCrops, setAllCrops] = useState([]); // 🔥 store all crop names

  // Load crop list from backend
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/crops");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setAllCrops(data.crops || []); // expects { crops: ["Rice", "Wheat", ...] }
      } catch (error) {
        console.error("Failed to load crop list:", error);
      }
    };
    fetchCrops();
  }, []);

  // Round numbers helper
  const formatValue = (val) =>
    typeof val === "number" ? val.toFixed(2) : val;

  // Handle crop check
  const handleCheckCrop = async () => {
    const cropToCheck = customCrop.trim() || selectedCrop;
    if (!cropToCheck) {
      alert("Please select or enter a crop.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        crop_name: cropToCheck,
        environment: env,
      };

      const response = await fetch("http://127.0.0.1:8000/check_crop/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);

      const data = await response.json();
      setCheckResult(data);
    } catch (error) {
      console.error("Error checking crop:", error);
      alert("Failed to fetch suitability score. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!recommendedCrops) {
    return (
      <div className="text-center mt-20">
        <p>No recommendations found. Go back and try again.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        🌱 Recommended Crops
      </h1>

      {/* Environmental Parameters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Environmental Parameters Used:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(env).map(([key, value]) => (
            <div
              key={key}
              className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm"
            >
              <strong>{key}:</strong>{" "}
              {typeof value === "object" && value !== null
                ? Object.entries(value)
                  .map(
                    ([subKey, subVal]) =>
                      `${subKey}: ${formatValue(subVal) ?? "NA"}`
                  )
                  .join(", ")
                : formatValue(value) ?? "NA"}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Crops */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Crops:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCrops.length > 0 ? (
            recommendedCrops.map((crop, idx) => {
              const cropName =
                typeof crop === "string" ? crop : crop.crop_name ?? "Unknown";
              const score =
                typeof crop === "object" ? formatValue(crop.score) : null;
              const limiting =
                typeof crop === "object" ? crop.limiting_factor : null;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCrop(cropName)}
                  className={`cursor-pointer ${selectedCrop === cropName
                    ? "bg-green-200 border-green-500"
                    : "bg-green-50 border-green-200"
                    } border rounded-xl p-4 shadow-md hover:shadow-lg transition-all`}
                >
                  <h3 className="text-lg font-bold text-green-700">
                    {cropName}
                  </h3>
                  {score !== null && (
                    <p className="text-gray-700 mt-1">Score: {score}</p>
                  )}
                  {limiting && (
                    <p className="text-gray-600 mt-1">
                      Limiting Factor: {limiting}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-700">No suitable crops found</p>
          )}
        </div>
      </div>

      {/* Custom Crop Input with Autocomplete */}
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Or Enter a Crop:</h2>
        <input
          list="crop-options"
          type="text"
          value={customCrop}
          onChange={(e) => setCustomCrop(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
          placeholder="Type crop name..."
        />
        <datalist id="crop-options">
          {allCrops.map((crop, idx) => (
            <option key={idx} value={crop} />
          ))}
        </datalist>
      </div> */}

      {/* Custom Crop Input with Autocomplete */}
      {/* Custom Crop Input with Autocomplete */}
      <div className="mb-8 relative">
        <h2 className="text-xl font-semibold mb-2">Or Enter a Crop:</h2>
        <input
          type="text"
          value={customCrop}
          onChange={(e) => {
            setCustomCrop(e.target.value);
            setShowDropdown(true); // reopen when typing
          }}
          className="border rounded-lg px-4 py-2 w-full"
          placeholder="Type crop name..."
        />

        {/* Dropdown */}
        {showDropdown && customCrop && (
          <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-md">
            {allCrops
              .filter((crop) =>
                crop.toLowerCase().includes(customCrop.toLowerCase())
              )
              .slice(0, 8) // limit results
              .map((crop, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setCustomCrop(crop);
                    setShowDropdown(false); // close dropdown after selecting
                  }}
                >
                  {crop}
                </li>
              ))}
          </ul>
        )}
      </div>



      {/* Check Button */}
      <div className="text-center">
        <button
          onClick={handleCheckCrop}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Suitability Score"}
        </button>
      </div>

      {/* Result */}
      {checkResult && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            🌾 Crop Suitability Result
          </h2>
          <p>
            <strong>Crop:</strong> {checkResult.crop_name}
          </p>
          <p>
            <strong>Suitability Score:</strong>{" "}
            {formatValue(checkResult.score)}
          </p>
          <p>
            <strong>Class:</strong> {checkResult.class}
          </p>
          <p>
            <strong>Limiting Factor:</strong>{" "}
            {checkResult.limiting_factor || "None"}
          </p>
          <p>
            <strong>Suggested Remedial Action:</strong>{" "}
            {checkResult.suggested_remedial_action}
          </p>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CropResults;
