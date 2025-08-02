import React from 'react';

const EnvironmentalDataPanel = ({ location, temp, rain, elevation, ph, sand, clay }) => {
  const fallback = "NA";

  const formatNumber = (value, decimals = 2) => {
    return typeof value === "number" ? value.toFixed(decimals) : fallback;
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
          <div className="text-blue-600">
            {temp !== null ? `${temp} K` : fallback}
          </div>
        </div>
        <div>
          <span className="font-semibold">Rainfall:</span>
          <div className="text-blue-600">
            {rain !== null ? `${formatNumber(rain, 2)} mm` : fallback}
          </div>
        </div>
        <div>
          <span className="font-semibold">Elevation:</span>
          <div className="text-gray-700">
            {elevation !== null ? `${formatNumber(elevation, 2)} m` : fallback}
          </div>
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
    </div>
  );
};

export default EnvironmentalDataPanel;
