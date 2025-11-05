
import React from 'react';
import type { EnrichedProduct } from '../types';
import { TrendingUpIcon, TrendingDownIcon, CheckCircleIcon, ExclamationIcon } from './IconComponents';

interface InventoryTableProps {
  products: EnrichedProduct[];
}

const getStatus = (product: EnrichedProduct) => {
  const totalForecast = product.prediction?.forecastedDemand.reduce((sum, val) => sum + val, 0) || 0;

  if (product.currentStock < product.reorderLevel) {
    return { 
      text: 'Low Stock', 
      icon: <ExclamationIcon className="text-red-500" />,
      className: 'text-red-600 bg-red-100',
    };
  }
  if (totalForecast > 0 && product.currentStock < totalForecast) {
      return { 
        text: 'Risk of Stockout', 
        icon: <ExclamationIcon className="text-yellow-500" />,
        className: 'text-yellow-600 bg-yellow-100',
      };
  }
  return { 
    text: 'In Stock', 
    icon: <CheckCircleIcon className="text-green-500" />,
    className: 'text-green-600 bg-green-100',
  };
};

const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">4-Week Forecast</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const status = getStatus(product);
            const totalForecast = product.prediction?.forecastedDemand.reduce((sum, val) => sum + val, 0);

            return (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 font-semibold">{product.currentStock}</div>
                    <div className="text-xs text-gray-500">min. {product.reorderLevel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                      {status.text}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.prediction ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">{totalForecast} units</span>
                      {(totalForecast ?? 0) > product.salesHistory.slice(-4).reduce((a,b)=>a+b,0) / 4 ? 
                       <TrendingUpIcon className="text-green-500" /> : 
                       <TrendingDownIcon className="text-red-500" />}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not run</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
