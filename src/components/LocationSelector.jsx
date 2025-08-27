// import React, { useState, useRef } from 'react';
// import LocationSearch from './LocationSearch';
// import MapView from './MapView';
// import EnvironmentalDataPanel from './EnvironmentalDataPanel';
// import { AnimatePresence, motion } from 'framer-motion';


// const LocationSelector = () => {
//     const [location, setLocation] = useState({
//         name: '',
//         lat: 20.5937,
//         lon: 78.9629,
//     });

//     const [userInteracted, setUserInteracted] = useState(false);
//     const [envdata, setenvData] = useState(null);
//     const panelRef = useRef(null);


//     async function getLocationName(lat, lon) {
//         const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
//         );
//         const data = await response.json();
//         const address = data.address;
//         const city =
//             address.city ||
//             address.town ||
//             address.village ||
//             address.hamlet ||
//             address.county ||
//             'Unknown place';
//         const state = address.state || 'Unknown state';
//         return `${city}, ${state}`;
//     }

//     const useMyLocation = async () => {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             const locationName = await getLocationName(latitude, longitude);
//             setLocation({
//                 name: locationName,
//                 lat: latitude,
//                 lon: longitude,
//             });
//             setUserInteracted(true); // mark as interaction!
//         });
//     };

//     const handleSelectedLocation = async (loc) => {
//         const locationName = await getLocationName(loc.lat, loc.lon);
//         setLocation({
//             name: locationName,
//             lat: loc.lat,
//             lon: loc.lon,
//         });
//         setUserInteracted(true);
//     };

//     // const fetchParameters = async (lat,lon) => {
//     //     try{
//     //         const response = await fetch("http://127.0.0.1:8000/get-data", {
//     //             method: "POST",
//     //             headers: {
//     //                 "Content-Type": "application/json"
//     //             },
//     //             body: JSON.stringify({latitude:lat, longitude:lon})
//     //         });

//     //         if (!response.ok) throw new Error("Failed to fetch");

//     //         const data = await response.json();
//     //         console.log("Recieved from Backend", data);
//     //         // My Logic here

//     //     }
//     //     catch(error){
//     //         console.error("Bruh backend broke",error);
//     //     }
//     // };

//     const fetchParameters = async (lat, lon) => {
//         try {
//             if (!lat || !lon) {
//                 console.error("Bruh, missing lat/lon values:", lat, lon);
//                 alert("Latitude or Longitude is missing!");
//                 return;
//             }

//             const payload = {
//                 lat: parseFloat(lat),
//                 lon: parseFloat(lon),
//             };

//             console.log("Sending to backend:", payload);

//             const response = await fetch("http://127.0.0.1:8001/get-data", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 const errorData = await response.text(); // Just in case backend sends string error
//                 throw new Error(`Backend error: ${response.status} - ${errorData}`);
//             }

//             const data = await response.json();
//             console.log("Received from backend:", data);

//             // Your logic goes here (display data, update UI, etc.)
//             //setenvData(data);

//             onEnvDataFetched({
//                 location: location.name,
//                 temp: data.temperature_K,
//                 rain: data.rainfall_mm,
//                 elevation: data.elevation_m,
//                 ph: data.soil.pH,
//                 sand: data.soil["sand_%"],
//                 clay: data.soil["clay_%"],
//             });

//             // Scroll after small delay to ensure DOM renders the panel
//             setTimeout(() => {
//                 panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//             }, 100);

//         } catch (error) {
//             console.error("Bruh backend broke:", error.message);
//             alert("Something went wrong! Check the console for details.");
//         }
//     };


//     return (
//         <div className="font-poppins p-6 bg-white shadow-xl rounded-2xl max-w-3xl mx-auto mt-8 space-y-6">
//             <LocationSearch onSelect={handleSelectedLocation} />

