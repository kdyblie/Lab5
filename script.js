// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const inputImg = document.getElementById("image-input");
var synth = window.speechSynthesis;
const generate = document.getElementById("generate-meme");
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.querySelector("[type = 'reset']").disabled = true; 
  document.querySelector("[type = 'submit']").disabled = false; 
  document.querySelector("[type = 'button']").disabled = true;

  let dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dim["startX"], dim["startY"], dim["width"], dim["height"]);
});

inputImg.addEventListener('change', (event) =>{
  img.src = URL.createObjectURL(event.target.files[0]);
  img.alt = event.target.files[0].name;
});

generate.addEventListener('submit', (event) => {
  event.preventDefault();
  let top = document.getElementById("text-top").value;
  let bot = document.getElementById("text-bottom").value;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.font = '40px arial';
  ctx.textAlign = 'center';
  ctx.fillText(top, canvas.width/2, 60);
  ctx.strokeText(top, canvas.width/2, 60);
  ctx.fillText(bot, canvas.width/2, 350);
  ctx.strokeText(bot, canvas.width/2, 350);

  document.querySelector("[type = 'reset']").disabled = false; 
  document.querySelector("[type = 'submit']").disabled = true; 
  document.querySelector("[type = 'button']").disabled = false;
});

document.querySelector("[type = 'reset']").addEventListener("click", () =>{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("text-top").value = "";
  document.getElementById("text-bottom").value = "";
  document.querySelector("[type = 'reset']").disabled = true; 
  document.querySelector("[type = 'submit']").disabled = false; 
  document.querySelector("[type = 'button']").disabled = true;
});

document.querySelector("[type = 'button']").addEventListener("click", (event) => {
  event.preventDefault();
  
  document.querySelector('select').disabled = false;
  let voices = speechSynthesis.getVoices();

  for(let i = 0; i < voices.length; i++){
    let voice = document.createElement('option');
    voice.textContent = voices[i].name + '(' + voices[i].lang + ')';

    voice.setAttribute('data-lang', voices[i].lang);
    voice.setAttribute('data-name', voices[i].name);
    document.querySelector('select').appendChild(voice);
  }

  let top = document.getElementById("text-top").value;
  let bot = document.getElementById("text-bottom").value;

  let speech = new SpeechSynthesisUtterance(top + bot);
  
  for(let i = 0; i < voices.length; i++){
    if(voices[i].name === document.querySelector('select').selectedOptions[0].getAttribute('data-name')){
      speech.voice = voices[i];
    }
  }
  speech.volume = document.querySelector("[type='range']").value / 100;
  synth.speak(speech);
});

document.querySelector("[type='range']").addEventListener("input", (event) => {
  let icon = document.getElementById("volume-group").getElementsByTagName("img")[0];
  if (document.querySelector("[type='range']").value == 0){
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }else if (document.querySelector("[type='range']").value <= 33){
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 2";
  }else if (document.querySelector("[type='range']").value <= 66){
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }else if (document.querySelector("[type='range']").value <= 100){
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";
  }
});
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
