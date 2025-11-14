const axios = require('axios');

// ===== 1. 创建 axios 实例 =====
const api = axios.create({
  baseURL: 'https://api.nullbr.eu.org',
  headers: {
    'X-APP-ID': process.env.APP_ID,
    'X-API-KEY': process.env.API_KEY,
  },
  timeout: 10000,
});

// ===== 2. 工具函数 =====
function parseSize(str) {
  if (!str) return 0;
  const m = str.trim().match(/^([\d.]+)\s*(GB|MB)$/i);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  return m[2].toUpperCase() === 'GB'
    ? Math.round(num * 1_000_000_000)
    : Math.round(num * 1_000_000);
}

module.exports = { api, parseSize };