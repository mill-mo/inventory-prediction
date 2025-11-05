import React, { useMemo } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import type { EnrichedProduct } from '../types';

interface DemandChartProps {
  products: EnrichedProduct[];
  viewMode: 'combined' | 'historical';
}

const DemandChart: React.FC<DemandChartProps> = ({ products, viewMode }) => {
  const chartData = useMemo(() => {
    if (!products.length || !products[0].salesHistory) return [];

    const data: any[] = [];
    const historyLength = products[0].salesHistory.length;

    // Populate historical data
    for (let i = 0; i < historyLength; i++) {
      const weekData: { name: string; [key: string]: any } = { name: `Week ${i - historyLength}` };
      products.forEach(p => {
        weekData[`${p.id}_hist`] = p.salesHistory[i];
      });
      data.push(weekData);
    }
    
    // Conditionally populate forecasted data
    if (viewMode === 'combined') {
      for (let i = 0; i < 4; i++) {
          const weekData: { name: string; [key: string]: any } = { name: `Week +${i + 1}` };
          products.forEach(p => {
            if (p.prediction) {
              weekData[`${p.id}_fore`] = p.prediction.forecastedDemand[i];
            }
          });
          data.push(weekData);
      }
    }

    return data;
  }, [products, viewMode]);
  
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28'];

  if (!products.length) return <p>No product data available.</p>;

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }} />
          <Legend />
          {products.map((p, index) => (
            <React.Fragment key={p.id}>
              <Bar dataKey={`${p.id}_hist`} name={`${p.name} (Sales)`} fill={colors[index % colors.length]} opacity={0.6} barSize={20} />
              {viewMode === 'combined' && (
                <Line type="monotone" dataKey={`${p.id}_fore`} name={`${p.name} (Forecast)`} stroke={colors[index % colors.length]} strokeWidth={2} dot={{r: 4}} />
              )}
            </React.Fragment>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemandChart;