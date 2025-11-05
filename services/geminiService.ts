import { GoogleGenAI, Type } from "@google/genai";
import type { Product, SalesHistory, PredictionResult } from '../types';

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      productId: {
        type: Type.STRING,
        description: 'The unique identifier for the product.'
      },
      forecastedDemand: {
        type: Type.ARRAY,
        description: 'An array of 4 integers representing the predicted sales demand for the next 4 weeks.',
        items: {
          type: Type.INTEGER
        },
      },
      restockRecommendation: {
        type: Type.OBJECT,
        properties: {
          shouldRestock: {
            type: Type.BOOLEAN,
            description: 'True if a restock is recommended, otherwise false.'
          },
          quantity: {
            type: Type.INTEGER,
            description: 'The suggested quantity to reorder to cover forecasted demand and reach a safe stock level. 0 if no restock is needed.'
          },
          reason: {
            type: Type.STRING,
            description: 'A brief, clear explanation for the restock recommendation decision.'
          },
        },
        required: ['shouldRestock', 'quantity', 'reason']
      },
    },
    required: ['productId', 'forecastedDemand', 'restockRecommendation']
  },
};

export const getInventoryPredictions = async (products: Product[], salesHistory: SalesHistory[]): Promise<PredictionResult[]> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it in your environment.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    You are an expert inventory management analyst. Your task is to analyze product data and historical sales to forecast future demand and provide actionable restocking recommendations.

    Analyze the following data:

    **Current Inventory:**
    ${JSON.stringify(products, null, 2)}

    **Historical Weekly Sales (last 8 weeks):**
    ${JSON.stringify(salesHistory, null, 2)}

    **Your Tasks:**
    1.  For each product, analyze its historical sales data to identify trends, seasonality, and velocity.
    2.  Forecast the sales demand for each product for the **next 4 weeks**.
    3.  Based on the current stock, reorder level, and your 4-week demand forecast, decide if a product needs to be restocked.
    4.  A restock is recommended if the current stock is below the reorder level OR if the predicted demand for the next 4 weeks exceeds the current stock.
    5.  If a restock is needed, calculate a recommended order quantity. The quantity should be enough to cover the 4-week forecasted demand plus a safety buffer (aim to bring stock level to forecast demand + 25% of reorder level). If no restock is needed, the quantity should be 0.
    6.  Provide a concise reason for each recommendation (e.g., "Stock below reorder level," "High forecasted demand," "Sufficient stock for predicted demand.").

    Return your analysis as a JSON array that strictly adheres to the provided schema. Do not include any introductory text, just the JSON output.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as PredictionResult[];
    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to parse inventory predictions from the API.");
  }
};