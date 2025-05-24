
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface BarConfig {
  dataKey: string;
  color: string;
  name?: string;
}

interface BarChartProps {
  title: string;
  description?: string;
  tooltip?: string;
  data: DataPoint[];
  bars: BarConfig[];
  className?: string;
  height?: number;
  isStacked?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  description,
  tooltip,
  data,
  bars,
  className,
  height = 300,
  isStacked = false,
}) => {
  return (
    <ChartCard title={title} description={description} tooltip={tooltip} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
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
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                fill={bar.color}
                name={bar.name || bar.dataKey}
                stackId={isStacked ? "stack" : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default BarChart;
