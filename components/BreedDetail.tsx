import React, { useState, useEffect } from 'react';
import { BreedDetails, Language } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Heart, Brain, Scissors, Volume2, Globe, Scale, Clock, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface BreedDetailProps {
  details: BreedDetails;
  isLoading: boolean;
  language: Language;
}

export const BreedDetail: React.FC<BreedDetailProps> = ({ details, isLoading, language }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [currentImgSrc, setCurrentImgSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  // Reset when breed changes
  useEffect(() => {
    setImageStatus('loading');
    setRetryCount(0);
    
    // 1. First try: Pollinations AI for custom style
    // Use a clean prompt designed for speed and style
    const encodedName = encodeURIComponent(details.name);
    const url = `https://image.pollinations.ai/prompt/cute%20${encodedName}%20cat%20soft%20pastel%20macaron%20colors%20minimalist%20bright%20lighting?width=1024&height=600&nologo=true&seed=${details.name.length}`;
    setCurrentImgSrc(url);
  }, [details.name]);

  const handleImageError = () => {
    console.warn(`Image failed to load: ${currentImgSrc}`);
    if (retryCount === 0) {
      // 2. Second try: LoremFlickr (Reliable & Fast)
      setRetryCount(1);
      setCurrentImgSrc(`https://loremflickr.com/1024/600/cat?lock=${details.name.length}`);
    } else if (retryCount === 1) {
      // 3. Third try: Cataas (Backup)
      setRetryCount(2);
      setCurrentImgSrc(`https://cataas.com/cat?width=1024&height=600&_t=${Date.now()}`);
    } else {
      // Give up
      setImageStatus('error');
    }
  };

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-macaron-bg">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-macaron-pink/30 border-t-macaron-pink rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CatIcon className="w-10 h-10 text-macaron-purple animate-bounce" />
          </div>
        </div>
        <p className="mt-8 text-macaron-purple font-bold text-xl animate-pulse tracking-wide">
          {language === 'en' ? 'Summoning Cute Cats...' : '正在召唤可爱猫咪...'}
        </p>
      </div>
    );
  }

  const labels = {
    friendly: language === 'en' ? 'Friendly' : '友好度',
    energy: language === 'en' ? 'Energy' : '活力值',
    grooming: language === 'en' ? 'Grooming' : '美容需求',
    smart: language === 'en' ? 'Smart' : '智力',
    vocal: language === 'en' ? 'Vocal' : '活跃度',
    origin: language === 'en' ? 'Origin' : '起源',
    lifespan: language === 'en' ? 'Lifespan' : '寿命',
    about: language === 'en' ? 'About' : '关于品种',
    temperament: language === 'en' ? 'Temperament' : '性格特征',
    funFact: language === 'en' ? 'Fun Fact' : '趣闻',
    weight: language === 'en' ? 'Avg Weight' : '平均体重',
    stats: language === 'en' ? 'Characteristics' : '品种特征'
  };

  const chartData = [
    { subject: labels.friendly, A: details.stats.friendliness, fullMark: 100 },
    { subject: labels.energy, A: details.stats.energy, fullMark: 100 },
    { subject: labels.grooming, A: details.stats.grooming, fullMark: 100 },
    { subject: labels.smart, A: details.stats.intelligence, fullMark: 100 },
    { subject: labels.vocal, A: details.stats.vocalisation, fullMark: 100 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-macaron-bg scroll-smooth">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-b-[3rem] shadow-lg mx-auto bg-white group">
        
        {/* Image Loader / Error State */}
        {imageStatus !== 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-macaron-blue/20">
             {imageStatus === 'loading' && (
                <div className="flex flex-col items-center text-macaron-purple/70">
                   <Sparkles className="w-12 h-12 animate-spin mb-2" />
                   <span className="font-bold">{language === 'en' ? 'Painting Portrait...' : '正在绘制画像...'}</span>
                </div>
             )}
             {imageStatus === 'error' && (
                <div className="flex flex-col items-center text-macaron-text/50">
                   <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                   <span className="font-bold">{language === 'en' ? 'No Photo Available' : '暂无照片'}</span>
                </div>
             )}
          </div>
        )}

        {/* The Image */}
        {imageStatus !== 'error' && (
          <img 
            src={currentImgSrc} 
            alt={details.name} 
            className={`w-full h-full object-cover transition-all duration-700 
              ${imageStatus === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-macaron-pink/90 via-transparent to-transparent flex items-end">
          <div className="p-8 pb-10 w-full max-w-5xl mx-auto">
            <h2 className="text-white drop-shadow-md text-5xl font-extrabold mb-3 tracking-tight flex items-center gap-3">
              {details.name}
              <Sparkles className="w-8 h-8 text-macaron-yellow animate-pulse" />
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-white font-bold text-sm tracking-wide">
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <Globe className="w-4 h-4" /> {details.origin}
              </span>
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <Clock className="w-4 h-4" /> {details.lifeSpan}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-macaron-pink/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-macaron-yellow/20 rounded-bl-full -mr-10 -mt-10"></div>
            <h3 className="text-2xl font-bold text-macaron-text mb-4 flex items-center gap-2 relative z-10">
              <span className="w-3 h-8 bg-macaron-pink rounded-full block"></span>
              {labels.about}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium relative z-10">{details.description}</p>
          </section>

          <section>
             <h3 className="text-xl font-bold text-macaron-text mb-4 px-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-macaron-pink" fill="#FFC8DD" />
                {labels.temperament}
             </h3>
             <div className="flex flex-wrap gap-3">
               {details.temperament.map((trait, idx) => (
                 <span key={idx} className="px-5 py-2 bg-white text-macaron-text rounded-full text-base font-bold shadow-sm border border-macaron-blue/30 hover:bg-macaron-blue hover:text-white transition-all hover:-translate-y-1 cursor-default">
                   {trait}
                 </span>
               ))}
             </div>
          </section>

          <section className="bg-macaron-yellow/30 p-8 rounded-3xl border border-macaron-yellow relative">
            <h3 className="text-sm font-bold text-macaron-text/60 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {labels.funFact}
            </h3>
            <p className="text-macaron-text font-bold text-xl leading-relaxed italic">"{details.funFact}"</p>
          </section>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-macaron-pink/20">
            <h3 className="text-center font-bold text-macaron-text mb-2 text-lg">{labels.stats}</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#FFC8DD" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#5D5D5D', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={details.name}
                    dataKey="A"
                    stroke="#A2D2FF"
                    strokeWidth={3}
                    fill="#BDE0FE"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-white border border-macaron-mint/30 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-macaron-mint/20 rounded-2xl text-macaron-text">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="font-bold text-macaron-text">{labels.weight}</span>
              </div>
              <span className="text-macaron-purple font-extrabold text-lg">{details.weight}</span>
            </div>
             
             {/* Stat Bars for quick glancing */}
             <div className="space-y-4 pt-2 bg-white p-6 rounded-3xl border border-macaron-pink/20">
                <StatBar icon={<Heart className="w-4 h-4"/>} label={labels.friendly} value={details.stats.friendliness} color="bg-macaron-pink" />
                <StatBar icon={<Activity className="w-4 h-4"/>} label={labels.energy} value={details.stats.energy} color="bg-macaron-yellow" />
                <StatBar icon={<Scissors className="w-4 h-4"/>} label={labels.grooming} value={details.stats.grooming} color="bg-macaron-green" />
                <StatBar icon={<Brain className="w-4 h-4"/>} label={labels.smart} value={details.stats.intelligence} color="bg-macaron-purple" />
                <StatBar icon={<Volume2 className="w-4 h-4"/>} label={labels.vocal} value={details.stats.vocalisation} color="bg-macaron-blue" />
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const StatBar = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
  <div className="flex items-center gap-3 text-sm group">
    <div className="text-macaron-text/50 group-hover:text-macaron-text transition-colors">{icon}</div>
    <div className="w-20 font-bold text-macaron-text/70">{label}</div>
    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const CatIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5c2.97 0 5.8 1.45 7.6 3.9a1.5 1.5 0 0 1 .4 1.1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-.4.16-.78.43-1.06A10.03 10.03 0 0 1 12 5Z" />
    <path d="M8 14v.5" />
    <path d="M16 14v.5" />
    <path d="M11.2 11.5a2 2 0 1 1 1.6 0" />
    <path d="M12 5V2.5" />
  </svg>
)
