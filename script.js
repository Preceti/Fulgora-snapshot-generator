// generic definition and initialization
// svg definition : bounding box
// removed % to prevent scrollbar appearing
//0.98*document.documentElement.clientWidth;
const width = 0.98 * window.innerWidth;
const height = 0.9 * window.innerHeight;
//you can change this number to change the number cell at start
const numberofcellsatstart = 1500
// chicken egg size definition
//console.log(width*height)/(tornadosize²))
//bigger number here means more land vs water
// [0.5-1.5] are quite extreme bound already
// 0.72 is ok for most value between 1000 and  20K points
const ratiotonormalcell = 0.72;

// empty variable initialization
var keybeingpressed = null;
var mouse = null;
var centroidcoordinatearray = [];
var centroidcoordinatearrayrough = [];
var hasorigin = "none";
var hastarget = "none";
var hasoriginp = "none";
var hastargetp = "none";
var impassablecelllist = [];
var passablecelllist = [];
var adjacencysuperarray = [];
var cleanadjacencysuperarray = [];
var activecell = "none";
var overlayactive = "none";
var landmasses = "none";
var landmasseslist = [];
var landmassesedgelist = [];
var daynight = "off";
var lightmode = "off";
var currentnightpos = 0;
var currentnightpos2 = 0;
// when circle is small one can't see there is a bit missing with pi = 3
var tau = 2 * Math.PI;
var faketau = Math.floor(100 * tau) / 100;
var fakertau = 6;
var aretornadoesactive = false;
var tornadospawner = [];
var tornadoprespawner =[];
var tornadopostspawner =[];
var tornadoprecaster =[];
var tornadoanimationframe = 12;
var timecounter = 0;
var averagecellarea = (height * width) / numberofcellsatstart;
var tornadosize = 1.2 * Math.sqrt(averagecellarea);

//make background off by default for performance when smoothing
var isbackgroundcoloractivated = false;
//make impassable on by default
var isimpassableactivated = true;
// make no choice for what is impassable. ( "none"/ "land" / "water")
var impassablemode = "none";
// list of type of cells
var icecelllist = [];
var watercelllist = [];
var landcelllist = [];
var shallowwatercelllist = [];
var deepwatercelllist = [];
var mountaincelllist = [];
var hillcelllist = [];
var bluemysterycelllist = [];

// color from factorio Fulgora planet
const Fulgoracolor = {
  //deepwater = "sand deep"
  deepwater: "#3a2029",
  //water = "sandshallow"
  water: "#4a2829",
  //shallowwater = "edge island":
  shallowwater: "#987954",
  //hills = "fillislandred"
  hills: "#734131",
  //land = "fill island tan"
  land: "#845542",
  //mountain =  "fill island blue"
  mountain: "#737974",
  // this is specific to Fulgora
  bluemystery: "#006299",
};

// Earth like color
const Earthcolor = {
  land: "#a5d260",
  ice: "#99ccff",
  mountain: "#98492f",
  hills: "#cc8800",
  shallowwater: "#2f6397",
  water: "#212869",
  deepwater: "#12123b",
};

// var to change the color palette
var planet = Fulgoracolor;

// random data to illustrate basic 
var datamap = Array.from({ length: numberofcellsatstart }).map(() => {
  return [
    Math.round(width * Math.random()),
    Math.round(height * Math.random()),
  ];
});



// create delaunay triangulation from array of points
var delaunayd = d3.Delaunay.from(datamap);

//create a voronoi diagram from the previous delaunay triangulation
var voronoid = delaunayd.voronoi([0, 0, width, height]);

// svg creation
const svg = d3
  .create("svg")
  .attr("id", "maincontainer")
  .attr("width", width)
  .attr("height", height);
container.append(svg.node());

// keyboard detector
d3.selectAll("*").on("keydown", function (event) {
  keybeingpressed = event.key;
});

// keyboard resetor
d3.selectAll("*").on("keyup", function () {
  keybeingpressed = null;
});

