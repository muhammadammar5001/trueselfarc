import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { VARIABLES, VARIABLE_LABELS } from "@/lib/quizData";

interface RadarChartProps {
  scores: Record<string, number>;
}

const RadarChartDisplay = ({ scores }: RadarChartProps) => {
  const maxScore = Math.max(...Object.values(scores), 1);

  const data = VARIABLES.map((v) => ({
    dimension: VARIABLE_LABELS[v] || v,
    value: Math.round((Math.max(scores[v] || 0, 0) / maxScore) * 100),
    fullMark: 100,
  }));

  return (
    <div className="doodle-card p-4 sm:p-6 bg-card mb-4">
      <h3 className="font-bold text-foreground text-lg text-center mb-2">
        📊 Your 5-D Personality Map
      </h3>
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{
                fill: "hsl(var(--foreground))",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Nunito, sans-serif",
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Scores"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--foreground))",
                strokeWidth: 2,
              }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartDisplay;
