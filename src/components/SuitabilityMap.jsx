import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SuitabilityMap = ({ crop }) => {
    const [geoData, setGeoData] = useState(null);
    const [scores, setScores] = useState({});

    const grades = ["0-20 (Low)", "21-40", "41-60", "61-80", "81-100 (High)"];
    const colors = ["#d73027", "#f46d43", "#fee08b", "#66bd63", "#1a9850"];

    // 1. Load GeoJSON states data
    useEffect(() => {
        fetch("http://127.0.0.1:8000/static/states.json") // adjust name
            .then((res) => res.json())
            .then((data) => setGeoData(data));
    }, []);

    // 2. Fetch suitability scores for each state (from your backend)
    useEffect(() => {
        if (!crop) return;
        fetch(`http://127.0.0.1:8000/suitability/${crop}`) // you'll need to make this API
            .then((res) => res.json())
            .then((data) => setScores(data.suitability_scores));
    }, [crop]);

    // 3. Style each state by suitability score
    const getColor = (score) => {
        if (score >= 80) return "#1a9850"; // dark green (high suitability)
        if (score >= 60) return "#66bd63";
        if (score >= 40) return "#fee08b";
        if (score >= 20) return "#f46d43";
        return "#d73027"; // low
    };

    const style = (feature) => {
        const stateName = feature.properties.ST_NM; // check key in your json
        const score = scores[stateName] || 0;
        return {
            fillColor: getColor(score),
            weight: 1,
            opacity: 1,
            color: "white",
            fillOpacity: 0.7,
        };
    };

    return (
        <div className="w-full mt-5">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
                Crop Suitability Map: {crop || "Select a Crop"}
            </h2>

            {/* Map + Legend container */}
            <div className="flex flex-col lg:flex-row justify-center items-start gap-6">

                {/* Map */}
                <div className="flex-1 h-[500px] rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <MapContainer
                        center={[22.0, 80.0]}
                        zoom={4.45} // zoom adjusted to focus India
                        minZoom={4.3}
                        maxZoom={10}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        {geoData && (
                            <GeoJSON
                                data={geoData}
                                style={style}
                                onEachFeature={(feature, layer) => {
                                    const stateName = feature.properties.ST_NM;
                                    const score = scores[stateName] ?? 0;
                                    const color = getColor(score);

                                    // Bind tooltip with styled HTML
                                    layer.bindTooltip(
                                        `<div style="
                                    background-color: ${color};
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    color: white;
                                    font-weight: bold;
                                    font-size: 12px;
                                ">
                                    ${stateName}: ${score}
                                </div>`,
                                        { sticky: true, direction: "top", opacity: 1 }
                                    );
                                }}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Legend */}
                <div className="w-48 bg-white rounded-lg shadow-md border border-gray-300 p-4 text-sm">
                    <h3 className="font-semibold mb-2 text-center">Suitability Score</h3>
                    {grades.map((grade, i) => (
                        <div key={i} className="flex items-center mb-2">
                            <div
                                className="w-6 h-6 mr-2 rounded-sm"
                                style={{ backgroundColor: colors[i] }}
                            ></div>
                            <span>{grade}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>


    );
};

export default SuitabilityMap;