// click detector
// letters are used to call function for now
//  First part of the list draw on map
function clickdetector(event) {
  //a call the function to add a new point
  if (keybeingpressed === "a") {
    newpoints(event);
    drawingbase(delaunayd, voronoid);
    daynight="off";
    aretornadoesactive=false; 
    if (isbackgroundcoloractivated === true) {
      fbackgroundcolors();
    }
  }

  // z smooth the graph
  if (keybeingpressed === "z") {
    drawallcentroids();
    replacecentroids(centroidcoordinatearray);
    graph = makegraph(datamap);
    daynight="off";
    aretornadoesactive=false;
    if (isbackgroundcoloractivated == true) {
      fbackgroundcolors();
    }

  }

  // e paint an overlay on the cell to show it has been made "impassable terrain"
  if (keybeingpressed === "e") {
    markimpassable(whichcell(event));
  }

  // r highlight edges of clicked cell and write its ID
  if (keybeingpressed === "r") {
    let previouscell = activecell;
    if (activecell != "none") {
      delete1cell();
      deletelabels();
      
    }
    if (activecell === "none") {
      activecell = whichcell(event);
      if (activecell != previouscell) {
        draw1cell(activecell);
        writecellID(event);        
      }
    }
 
  }

  // t paint all cells with a temporary overlay according to various criterions
  if (keybeingpressed === "t") {
    overlaymanager();
  }

  //y draw all centroids
  if (keybeingpressed === "y") {
    drawallcentroids();
  }

  //u replace earlier random points with new centroids and redo the voronoi diagram
  if (keybeingpressed === "u") {
    replacecentroids(centroidcoordinatearray);
  }

  //i draw a road to neighbouring cell
  if (keybeingpressed === "i") {
    drawroadtoneighbour(whichcell(event));
  }

  //o first select a cell as origin, then second click draw path from origin to target
  // lazy optimist
  if (keybeingpressed === "o") {
    pathfindclicker(whichcell(event));
  }

  //p first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed === "p") {
    pathfindclicker2(whichcell(event));
  }

  //m first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed === "m") {
    pathfindclicker3(whichcell(event));
  }

  // l to draw background colors
  if (keybeingpressed === "l") {
    if (isbackgroundcoloractivated === true) {
      isbackgroundcoloractivated = false;
      removebackgroundcolors();
    } else {
      isbackgroundcoloractivated = true;
      fbackgroundcolors();
    }
  }

  //k to hide/show impassable terrain
  if (keybeingpressed === "k") {
    if (isimpassableactivated === true) {
      isimpassableactivated = false;
      hideimpassableterrain();
    } else {
      isimpassableactivated = true;
      paintimpassable();
    }
  }

  //j to turn all "land" or "water" into impassable 3rd click reset
  if (keybeingpressed === "j") {
    //force visibility first anyway
    if (isimpassableactivated != true) {
      isimpassableactivated = true;
    }
    applyimpassablemode();
  }

  //h to detect and hightlight landmasses another time hide
  if (keybeingpressed === "h") {
    landmassesmanager();
  }

  // g to enable/ disable the day and night cycle
  if (keybeingpressed === "g") {
    if (daynight === "off") {
      daynight = "on";
      daynightcycler();
    } else {
      daynight = "off";
      daynightcycler();
    }
  }

  // f to activate the tornadoes ?
  if (keybeingpressed === "f") {
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);
    smoothing(centroidcoordinatearray);

    tornadomanager();
  }

  // sound key
  if (keybeingpressed === "²") {
    if (ambiantsound != "playing") {
      ambiantsound = "playing";
      customrepeatplay(FulgoraThunder);
      customrepeatplay(FulgoraWind);
    } else {
      ambiantsound = "off";
    }
  }

  // second row, write
  // q tell in the console the ID of the clicked cell
  if (keybeingpressed === "q") {
    console.log(whichcell(event));
  }

  // s tell in the console the area of the clicked cell
  if (keybeingpressed === "s") {
    console.log(d3.polygonArea(polygonizemyID(whichcell(event))));
  }

  // log in adjacency array
  if (keybeingpressed === "d") {
    console.log(readadjacency(datamap));
  }

    // used to test new functions
    if (keybeingpressed==="x"){
      
      showlandmassescontour(landmasseslist)
    }
        // used to test new functions
        if (keybeingpressed==="c"){      
          
          if (daynight === "on") {
            daynight = "off";
            daynightcycler();
            deactivatetornadoes();
          }
          cyclerandomdistrib();
         
        }
}

// helper function to make average
const average = (array) => array.reduce((a, b) => a + b) / array.length;

// function called to draw things
function drawingbase(delaunayd, voronoid) {
  // clean everything
  svg.selectAll("*").remove();
  // redraw the mesh
  drawingbasend(delaunayd, voronoid);
  //redraw impassable
  paintimpassable();
}

// function called to draw things ( non destructive )
function drawingbasend(delaunayd, voronoid) {
  //create a svg and draw the delaunay triangulation as a path
  svg
    .append("path")
    .attr("d", delaunayd.render())
    .attr("stroke", "brown")
    .attr("opacity", 0.2)
    .attr("delaunay", true)
    .attr("fill", "none");

  // draw the voronoi diagram as a path
  svg
    .append("path")
    .attr("d", voronoid.render())
    .attr("stroke", "black")
    .attr("voronoi", true)
    .attr("fill", "none")
    .attr("opacity", 0.5);

  // daw the points triangulated by the delaunay
  svg
    .append("path")
    .attr("d", delaunayd.renderPoints(1))
    .attr("fill", "black")
    .attr("ispoints", "true");

  // draw the rectangle bound of the voronoid diagram
  svg
    .append("path")
    .attr("d", voronoid.renderBounds())
    .attr("stroke", "black")
    .attr("opacity", 1)
    .attr("fill", "none")
    .attr("bounds", true);
}

// function called to draw additionnal things
function drawingpoints(mouse) {
  svg
    .append("circle")
    .attr("fill", "black")
    .attr("opacity", 0.5)
    .attr("r", 1)
    .attr("iscenterofcell", "yes")
    .attr("cx", mouse[0][0])
    .attr("cy", mouse[0][1]);
}

// function to add a new points
function newpoints(event) {
  var mouse = d3.pointers(event);
  datamap.push([mouse[0][0], mouse[0][1]]);
  delaunayd = d3.Delaunay.from(datamap);
  voronoid = delaunayd.voronoi([0, 0, width, height]);
}

// function to know which cell was clicked
function whichcell(event) {
  var mouse = d3.pointers(event);
  cellID = delaunayd.find(mouse[0][0], mouse[0][1]);
  return cellID;
}

// function to write the ID of a cell
function writecellID(event) {
  let cellID = whichcell(event);
  svg
    .append("text")
    .text(cellID)
    .attr("x", datamap[cellID][0])
    .attr("y", datamap[cellID][1])
    .attr("font-size", "1em");
}

// function to remove the ID of a cell
function deletelabels() {
  let newselec = d3.selectAll("[font-size]");
  newselec.remove();
}

// function to paint a cell
function paintcell(cellID) {
  svg
    .append("path")
    .attr("d", voronoid.renderCell(cellID))
    .attr("opacity", 0.3)
    .attr("fill", "red")
    .attr("isaremovable", "yes")
    .attr("id", "name" + cellID)
    .attr("isapaintedcell", "yes")
    .attr("isimpassable", "yes");
}

