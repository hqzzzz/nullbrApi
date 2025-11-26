const { api, parseSize } = require('./common');

/** 传入单条 movie 对象，返回 [{title,download,size...}, ...] */
async function fetchMovieMagnets(item) {
  const { tmdbid, title, poster, vote_average, release_date } = item;


   // 先拿元数据
  const { data: detail } = await api.get(`/movie/${tmdbid}`);
  if (!detail || detail['magnet-flg'] !== 1) {
    return [];          // 没有磁力资源，直接空数组
  }

  const { data } = await api.get(`/movie/${tmdbid}/magnet`);
  return (data.magnet || []).map(m => ({
    title: m.name || title,
    category: '2000',  // 2000 = Movies
    details: `https://www.themoviedb.org/movie/${tmdbid}`,
    download: m.magnet,
    size: parseSize(m.size),
    seeders: 0,
    leechers: 0,
    grabs: 0,
    downloadvolumefactor: 1,
    uploadvolumefactor: 1,
    date: release_date || new Date().toISOString(),
    poster,
    vote: vote_average,
    info_hash: (m.magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/i) || [])[1] || '',
  }));
}

module.exports = { fetchMovieMagnets };