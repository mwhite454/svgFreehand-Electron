var globals = {
                "isDrawing": false,
                "points" : [],
                "drawing" : [],
                "currDraw" : "",
                "smoothing": "4",
                "currentElement" : 0
              };


///Event listeners
window.addEventListener("load", function(){
  globals.currDraw = document.getElementById("svgPort").innerHTML;
  globals.paper = document.getElementById('svgPort');
  globals.desk = document.getElementById('desk');
  prepPort();
  //set svgPort width and height based on window size
  //setPortSize();
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
  globals.paper.addEventListener("mousedown", startDraw);
  globals.paper.addEventListener("mouseup", endDraw);
  globals.paper.addEventListener("mousemove", collectPoints);
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
  globals.currDraw = document.getElementById("svgPort").innerHTML;
}

function endDraw(){
  var thisDraw = document.getElementById("currentDrawing");
  thisDraw.setAttribute("points", "0,300 300,300");
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
  document.getElementById("svgPort").innerHTML = globals.currDraw + poly;
  globals.currentElement +=1;
  globals.isDrawing = false;

}

function collectPoints(){
  if(globals.isDrawing){

    //var myCoordinates = getRelativeCoordinates(event, globals.paper );
    var point = " " + event.offsetX + "," + event.offsetY;
    globals.points.push(point);
    refreshDraw();
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