// function to paint all impassable cell
function paintimpassable() {
  if (isimpassableactivated === true && impassablecelllist) {
    for (element of impassablecelllist) {
      paintcell(impassablecelllist[impassablecelllist.indexOf(element)]);
    }
  }
}

// function to paint a cell a certain color for background
function paintcellfillcolor(cellID, color, attributestring) {
  svg
    .append("path")
    .attr("d", voronoid.renderCell(cellID))
    .attr("opacity", 1)
    .attr("fill", color)
    .attr("isaremovable", "no")
    .attr("id", "name" + cellID)
    .attr("isapaintedcell", "yes")
    .attr("background", attributestring);
}

// function to make a cell impassable if it wasn't or vice versa and call the paint job accordingly
function markimpassable(cellID) {
  let iscellincluded = impassablecelllist.includes(cellID);
  while (iscellincluded === true) {
    removeimpassable(cellID);
    break;
  }
  while (iscellincluded === false) {
    makeimpassable(cellID);
    break;
  }
  return;
}

// function to make impassable
function makeimpassable(cellID) {
  // add it to the list
  impassablecelllist.push(cellID);
  // paint it
  paintcell(cellID);
}

// function to remove impassable
function removeimpassable(cellID) {
  // remove it from the list
  impassablecelllist.splice(impassablecelllist.indexOf(cellID), 1);
  //delete the overlay
  let newselec = d3.selectAll("#name" + cellID + '[isimpassable="yes"]');
  newselec.remove();

  return;
}

// function to hide impassable
function hideimpassableterrain() {
  if (isimpassableactivated === false) {
    let newselec = d3.selectAll('[isimpassable="yes"]');
    newselec.remove();
  }
}

// function to highlight the edge of a cell
function draw1cell(cellID) {
  svg
    .append("polygon")
    .attr("points", voronoid.cellPolygon(cellID))
    .attr("isaremovable", "yes")
    .attr("isapaintedcell", cellID)
    .attr("isactivecell", "yes")
    .attr("fill-opacity", 0)
    .attr("opacity", 1)
    .attr("stroke", "green")
    .attr("stroke-width", 4);
}

// function to remove edge of cell
function delete1cell() {
  let newselec = d3.selectAll("[isactivecell");
  newselec.remove();
  activecell = "none";
}

// function to manage the overlays
function overlaymanager() {
  if (overlayactive === "none") {
    overlayactive = "area";
    paintallcellbasedontheirarea();
  } else if (overlayactive === "area") {
    let newselec = d3.selectAll('[isoverlay="yes"]');
    newselec.remove();
    overlayactive = "neighbournumber";
    paintallcellbasedontheirneighbournumber();
  } else if (overlayactive === "neighbournumber") {
    let newselec = d3.selectAll('[isoverlay="yes"]');
    newselec.remove();
    overlayactive = "perimeter";
    paintallcellbasedonperimeter();
  } else if (overlayactive === "perimeter") {
    let newselec = d3.selectAll('[isoverlay="yes"]');
    newselec.remove();
    overlayactive = "none";
  }
}

// function to paint all cell based on the number of neighbour they have
function paintallcellbasedontheirneighbournumber() {
  for (element of datamap) {
    let neighboured = [...voronoid.neighbors(datamap.indexOf(element))];
    let color = "black";

    switch (neighboured.length) {
      case 1:
        color = "Snow";
        break;
      case 2:
        color = "LemonChiffon";
        break;
      case 3:
        color = "LavenderBlush";
        break;
      case 4:
        color = "MistyRose";
        break;
      case 5:
        color = "NavajoWhite";
        break;
      case 6:
        color = "LightSalmon";
        break;
      case 7:
        color = "Bisque";
        break;
      case 8:
        color = "Tan";
        break;
      case 9:
        color = "Coral";
        break;
      case 10:
        color = "Tomato";
        break;
      case 11:
        color = "OrangeRed";
        break;
      case 12:
        color = "Red";
        break;
      case 13:
        color = "DeepPink";
        break;
    }

    svg
      .append("path")
      .attr("d", voronoid.renderCell(datamap.indexOf(element)))
      .attr("opacity", 1)
      .attr("isoverlay", "yes")
      .attr("fill", color);
  }
}

// better function to paint all cell
function paintallcellbasedontheirarea() {
  //create empty array to store additionnal data
  var datamapinfo = [];
  // iterate through each cell and push area of cell in the array
  for (let i = 0; i < datamap.length; i++) {
    datamapinfo.push(-1 * d3.polygonArea(polygonizemyID(i)));
  }
  //find largest cell
  let largestcell = Math.max(...datamapinfo);
  // paint all the cell with gradient from largest cell
  for (let i = 0; i < datamapinfo.length; i++) {
    svg
      .append("path")
      .attr("d", voronoid.renderCell(i))
      .attr(
        "opacity",
        1 - Math.floor((datamapinfo[i] / largestcell) * 100) / 100
      )
      .attr("isoverlay", "yes")
      .attr("fill", "blue");
  }
  //console.log(largestcell);
  //console.log(datamapinfo);
}

