// generic definition and initialization
// svg definition : bounding box
// this is fit to small notebook
const width = 1350;
const height = 550;
//you can change this number to change the number cell at start
const numberofcellsatstart = 100;
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
var adjacencysuperarray = [];
var isbackgroundcoloractivated = false;
// list of type of cells
var icecelllist = [];
var watercelllist = [];
var landcelllist = [];
var shallowwatercelllist = [];
var deepwatercelllist = [];
var mountaincelllist = [];
var tundracelllist = [];
var hillcelllist = [];
var grasscelllist = [];
var bluemysterycelllist=[];

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
  bluemystery :"#006299",
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

// svg creation
const svg = d3
  .create("svg")
  .attr("id", "test1")
  .attr("width", width)
  .attr("height", height);
container.append(svg.node());

// keyboard detector
d3.selectAll("*").on("keydown", function () {
  keybeingpressed = event.key;
});

// keyboard resetor
d3.selectAll("*").on("keyup", function () {
  keybeingpressed = null;
});

// click detector
// letters are used to call function for now
// first row, draw
function clickdetector(event) {
  //a call the function to add a new point
  if (keybeingpressed == "a") {
    newpoints(event);
    drawingbase(delaunayd, voronoid);
    if (isbackgroundcoloractivated == true) {
      fbackgroundcolors();
    }
  }

  // z smooth the graph
  if (keybeingpressed == "z") {
    drawallcentroids();
    replacecentroids(centroidcoordinatearray);
    graph = makegraph(datamap);
    if (isbackgroundcoloractivated == true) {
      fbackgroundcolors();
    }
  }

  // e paint an overlay on the cell to show it has been made "impassable terrain"

  if (keybeingpressed == "e") {
    markimpassable(whichcell(event));
  }
  // r highlight edges of clicked cell and write its ID

  if (keybeingpressed == "r") {
    draw1cell(whichcell(event));
    writecellID(event);
  }

  // t paint all cells in a gradiant of red based on their area
  if (keybeingpressed == "t") {
    paintallcellbasedontheirarea();
  }
  //y draw all centroids
  if (keybeingpressed == "y") {
    drawallcentroids();
  }
  //u replace earlier random points with new centroids and redo the voronoi diagram
  if (keybeingpressed == "u") {
    replacecentroids(centroidcoordinatearray);
  }

  //i draw a road to neighbouring cell
  if (keybeingpressed == "i") {
    drawroadtoneighbour(whichcell(event));
  }

  //o first select a cell as origin, then second click draw path from origin to target
  // lazy optimist
  if (keybeingpressed == "o") {
    pathfindclicker(whichcell(event));
  }

  //p first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed == "p") {
    pathfindclicker2(whichcell(event));
  }

  //p first select a cell as origin, then second click draw path from origin to target
  // graph attempt
  if (keybeingpressed == "m") {
    pathfindclicker3(whichcell(event));
  }
  // l to draw background colors
  if (keybeingpressed == "l") {
    if (isbackgroundcoloractivated === true) {
      isbackgroundcoloractivated = false;
      removebackgroundcolors();
    } else {
      isbackgroundcoloractivated = true;
      fbackgroundcolors();
    }
  }
  // second row, write
  // q tell in the console the ID of the clicked cell
  if (keybeingpressed == "q") {
    console.log(whichcell(event));
  }
  // s tell in the console the area of the clicked cell
  if (keybeingpressed == "s") {
    console.log(d3.polygonArea(polygonizemyID(whichcell(event))));
  }

  // log in adjacency array

  if (keybeingpressed == "d") {
    console.log(readadjacency(datamap));
  }
  // log in distance to other tiles

  if (keybeingpressed == "f") {
    //readdistancetothertile(datamap, whichcell(event));
    makegraph(datamap);
  }
}

// random data to illustrate
var datamap = Array.from({ length: numberofcellsatstart }).map(() => {
  return [
    Math.round(width * Math.random()),
    Math.round(height * Math.random()),
  ];
});

// create delaunay triangulation for array of points
var delaunayd = d3.Delaunay.from(datamap);

