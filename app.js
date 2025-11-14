const fastify = require('fastify')({ logger: false });
fastify.register(require('./routes/search'));
const PORT = process.env.PORT || 3000;
fastify.listen({ port: PORT, host: '0.0.0.0' }, err => {
  if (err) throw err;
  console.log(`>>> NullBR bridge on http://0.0.0.0:${PORT}/search?keyword=`);
});