// paint all cell based on perimeter
function paintallcellbasedonperimeter() {
  // for each cell, pick each edge and calculate the distance to the following edge to put in array
  // track longest perimeter in process
  var longerperimeter = 0;
  var datamapinfo = [];
  for (element of datamap) {
    let edgelist = polygonizemyID(datamap.indexOf(element));
    let perimeter = [];
    for (let i = 0; i < edgelist.length - 1; i++) {
      perimeter.push(
        Math.hypot(
          edgelist[i + 1][0] - edgelist[i][0],
          edgelist[i + 1][1] - edgelist[i][1]
        )
      );
    }
    // sum this array and push result aka perimeter in datamapinfo
    let sum = perimeter.reduce((a, b) => a + b, 0);
    datamapinfo.push(sum);
    if (sum > longerperimeter) {
      longerperimeter = sum;
    }
  }

  // at this point datamap info contain an array with the perimeter of every cell and longerperimeter is a trusted value
  //console.log(datamapinfo)

  for (let i = 0; i < datamapinfo.length; i++) {
    svg
      .append("path")
      .attr("d", voronoid.renderCell(i))
      .attr(
        "opacity",
        Math.floor((datamapinfo[i] / longerperimeter) * 100) / 100
      )
      .attr("isoverlay", "yes")
      .attr("fill", "green");
  }
}

// function to draw all center as the centroids
function drawallcentroids() {
  // create empty array to store data
  var centroidcoordinatearrayrough = [];
  centroidcoordinatearray = [];

  // iterate each cell and put the coordinate of each edge of each cell in an array
  for (let i = 0; i < datamap.length; i++) {
    centroidcoordinatearrayrough.push(polygonizemyID(i));
  }

  // trim coordinate from double
  for (let i = 0; i < centroidcoordinatearrayrough.length; i++) {
    centroidcoordinatearrayrough[i].splice(-1);
  }

  // separate X and Y coordinates
  var xforcentroid = [];
  var yforcentroid = [];

  var intsumx = null;
  var intsumy = null;
  // loop over each cell, then over each edge of each cell, and push the x or y coordinated into respective array
  for (let j = 0; j < centroidcoordinatearrayrough.length; j++) {
    for (let k = 0; k < centroidcoordinatearrayrough[j].length; k++) {
      xforcentroid.push(centroidcoordinatearrayrough[j][k][0]);
      yforcentroid.push(centroidcoordinatearrayrough[j][k][1]);
    }
    // make intermediate sum of all x and all y positions of all edge of a cell, and divide them by the number of edge to get an average position for that cell
    intsumx = average(xforcentroid);
    intsumy = average(yforcentroid);

    yforcentroid = [];
    xforcentroid = [];
    // push the couple [x,y] of the centroid for that cell id in an array with the same index
    centroidcoordinatearray.push([intsumx, intsumy]);
  }

  // draw circles at the points in the array
  for (let i = 0; i < centroidcoordinatearray.length; i++) {
    svg
      .append("circle")
      .attr("fill", "black")
      .attr("opacity", 0.5)
      .attr("r", 3)
      .attr("iscenterofcell", "yes")
      .attr("cx", centroidcoordinatearray[i][0])
      .attr("cy", centroidcoordinatearray[i][1]);
  }
}

// function used to replace the random points by the centroids
function replacecentroids(centroidcoordinatearray) {
  // create a delaunay triangulation mesh from the array containing the coordinate of the centroids
  delaunayd = d3.Delaunay.from(centroidcoordinatearray);
  //create a voronoi diagram from the previous delaunay triangulation
  voronoid = delaunayd.voronoi([0, 0, width, height]);
  drawingbase(delaunayd, voronoid);
  datamap = [];
  for (i = 0; i < centroidcoordinatearray.length; i++) {
    datamap.push(centroidcoordinatearray[i]);
  }
}

// function to draw road to the neighbouring cell
function drawroadtoneighbour(cellID) {
  // clear previous road is there is one
  d3.selectAll("#islatestroadtoneighbour").remove();

  // get array of ID of neighbors
  let neighboured = [...voronoid.neighbors(cellID)];
  // get ID of source cell for road
  var clickedcell = cellID;
  // make a path from the datamap point that correspond to the center of the cell, to the center of the neighbour
  var pathroadneighbour = d3.path();
  for (let i = 0; i < neighboured.length; i++) {
    pathroadneighbour.moveTo(datamap[cellID][0], datamap[cellID][1]);
    pathroadneighbour.lineTo(
      datamap[neighboured[i]][0],
      datamap[neighboured[i]][1]
    );
  }

  svg
    .append("path")
    .attr("id", "islatestroadtoneighbour")
    .attr("d", pathroadneighbour)
    .attr("opacity", 0.8)
    .attr("stroke", "green")
    .attr("stroke-width", 2);
}

// function used to select a tile as origin or to draw a path from the origin to the target if there is already an origin
// first version left sticky path
function pathfindclicker(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasorigin != "none") {
    // console.log("origin was " + hasorigin);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasorigin][0], datamap[hasorigin][1]);
    //set the target
    hastarget = cellID;
    //console.log("target is now " + hastarget);

    // function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
    var celltovisit = pathfind(hasorigin, hastarget);
    // pathfind error handling (i'm not proud)
    if (celltovisit == undefined) {
      //console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      //console.log("path is going through cells " + celltovisit);

      // make a path to connect them
      for (i = 0; i < celltovisit.length; i++) {
        pathdargumentinit.lineTo(
          datamap[celltovisit[i]][0],
          datamap[celltovisit[i]][1]
        );
      }
      // draw path

      svg
        .append("path")
        .attr("id", "islatestroadtotarget")
        .attr("d", pathdargumentinit)
        .attr("opacity", 1)
        .attr("fill-opacity", 0)
        .attr("stroke", "blue")
        .attr("stroke-width", 2);

      // reset the origin to none for the 3rd click to act like the 1rst
      hasorigin = "none";
      //console.log("origin is now " + hasorigin);
      return;
    }
  }

  // if no origin, set origin,
  if (hasorigin == "none") {
    hasorigin = cellID;
    // console.log("origin set as " + cellID);
    //make sure there is no target in case it's the 3rd click and not the first
    hastarget = "none";
  }
}

