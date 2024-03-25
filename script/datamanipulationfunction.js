// this is every functions that can be called that will modify either
// the location of points of datamap
// the status of cells impassable / water 
// some function also make visible the change they did, but they belong here, only function that DO NOT ALTER state = purely overlay goes into displayfunctions



// function to add a new points
function newpoints(event,datamap) {
    var mouse = d3.pointers(event);
    console.log(mouse)
   FSG.DATA.datamap.push([mouse[0][0], mouse[0][1]]);
   // delaunayd.update();
   // voronoid.update();
    FSG.MAIN.delaunayd = d3.Delaunay.from(datamap);
    FSG.MAIN.voronoid = FSG.MAIN.delaunayd.voronoi([0, 0, FSG.MAIN.width, FSG.MAIN.height]);
  }

  // function to know which cell was clicked
function whichcell(event) {
    var mouse = d3.pointers(event);
    cellID = delaunayd.find(mouse[0][0], mouse[0][1]);
    return cellID;
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
  

  //helper function to identify passable cell
function identifypassable() {
    FSG.DATA.passablecelllist = [];
    FSG.DATA.datamap.forEach((element) => {
      if (!FSG.DATA.impassablecelllist.includes(FSG.DATA.datamap.indexOf(element))) {
        FSG.DATA.passablecelllist.push(FSG.DATA.datamap.indexOf(element));
      }
    });
  }
  