//             {/* MAP Section */}
//             <div className="h-64 bg-gray-100 border-2 border-dashed border-green-300 flex items-center justify-center rounded-xl text-gray-500 text-lg">
//                 <MapView
//                     position={[location.lat, location.lon]}
//                     userInteracted={userInteracted}
//                     onLocationChange={async ({ lat, lon }) => {
//                         const locName = await getLocationName(lat, lon);
//                         setLocation({
//                             name: locName,
//                             lat,
//                             lon,
//                         });
//                         setUserInteracted(true);
//                     }}
//                 />
//             </div>

//             {/* Location Details */}
//             <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
//                 <h2 className="text-lg font-semibold text-green-800">📍 Selected Location:</h2>
//                 <p className="text-gray-700 mt-1">
//                     {location.name}
//                     <br />
//                     <span className="text-sm">
//                         Latitude: {location.lat} | Longitude: {location.lon}
//                     </span>
//                 </p>
//             </div>

//             {/* Use My Location Button */}
//             <div className="flex justify-between text-center">
//                 <button
//                     onClick={useMyLocation}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
//                 >
//                     Use My Location
//                 </button>
//                 <button
//                     onClick={() => fetchParameters(location.lat, location.lon)}
//                     className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
//                 >
//                     Confirm Location
//                 </button>
//             </div>

//             <AnimatePresence>
//                 {envdata && (
//                     <motion.div
//                         ref={panelRef}
//                         initial={{ opacity: 0, y: 40 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 40 }}
//                         transition={{ duration: 0.6, ease: "easeOut" }}
//                         key="env-panel"
//                     >
//                         <EnvironmentalDataPanel
//                             location={location.name}
//                             temp={envdata.temperature_K}
//                             rain={envdata.rainfall_mm}
//                             elevation={envdata.elevation_m}
//                             ph={envdata.soil.pH}
//                             sand={envdata.soil["sand_%"]}
//                             clay={envdata.soil["sand_%"]}
//                         />
//                     </motion.div>
//                 )}
//             </AnimatePresence>


//         </div>
//     );
// };

// export default LocationSelector;


// import React, { useState, useRef } from 'react';
// import LocationSearch from './LocationSearch';
// import MapView from './MapView';
// import EnvironmentalDataPanel from './EnvironmentalDataPanel';
// import { AnimatePresence, motion } from 'framer-motion';

// const LocationSelector = ({ onEnvDataFetched, setRecommendedCrops }) => {
//     const [location, setLocation] = useState({
//         name: '',
//         lat: 20.5937,
//         lon: 78.9629,
//     });

//     const [userInteracted, setUserInteracted] = useState(false);
//     const [envdata, setenvData] = useState(null);
//     const panelRef = useRef(null);

//     async function getLocationName(lat, lon) {
//         const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
//         );
//         const data = await response.json();
//         const address = data.address;
//         const city =
//             address.city ||
//             address.town ||
//             address.village ||
//             address.hamlet ||
//             address.county ||
//             'Unknown place';
//         const state = address.state || 'Unknown state';
//         return `${city}, ${state}`;
//     }

//     const useMyLocation = async () => {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             const locationName = await getLocationName(latitude, longitude);
//             setLocation({
//                 name: locationName,
//                 lat: latitude,
//                 lon: longitude,
//             });
//             setUserInteracted(true);
//         });
//     };

//     const handleSelectedLocation = async (loc) => {
//         const locationName = await getLocationName(loc.lat, loc.lon);
//         setLocation({
//             name: locationName,
//             lat: loc.lat,
//             lon: loc.lon,
//         });
//         setUserInteracted(true);
//     };

//     const fetchParameters = async (lat, lon) => {
//         try {
//             if (!lat || !lon) {
//                 console.error("Bruh, missing lat/lon values:", lat, lon);
//                 alert("Latitude or Longitude is missing!");
//                 return;
//             }

//             const payload = {
//                 lat: parseFloat(lat),
//                 lon: parseFloat(lon),
//             };

