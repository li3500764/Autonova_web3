/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // ✅ 添加以下路径确保扫描所有文件
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: { 
      colors: {
        primary: '#4f46e5',
        secondary: '#7c3aed',
      }
    }
  },
  plugins: [],
  important: true, // 强制 Tailwind 样式优先级
}