function pagination(_limit=1, num){
    let limit = _limit;
  let offset = (isNaN(num) || num <= 1) ? 0 : (parseInt(num) -1) * limit;
    return {limit, offset}
}

function handleNext(offset, limit, count){
    return (offset + limit >= count) ? false : true
}

module.exports = {pagination, handleNext}