//create a voronoi diagram from the previous delaunay triangulation
var voronoid = delaunayd.voronoi([0, 0, width, height]);

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
    .attr("fill", "none");

  // draw the voronoi diagram as a path
  svg
    .append("path")
    .attr("d", voronoid.render())
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("opacity", 0.5);

  // daw the points triangulated by the delaunay
  svg.append("path").attr("d", delaunayd.renderPoints(1)).attr("fill", "black");

  // draw the rectangle bound of the voronoid diagram
  svg
    .append("path")
    .attr("d", voronoid.renderBounds())
    .attr("stroke", "black")
    .attr("opacity", 1)
    .attr("fill", "none");
}

// function called to draw additionnal things
function drawingpoints(mouse) {
  svg
    .append("circle")
    .attr("fill", "black")
    .attr("opacity", 0.5)
    .attr("r", 1)
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
    .attr("font-size", "0.5em");
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
  for (element of impassablecelllist) {
    paintcell(impassablecelllist[impassablecelllist.indexOf(element)]);
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
  while (iscellincluded == true) {
    removeimpassable(cellID);

    break;
  }
  while (iscellincluded == false) {
    makeimpassable(cellID);

    break;
  }
  return;
}

// function to make impassable
function makeimpassable(cellID) {
  // add it to the list
  impassablecelllist.push(cellID);
  console.log("list of impassable tile = " + impassablecelllist);
  // paint it
  paintcell(cellID);
}

// function to remove impassable
function removeimpassable(cellID) {
  // remove it from the list
  impassablecelllist.splice(impassablecelllist.indexOf(cellID), 1);
  console.log("list of impassable tile = " + impassablecelllist);
  // unpaint it

  let newselec = d3.selectAll("#name" + cellID + '[isimpassable="yes"]');
  newselec.remove();

  return;
}

// function to remove 1 impassable
function removelastimpassable(cellID) {
  // remove it from the list
  impassablecelllist.splice(impassablecelllist.indexOf(cellID), 1);
  console.log("list of impassable tile = " + impassablecelllist);
}

// function to highlight the edge of a cell
function draw1cell(cellID) {
  svg
    .append("polygon")
    .attr("points", voronoid.cellPolygon(cellID))
    .attr("isaremovable", "yes")
    .attr("isapaintedcell", cellID)
    .attr("fill-opacity", 0)
    .attr("opacity", 1)
    .attr("stroke", "green")
    .attr("stroke-width", 4);
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
  // update all value in the array so that the largest cell is given a weight of 100 and the other proportionnal to it
  for (let i = 0; i < datamapinfo.length; i++) {
    datamapinfo[i] = 0 + Math.floor((datamapinfo[i] / largestcell) * 100);
  }
  // paint all the cell with gradient from largest cell

  for (let i = 0; i < datamapinfo.length; i++) {
    svg
      .append("path")
      .attr("d", voronoid.renderCell(i))
      .attr("opacity", 1 - datamapinfo[i] / 100)
      .attr("fill", "red");
  }
  //console.log(largestcell);
  //console.log(datamapinfo);
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
    intsumx =
      xforcentroid.reduce((a, b) => a + b, 0) /
      centroidcoordinatearrayrough[j].length;
    intsumy =
      yforcentroid.reduce((a, b) => a + b, 0) /
      centroidcoordinatearrayrough[j].length;
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
// first version deprecated
function pathfindclicker(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasorigin != "none") {
    console.log("origin was " + hasorigin);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasorigin][0], datamap[hasorigin][1]);
    //set the target
    hastarget = cellID;
    console.log("target is now " + hastarget);

    // function to find a path between the cell whose ID is hasorigin and the cell whose ID is hastarget
    var celltovisit = pathfind(hasorigin, hastarget);
    // pathfind error handling (i'm not proud)
    if (celltovisit == undefined) {
      console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      console.log("path is going through cells " + celltovisit);

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
      console.log("origin is now " + hasorigin);
      return;
    }
  }

  // if no origin, set origin,
  if (hasorigin == "none") {
    hasorigin = cellID;
    console.log("origin set as " + cellID);
    //make sure there is no target in case it's the 3rd click and not the first
    hastarget = "none";
  }
}

// function to draw path from the origin to target , or to select an origin if there was none
// 2nd version sligthly better
function pathfindclicker2(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasoriginp != "none") {
    console.log("origin was " + hasoriginp);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasoriginp][0], datamap[hasoriginp][1]);
    //set the target
    hastargetp = cellID;
    console.log("target is now " + hastargetp);
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
      console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      console.log("path is going through cells " + celltovisit);

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
      console.log("origin is now " + hasoriginp);
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

    console.log("origin set as " + cellID);
    //make sure there is no target in case it's the 3rd click and not the first
    hastargetp = "none";
    let newselec = d3.selectAll('[isatargetforpath="yes"]');
    console.log(newselec);
    newselec.remove();
  }
}

