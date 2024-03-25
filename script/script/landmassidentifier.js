// there's only 6 functions there but a lot of comment and it's messy
// I thought i would make a function to draw only the contour of landmasses
// to reduce the amount of space occupied in the end result by the shallow water color to match more the source image
// turned out difficult
// first part identifying the different landmasses is done but it feel like spagetthi
// second part identifying non-shared edges sound even more trouble, for now it identify verteces only.
// While the previous is not done instead it just color the different landmasses in their own color.
// ideas for future => give landmasses proceduraly generated name, and try to write it as label using voronoi labeling à la EUIV
// where am i going to write the name when the landmass look like a double donut ?
// maybe just take convex hull and show name only on hover ?
// EUIV famously can't daw properly name in some situation of "border gore" 

// function to find landmasses
function findlandmasses() {
  // doing this once to fasten looking for neighbors
  readadjacency(datamap);
  // reset previous
  passablecelllist = [];
  //function will refill this under form => [[idcell1,idcell2,],[idcell4]] for 2 landmass, one with 2 cell and one with 1.
  landmasseslist = [];
  var todelete = [];
  datamap.forEach((element) => {
    let cellID = datamap.indexOf(element);
    if (!impassablecelllist.includes(cellID)) {
      passablecelllist.push([cellID]);
      landmasseslist.push([cellID]);
    }
  });

  // factorissimo ;)
  // This goes through all array in the landmasslist array
  // find the neighbour of the first cell in the first array  and put them in the same landmasslist[i] array
  // then second neighbour, and will continue the whole array that is being expanded with the neighbour of neighbour
  // then first cell in the following array and repeat
  // it (fail to) make sure to remove the other occurences of them from both the passablecellist and the landmasses list so that they would not be used twice
  // when there is no cell left in the passablecelllist, it means they all have been sorted in the correct array inside the landmasslist array of array
  while (passablecelllist.length > 0) {
    let l = landmasseslist.length;
    for (let i = 0; i < l; i++) {
      for (element of landmasseslist[i]) {
        if (!iselementincluded(element, landmasseslist, i - 1)) {
          let neighbour = adjacencysuperarray[element];
          //[...voronoid.neighbors(element)];
          //console.log(element)

          for (element2 of neighbour) {
            while (
              !iselementincluded(element2, landmasseslist, i) &&
              !impassablecelllist.includes(element2)
            ) {
              landmasseslist[i].push(element2);
              passablecelllist.splice(passablecelllist.indexOf(element2), 1);

              break;
            }
            passablecelllist.splice(passablecelllist.indexOf(element2), 1);
          }
        } else {
          // need to delete element in landmasseslist
          // console.log("yo cell " +[element] + " should be removed from " + [landmasseslist] + " but i suck at doing it" );
          // instead i did this
          todelete.push(element);
          continue;
        }
        continue;
      }
    }
  }
  deleteduplicatelandmass(landmasseslist, todelete);
  console.log(landmasseslist);

  // restore passable cell list for lights to show up
  datamap.forEach((element) => {
    let cellID = datamap.indexOf(element);
    if (!impassablecelllist.includes(cellID)) {
      passablecelllist.push(cellID);
    }
  });
}

// helper function to check if an element is included in array of array
// required to identify landmass 
// is slow and should be avoided 
function iselementincluded(element, arrayofarray, i) {
  let result = false;
  for (let j = 0; j <= i; j++) {
    if (arrayofarray[j].includes(element)) {
      result = true;
    }
  }
  return result;
}

// helper function to delete an element because i couldn't manage otherwise
// required to identify landmass
function deleteduplicatelandmass(landmasseslist, todelete) {
  let l = todelete.length;
  for (let i = l - 1; i >= 0; i--) {
    let l2 = landmasseslist.length;
    for (let j = l2 - 1; j >= 0; j--) {
      // comparing a number with an array containing only that number was difficult, why work with 2 == and not 3 === ?
      if (todelete[i] == landmasseslist[j][0]) {
        //console.log("delete cell "+todelete[i]+" or so called "+landmasseslist[j][0] + " at index " + j)
        landmasseslist.splice(j, 1);
      }
    }
  }
  todelete = [];
  //console.log(landmasseslist);
}

