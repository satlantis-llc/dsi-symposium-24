import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

interface ResultProps {
  results: { [key: string]: number };
}

const COLORS = [
  'hsl(0.0, 70%, 50%)',
  'hsl(18.0, 70%, 50%)',
  'hsl(36.0, 70%, 50%)',
  'hsl(54.0, 70%, 50%)',
  'hsl(72.0, 70%, 50%)',
  'hsl(90.0, 70%, 50%)',
  'hsl(108.0, 70%, 50%)',
  'hsl(126.0, 70%, 50%)',
  'hsl(144.0, 70%, 50%)',
  'hsl(162.0, 70%, 50%)',
  'hsl(180.0, 70%, 50%)',
  'hsl(198.0, 70%, 50%)',
  'hsl(216.0, 70%, 50%)',
  'hsl(234.0, 70%, 50%)',
  'hsl(252.0, 70%, 50%)',
  'hsl(270.0, 70%, 50%)',
  'hsl(288.0, 70%, 50%)',
  'hsl(306.0, 70%, 50%)',
  'hsl(324.0, 70%, 50%)',
  'hsl(342.0, 70%, 50%)',
];

const Result: React.FC<ResultProps> = ({ results }) => {
  const data = Object.keys(results).map(key => ({
    name: key,
    value: results[key],
  }));

  return (
    <div className="flex flex-col justify-center items-center">
      <h2>Prediction Results</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={entry => entry.name}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Result;