// function to draw path from the origin to target , or to select an origin if there was none
// 3rd version with djiskra
function pathfindclicker3(cellID) {
  // if there is already an origin this click is a 2nd click designating a target
  if (hasoriginp != "none") {
    console.log("origin was " + hasoriginp);
    // set the origin for path
    var pathdargumentinit = d3.path();
    pathdargumentinit.moveTo(datamap[hasoriginp][0], datamap[hasoriginp][1]);
    //set the target
    hastargetp = cellID;
    console.log("target is now " + hastargetp);
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
    if (celltovisit == undefined) {
      console.log("bobbynofindo");
      return;
    } else {
      // tell which cell are going to be drawn as the path
      console.log("path is going through cells " + celltovisit);

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
      console.log("origin is now " + hasoriginp);
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

    console.log("origin set as " + cellID);
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

    /*

    // first compute crow fly distance between origin and target to use as guidance
    var crowflydistance = Math.sqrt(
      (targety - originy) ** 2 + (targetx - originx) ** 2
    );

    */

    // here remove forbidden neighbour => impassable terrain and such

    // search the neighbor of the origin
    var neighboured = [...voronoid.neighbors(origincellid)];
    console.log(
      "before removal , neighbour list of " +
        origincellid +
        " is " +
        neighboured
    );

    // list all impassable neighbour
    var badneighbour = neighboured.filter((element) =>
      impassablecelllist.includes(element)
    );
    console.log(
      "the bad neighbour due to impassability of " +
        origincellid +
        " are " +
        badneighbour
    );
    //list all visited neighbour
    var visitedneighbour = neighboured.filter((element) =>
      cellvisited.includes(element)
    );

    console.log(
      "the bad neighbour due to already visited of " +
        origincellid +
        " are " +
        visitedneighbour
    );

    // should also prevent revisiting a tile here
    // and remove visited tile as bad neighbour to prevent back and forth in cul de sac
    // need a way to tell when destination can't be reached, like 100 attempts or so.
    // djiskra ? with distance computed from center instead of 1 for next tile ?

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
    if (bestneighbour == undefined) {
      console.log("boy no push");
      return;
    } else {
      console.log(bestneighbour);
      origincellid = bestneighbour;
      celltovisit.push(origincellid);
    }
  }
  if (celltovisit) {
    console.log("bobby visit" + celltovisit);
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
  const graph = new Graph();
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

//Rules manager for background colors
function fbackgroundcolors() {
  // first remove everything as nothing should be drawn under background
  svg.selectAll("*").remove();
  // then draw background if needed
  if (isbackgroundcoloractivated === true) {
    // clean default tile
    watercelllist = [];
    icecelllist = [];
    landcelllist = [];
    shallowwatercelllist = [];
    mountaincelllist = [];
    deepwatercelllist = [];
   hillcelllist=[];
   bluemysterycelllist=[];

    /*
    //prepare array for coloration
    // area is needed for land and moutain initially
    let cellareaarray = [];
    for (element of datamap) {
      cellareaarray.push(
        d3.polygonArea(polygonizemyID(datamap.indexOf(element)))
      );
    }
    let averagecellarea = average(cellareaarray);
    // this is not used anymore
    */

    let averagecellarea = (height * width) / numberofcellsatstart;

    // iterate through each cell
    for (element of datamap) {
      // apply rules
      // no ice on Fulgora
      // ruleforice(element);
      ruleforland(element, averagecellarea);
      ruleforwater(element);
    }
  
  
    for (element of datamap) {
      // it doesn't work when put in the previous loop
      ruleformountain(element);
    }
    //same :( i notice this must be terribly innefficient way of doing as the more i add the slower it gets to do the garbage collection when it eventually starts
    // even later deep water

    for (element of datamap) {
      ruleforhills(element);
     
    }

   // for whatever reason this one shallow water need to be launched after rule for water otherwise the first one isn't finished and some tile aren't made shallow when they should
   for (element of datamap) {
    
    ruleforshallowwater(element);
   
  }


  for (element of datamap) {
    rulefordeepwater(element);
  }
  for (element of datamap) {
    ruleforbluemystery(element);
  }

    // redraw things once at the end, above it all as we just did background color
    drawingbasend(delaunayd, voronoid);
    paintimpassable();
  }
}

// Actual rules for background colors
//
//ice
//cells located in the 10% upper and lower part of the map are receiving "ice color"
function ruleforice(element) {
  if (
    element[1] > 0.97 * height ||
    element[1] < 0.03 * height ||
    icecelllist.includes(datamap.indexOf(element))
  ) {
    paintcellfillcolor(datamap.indexOf(element), planet.ice, "ice");
    if (!icecelllist.includes(datamap.indexOf(element))) {
      icecelllist.push(datamap.indexOf(element));
    }
  } else {
    if (icecelllist.includes(datamap.indexOf(element))) {
      icecelllist.splice(datamap.indexOf(element), 1);
    }
  }
}

// land
//
function ruleforland(element, averagecellarea) {
  // amongst valid candidate
  if (element[1] < 0.96 * height && element[1] > 0.04 * height) {
    // exclude some for lake or mountains
    // calculate area of the cell
    let elementarea =
      -1 * d3.polygonArea(polygonizemyID(datamap.indexOf(element)));
    if (
      elementarea < ratiotonormalcell * averagecellarea &&
      !landcelllist.includes(datamap.indexOf(element))
    ) {
      landcelllist.push(datamap.indexOf(element));
    }
  }

  if (landcelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.land, "land");
  }
}

/* old mountain
// mountains
// some large land tiles
// could be if all neighbour are land before dicerolling
// then some of neighbour would become hills

function ruleformountain (element){
  if (landcelllist.includes(datamap.indexOf(element))) {
    console.log("i tried")
    let diceroll = Math.random();
    
    if (diceroll <= 0.02) {
      landcelllist.splice(landcelllist.indexOf(element), 1);
      if (!mountaincelllist.includes(datamap.indexOf(element))) {
        mountaincelllist.push(datamap.indexOf(element));
      }
    }
  }
  if (mountaincelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.mountain, "mountain");
  }


}
*/

function ruleformountain(element) {
  if (
    areallneighbourland(element) &&
    landcelllist.includes(datamap.indexOf(element)) &&
    !mountaincelllist.includes(datamap.indexOf(element))
  ) {
    mountaincelllist.push(datamap.indexOf(element));
    landcelllist.splice(landcelllist.indexOf(datamap.indexOf(element)), 1);
  }

  if (mountaincelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.mountain, "mountain");
  }
}

// function to test if all neighbour are land
function areallneighbourland(cellID) {
  let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];

  var allneighbourareland = true;
  for (element of neighboured) {
    // actually hills and other mountains are also land
    if (!landcelllist.includes(element)) {
      if (!hillcelllist.includes(element)) {
        if (!mountaincelllist.includes(element)) {
          allneighbourareland = false;
        }
      }
    }
  }
  neighboured = [];

  return allneighbourareland;
}

