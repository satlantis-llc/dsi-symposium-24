import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

interface ResultProps {
  results: { [key: string]: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
