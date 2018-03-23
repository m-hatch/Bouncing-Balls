// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random()*(max-min)) + min;
}
