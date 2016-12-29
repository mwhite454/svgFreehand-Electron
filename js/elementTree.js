globals.renderElements = {
     'a': 1
   , 'audio': 1
   , 'canvas': 1
   , 'circle': 1
   , 'ellipse': 1
   , 'foreignObject': 1
   , 'g': 1
   , 'iframe': 1
   , 'image': 1
   , 'line': 1
   , 'mesh': 1
   , 'path': 1
   , 'polygon': 1
   , 'polyline': 1
   , 'rect': 1
   , 'svg': 1
   , 'switch': 1
   , 'symbol': 1
   , 'text': 1
   , 'textPath': 1
   , 'tspan': 1
   , 'unknown': 1
   , 'use': 1
   , 'video' : 1
}

function updateElementTree(element){
  var ul = document.getElementById("elementList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(element));
  li.setAttribute("name", element+"TreeView"); // added line
  ul.appendChild(li);
}

function readSVGTree(){
  if(globals.paper.hasChildNodes()){
    var children = globals.paper.childNodes;
    for(var i=0; i< children.length; i++){
      if(globals.renderElements.hasOwnProperty(children[i].nodeName)){
        console.log(children[i].nodeName + ' bongo!');
      }
    }
  }
}
