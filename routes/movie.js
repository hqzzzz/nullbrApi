const { api, parseSize } = require('./common');

/** 传入单条 movie 对象，返回 [{title,download,size...}, ...] */
async function fetchMovieMagnets(item) {
  const { tmdbid, title, poster, vote_average, release_date } = item;


   // 先拿元数据
  const { data: detail } = await api.get(`/movie/${tmdbid}`);
  if (!detail || detail['magnet-flg'] !== 1) {
    return [];          // 没有磁铁资源，直接空数组
  }

  const { data } = await api.get(`/movie/${tmdbid}/magnet`);
  return (data.magnet || []).map(m => ({
    title: m.name || title,
    category: '1',
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
  }));
}

module.exports = { fetchMovieMagnets };