import { GoogleGenAI, Type } from "@google/genai";
import { BreedDetails, Category, Language } from '../types';
import { FALLBACK_TREE_EN, FALLBACK_TREE_ZH, INITIAL_BREED_DETAILS_EN, INITIAL_BREED_DETAILS_ZH } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY found in process.env. Using fallback data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Generate the 3-level hierarchy tree
export const fetchBreedTree = async (lang: Language): Promise<Category[]> => {
  const ai = getClient();
  const fallback = lang === 'en' ? FALLBACK_TREE_EN : FALLBACK_TREE_ZH;
  
  if (!ai) return fallback;

  const prompt = lang === 'en' 
    ? "Generate a hierarchical JSON list of cat breeds with 3 levels: Region, Coat Type, and Breed. Provide at least 3 regions."
    : "生成一个三级层级的猫咪品种JSON列表：地区（如西方、东方）、被毛类型（如短毛、长毛）、以及具体品种。请提供至少3个地区。使用中文回答。";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['category'] },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['subcategory'] },
                    children: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          type: { type: Type.STRING, enum: ['breed'] }
                        },
                        required: ['id', 'name', 'type']
                      }
                    }
                  },
                  required: ['id', 'name', 'type', 'children']
                }
              }
            },
            required: ['id', 'name', 'type', 'children']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Category[];
    }
    return fallback;
  } catch (error) {
    console.error("Gemini API Error (Tree):", error);
    return fallback;
  }
};

// Generate detailed info for a specific breed
export const fetchBreedDetails = async (breedName: string, lang: Language): Promise<BreedDetails> => {
  const ai = getClient();
  const initial = lang === 'en' ? INITIAL_BREED_DETAILS_EN : INITIAL_BREED_DETAILS_ZH;

  if (!ai) return { ...initial, name: breedName, description: lang === 'en' ? "API unavailable." : "API不可用" };

  try {
    const prompt = lang === 'en'
      ? `Provide detailed information for the cat breed: "${breedName}". Include numerical stats (0-100) for charts.`
      : `请提供关于猫咪品种 "${breedName}" 的详细信息。包含用于图表的数值统计（0-100）。请使用中文回答。`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            origin: { type: Type.STRING },
            lifeSpan: { type: Type.STRING },
            weight: { type: Type.STRING },
            temperament: { type: Type.ARRAY, items: { type: Type.STRING } },
            funFact: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                friendliness: { type: Type.NUMBER },
                energy: { type: Type.NUMBER },
                grooming: { type: Type.NUMBER },
                intelligence: { type: Type.NUMBER },
                vocalisation: { type: Type.NUMBER }
              },
              required: ['friendliness', 'energy', 'grooming', 'intelligence', 'vocalisation']
            }
          },
          required: ['name', 'description', 'origin', 'lifeSpan', 'weight', 'temperament', 'stats', 'funFact']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BreedDetails;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini API Error (Details):", error);
    return {
      ...initial,
      name: breedName,
      description: lang === 'en' 
        ? "Could not fetch details at this time. Please try again later." 
        : "暂时无法获取详细信息，请稍后再试。",
      origin: "Unknown"
    };
  }
};