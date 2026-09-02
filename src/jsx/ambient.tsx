import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export const AmbientBackground = ({ activeTabId }: { activeTabId: string }) => {
  const colors = useMemo(() => {
    switch (activeTabId) {
      case 'person': return { s1: '#4f46e5', s2: '#ec4899', s3: '#6366f1' };
      case 'panchang': return { s1: '#d97706', s2: '#e11d48', s3: '#ea580c' };
      case 'tarot': return { s1: '#9333ea', s2: '#c026d3', s3: '#8b5cf6' };
      case 'union': return { s1: '#be185d', s2: '#e11d48', s3: '#9f1239' };
      case 'palmistry': return { s1: '#6d28d9', s2: '#7e22ce', s3: '#a855f7' };
      case 'week': return { s1: '#4338ca', s2: '#3b82f6', s3: '#6366f1' };
      case 'reports': return { s1: '#1e3a8a', s2: '#0891b2', s3: '#0369a1' };
      case 'ask': return { s1: '#047857', s2: '#10b981', s3: '#059669' };
      default: return { s1: '#4f46e5', s2: '#ec4899', s3: '#6366f1' };
    }
  }, [activeTabId]);

  return (
    <div className="fixed inset-0 z-[-15] overflow-hidden pointer-events-none mix-blend-screen opacity-50">
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[10%] left-[10%] w-[400px] h-[400px]"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [-30, 30, -30], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.2 }}
      >
        <motion.polygon 
          points="50,5 95,95 5,95" 
          fill="none" 
          strokeWidth="1.5" 
          animate={{ stroke: colors.s1 }}
          transition={{ duration: 2 }}
        />
        <motion.circle 
          cx="50" cy="50" r="20" 
          fill="none" 
          strokeWidth="1.5"
          animate={{ stroke: colors.s2 }}
          transition={{ duration: 2 }}
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px]"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [30, -30, 30], rotate: [0, -20, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.15 }}
      >
        <motion.circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          strokeWidth="1" 
          strokeDasharray="4 4"
          animate={{ stroke: colors.s3 }}
          transition={{ duration: 2 }}
        />
        <motion.path 
          d="M 50 10 L 90 50 L 50 90 L 10 50 Z" 
          fill="none" 
          strokeWidth="1.5"
          animate={{ stroke: colors.s2 }}
          transition={{ duration: 2 }}
        />
      </motion.svg>
    </div>
  );
};
