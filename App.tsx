import React, { useEffect, useState, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { BreedDetail } from './components/BreedDetail';
import { fetchBreedTree, fetchBreedDetails } from './services/geminiService';
import { Category, BreedDetails, Language } from './types';
import { INITIAL_BREED_DETAILS_EN, INITIAL_BREED_DETAILS_ZH } from './constants';
import { Menu, X, Languages } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBreedDetails, setSelectedBreedDetails] = useState<BreedDetails>(INITIAL_BREED_DETAILS_ZH);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedBreedName, setSelectedBreedName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reload tree when language changes
  useEffect(() => {
    const loadTree = async () => {
      setIsLoadingTree(true);
      const tree = await fetchBreedTree(language);
      setCategories(tree);
      setIsLoadingTree(false);
      
      // Update initial placeholder if no breed selected
      if (!selectedBreedName) {
        setSelectedBreedDetails(language === 'en' ? INITIAL_BREED_DETAILS_EN : INITIAL_BREED_DETAILS_ZH);
      }
    };
    loadTree();
  }, [language]);

  // Handler for selecting a breed
  const handleSelectBreed = useCallback(async (breedName: string) => {
    setSelectedBreedName(breedName);
    setIsMobileMenuOpen(false); 
    setIsLoadingDetails(true);
    
    // Fetch details in current language
    const details = await fetchBreedDetails(breedName, language);
    setSelectedBreedDetails(details);
    setIsLoadingDetails(false);
  }, [language]);

  // Re-fetch details if language changes while a breed is selected
  useEffect(() => {
    if (selectedBreedName) {
      handleSelectBreed(selectedBreedName);
    }
  }, [language, selectedBreedName]); // Careful with dependency loop, handleSelectBreed is memoized with lang

  return (
    <div className="flex h-screen w-full bg-macaron-bg overflow-hidden font-sans">
      
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-macaron-purple text-white rounded-2xl shadow-lg border border-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md text-macaron-text px-4 py-2 rounded-full shadow-md border-2 border-macaron-pink hover:scale-105 transition-transform font-bold text-sm"
        >
          <Languages size={18} className="text-macaron-pink" />
          {language === 'en' ? '中文' : 'English'}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white/90 backdrop-blur-md border-r border-macaron-pink/20 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {isLoadingTree ? (
           <div className="p-8 space-y-6 animate-pulse">
             <div className="h-8 bg-macaron-pink/30 rounded-full w-1/2 mb-8"></div>
             {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-macaron-blue/10 rounded-3xl w-full border border-macaron-blue/20"></div>
             ))}
           </div>
        ) : (
          <Navigation 
            categories={categories} 
            onSelectBreed={handleSelectBreed}
            selectedBreedId={selectedBreedName}
            language={language}
          />
        )}
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-macaron-text/10 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full w-full">
        <BreedDetail 
          details={selectedBreedDetails} 
          isLoading={isLoadingDetails}
          language={language}
        />
      </main>
    </div>
  );
};

export default App;