//             console.log("Sending to backend:", payload);

//             const response = await fetch("http://127.0.0.1:8001/get-data", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 const errorData = await response.text();
//                 throw new Error(`Backend error: ${response.status} - ${errorData}`);
//             }

//             const data = await response.json();
//             console.log("Received from backend:", data);

//             // 1. store locally
//             setenvData(data);

//             console.log(envdata);

//             // 2. also notify parent if callback exists
//             if (onEnvDataFetched) {
//                 onEnvDataFetched({
//                     location: location.name,
//                     temp: data.temperature_K,
//                     rain: data.rainfall_mm,
//                     elevation: data.elevation_m,
//                     ph: data.soil.pH,
//                     sand: data.soil["sand_%"],
//                     clay: data.soil["clay_%"],
//                 });
//             }

//             // 3. scroll into view
//             setTimeout(() => {
//                 panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//             }, 100);

//         } catch (error) {
//             console.error("Bruh backend broke:", error.message);
//             alert("Something went wrong! Check the console for details.");
//         }
//     };

//     return (
//         <div className="font-poppins p-6 bg-white shadow-xl rounded-2xl max-w-3xl mx-auto mt-8 space-y-6">
//             <LocationSearch onSelect={handleSelectedLocation} />

//             {/* MAP Section */}
//             <div className="h-64 bg-gray-100 border-2 border-dashed border-green-300 flex items-center justify-center rounded-xl text-gray-500 text-lg">
//                 <MapView
//                     position={[location.lat, location.lon]}
//                     userInteracted={userInteracted}
//                     onLocationChange={async ({ lat, lon }) => {
//                         const locName = await getLocationName(lat, lon);
//                         setLocation({
//                             name: locName,
//                             lat,
//                             lon,
//                         });
//                         setUserInteracted(true);
//                     }}
//                 />
//             </div>

//             {/* Location Details */}
//             <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
//                 <h2 className="text-lg font-semibold text-green-800">📍 Selected Location:</h2>
//                 <p className="text-gray-700 mt-1">
//                     {location.name}
//                     <br />
//                     <span className="text-sm">
//                         Latitude: {location.lat} | Longitude: {location.lon}
//                     </span>
//                 </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between text-center">
//                 <button
//                     onClick={useMyLocation}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
//                 >
//                     Use My Location
//                 </button>
//                 <button
//                     onClick={() => fetchParameters(location.lat, location.lon)}
//                     className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
//                 >
//                     Confirm Location
//                 </button>
//             </div>

//             {/* Environmental Data Panel */}
//             <AnimatePresence>
//                 {envdata && (
//                     <motion.div
//                         ref={panelRef}
//                         initial={{ opacity: 0, y: 40 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 40 }}
//                         transition={{ duration: 0.6, ease: "easeOut" }}
//                         key="env-panel"
//                     >
//                         <EnvironmentalDataPanel
//                             envData={{
//                                 location: location.name,
//                                 temp: envdata.temperature_K,
//                                 rain: envdata.rainfall_mm,
//                                 elevation: envdata.elevation_m,
//                                 ph: envdata.soil.pH,
//                                 sand: envdata.soil["sand_%"],
//                                 clay: envdata.soil["clay_%"],
//                             }}
//                             setRecommendedCrops={setRecommendedCrops}
//                         />

//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default LocationSelector;


import React, { useState, useRef } from 'react';
import LocationSearch from './LocationSearch';
import MapView from './MapView';
import EnvironmentalDataPanel from './EnvironmentalDataPanel';
import { AnimatePresence, motion } from 'framer-motion';