// function to draw path from the origin to target , or to select an origin if there was none
// 2nd version sligthly better
function pathfindclicker2(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasoriginp != "none") {
    //console.log("origin was " + hasoriginp);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasoriginp][0], datamap[hasoriginp][1]);
    //set the target
    hastargetp = cellID;
    //console.log("target is now " + hastargetp);
    //draw as target

    svg
      .append("polygon")
      .attr("points", voronoid.cellPolygon(cellID))
      .attr("isaremovable", "yes")
      .attr("isapaintedcell", cellID)
      .attr("fill-opacity", 0)
      .attr("opacity", 1)
      .attr("stroke", "purple")
      .attr("stroke-width", 4)
      .attr("isatargetforpath", "yes");

    // function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
    var celltovisit = pathfind(hasoriginp, hastargetp);
    // pathfind error handling (i'm not proud)
    if (celltovisit == undefined) {
      // console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      //console.log("path is going through cells " + celltovisit);

      // make a path to connect them
      for (i = 0; i < celltovisit.length; i++) {
        pathdargumentinit.lineTo(
          datamap[celltovisit[i]][0],
          datamap[celltovisit[i]][1]
        );
      }
      // draw path

      svg
        .append("path")
        .attr("id", "islatestroadtotarget")
        .attr("d", pathdargumentinit)
        .attr("opacity", 1)
        .attr("fill-opacity", 0)
        .attr("stroke", "blue")
        .attr("stroke-width", 2);

      // reset the origin to none for the 3rd click to act like the 1rst
      hasoriginp = "none";
      //console.log("origin is now " + hasoriginp);
      return;
    }
  }

  // if no origin, delete the old overlay and set new origin and color it so it is visible
  if (hasoriginp == "none") {
    let newselec2 = d3.selectAll('[isanoriginforpath="yes"]');
    newselec2.remove();
    // also delete the old drawn path
    newselec2 = d3.selectAll("#islatestroadtotarget");
    newselec2.remove();

    hasoriginp = cellID;
    svg
      .append("polygon")
      .attr("points", voronoid.cellPolygon(cellID))
      .attr("isaremovable", "yes")
      .attr("isapaintedcell", cellID)
      .attr("fill-opacity", 0)
      .attr("opacity", 1)
      .attr("stroke", "green")
      .attr("stroke-width", 4)
      .attr("isanoriginforpath", "yes");

    // console.log("origin set as " + cellID);
    //make sure there is no target in case it's the 3rd click and not the first
    hastargetp = "none";
    let newselec = d3.selectAll('[isatargetforpath="yes"]');

    newselec.remove();
  }
}

// function to draw path from the origin to target , or to select an origin if there was none
// 3rd version with djiskra
function pathfindclicker3(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasoriginp != "none") {
    // console.log("origin was " + hasoriginp);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasoriginp][0], datamap[hasoriginp][1]);
    //set the target
    hastargetp = cellID;
    // console.log("target is now " + hastargetp);
    //draw as target

    svg
      .append("polygon")
      .attr("points", voronoid.cellPolygon(cellID))
      .attr("isaremovable", "yes")
      .attr("isapaintedcell", cellID)
      .attr("fill-opacity", 0)
      .attr("opacity", 1)
      .attr("stroke", "purple")
      .attr("stroke-width", 4)
      .attr("isatargetforpath", "yes");

    // function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
    var celltovisit = pathfindd(hasoriginp, hastargetp);
    // pathfind error handling (i'm not proud)
    if (celltovisit === undefined) {
      //console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      //console.log("path is going through cells " + celltovisit);

      // make a path to connect them
      for (i = 0; i < celltovisit.length; i++) {
        pathdargumentinit.lineTo(
          datamap[celltovisit[i]][0],
          datamap[celltovisit[i]][1]
        );
      }
      // draw path

      svg
        .append("path")
        .attr("id", "islatestroadtotarget")
        .attr("d", pathdargumentinit)
        .attr("opacity", 1)
        .attr("fill-opacity", 0)
        .attr("stroke", "blue")
        .attr("stroke-width", 2);

      // reset the origin to none for the 3rd click to act like the 1rst
      hasoriginp = "none";
      // console.log("origin is now " + hasoriginp);
      return;
    }
  }

  // if no origin, delete the old overlay and set new origin and color it so it is visible
  if (hasoriginp === "none") {
    let newselec2 = d3.selectAll('[isanoriginforpath="yes"]');
    newselec2.remove();
    // also delete the old drawn path
    newselec2 = d3.selectAll("#islatestroadtotarget");
    newselec2.remove();

    hasoriginp = cellID;
    svg
      .append("polygon")
      .attr("points", voronoid.cellPolygon(cellID))
      .attr("isaremovable", "yes")
      .attr("isapaintedcell", cellID)
      .attr("fill-opacity", 0)
      .attr("opacity", 1)
      .attr("stroke", "green")
      .attr("stroke-width", 4)
      .attr("isanoriginforpath", "yes");

    // console.log("origin set as " + cellID);
    //make sure there is no target in case it's the 3rd click and not the first
    hastargetp = "none";
    let newselec = d3.selectAll('[isatargetforpath="yes"]');
    //console.log(newselec);
    newselec.remove();
  }
}

