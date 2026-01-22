import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Cat, Sparkles } from 'lucide-react';
import { Category, SubCategory, BreedMenuItem, Language } from '../types';

interface NavigationProps {
  categories: Category[];
  onSelectBreed: (breed: string) => void;
  selectedBreedId: string | null;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ categories, onSelectBreed, selectedBreedId, language }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedCategories(newSet);
  };

  const toggleSubCategory = (id: string) => {
    const newSet = new Set(expandedSubCategories);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSubCategories(newSet);
  };

  return (
    <nav className="h-full flex flex-col bg-white/50 backdrop-blur-sm">
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="bg-macaron-pink p-2 rounded-2xl shadow-sm text-white">
          <Cat size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-macaron-text tracking-tight">
            {language === 'en' ? 'Purrfect' : '喵星图鉴'}
          </h1>
          <p className="text-xs text-macaron-purple font-bold uppercase tracking-widest">
            {language === 'en' ? 'Breed Explorer' : '品种百科'}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-3xl shadow-sm border border-macaron-pink/20 overflow-hidden transition-all duration-300">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 text-sm font-bold text-macaron-text hover:bg-macaron-pink/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-macaron-pink"></span>
                {category.name}
              </span>
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="w-5 h-5 text-macaron-pink" />
              ) : (
                <ChevronRight className="w-5 h-5 text-macaron-pink/50" />
              )}
            </button>

            {expandedCategories.has(category.id) && (
              <div className="bg-macaron-bg/50 px-3 pb-3 pt-1 space-y-2">
                {category.children.map((sub: SubCategory) => (
                  <div key={sub.id} className="rounded-2xl bg-white/80 border border-macaron-blue/10 overflow-hidden">
                    <button
                      onClick={() => toggleSubCategory(sub.id)}
                      className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:text-macaron-purple transition-colors"
                    >
                      <span className="font-semibold pl-2">{sub.name}</span>
                      {expandedSubCategories.has(sub.id) ? (
                        <ChevronDown className="w-4 h-4 text-macaron-purple" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-macaron-purple/50" />
                      )}
                    </button>

                    {expandedSubCategories.has(sub.id) && (
                      <div className="px-2 pb-2 space-y-1">
                        {sub.children.map((breed: BreedMenuItem) => (
                          <button
                            key={breed.id}
                            onClick={() => onSelectBreed(breed.name)}
                            className={`w-full text-left px-4 py-2 text-sm transition-all rounded-xl flex items-center gap-2
                              ${selectedBreedId === breed.name 
                                ? 'bg-macaron-purple text-white font-bold shadow-md transform scale-105' 
                                : 'text-gray-500 hover:bg-macaron-purple/20 hover:text-macaron-purple'
                              }`}
                          >
                             {selectedBreedId === breed.name && <Sparkles className="w-3 h-3" />}
                             {breed.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-macaron-pink/20 text-center">
        <p className="text-xs text-macaron-purple/80 font-semibold">
           {language === 'en' ? 'Made with ❤️ by Gemini' : '由 Gemini ❤️ 驱动'}
        </p>
      </div>
    </nav>
  );
};