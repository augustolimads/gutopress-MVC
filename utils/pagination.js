function pagination(_limit = 1, num) {
  let limit = _limit;
  let offset = isNaN(num) || num == 1 ? 0 : (parseInt(num) - 1) * limit;
  return { limit, offset };
}

function handleBackNext(offset, limit, count, num) {
  const next = offset + limit >= count ? false : parseInt(num) + 1;
  const back = num <= 0 ? 1 : num - 1;
  return { back, next };
}

module.exports = { pagination, handleBackNext };
