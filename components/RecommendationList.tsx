
import React from 'react';
import type { RestockRecommendation } from '../types';
import { ShoppingCartIcon, ThumbsUpIcon } from './IconComponents';

interface Recommendation {
  id: string;
  name: string;
  recommendation: RestockRecommendation;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  isLoading: boolean;
  hasRun: boolean;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations, isLoading, hasRun }) => {

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasRun) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Run the forecast to see recommendations.</p>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <div className="text-center text-green-600 py-8 flex flex-col items-center gap-3">
        <ThumbsUpIcon className="w-10 h-10" />
        <p className="font-semibold">All inventory levels are optimal!</p>
        <p className="text-sm text-gray-500">No restocks needed at this time.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {recommendations.map(({ id, name, recommendation }) => (
        <li key={id} className="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <ShoppingCartIcon className="text-primary-600"/>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Order <span className="font-bold text-primary-700">{recommendation.quantity} units</span>.
              </p>
              <p className="text-xs text-gray-500 italic mt-1">
                Reason: {recommendation.reason}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecommendationList;
