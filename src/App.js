// // import React, { useState } from "react";
// // import Header from "./components/Header";
// // import LocationSelector from "./components/LocationSelector";
// // import CropRecommendations from "./components/CropRecommendations";
// // import CropChecker from "./components/CropChecker";
// // import 'leaflet/dist/leaflet.css';

// // function App() {
// //   const [envData, setEnvData] = useState(null); // from LocationSelector
// //   const [recommendedCrops, setRecommendedCrops] = useState([]); // from backend
// //   const [selectedCrop, setSelectedCrop] = useState(null); // user selection

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header />

// //       {/* Step 1: Location Selection */}
// //       <LocationSelector onEnvDataFetched={setEnvData} />

// //       {/* Step 2: Recommended Crops */}
// //       {envData && (
// //         <CropRecommendations 
// //           envData={envData} 
// //           recommendedCrops={recommendedCrops}
// //           setRecommendedCrops={setRecommendedCrops}
// //           onCropSelect={setSelectedCrop}
// //         />
// //       )}

// //       {/* Step 3: Suitability Result */}
// //       {selectedCrop && (
// //         <CropChecker envData={envData} crop={selectedCrop} />
// //       )}
// //     </div>
// //   );
// // }

// // export default App;

// // import React, { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Header from "./components/Header";
// // import LocationSelector from "./components/LocationSelector";
// // import CropRecommendations from "./components/CropRecommendations";
// // import CropChecker from "./components/CropChecker";
// // import 'leaflet/dist/leaflet.css';

// // function App() {
// //   const [envData, setEnvData] = useState(null);
// //   const [recommendedCrops, setRecommendedCrops] = useState([]);
// //   const [selectedCrop, setSelectedCrop] = useState(null);

// //   // 👇 Fetch crops from backend when envData is set
// //   useEffect(() => {
// //     if (!envData) return;

// //     const fetchCrops = async () => {
// //       try {
// //         const res = await fetch("http://127.0.0.1:8000/suggest_crops/", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             temperature: envData.temp,
// //             rainfall: envData.rain,
// //             ph: envData.ph,
// //             altitude: envData.elevation,
// //             texture: `${envData.sand}% sand, ${envData.clay}% clay`,
// //           }),
// //         });

// //         const data = await res.json();
// //         console.log("Crop recommendations:", data);
// //         setRecommendedCrops(data.recommended_crops || []);
// //       } catch (err) {
// //         console.error("Error fetching crops:", err);
// //       }
// //     };

// //     fetchCrops();
// //   }, [envData]);

// //   return (
// //     <Router>
// //       <div className="min-h-screen bg-gray-50">
// //         <Header />

// //         <Routes>
// //           {/* Page 1: Location + Environmental Panel */}
// //           <Route
// //             path="/"
// //             element={<LocationSelector onEnvDataFetched={setEnvData} />}
// //           />

// //           {/* Page 2: Suitability Page */}
// //           <Route
// //             path="/suitability"
// //             element={
// //               <div className="p-6">
// //                 {envData && (
// //                   // ✅ Passing crops + callback to CropRecommendations
// //                   <CropRecommendations
// //                     crops={recommendedCrops}
// //                     onSelectCrop={setSelectedCrop}
// //                   />
// //                 )}


// //                 {selectedCrop && (
// //                   <CropChecker envData={envData} crop={selectedCrop} />
// //                 )}
// //               </div>
// //             }
// //           />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import LocationSelector from "./components/LocationSelector";
// import EnvironmentalDataPanel from "./components/EnvironmentalDataPanel";
// import CropRecommendations from "./components/CropRecommendations";
// import CropChecker from "./components/CropChecker";
// import 'leaflet/dist/leaflet.css';

// function App() {
//   const [envData, setEnvData] = useState(null);
//   const [recommendedCrops, setRecommendedCrops] = useState([]);
//   const [selectedCrop, setSelectedCrop] = useState(null);

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Header />

//         <Routes>
//           {/* Step 1: Location Selection + Environmental Panel */}
//           <Route
//             path="/"
//             element={
//               <>
//                 <LocationSelector 
//                 onEnvDataFetched={setEnvData} 
//                 setRecommendedCrops={setRecommendedCrops}/>
//                 {/* {envData && (
//                   <EnvironmentalDataPanel
//                     envData={envData}
//                     setRecommendedCrops={setRecommendedCrops}
//                   />
//                 )} */}
//               </>
//             }
//           />

//           {/* Step 2: Suitability Page */}
//           <Route
//             path="/suitability"
//             element={
//               <div className="p-6">
//                 {recommendedCrops.length > 0 ? (
//                   <CropRecommendations
//                     crops={recommendedCrops}
//                     onSelectCrop={setSelectedCrop}
//                   />
//                 ) : (
//                   <p className="text-gray-500">No recommendations yet.</p>
//                 )}

//                 {selectedCrop && (
//                   <CropChecker envData={envData} crop={selectedCrop} />
//                 )}
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import Header from "./components/Header";
// import LocationSelector from "./components/LocationSelector";
// import 'leaflet/dist/leaflet.css';

// function App() {
//   return (
//     <div>
//       <Header />
//       <LocationSelector />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LocationSelector from "./components/LocationSelector";
import CropResults from "./components/CropResults"; // create this as shown earlier
import 'leaflet/dist/leaflet.css';
import VisualizeResults from "./components/VisualizeResults";
import SuitabilityMap from "./components/SuitabilityMap";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Main page */}
          <Route path="/" element={<LocationSelector />} />

          {/* Results page */}
          <Route path="/crop-results" element={<CropResults />} />

          {/* Visulaization Page */}
          <Route path="/visualize" element={<VisualizeResults /> } />

          {/* Map Overlay Page */}
          <Route path="/map" element={<SuitabilityMap /> } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
