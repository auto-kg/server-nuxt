import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.06)'
      }
    }
  }
}
