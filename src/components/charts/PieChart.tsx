
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  description?: string;
  tooltip?: string;
  data: DataPoint[];
  className?: string;
  height?: number;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  tooltip,
  data,
  className,
  height = 300,
  colors = ['#9b87f5', '#1EAEDB', '#D946EF', '#4CAF50', '#FF9800'],
  innerRadius = 60,
  outerRadius = 90,
}) => {
  return (
    <ChartCard title={title} description={description} tooltip={tooltip} className={className}>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1F2C', border: 'none', borderRadius: '8px' }}
              formatter={(value: number, name: string) => [`${value} (${((value / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%)`, name]}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default PieChart;
