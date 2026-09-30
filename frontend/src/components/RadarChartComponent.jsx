import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default function RadarChartComponent({ scores }) {
  const data = [
    { dimension: 'Technical Skill', candidate: scores?.technical_score || 78, benchmark: 85 },
    { dimension: 'Aptitude', candidate: scores?.aptitude_score || 80, benchmark: 80 },
    { dimension: 'Communication', candidate: scores?.comm_score || 84, benchmark: 85 },
    { dimension: 'Domain Knowledge', candidate: scores?.skills_score || 82, benchmark: 82 },
    { dimension: 'Interview Readiness', candidate: scores?.interview_score || 80, benchmark: 88 }
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
          <Radar 
            name="Candidate Current" 
            dataKey="candidate" 
            stroke="#7C3AED" 
            fill="#7C3AED" 
            fillOpacity={0.45} 
          />
          <Radar 
            name="Target Role Benchmark" 
            dataKey="benchmark" 
            stroke="#94A3B8" 
            fill="#94A3B8" 
            fillOpacity={0.15} 
            strokeDasharray="4 4"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
