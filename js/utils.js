export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red','orange','yellow','green','blue','purple','pink','monochrome']

  //random count color
  for (let i = 0;i< count;i++){
    const color = window.randomColor({
      liminosity : 'dark',
      hue : hueList[i % hueList.length],
    })
    colorList.push(color);
  }

  const fullColorList = [...colorList,...colorList];
  shuffle(fullColorList);

  return fullColorList;
}
function shuffle(arr){
  if (!Array.isArray(arr) || arr.length <= 2) return arr;
  for (let i = arr.length -1;i > 1;i--){
    const j = Math.floor(Math.random() * i);
    let temp = arr[i];
    arr[i] = arr[j]
    arr[i] = temp;
  }
}