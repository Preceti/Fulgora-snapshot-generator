// here are all the functions that are used to process the inputs that will be used by the djiskra algo
// everything related to pathfinding, giving a small adjacency array makes the pathfinding way faster
// this is quite old and probably terrible like yellow and red belts no-module build in factorio


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
  