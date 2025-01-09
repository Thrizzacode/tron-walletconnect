import './assets/main.css'
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer // 確保全域可用

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
