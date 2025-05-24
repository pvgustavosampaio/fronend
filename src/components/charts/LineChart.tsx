
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  color: string;
  name?: string;
}

interface LineChartProps {
  title: string;
  description?: string;
  tooltip?: string;
  data: DataPoint[];
  lines: LineConfig[];
  className?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  tooltip,
  data,
  lines,
  className,
  height = 300,
}) => {
  return (
    <ChartCard title={title} description={description} tooltip={tooltip} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
            <YAxis tick={{ fill: '#ccc' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1F2C', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                name={line.name || line.dataKey}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default LineChart;