// water is the default
// some of the ice tile are turned into water, and all the empty tile too
function ruleforwater(element) {
  if (icecelllist.includes(datamap.indexOf(element))) {
    let diceroll = Math.random();
    if (diceroll <= 0.3) {
      icecelllist.splice(icecelllist.indexOf(element), 1);
      if (!watercelllist.includes(datamap.indexOf(element))) {
        watercelllist.push(datamap.indexOf(element));
      }
    }
  } else {
    if (!landcelllist.includes(datamap.indexOf(element))) {
      if (!watercelllist.includes(datamap.indexOf(element))) {
        watercelllist.push(datamap.indexOf(element));
      }
    }
  }

  if (watercelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.water, "water");
  }
}

// shallow water
// is done after water which is the fill for empty tile
// aim : any tile that is water and touching a coast

function ruleforshallowwater(element) {
  // for each neighbour check if it's land and if tile is not  already shallow water
  if (
    hassomelandneighbour(element) &&
    watercelllist.includes(datamap.indexOf(element)) &&
    !shallowwatercelllist.includes(datamap.indexOf(element))
  ) {
    shallowwatercelllist.push(datamap.indexOf(element));
    watercelllist.splice(watercelllist.indexOf(datamap.indexOf(element)), 1);
  }

  if (shallowwatercelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(
      datamap.indexOf(element),
      planet.shallowwater,
      "shallowwater"
    );
  }
}
//function to test if the cell as some land neighbour