//function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
//" the lazy optmist"
// return an array of the ID of the cells composing the path
function pathfind(origincellid, targetcellid) {
  var celltovisit = [];
  var cellvisited = [];

  while (origincellid != targetcellid && origincellid) {
    // some var to make it easier to understand
    var originx = datamap[origincellid][0];
    var originy = datamap[origincellid][1];
    var targetx = datamap[targetcellid][0];
    var targety = datamap[targetcellid][1];

    // here remove forbidden neighbour => impassable terrain and such

    // search the neighbor of the origin
    var neighboured = [...voronoid.neighbors(origincellid)];
    //console.log( "before removal , neighbour list of " +  origincellid + " is " + neighboured );

    // list all impassable neighbour
    var badneighbour = neighboured.filter((element) =>
      impassablecelllist.includes(element)
    );
    // console.log( "the bad neighbour due to impassability of " + origincellid +   " are " +   badneighbour  );
    //list all visited neighbour
    var visitedneighbour = neighboured.filter((element) =>
      cellvisited.includes(element)
    );

    //console.log("the bad neighbour due to already visited of " + origincellid + " are " +visitedneighbour );

    // prevent revisiting a tile here
    // remove the bad neighbour from the potential neighbour

    while (badneighbour.length > 0) {
      for (let j = 0; j < badneighbour.length; j++) {
        neighboured.splice(neighboured.indexOf(badneighbour[j]), 1);
        badneighbour.splice(badneighbour.indexOf(badneighbour[j]), 1);
      }
    }
    // remove the already visited neighbour from the potential neighbour
    while (visitedneighbour.length > 0) {
      for (let k = 0; k < visitedneighbour.length; k++) {
        neighboured.splice(neighboured.indexOf(visitedneighbour[k]), 1);
        visitedneighbour.splice(
          visitedneighbour.indexOf(visitedneighbour[k]),
          1
        );
      }
    }

    // if datamap[neighboured[i]].impassable == true
    // if datamap[neighboured[i]][2] == "impassable"

    // compute their distance to target and store them in a an array
    var neighbourcrowflydistance = [];
    for (let i = 0; i < neighboured.length; i++) {
      let neighbourx = datamap[neighboured[i]][0];
      let neighboury = datamap[neighboured[i]][1];
      neighbourcrowflydistance.push(
        Math.sqrt((targety - neighboury) ** 2 + (targetx - neighbourx) ** 2)
      );
      // list of distances from neighbor to target
      // console.log(neighbourcrowflydistance)
      // minimum distance from all the neighbour
      //console.log(Math.min(...neighbourcrowflydistance))
      // rank of the neighbour that is the closest to target amongst other neighbour
      //console.log(neighbourcrowflydistance.indexOf(Math.min(...neighbourcrowflydistance)))
      // Cell is of that closest neighbour
      //console.log(neighboured[neighbourcrowflydistance.indexOf(Math.min(...neighbourcrowflydistance))])
    }

    var bestneighbour =
      neighboured[
        neighbourcrowflydistance.indexOf(Math.min(...neighbourcrowflydistance))
      ];
    // mark the visited tile
    cellvisited.push(origincellid);
    // from the best one pick neighbor
    if (bestneighbour === undefined) {
      //console.log("boy no push");
      return;
    } else {
      //console.log(bestneighbour);
      origincellid = bestneighbour;
      celltovisit.push(origincellid);
    }
  }
  if (celltovisit) {
    return celltovisit;
  } else {
    console.log("no path found bobby not smart sorry");
    return [0];
  }
}

//function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
//" more proper djiskra"
function pathfindd(origincellid, targetcellid) {
  graph = makegraph(datamap);
  var shortestPath = graph.dijkstra(origincellid, targetcellid);
  console.log("Shortest Path:", shortestPath);
  return shortestPath;
}

// function that is used to create adjacency list
function readadjacency(datamap) {
  adjacencysuperarray = [];
  for (let i = 0; i < datamap.length; i++) {
    adjacencysuperarray.push([...voronoid.neighbors(i)]);
  }
  return adjacencysuperarray;
}

// function to remove non passable from adjacency list
function removeimpassablefromadjacency() {
  var cleanadjacencysuperarray = [...adjacencysuperarray];
  var celltoremove = [...impassablecelllist];
  // console.log(cleanadjacencysuperarray);
  // console.log("impassable" + celltoremove);

  // remove all links to impassable cells
  // was super difficult to make

  for (let j = 0; j < cleanadjacencysuperarray.length; j++) {
    var valuetoremove = celltoremove.filter((value) =>
      cleanadjacencysuperarray[j].includes(value)
    );
    for (let k = 0; k < valuetoremove.length; k++) {
      cleanadjacencysuperarray[j].splice(
        cleanadjacencysuperarray[j].indexOf(valuetoremove[k]),
        1
      );
    }
  }

  // remove the impassable cell links so they cannot lead to anywhere
  for (let i = 0; i < celltoremove.length; i++) {
    cleanadjacencysuperarray[celltoremove[i]] = [];
  }
  //console.log(cleanadjacencysuperarray);
  //console.log(celltoremove);
  // console.log(cleanadjacencysuperarray);
  return cleanadjacencysuperarray;
}

// function used to test djiskra 1
// create a graph
function makegraph(datamap) {
  // try to make a new graph from datapoints
  const graph = new Graaph();
  readadjacency(datamap);
  cleanadjacencysuperarray = removeimpassablefromadjacency();

  //each point is a node
  for (let i = 0; i < datamap.length; i++) {
    let source = i;
    graph.addNode(source);
  }

  // each node has neighbour and coordinate
  for (let i = 0; i < datamap.length; i++) {
    let source = i;
    let sourcecoordinate = datamap[i];

    for (let j = 0; j < cleanadjacencysuperarray[i].length; j++) {
      let destination = cleanadjacencysuperarray[i][j];
      let destinationcoordinate = datamap[cleanadjacencysuperarray[i][j]];
      let distancesourcedestination = Math.hypot(
        destinationcoordinate[1] - sourcecoordinate[1],
        destinationcoordinate[0] - sourcecoordinate[0]
      );

      //console.log(source + " is adjacent to " + destination);
      //console.log(sourcecoordinate, destinationcoordinate);
      //console.log("distance of" + distancesourcedestination);
      graph.addEdge(source, destination, distancesourcedestination);
    }
  }

  //console.log(graph);
  return graph;
}

