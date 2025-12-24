'use client'
import React from 'react';
import Snowfall from 'react-snowfall';

export default function SnowfallBackground() {
  return (
    <Snowfall
      snowflakeCount={150}
      color="white"
      radius={[0.5, 3.0]} 
      speed={[0.5, 2.5]} 
      wind={[-0.5, 1.0]}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 1, // Đảm bảo zIndex thấp để nằm sau các nút bấm
        pointerEvents: 'none', // QUAN TRỌNG: Để chuột bấm xuyên qua tuyết được
      }}
    />
  )
}