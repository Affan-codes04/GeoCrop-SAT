import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CropBarChart from "./CropBarChart";
import SuitabilityMap from "./SuitabilityMap";

const VisualizeResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { recommendedCrops } = location.state || { recommendedCrops: [] };
    const { cropSelected } = location.state || { cropSelected: null };

    if (!recommendedCrops.length) {
        return (
            <div className="text-center mt-20">
                <p>No results to visualize.</p>
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
                📊 Visualization of Crop Suitability
            </h1>
            <CropBarChart data={recommendedCrops} />

            {/* <div className="mt-6 text-center">
                <button
                    onClick={() =>
                        navigate("/map", { state: { cropSelected } })
                    }
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                >
                    View Suitability Regions
                </button>
            </div> */}

            <SuitabilityMap crop={cropSelected} />
        </div>
    );
};

export default VisualizeResults;
