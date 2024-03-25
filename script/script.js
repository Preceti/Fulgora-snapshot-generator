
// function to draw all center as the centroids
function drawallcentroids(datamap,svg) {
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
    // accessed for smoothing / "loyd's relaxation" not sure it's properly implemented and not just something that look like
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

// function to calculate all centroids
function updatecentroid(){ 
  // create empty array to store data
  var centroidcoordinatearrayrough = [];
   FSG.DATA.centroidcoordinatearray = [];
  // iterate each cell and put the coordinate of each edge of each cell in an array
  for (let i = 0; i < FSG.DATA.datamap.length; i++) {
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

    FSG.DATA.centroidcoordinatearray.push([intsumx, intsumy]);
   

  }
 // console.log(centroidcoordinatearray)
}
// replace datamap by centroids
function replacedatamapwithcentroids (){
  for (i = 0; i < FSG.DATA.centroidcoordinatearray.length; i++) {
    FSG.DATA.datamap[i]=FSG.DATA.centroidcoordinatearray[i];
  }
  FSG.MAIN.delaunayd = d3.Delaunay.from(FSG.DATA.datamap);
  FSG.MAIN.voronoid = FSG.MAIN.delaunayd.voronoi([0, 0, FSG.MAIN.width, FSG.MAIN.height]);
 //delaunayd.update();
 //voronoid.update(); 
// console.log(delaunayd ,voronoid) 
// if doing the non destructive version it look mesmerizing
 // drawingbasend(delaunayd, voronoid);
// drawingbase(delaunayd, voronoid);

}
// replace datamap by centroids
function justreplacedatamapwithcentroids (){
  for (i = 0; i < centroidcoordinatearray.length; i++) {
    datamap[i]=centroidcoordinatearray[i];
  }
}


// function used to replace the random points by the centroids
function replacecentroids(centroidcoordinatearray,width,height) {
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


// function that is used to create adjacency list
function redoadjacency(datamap,voronoid) {
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


// function to spit the coordinate of the polygon from its ID
function polygonizemyID(cellID) {
  polygon = FSG.MAIN.voronoid.cellPolygon(cellID);
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
        [0, FSG.MAIN.height],
        [0, FSG.MAIN.height],
        [0, FSG.MAIN.height],
      ],
      [
        [FSG.MAIN.width, 0],
        [FSG.MAIN.width, 0],
        [FSG.MAIN.width, 0],
      ],
      [
        [FSG.MAIN.width, FSG.MAIN.height],
        [FSG.MAIN.width, FSG.MAIN.height],
        [FSG.MAIN.width, FSG.MAIN.height],
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
  // need be used only after landmass identification
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





// Actual beginning of the script run when the page is loaded

drawingbase(FSG.MAIN.delaunayd, FSG.MAIN.voronoid);
FSG.STATE.color = "passed";
FSG.MAIN.svg.on("mouseup", function (event) {
  FSG.ITF.clickdetector(event,FSG.DATA.datamap);
});