const LocationSelector = () => {
    const [location, setLocation] = useState({
        name: '',
        lat: 20.5937,
        lon: 78.9629,
    });

    const [userInteracted, setUserInteracted] = useState(false);
    const [envdata, setenvData] = useState(null);
    const panelRef = useRef(null);


    async function getLocationName(lat, lon) {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        const address = data.address;
        const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            address.county ||
            'Unknown place';
        const state = address.state || 'Unknown state';
        return `${city}, ${state}`;
    }

    const useMyLocation = async () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const locationName = await getLocationName(latitude, longitude);
            setLocation({
                name: locationName,
                lat: latitude,
                lon: longitude,
            });
            setUserInteracted(true); // mark as interaction!
        });
    };

    const handleSelectedLocation = async (loc) => {
        const locationName = await getLocationName(loc.lat, loc.lon);
        setLocation({
            name: locationName,
            lat: loc.lat,
            lon: loc.lon,
        });
        setUserInteracted(true);
    };

    // const fetchParameters = async (lat,lon) => {
    //     try{
    //         const response = await fetch("http://127.0.0.1:8000/get-data", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({latitude:lat, longitude:lon})
    //         });

    //         if (!response.ok) throw new Error("Failed to fetch");

    //         const data = await response.json();
    //         console.log("Recieved from Backend", data);
    //         // My Logic here

    //     }
    //     catch(error){
    //         console.error("Bruh backend broke",error);
    //     }
    // };

    const fetchParameters = async (lat, lon) => {
        try {
            if (!lat || !lon) {
                console.error("Bruh, missing lat/lon values:", lat, lon);
                alert("Latitude or Longitude is missing!");
                return;
            }

            const payload = {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
            };

            console.log("Sending to backend:", payload);

            const response = await fetch("http://127.0.0.1:8001/get-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Just in case backend sends string error
                throw new Error(`Backend error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            console.log("Received from backend:", data);

            // Your logic goes here (display data, update UI, etc.)
            setenvData(data);

            // Scroll after small delay to ensure DOM renders the panel
            setTimeout(() => {
                panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);

        } catch (error) {
            console.error("Bruh backend broke:", error.message);
            alert("Something went wrong! Check the console for details.");
        }
    };


    return (
        <div className="font-poppins p-6 bg-white shadow-xl rounded-2xl max-w-3xl mx-auto mt-8 space-y-6">
            <LocationSearch onSelect={handleSelectedLocation} />

            {/* MAP Section */}
            <div className="h-64 bg-gray-100 border-2 border-dashed border-green-300 flex items-center justify-center rounded-xl text-gray-500 text-lg">
                <MapView
                    position={[location.lat, location.lon]}
                    userInteracted={userInteracted}
                    onLocationChange={async ({ lat, lon }) => {
                        const locName = await getLocationName(lat, lon);
                        setLocation({
                            name: locName,
                            lat,
                            lon,
                        });
                        setUserInteracted(true);
                    }}
                />
            </div>

            {/* Location Details */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
                <h2 className="text-lg font-semibold text-green-800">📍 Selected Location:</h2>
                <p className="text-gray-700 mt-1">
                    {location.name}
                    <br />
                    <span className="text-sm">
                        Latitude: {location.lat} | Longitude: {location.lon}
                    </span>
                </p>
            </div>

            {/* Use My Location Button */}
            <div className="flex justify-between text-center">
                <button
                    onClick={useMyLocation}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                    Use My Location
                </button>
                <button
                    onClick={() => fetchParameters(location.lat, location.lon)}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md"
                >
                    Confirm Location
                </button>
            </div>

            <AnimatePresence>
                {envdata && (
                    <motion.div
                    ref={panelRef}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        key="env-panel"
                    >
                        <EnvironmentalDataPanel
                            location={location.name}
                            temp={envdata.temperature_K}
                            rain={envdata.rainfall_mm ? parseFloat(envdata.rainfall_mm) * 365 : null}
                            elevation={envdata.elevation_m}
                            ph={envdata.soil.pH}
                            sand={envdata.soil["sand_%"]}
                            clay={envdata.soil["sand_%"]}
                        />
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
};

export default LocationSelector;