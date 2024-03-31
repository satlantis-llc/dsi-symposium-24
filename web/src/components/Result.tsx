import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

interface ResultProps {
  results: { [key: string]: number };
}

const COLORS = [
  '#f67088',
  '#db8831',
  '#ad9c31',
  '#77aa31',
  '#33b07a',
  '#35aca4',
  '#38a8c5',
  '#6e9af4',
  '#cc79f4',
  '#f565cc',
];

const shuffleColors = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // ES6 array destructuring syntax to swap elements
  }
};

const Result: React.FC<ResultProps> = ({ results }) => {
  const data = Object.keys(results).map(key => ({
    name: key,
    value: results[key],
  }));

  const shuffledColors = [...COLORS];
  shuffleColors(shuffledColors);

  return (
    <div className="flex flex-col justify-center items-center w-auto mx-auto">
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
              fill={shuffledColors[index % shuffledColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <div className="mt-8 w-full">
        <h3 className="text-lg font-semibold mb-2">Values</h3>
        <ul className="list-disc list-inside">
          {Object.entries(results).map(([key, value]) => (
            <li key={key} className="text-2xl">
              <span className="font-bold">{key}: </span>
              <span>{value.toFixed(2)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Result;
