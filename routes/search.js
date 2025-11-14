const { api } = require('./common');
const { fetchMovieMagnets } = require('./movie');
const { fetchTvMagnets } = require('./tv');

async function searchRoutes (fastify, opts) {
  fastify.get('/search', async (req, reply) => {
    /* ---------- tmdbid 直查 ---------- */
    if (req.query.id && req.query.type) {
      console.log('tmdbid search' + JSON.stringify(req.query));
      const type = req.query.type === 'tv' ? 'tv' : 'movie'; // 缺省视为 movie
      const id = req.query.tmdbid || req.query.id;
      const item = { tmdbid: Number(id), media_type: type };
      return type === 'movie'
        ? await fetchMovieMagnets(item)
        : await fetchTvMagnets(item);
    }

    /* ---------- 关键词搜索 ---------- */
    if (req.query.keyword) {
      console.log('keyword search' + JSON.stringify(req.query));
      const { data } = await api.get(`/search?query=${encodeURIComponent(req.query.keyword)}`);
      const items = data.items || [];
      const jobs = items.filter(it => it['magnet-flg'] === 1).slice(0, 3);
      const movieJobs = jobs.filter(it => it.media_type === 'movie').slice(0, 2);
      const tvJobs = jobs.filter(it => it.media_type === 'tv').slice(0, 2);

      const [movieRows, tvRows] = await Promise.all([
        Promise.all(movieJobs.map(fetchMovieMagnets)),
        Promise.all(tvJobs.map(fetchTvMagnets)),
      ]);
      return movieRows.flat().concat(tvRows.flat());
    }

    return reply.code(400).send({ error: 'missing keyword/tmdbid' });


  });
}

module.exports = searchRoutes;