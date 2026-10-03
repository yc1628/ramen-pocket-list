import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// GitHub Pages 會把網站放在 https://<帳號>.github.io/<repo 名稱>/ 底下，
// 因此 base 必須設成 repo 名稱，否則打包後的 JS / CSS 路徑會指向網域根目錄而載入失敗。
// 本機開發 (npm run dev) 不受影響。
export default defineConfig({
  base: '/ramen-pocket-list/',
  plugins: [react()],
})