// function of smoothing
function smoothing(centroidcoordinatearray) {
  drawallcentroids();
  replacecentroids(centroidcoordinatearray);
}


// function to remove all background colors
function removebackgroundcolors() {
  let newselec = d3.selectAll("[background]");
  newselec.remove();
}

//function to manage the impassable mode
function applyimpassablemode() {
  let newselec = d3.selectAll('[isimpassable="yes"]');
  newselec.remove();

  if (impassablemode === "none") {
    impassablemode = "land";
    makealllandimpassable();
  } else if (impassablemode === "land") {
    impassablemode = "water";
    makeallwaterimpassable();
  } else if (impassablemode === "water") {
    impassablecelllist = [];
    impassablemode = "none";
  }

  paintimpassable();
}

// function to make all land impassable
function makealllandimpassable() {
  impassablecelllist = [];
  impassablecelllist.push(...landcelllist);
  impassablecelllist.push(...hillcelllist);
  impassablecelllist.push(...mountaincelllist);
  impassablecelllist.push(...bluemysterycelllist);

  // should be for fulgora only
  impassablecelllist.push(...shallowwatercelllist);
}

// function to make all water impassable
function makeallwaterimpassable() {
  impassablecelllist = [];
  impassablecelllist.push(...watercelllist);
  impassablecelllist.push(...deepwatercelllist);
}

// function to spit the coordinate of the polygon from its ID
function polygonizemyID(cellID) {
  polygon = voronoid.cellPolygon(cellID);
  if (polygon) {
    return polygon;
  } else {
    //console.log("failure detected at cell " + cellID);
    // if no polygon detected, just make a dummy empty triangle at origin
    // it doesn't throw error
    return [
      [0, 0],
      [0, 0],
      [0, 0],
    ];
  }
}

// function to manage the landmasses visibility
function landmassesmanager() {
  if (landmasses === "none") {
    findlandmasses();
    showlandmasses();
    if (landmasseslist.length > 0) {
      landmasses = "visible";
    }
  } else if (landmasses === "hidden") {
    findlandmasses();
    showlandmasses();
    landmasses = "visible";
  } else if (landmasses === "visible") {
    hidelandmasses();
    landmasses = "hidden";
  }
}

// function to show landmasses
function showlandmasses() {
  for (i = 0; i < landmasseslist.length; i++) {
    let diceroll1 = Math.round(255 * Math.random());
    let diceroll2 = Math.round(255 * Math.random());
    let diceroll3 = Math.round(255 * Math.random());

    for (j = 0; j < landmasseslist[i].length; j++) {
      svg
        .append("path")
        .attr("d", voronoid.renderCell(landmasseslist[i][j]))
        .attr(
          "fill",
          "rgb(" + diceroll1 + ", " + diceroll2 + " , " + diceroll3 + ")"
        )
        .attr("isaremovable", "yes")
        .attr("isapaintedcell", landmasseslist[i][j])
        .attr("fill-opacity", 0.3)
        .attr("islandmassoverlay", "yes");
    }
  }
}

// funtion to hide landmasses
function hidelandmasses() {
  let newselec = d3.selectAll("[islandmassoverlay]");
  newselec.remove();
}

// function to draw the shading as a svg
function drawtheshading() {
  // create a path for shading
  // then this will be translated
  // it doesn't need to have the currentnightpos updating anymore and they are 0 when the function is called just once
  pathdargument = d3.path();
  // drawn schematics required for understanding =>
  // x are points designed by "beziercurveto"
  // c are control points duplicated
  // à represent path that slide
  // 0 is origin or path
  //////////////////////////////////////////////////////////////////////
  //x.......c..ààààxàààà..c..............c..ààààxàààà..c......x.......//
  //.........àà.........àà................àà.........àà...............//
  //........à.............à..............à.............à..............//
  //........x.............x..............x.............x..............//
  //........à.............à..............à.............à..............//
  //......àà...............àà..........àà...............àà............//
  //xàààà...c.............c..àààà0àààà...c.............c..ààààx.......//
  //////////////////////////////////////////////////////////////////////
  // needlessly computationnaly expensive, but i wanted to try and use bezier curves

  pathdargument.moveTo(0 + currentnightpos, 0.98 * height);
  pathdargument.bezierCurveTo(
    0.15 * width + currentnightpos,
    0.98 * height,
    0.15 * width + currentnightpos,
    0.98 * height,
    0.15 * width + currentnightpos,
    0.5 * height
  );
  pathdargument.bezierCurveTo(
    0.15 * width + currentnightpos,
    0.05 * height,
    0.15 * width + currentnightpos,
    0.05 * height,
    0.5 * width + currentnightpos,
    0.05 * height
  );
  pathdargument.bezierCurveTo(
    0.85 * width + currentnightpos,
    0.05 * height,
    0.85 * width + currentnightpos,
    0.05 * height,
    0.85 * width + currentnightpos,
    0.5 * height
  );
  pathdargument.bezierCurveTo(
    0.85 * width + currentnightpos,
    0.98 * height,
    0.85 * width + currentnightpos,
    0.98 * height,
    width + currentnightpos,
    0.98 * height
  );
  pathdargument.lineTo(width + currentnightpos, 0);
  pathdargument.lineTo(0 + currentnightpos2, 0);
  pathdargument.lineTo(0 + currentnightpos2, 0.98 * height);
  pathdargument.bezierCurveTo(
    0.15 * width + currentnightpos2,
    0.98 * height,
    0.15 * width + currentnightpos2,
    0.98 * height,
    0.15 * width + currentnightpos2,
    0.5 * height
  );
  pathdargument.bezierCurveTo(
    0.15 * width + currentnightpos2,
    0.05 * height,
    0.15 * width + currentnightpos2,
    0.05 * height,
    0.5 * width + currentnightpos2,
    0.05 * height
  );
  pathdargument.bezierCurveTo(
    0.85 * width + currentnightpos2,
    0.05 * height,
    0.85 * width + currentnightpos2,
    0.05 * height,
    0.85 * width + currentnightpos2,
    0.5 * height
  );
  pathdargument.bezierCurveTo(
    0.85 * width + currentnightpos2,
    0.98 * height,
    0.85 * width + currentnightpos2,
    0.98 * height,
    width + currentnightpos2,
    0.98 * height
  );

  svg
    .append("path")
    .attr("d", pathdargument)
    .attr("opacity", 0.5)
    .attr("fill-color", "black")
    .attr("daynight", true)
    .attr("transform", "translate(0," + currentnightpos + ")");
}

