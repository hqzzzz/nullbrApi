# ---- 依赖阶段 ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- 运行阶段 ----
FROM node:20-alpine
WORKDIR /app
# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制源码（受 .dockerignore 控制）
COPY . .
ENV PORT=3000
EXPOSE ${PORT}
USER node
CMD ["node","app.js"]