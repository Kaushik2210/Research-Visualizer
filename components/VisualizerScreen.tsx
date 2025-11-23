import React, { useState, useRef } from 'react';
import { PaperAnalysis } from '../types';
import { ArrowLeft, Brain, Cpu, FileText, Layers, TrendingUp } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button, Card } from './FuturisticUI';

interface VisualizerScreenProps {
  data: PaperAnalysis;
  onBack: () => void;
}

const VisualizerScreen: React.FC<VisualizerScreenProps> = ({ data, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number | null>(0);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".stagger-in", 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
    
    tl.fromTo(".chart-anim",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        "-=0.4"
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full min-h-screen p-4 md:p-8 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 stagger-in border-b border-cyan-900/50 pb-6">
        <div className="flex items-start gap-4">
          <Button onClick={onBack} variant="secondary" className="mt-1">
             <ArrowLeft className="w-4 h-4 mr-2" /> Return
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
              {data.title}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-cyan-400 font-mono text-sm">
              <span>AUTHORS: {data.authors.join(", ")}</span>
              <span className="text-slate-600">|</span>
              <span>DATE: {data.publication_date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Summary & Concepts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Executive Summary */}
          <Card title="EXECUTIVE_SUMMARY" className="stagger-in">
            <p className="text-slate-300 leading-relaxed font-light">
              {data.executive_summary}
            </p>
          </Card>

          {/* Key Concepts List */}
          <Card title="CORE_CONCEPTS" className="stagger-in">
            <div className="space-y-4">
              {data.concepts.map((concept) => (
                <div key={concept.id} className="group cursor-default">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-300 font-bold font-mono">{concept.name}</span>
                    <span className="text-xs text-slate-500 font-mono px-2 py-0.5 border border-slate-700 rounded bg-slate-900">
                      {concept.category}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-purple-500 transition-all duration-1000 group-hover:bg-cyan-400"
                      style={{ width: `${concept.importance}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 h-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
                    {concept.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

           {/* Future Implications */}
           <Card title="FUTURE_TRAJECTORY" className="stagger-in">
             <ul className="space-y-3">
               {data.future_implications.map((imp, i) => (
                 <li key={i} className="flex gap-3 text-sm text-slate-300">
                   <TrendingUp className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                   {imp}
                 </li>
               ))}
             </ul>
           </Card>
        </div>

        {/* Center/Right Column: Viz & Deep Dives (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Metrics Visualization Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-in">
            
            {/* Radar Chart for Metrics */}
            <Card title="IMPACT_METRICS" className="h-80 chart-anim">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.metrics}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Share Tech Mono' }} />
                  <Radar
                    name="Paper Score"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="#22d3ee"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#22d3ee', color: '#fff' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart for Concept Importance */}
            <Card title="CONCEPT_WEIGHT" className="h-80 chart-anim">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.concepts} layout="vertical" margin={{ left: 40, right: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                   <XAxis type="number" stroke="#475569" />
                   <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} tick={{fontSize: 10}} />
                   <Tooltip 
                     cursor={{fill: 'rgba(34,211,238,0.1)'}}
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#22d3ee' }}
                   />
                   <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
            </Card>
          </div>

          {/* Deep Dive Interactive Section */}
          <div className="stagger-in">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
              {data.sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                  className={`
                    px-4 py-2 font-mono text-sm whitespace-nowrap border transition-all duration-300
                    ${activeSection === idx 
                      ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }
                  `}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {activeSection !== null && (
               <Card className="min-h-[300px] border-t-2 border-t-cyan-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-cyan-400 font-display">
                        <Brain className="w-5 h-5" />
                        <h4 className="font-bold text-lg">SIMPLIFIED_EXPLANATION</h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {data.sections[activeSection].simplified_explanation}
                      </p>
                      
                      <div className="mt-6 p-4 bg-cyan-900/10 border border-cyan-900/50 rounded">
                        <h5 className="text-cyan-600 font-mono text-xs uppercase mb-2">Key Takeaway</h5>
                        <p className="text-cyan-100 italic">
                          "{data.sections[activeSection].key_takeaway}"
                        </p>
                      </div>
                   </div>

                   <div className="space-y-4 border-l border-slate-800 md:pl-8 mt-6 md:mt-0">
                      <div className="flex items-center gap-2 text-purple-400 font-display">
                        <Cpu className="w-5 h-5" />
                        <h4 className="font-bold text-lg">TECHNICAL_DETAILS</h4>
                      </div>
                      <p className="text-slate-400 leading-relaxed font-mono text-sm">
                        {data.sections[activeSection].technical_detail}
                      </p>
                   </div>
                 </div>
               </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisualizerScreen;
