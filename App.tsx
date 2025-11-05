import React, { useState, useCallback, useMemo } from 'react';
import { getInventoryPredictions } from './services/geminiService';
import { INITIAL_PRODUCTS, INITIAL_SALES_HISTORY } from './constants';
import type { Product, SalesHistory, PredictionResult, EnrichedProduct } from './types';
import Header from './components/Header';
import InventoryTable from './components/InventoryTable';
import RecommendationList from './components/RecommendationList';
import DemandChart from './components/DemandChart';
import { AnalyticsIcon, ErrorIcon, LoadingIcon, MagicWandIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [salesHistory] = useState<SalesHistory[]>(INITIAL_SALES_HISTORY);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'combined' | 'historical'>('combined');

  const handlePredict = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await getInventoryPredictions(products, salesHistory);
      setPredictions(results);
    } catch (err) {
      setError('Failed to fetch predictions from Gemini API. Please ensure your API key is configured correctly.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [products, salesHistory]);

  const enrichedProducts: EnrichedProduct[] = useMemo(() => {
    return products.map(product => {
      const prediction = predictions.find(p => p.productId === product.id);
      const sales = salesHistory.find(s => s.productId === product.id)?.weeklySales || [];
      return {
        ...product,
        prediction: prediction || null,
        salesHistory: sales,
      };
    });
  }, [products, predictions, salesHistory]);

  const recommendations = useMemo(() => {
    return enrichedProducts
      .filter(p => p.prediction?.restockRecommendation.shouldRestock)
      .map(p => ({
        id: p.id,
        name: p.name,
        recommendation: p.prediction!.restockRecommendation,
      }));
  }, [enrichedProducts]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Current stock levels and demand forecasting.
            </p>
          </div>
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? (
              <>
                <LoadingIcon />
                Analyzing Data...
              </>
            ) : (
              <>
                <MagicWandIcon />
                Generate Forecast
              </>
            )}
          </button>
        </div>
        
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start gap-3">
                <ErrorIcon />
                <div>
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Inventory</h2>
            <InventoryTable products={enrichedProducts} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AnalyticsIcon />
              Restock Recommendations
            </h2>
            <RecommendationList recommendations={recommendations} isLoading={isLoading} hasRun={predictions.length > 0} />
          </div>
        </div>
        
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
             <h2 className="text-lg font-semibold text-gray-800">
                {chartView === 'combined' ? 'Sales & Demand Forecast' : 'Historical Sales Performance'}
             </h2>
             <div className="flex-shrink-0 flex items-center rounded-lg bg-gray-100 p-0.5">
                 <button
                    onClick={() => setChartView('combined')}
                    aria-pressed={chartView === 'combined'}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        chartView === 'combined'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                    Forecast
                </button>
                 <button
                    onClick={() => setChartView('historical')}
                    aria-pressed={chartView === 'historical'}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        chartView === 'historical'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                    Historical
                </button>
             </div>
           </div>
           <DemandChart products={enrichedProducts} viewMode={chartView} />
        </div>

      </main>
    </div>
  );
};

export default App;