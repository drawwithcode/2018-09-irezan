var data;
var myLoc;
var myMap;
var allButtons = [];

var mappa = new Mappa('MapboxGL', 'pk.eyJ1IjoiYXNoaXJhIiwiYSI6ImNqb3VoaDU5cjFjOWMzcXBpbThkZHA4NW8ifQ.nerPFx0UJLfFVBEYHSA6gA');
var options = {
  lat: 37.998500,
  lng: 22.292487,
  zoom: 4,
  style: 'mapbox://styles/ashira/cjouhku5d047m2so5g9h98onp',
  pitch: 0
};

var state = 0;
var myWonder = 0;

function WonderButton(_posx, _posy, _boxx, _boxy, _name, _wonNum) {
  this.posx = _posx;
  this.posy = _posy;
  this.name = _name;
  this.wonNum = _wonNum;
  this.boxx = _boxx;
  this.boxy = _boxy;

  this.clicked = function() {
    if (mouseX > this.posx && mouseX < (this.posx + this.boxx) && mouseY > this.posy && mouseY < (this.posy + this.boxy)) {
      state = 1;
      myWonder = this.wonNum + 1;
      drawPos();
      // console.log('hey');
    }
  }
}


function preload() {
  data = loadJSON('./wonders.json');
  myLoc = getCurrentPosition();
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  //  textAlign(CENTER);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawPos);

  setupButtons();
}

function draw() {
  //  clear();
  //mousepressed

  if (state == 1) {
    writeDistance();
    var ref = min(height, width);
    fill(0);
    rect(ref / 10, 4 * height / 5 + height / 25, ref / 4, height / 25);
    var info = 'info';
    fill(255);
    textSize(ref / 30);
    textAlign(CENTER);
    text(info, ref / 10 + ref / 8, 4 * height / 5 + height / 25 + height / 37);
  }

  drawButtons();


}

function setupButtons() {
  var ref = min(height, width);
  for (var i = 0; i < data.wonders.length; i++) {
    var name = data.wonders[i].name;
    var boxx = ref / 6;
    var boxy = ref / 10;
    var posx = ref / 10 - (ref / 10 - boxx) / 2;
    var posy = map(i, 0, 6, height / 4, 3 * height / 4);
    var button = new WonderButton(posx, posy, boxx, boxy, name, i);
    allButtons.push(button);
  }
}

function drawButtons() {

  fill(0, 0, 0, 180);
  var ref = min(height, width);
  var rectH = dist(ref / 10, height / 5, ref / 10, 4 * height / 5);
  rect(ref / 10, height / 5, ref / 4, rectH);

  fill(255);

  textSize(ref / 60);
  textAlign(CENTER);
  for (var i = 0; i < allButtons.length; i++) {
    if(myWonder - 1 == i){
      fill(51, 153, 255);
    } else {
      fill(255);
    }
    text(allButtons[i].name, allButtons[i].posx, allButtons[i].posy, allButtons[i].boxx, allButtons[i].boxy);
  }
}

function drawPos() {
  if (state == 0) {
    drawMyPos();
  } else {
    drawBothPos();
  }
}

function drawMyPos() {
  fill(51, 153, 255);
  strokeWeight(2);
  clear();
  var myPos = myMap.latLngToPixel(myLoc.latitude, myLoc.longitude);
  ellipse(myPos.x, myPos.y, 20);
}

function drawBothPos() {
  strokeWeight(2);

  clear();
  var myPos = myMap.latLngToPixel(myLoc.latitude, myLoc.longitude);
  var wonPos = myMap.latLngToPixel(data.wonders[myWonder - 1].coordLat, data.wonders[myWonder - 1].coordLon);

  push();
  stroke(51, 153, 255);
  line(myPos.x, myPos.y, wonPos.x, wonPos.y);
  pop();
  fill(51, 153, 255);
  ellipse(myPos.x, myPos.y, 20);
  ellipse(wonPos.x, wonPos.y, 20);

}

function writeDistance() {

  var km = calcGeoDistance(myLoc.latitude, myLoc.longitude, data.wonders[myWonder - 1].coordLat, data.wonders[myWonder - 1].coordLon, "km");
  var time = floor(km * 0.0104); // basato su 96 km al giorno
  var days = time + '\ndays on foot';
  // var days =  '\n days on foot';
  //attributi del testo
  push();
  fill(0);
  stroke(255);
  var ref = min(height, width);
  rect(ref / 10, height / 25, ref / 4, 3 * height / 25);
  pop();

  textSize(ref / 30);
  fill(255);
  text(days, ref / 10, height / 25 + (height / 25 / 2), ref / 4, 3 * height / 25);
}

function drawInfo() {
  fill(0);
  var ref = min(height, width);
  var rectH = dist(ref / 10, height / 5, ref / 10, 4 * height / 5);
  rect(4 * ref / 10, height / 5, 2 * ref / 4, rectH / 2);

  var offset = height / 20;
  fill(255);
  textAlign(LEFT);
  textSize(ref / 40);
  var name = data.wonders[myWonder - 1].name;
  text(name, 4.5 * ref / 10, height / 4, ref / 3, height / 20);

  textSize(ref / 60);
  var dateConstr = 'Date of construction: ' + data.wonders[myWonder - 1].dateConstr;
  text(dateConstr, 4.5 * ref / 10, height / 4 + offset, ref / 3, height / 20);

  var builders = 'Builders: ' + data.wonders[myWonder - 1].builders;
  text(builders, 4.5 * ref / 10, height / 4 + offset * 2, ref / 3, height / 20);

  var dateDestr = 'Date of destruction: ' + data.wonders[myWonder - 1].dateDestr;
  text(dateDestr, 4.5 * ref / 10, height / 4 + offset * 3, ref / 3, height / 20);

  var cause = 'Cause of destruction: ' + data.wonders[myWonder - 1].cause;
  text(cause, 4.5 * ref / 10, height / 4 + offset * 4, ref / 3, height / 20);

  var modernLoc = 'Modern location: ' + data.wonders[myWonder - 1].modernLoc;
  text(modernLoc, 4.5 * ref / 10, height / 4 + offset * 5, ref / 3, height / 20);

}

function mousePressed() {
  var ref = min(height, width);
  for (var i = 0; i < allButtons.length; i++) {
    // console.log(data.wonders.length);
    // console.log('hey');
    allButtons[i].clicked();
  }
  if (mouseX > ref / 10 && mouseX < (ref / 10 + ref / 4) && mouseY > 4 * height / 5 + height / 25 && mouseY < 4 * height / 5 + height / 25 + height / 25) {
    drawInfo();
  }
}
