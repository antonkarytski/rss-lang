export const shuffle = (array) => {
  const _array = array.slice(0)
  for (let i = 0; i < array.length - 1; i++) {
    let randomIndex = Math.floor(Math.random() * (i + 1))

    // Swapping values
    let temp = _array[i]
    _array[i] = _array[randomIndex]
    _array[randomIndex] = temp
  }

  return _array
}


export const getRandomNumber = (min, max) => (
  Math.floor(
    Math.random() * (
      Math.floor(max) - Math.ceil(min) + 1
    ),
  ) + min
)

function toRel(objRect){

  return {
    right: objRect.right,
    left: objRect.right - objRect.width,
    top: objRect.top,
    bottom: objRect.top - objRect.height,
  }
}


export function checkCollision(staticObj, mobileObj){
  const mobileHorizontalCenter = mobileObj.right - mobileObj.width/2
  const relStatic = toRel(staticObj)

  return mobileHorizontalCenter < relStatic.right
  && mobileHorizontalCenter > relStatic.left
  && mobileObj.top > relStatic.bottom
  && mobileObj.top - mobileObj.height < relStatic.top

}

export const populateStatistics = (key, totalStatistics, gameStatistics) => {
  try {
    const statistics = JSON.parse(totalStatistics.optional[key]);
    statistics.push(gameStatistics);
    totalStatistics.optional[key] = JSON.stringify(statistics);
    // for null data
    //totalStatistics.optional[key] = JSON.stringify([]);
    delete totalStatistics.id;
  } catch (e) {}
  return totalStatistics;
};