// function drawing circle for "lights" in passable cells at night
function turnonthelights(timecounter) {
  // stagger the update for "lights"

  if (lightmode === "on") {
    if (timecounter % 15 === 0) {
      let newselec2 = d3.selectAll("[ispointsforlight]");
      newselec2.remove();
      //it works but i can't tell why ._groups[0][0]  is necessary??
      let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
      let svg2 = document.getElementById("maincontainer");
      if (newselec) {
        // 3rd version takes only passable cells, and draw 1 path for all points
        // random radius makes a gloow effect with the fast refresh from night moving
        let pathjoiningpointsforlights = d3.path();
        for (let i = 0; i < passablecelllist.length; i++) {
          var pointObj = svg2.createSVGPoint();
          // create fake invisible points with same offset as currentnightpos to check for collision with the translated path that represent night shading
          pointObj.x = -currentnightpos + datamap[passablecelllist[i]][0];
          pointObj.y = datamap[passablecelllist[i]][1];
          if (newselec.isPointInFill(pointObj)) {
            let radius = 3 + Math.round(1 * Math.random());
            pathjoiningpointsforlights.moveTo(
              datamap[passablecelllist[i]][0] + radius,
              datamap[passablecelllist[i]][1]
            );
            pathjoiningpointsforlights.arc(
              datamap[passablecelllist[i]][0],
              datamap[passablecelllist[i]][1],
              radius,
              // with a different start angle it doesn't make a full circle i like the look
              -3,
              1
            );
          }
          //console.log(svg2)
        }

        svg
          .append("path")
          .attr("d", pathjoiningpointsforlights)
          .attr("fill", "yellow")
          .attr("ispointsforlight", "true");
      }
      newselec = 0;
      svg2 = 0;
    }
  } else {
    let newselec2 = d3.selectAll("[ispointsforlight]");
    newselec2.remove();
  }
}

//helper function to identify passable cell
function identifypassable() {
  passablecelllist = [];
  datamap.forEach((element) => {
    if (!impassablecelllist.includes(datamap.indexOf(element))) {
      passablecelllist.push(datamap.indexOf(element));
    }
  });
}


// function to draw the night/day cycle
// that's probably not how one should do an update loop, but for now it do the job
function daynightcycler() {
  // reset time
  timecounter = 0;
  // time of a day in second
  let daynightcycletime = 30;
  // time between each update in millisec (16 for 60 fps)
  let dayticktime = 16;
  // start with recent list not updated for performance
  identifypassable();
  // amount of space to move the overlay each update
  let baseoffset = width / ((daynightcycletime * 1000) / dayticktime);

  // set the time waiting between 2 updates
  let delay = (ms) => new Promise((res) => setTimeout(res, ms));

  //calculate position and size based on user browser window
  currentnightpos = 0;
  currentnightpos2 = currentnightpos - width;
  var daynightFunction = async () => {
    // repeat unless toggled off
    while (daynight === "on") {

      timecounter = (timecounter + 1) % 1000000;
      lightmode = "on";
      // update position
      currentnightpos = (currentnightpos + baseoffset) % width;
      currentnightpos2 = currentnightpos - width;

      // magic
      // why this need be here ?
      let selecdaynight = d3.selectAll("[daynight]")._groups[0][0];
      if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        var firstX = firstXForm.matrix.e,
          firstY = firstXForm.matrix.f;
      }
      if (selecdaynight) {
        selecdaynight.transform.baseVal
          .getItem(0)
          .setTranslate(currentnightpos, 0);
      }
           // call on the lights check each update may be smarter to stagger with % so every 5 updates, 10% of nodes are checked for performance
           turnonthelights(timecounter);
           animatetornadoes(timecounter);

      // wait before update
      await delay(dayticktime);
      // console.log("Waited" + dayticktime + "ms");
    }

    // remove last
    let selecdaynight = d3.selectAll("[daynight]");
    selecdaynight.remove();
    daynight = "off";
    lightmode = "off";
    aretornadoesactive ="off";
    turnonthelights(timecounter);
  };

  // draw a shade shape that will slide to represent nightcycle
  drawtheshading();

  // defining this svg as the selection to be translated
  // magic
  var selecdaynight = d3.selectAll("[daynight]")._groups[0][0];
  var xforms = selecdaynight.transform.baseVal;
  var firstXForm = xforms.getItem(0);

  // actually start the controlled infinite loop
  daynightFunction();
}

// Actual beginning of the script run when the page is loaded

drawingbase(delaunayd, voronoid);
svg.on("click", function (event) {
  clickdetector(event);
});
