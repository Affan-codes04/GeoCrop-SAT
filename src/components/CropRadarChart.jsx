import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CropRadarChart = ({ cropData }) => {
  if (!cropData || !cropData.params) return null;

  // Transform backend response to Radar format
  const radarData = Object.keys(cropData.params).map((key) => {
    const [min, max] = cropData.params[key];
    return {
      parameter: key.toUpperCase(),
      min: min,
      max: max,
      avg: (min + max) / 2, // average for visualization
    };
  });

  return (
    <div className="w-full h-96 bg-gray-50 rounded-xl p-4 shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="70%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="parameter" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar
            name="Optimal Range Avg"
            dataKey="avg"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropRadarChart;
