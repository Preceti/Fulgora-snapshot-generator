// svg creation
const svg = d3
  .create("svg")
  .attr("id", "maincontainer")
  .attr("y", UIheight)
  .attr("position", "fixed")
  .attr("display", "block")
  .attr("width", width)
  .attr("height", height);
container.append(svg.node());

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
    .attr("opacity", 0.4);

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
    .attr("stroke-width", 2)
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

// function to paint a bunch of cells that should be grouped as 1 path because they have the same color

function paintallcellfillcolor(colorobject, attributestringarray) {
  let l = attributestringarray.length;
  for (let i = 0; i < l; i++) {
    svg
      .append("path")
      .attr("d", attributestringarray[i])
      .attr("opacity", 1)
      .attr("isaremovable", "no")
      .attr("isapaintedcell", "yes")
      .attr("fill", colorobject.colorscheme[i])
      .attr("background", colorobject.colornames[i])
      // make the mesh stand out has very strong impact on overal look
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.25);
  }
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
    let l = edgelist.length;
    for (let i = 0; i < l - 1; i++) {
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
  let l = datamapinfo.length;
  for (let i = 0; i < l; i++) {
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
    // remove duplicate point we don't need to close the polygon
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
    // accessed for smoothing / "loyd's relaxation"
    centroidcoordinatearray.push([intsumx, intsumy]);
    svg
      .append("circle")
      .attr("fill", "black")
      .attr("opacity", 0.5)
      .attr("r", 3)
      .attr("iscenterofcell", "yes")
      .attr("cx", intsumx)
      .attr("cy", intsumy);
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
    // in fact bobby cheats and draw straight line
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
  let newselecbg = d3.selectAll("[background]");
  newselecbg.remove();
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
    // if no polygon detected, make a dummy triangle in a corner
    // it doesn't throw error
    // this happens when points are generated too close to each other to create a cell originally
    // it may need rounds of relaxation for all of them to appears when many points are on top of each other
    // it's be nice to tell how many points are still hidden
    let diceroll = Math.floor((10 * Math.random()) % 4);
    let dummypolylist = [
      [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, height],
        [0, height],
        [0, height],
      ],
      [
        [width, 0],
        [width, 0],
        [width, 0],
      ],
      [
        [width, height],
        [width, height],
        [width, height],
      ],
    ];

    return dummypolylist[diceroll];
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
  // need be used after landmass identification
  for (let i = 0; i < landmasseslist.length; i++) {
    // pick random value for RGB coloring of a landmass
    let diceroll1 = Math.round(255 * Math.random());
    let diceroll2 = Math.round(255 * Math.random());
    let diceroll3 = Math.round(255 * Math.random());
    // make only 1 path per landmass
    // would be better if countour point was used
    let pathforlandmass = d3.path();

    for (let j = 0; j < landmasseslist[i].length; j++) {
      let cell = polygonizemyID(landmasseslist[i][j]);
      pathforlandmass.moveTo(cell[0][0], cell[0][1]);
      for (let k = 1; k < cell.length - 1; k++) {
        pathforlandmass.lineTo(cell[k][0], cell[k][1]);
      }
    }
    svg
      .append("path")
      .attr("d", pathforlandmass)
      .attr(
        "fill",
        "rgb(" + diceroll1 + ", " + diceroll2 + " , " + diceroll3 + ")"
      )
      .attr("isaremovable", "yes")
      .attr("fill-opacity", 0.3)
      .attr("islandmassoverlay", true);
  }
}

// funtion to hide landmasses
function hidelandmasses() {
  let newseleclandmass = d3.selectAll("[islandmassoverlay]");
  newseleclandmass.remove();
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
// has been damaged by the new landmass overlay in 1 path, it now disappear somehow
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
      animateworms(timecounter,svg)

      // wait before update
      await delay(dayticktime);
      // console.log("Waited" + dayticktime + "ms");
    }

    // remove last
    let selecdaynight = d3.selectAll("[daynight]");
    selecdaynight.remove();
    daynight = "off";
    lightmode = "off";
    aretornadoesactive = false;
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
initUI.color = "passed";
svg.on("mouseup", function (event) {
  clickdetector(event);
});
