const { api } = require('./common');
const { fetchMovieMagnets } = require('./movie');
const { fetchTvMagnets } = require('./tv');

async function searchRoutes(fastify, opts) {
  fastify.get('/search', async (req, reply) => {
    const keyword = req.query.keyword || req.query.query;
    if (!keyword) return reply.code(400).send({ error: 'missing keyword' });

    const { data } = await api.get(`/search?query=${encodeURIComponent(keyword)}`);
    const items = data.items || [];

    // 按 media_type 分流
    const jobs = items.filter(it => it['magnet-flg'] === 1);
    const movieJobs = jobs.filter(it => it.media_type === 'movie');
    const tvJobs    = jobs.filter(it => it.media_type === 'tv');

    // 并发拉取
    const movieRows = await Promise.all(movieJobs.map(fetchMovieMagnets));
    const tvRows    = await Promise.all(tvJobs.map(fetchTvMagnets));


    return movieRows.flat().concat(tvRows.flat());
  });
}

module.exports = searchRoutes;