// WIP
//function attempt to highlight the edge of a selection of cells
// more complicated than expected
// ideas for future => for each edges make a mini diamond, and check with .find if both newly created points belong to same landmass to identify
// difficult to write the logic
function showselectionedges() {
  landmassesedgelist = [];
  // started as attempt to find unique edge from cell in subarray
  // really is only partially succedding at vertices
  for (let i = 0; i < landmasseslist.length; i++) {
    for (let j = 0; j < landmasseslist[i].length; j++) {
      let celledges = polygonizemyID(landmasseslist[i][j]);
      //console.log(celledges);

      for (let k = 0; k <= celledges.length - 3; k += 2) {
        console.log(k);
        //&&!landmassesedgelist.includes([celledges[k][1],celledges[k][0]])&&!landmassesedgelist.includes([celledges[k][0],celledges[k][1]]))
        landmassesedgelist.push([celledges[k], celledges[k + 1]]);
        svg
          .append("circle")
          .attr("fill", "red")
          .attr("opacity", 0.5)
          .attr("r", 5)
          .attr("cx", celledges[k][0])
          .attr("cy", celledges[k][1]);
        svg
          .append("text")
          .text(i + " " + j + " " + k)
          .attr("x", celledges[k][0])
          .attr("y", celledges[k][1])
          .attr("font-size", "1em");
      }
    }
  }

  // draw vertices
  console.log(landmassesedgelist);
}

function showlandmassescontour(landmasseslist) {
  // ideas =>
  // pick first landmass

  // first cell

  // is it outside ?=
  // does it have impassable neighbour ? ||
  // does it have a point on the edge of the graph ?
  //
  //then
  //
  // in the list of contour cell, pick one of the the upper most point and draw from there ?
  // which segment ?
  // if segment shared by any of same landmass neighbour => no
  // if no segment, it means we finish with a point that is also shared with a cell, that will be 2nd cell
  //
  let contourtilelist = [];
  for (let i = 0; i < landmasseslist.length; i++) {
    contourtilelist.push([]);
    for (let j = 0; j < landmasseslist[i].length; j++) {
      let cellID = landmasseslist[i][j];
      // replace with adjacencysuperarray if/when called?
      let neighbor = [...voronoid.neighbors(cellID)];
      if (is1neighbournotpassable(neighbor)) {
        // console.log(cellID + " is a contour tile");
        contourtilelist[i].push(cellID);
      } else {
        // other contour tile are those that have a point that have either the x or the y coordinate the same as the bound limit

        let points = [...polygonizemyID(cellID)];
        let haspointonboundary = false;
        for (let k = 0; k < points.length; k++) {
          if (
            points[k][0] == 0 ||
            points[k][0] == width ||
            points[k][1] == 0 ||
            points[k][1] == height
          ) {
            haspointonboundary = true;
          }
        }
        if (haspointonboundary) {
          contourtilelist[i].push(cellID);
          //console.log(cellID + " is also contour tile");
        }
      }
    }
  }
  console.log(contourtilelist);
  //console.log(landmasseslist);
}

// should be possible =>
// on landmass take only the points from contour cell that are unique or that are shared by 2 contour cell
// as the other points on the ladmass must be shared by at least 3 cells including 1 non-contour
// right ?

// function to test if 1 neighbour is not passable
function is1neighbournotpassable(neighboursarray) {
  var atleast1neighbourisnotpassable = false;
  for (element of neighboursarray) {
    if (!passablecelllist.includes(element)) {
      atleast1neighbourisnotpassable = true;
      return atleast1neighbourisnotpassable;
    }
  }
  return atleast1neighbourisnotpassable;
}
