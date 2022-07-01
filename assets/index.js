let img = document.getElementById('img');
let predict = document.getElementById('predict');
let canvas = document.getElementById('canvas');
let predictionDiv = document.querySelector('.predictionDiv');

let model = tf.loadLayersModel('/model/model.json').then( _ => console.log("Loaded Converted CNN Model"))

let renderTableHTML = (array) => {
  let html = ``;
  html += `<table>
  <thead>
    <tr>
      <th>Prediction</th>
      <th>Probability</th>
    </tr>
  </thead>
  <tbody>`;

  array.forEach((element) => {
    html += `
    <tr>
      <td>
        ${element.className}
      </td>
      <td>
        ${element.probability}
      </td>
    </tr>`;
  });

  html += `</tbody></table>`;

  return html;
};

let updateResults = (array) => {
  let html = renderTableHTML(array);
  predictionDiv.innerHTML = html;
  loading();
};

let loading = (value = false) => {
  value ? (predictionDiv.innerHTML = `<span>Prediction Loading...</span>`) : '';
  predictionDiv.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
};

predict.addEventListener('click', async () => {
  loading(true);
  let model = await mobilenet.load();
  let predictions = await model.classify(canvas);
  console.log(predictions);
  updateResults(predictions);
});

document.getElementById('inp').onchange = function (e) {
  var img = new Image();
  img.onload = draw;
  img.onerror = failed;
  img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
  canvas.width = this.width;
  canvas.height = this.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(this, 0, 0);
}
function failed() {
  console.error("The provided file couldn't be loaded as an Image media");
}
