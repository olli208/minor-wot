// color-text
var textColors = ['rood','geel','paars','blauw','oranje','groen','roze','zwart'];


function randomColorGenerator() {
  var rand = Math.floor(Math.random() * textColors.length);
  document.getElementById('color-name').innerHTML = rand;
  console.log(rand);
}
