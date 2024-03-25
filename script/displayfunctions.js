// displayfunctions are the drawing function initiated by user
// whereas drawer is the drawing that is automated in the updateloop

// function called to draw things
function drawingbase(delaunayd, voronoid) {
  // clean everything
  FSG.MAIN.svg.selectAll("*").remove();
  // redraw the mesh
  drawingbasend(delaunayd, voronoid,FSG.MAIN.svg);
  //redraw impassable
  paintimpassable();
}

// function called to draw things ( non destructive )
function drawingbasend(delaunayd, voronoid,svg) {

    if ( FSG.STATE.delaunayd==="on"){
  //create a svg and draw the delaunay triangulation as a path
  drawdelaunayd(delaunayd,svg)}
    if ( FSG.STATE.voronoid ==="on"){
  // draw the voronoi diagram as a path
  svg
    .append("path")
    .attr("d", voronoid.render())
    .attr("stroke", "black")
    .attr("voronoi", true)
    .attr("fill", "none")
    .attr("opacity", 0.4);
    }
    if ( FSG.STATE.delaunaydpoints==="on"){
  // daw the points triangulated by the delaunay
  svg
    .append("path")
    .attr("d", delaunayd.renderPoints(1))
    .attr("fill", "black")
    .attr("ispoints", "true");
    }
    if (FSG.STATE.bound = "on"){
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
}

function drawdelaunayd(delaunayd,svg){
    if ( FSG.STATE.delaunayd==="on"){
        //create a svg and draw the delaunay triangulation as a path
        svg
          .append("path")
          .attr("d", delaunayd.render())
          .attr("stroke", "brown")
          .attr("opacity", 0.25)
          .attr("delaunay", true)
          .attr("fill", "none");
          }

}
// function called to update the "d" path attribute of the delaunayd and voronoid
function updatesvgpathbase (delaunayd ,voronoid){
    if (FSG.STATE.delaunayd==="on"){ 
         let newselec = d3.select("[delaunay]")._groups[0][0];
   // console.log(newselec)
    //newselec.remove();
     newselec.setAttribute("d", delaunayd.render());}
  if (FSG.STATE.voronoid==="on"){
     newselec = d3.select("[voronoi]")._groups[0][0];
 //   console.log(newselec)
    newselec.setAttribute("d",voronoid.render());
   // delaunayd.update();
    //voronoid.update();

}
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

function removedelaunayd (){
    let newselec = d3.select("[delaunay]")._groups[0][0];
newselec.remove();

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
  if (FSG.STATE.isimpassableactivated === true && FSG.STATE.impassablecelllist) {
    for (element of FSG.DATA.impassablecelllist) {
      paintcell(FSG.DATA.impassablecelllist[FSG.DATA.impassablecelllist.indexOf(element)]);
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

// function to paint a bunch of cells that can be grouped as 1 path because they have the same color
function paintallcellfillcolor(colorobject, attributestringarray,svg) {
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
      .attr("stroke-width", FSG.STATE.meshwidth)
      .attr("stroke-opacity", 0.25);
  }
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
  // ideally this should never need to update the adjacency only to display the overlay, it may be better to compute it once after update that change data and keep it at this
  readadjacency(datamap);
  for (let i = 0; i < adjacencysuperarray.length; i++) {
    let neighboured = adjacencysuperarray[i];
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
      .attr("d", voronoid.renderCell(i))
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

// function to draw road to the neighbouring cell
function drawroadtoneighbour(cellID) {
  // clear previous road is there is one
  d3.select("#islatestroadtoneighbour").remove();
  // get array of ID of neighbors
  let neighboured = [...voronoid.neighbors(cellID)];
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

// function to remove all background colors
function removebackgroundcolors() {
  let newselecbg = d3.selectAll("[background]");
  newselecbg.remove();
}

// function to hide landmasses
function hidelandmasses() {
  let newseleclandmass = d3.selectAll("[islandmassoverlay]");
  newseleclandmass.remove();
}
