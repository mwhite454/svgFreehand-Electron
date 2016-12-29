var globals = {
                "isDrawing": false,
                "points" : [],
                "drawing" : [],
                "currDraw" : "",
                "smoothing": "4",
                "currentElement" : 0,
                "zoomRate" : 0.1,
                "panRate" : 10,
                "currentZoom" : 1,
                "currentViewBox" : ""
              };


///Event listeners
window.addEventListener('load', function(){
  globals.desk = document.getElementById('desk');
  window.addEventListener('keydown', processKeyPress, true);
  //window.addEventListener('wheel', MouseWheelHandler, false);
  prepPort();
});

function prepPort(){
  if(globals.desk.hasChildNodes()){
    var children = globals.desk.childNodes;
    for(var i=0; i< children.length; i++){
      if(children[i].nodeName === "svg"){
        children[i].setAttribute('id', 'svgPort');
      }
    }

  }
  globals.paper = document.getElementById('svgPort');
  globals.currDraw = document.getElementById("viewport");
  globals.cursor = document.getElementById("cursorDot");
  globals.cursorView = document.getElementById("cursorView");
  globals.paper.addEventListener("mousedown", startDraw);
  globals.paper.addEventListener("mouseup", endDraw);
  globals.paper.addEventListener("mousemove", collectPoints);
  globals.paper.addEventListener('wheel', MouseWheelHandler);
  globals.paper.addEventListener('contextmenu', rightClickPan, false);
  readSVGTree();
}


function setPortSize(){
  var width = window.innerWidth;
  var height = window.innerHeight;
  globals.paper.setAttribute("width", width-300);
  globals.paper.setAttribute("height", height-200);
}

function startDraw(){
  globals.isDrawing = true;
}

function endDraw(){
  var thisDraw = document.getElementById("currentDrawing");
  thisDraw.setAttribute("points", "0,0 0,0");
  var poly = "";
  for(var i=0; i<globals.points.length; i++){
    if(i===0 || i===globals.points.length-1 || i%globals.smoothing === 0){
      poly = poly + globals.points[i];
    }
  }
  var el = "element" + globals.currentElement;
  poly = "<polyline id='" + el + "' points='" + poly + "' style='stroke:black; stroke-width:1; fill: none' />";
  globals.drawing.push(globals.points);
  updateElementTree(el);
  globals.points = [];
  globals.currDraw.innerHTML = globals.currDraw.innerHTML + poly;
  globals.currentElement +=1;
  globals.isDrawing = false;

}

function collectPoints(){
  //globals.cursor = document.getElementById("cursorDot");
  globals.cursor.setAttribute('cx', event.offsetX);
  globals.cursor.setAttribute('cy', event.offsetY);
  if(globals.isDrawing){
    //var myCoordinates = getRelativeCoordinates(event, globals.paper );
    var point = " " + event.offsetX + "," + event.offsetY;
    globals.points.push(point);
    refreshDraw();
  } else {

  }

}

function refreshDraw(){
    var thisDraw = document.getElementById("currentDrawing");
    var poly = thisDraw.getAttribute("points");
    var i = globals.points.length-1;
    if(globals.points.length<2){
      poly = " ";
      poly = globals.points[0] + " " + globals.points[0];
    } else if(globals.points.length===2){
      poly = " ";
      poly = globals.points[0] + " " + globals.points[1];
    } else {
      //for(var i=1; i<globals.points.length-1; i++){
        poly = poly + globals.points[i];
      //}
    }
    thisDraw.setAttribute("points", poly);
}

//interface
/* Constants: */
var leftArrow  = 37;	// Key code for the left arrow key.
var upArrow    = 38;
var rightArrow = 39;
var downArrow  = 40;
var plus = 187;
var minus = 189;

function getViewBox(){
  var viewBox = globals.paper.getAttribute('viewBox');
  var viewBoxValues = viewBox.split(' ');
  viewBoxValues[0] = parseFloat(viewBoxValues[0]);
  viewBoxValues[1] = parseFloat(viewBoxValues[1]);
  return viewBoxValues;
}

function processKeyPress(evt)
{
  var viewBoxValues = getViewBox();

  switch (evt.keyCode)
  {
    case leftArrow:
      viewBoxValues[0] += globals.panRate;	// Increase the x-coordinate value of the viewBox attribute by the amount given by panRate.
      break;
    case rightArrow:
      viewBoxValues[0] -= globals.panRate;	// Decrease the x-coordinate value of the viewBox attribute by the amount given by panRate.
      break;
    case upArrow:
      viewBoxValues[1] += globals.panRate;	// Increase the y-coordinate value of the viewBox attribute by the amount given by panRate.          break;
      break;
    case downArrow:
      viewBoxValues[1] -= globals.panRate;	// Decrease the y-coordinate value of the viewBox attribute by the amount given by panRate.          break;
      break;
    case plus:
    globals.currentZoom += globals.zoomRate;
    break;
    case minus:
    globals.currentZoom -= globals.zoomRate;
    break;
  } // switch
  globals.currentViewBox = viewBoxValues.join(' ');
  setPan();
  setZoom();
	// Convert the viewBoxValues array into a string with a white space character between the given values.
}

function setPan(){
  if(globals.currentViewBox!=""){
    globals.paper.setAttribute('viewBox', globals.currentViewBox);
  }
}

function setZoom(){
  globals.currDraw.setAttribute('transform',"scale("+ globals.currentZoom +")");
  globals.cursorView.setAttribute('transform',"scale("+ globals.currentZoom +")");
}

function rightClickPan(){
    event.preventDefault();
    globals.isDrawing = false;
    var startX = event.offsetX;
    var startY = event.offsetY;

}

function MouseWheelHandler(e) {
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  delta = delta * globals.zoomRate;
  globals.currentZoom += delta;
  setZoom();
}