function hassomelandneighbour(cellID) {
  let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];

  var hassomelandneighbour = false;
  for (element of neighboured) {
    if (landcelllist.includes(element)||hillcelllist.includes(element)||mountaincelllist.includes(element)) {
      hassomelandneighbour = true;
    }
  }
  return hassomelandneighbour;
}

// hills
// if there is a mountain neighbour a diceroll

function ruleforhills(element) {
  // for each neighbour check if it's land and if tile is not  already shallow water
  if (
    hassomemountainneighbour(element) &&
    landcelllist.includes(datamap.indexOf(element)) &&
    !hillcelllist.includes(datamap.indexOf(element)) &&
    !mountaincelllist.includes(datamap.indexOf(element))
  ) {
    hillcelllist.push(datamap.indexOf(element));
    landcelllist.splice(landcelllist.indexOf(datamap.indexOf(element)), 1);
    
    
  } 
  if (hillcelllist.includes(datamap.indexOf(element))&&!(hassomemountainneighbour(element))) {
    console.log(hassomemountainneighbour(element))
    hillcelllist.splice(hillcelllist.indexOf(datamap.indexOf(element)), 1);
    landcelllist.push(datamap.indexOf(element));

    paintcellfillcolor(datamap.indexOf(element), planet.land, "land");
  }

  if (hillcelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.hills, "hills");
  }
}

//function to test is the cell has some mountain neighbors
function hassomemountainneighbour(cellID) {
  let neighboured = [...voronoid.neighbors(datamap.indexOf(cellID))];

  var hassomemountainneighbour = false;
  for (element of neighboured) {
    if (mountaincelllist.includes(element)) {
      hassomemountainneighbour = true;
    }
  }

  return hassomemountainneighbour;
}

// deep water
// water whose only connexion is other water

function rulefordeepwater(element) {
  if (
    areallneighbourarewater(element) &&
    watercelllist.includes(datamap.indexOf(element)) &&
    !deepwatercelllist.includes(datamap.indexOf(element))
  ) {
    deepwatercelllist.push(datamap.indexOf(element));
    watercelllist.splice(watercelllist.indexOf(datamap.indexOf(element)), 1);
  }

  if (deepwatercelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(datamap.indexOf(element), planet.deepwater, "deepwater");
  }
}

// function to test if all neighbour are water
function areallneighbourarewater(element) {
  let neighboured = [...voronoid.neighbors(datamap.indexOf(element))];
  let allneighbourarewater = true;
  for (element of neighboured) {
    if (
      !watercelllist.includes(element) &&
      !deepwatercelllist.includes(element)
    ) {
      allneighbourarewater = false;
    }
  }
  neighboured = [];
  return allneighbourarewater;
}

// function for the bluemystery

function ruleforbluemystery (element){


  if( mountaincelllist.includes(datamap.indexOf(element))){
    
    let diceroll = Math.random();
        if (diceroll <= 0.9) {
      mountaincelllist.splice(mountaincelllist.indexOf(datamap.indexOf(element),1))
      bluemysterycelllist.push(datamap.indexOf(element))
     
    }   
  }

  if (hillcelllist.includes(datamap.indexOf(element))){
    console.log("all good")
    let diceroll = Math.random();
       if (diceroll <= 0.9) {
    hillcelllist.splice(hillcelllist.indexOf(datamap.indexOf(element),1))
    bluemysterycelllist.push(datamap.indexOf(element))}
   
  }
  if (bluemysterycelllist.includes(datamap.indexOf(element))) {
    paintcellfillcolor(
      datamap.indexOf(element),
      planet.bluemystery,
      "bluemystery"
    );
  }



}

// function to remove all background colors
function removebackgroundcolors() {
  let newselec = d3.selectAll("[background]");
  newselec.remove();
}

// function to spit the coordinate of the polygon from its ID
function polygonizemyID(cellID) {
  polygon = voronoid.cellPolygon(cellID);
  if (polygon) {
    return polygon;
  } else {
    console.log("failure detected at cell " + cellID);
    // if no polygon detected, just make a dummy empty triangle at origin
    return [
      [0, 0],
      [0, 0],
      [0, 0],
    ];
  }
}

// Actual beginning of the script run when the page is loaded
drawingbase(delaunayd, voronoid);

svg.on("click", function (event) {
  clickdetector(event);
});
