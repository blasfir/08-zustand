// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
   domains: ['picsum.photos'], 
	 remotePatterns: [
	   { protocol: 'https', hostname: 'picsum.photos' }
	  ]
  },
  async headers() {
    return [
      {
        source: '/notes/filter/:slug', // маршрут сторінки
        locale: false,
        headers: [
          {
            key: 'Cache-Control', // Заголовок
            value: 'public, max-age=300, must-revalidate', // кешуємо на 5 хв
          },
        ],
      },
    ]
  }
};

export default nextConfig;
