// function that manage the worms
function Wormsmanager() {
  if (arewormsroaming === true) {
    populateworms();
    animateworms();
  } else {
    console.log(" worms are not alloed to roam ");
  }
}

// function to add some worms
function populateworms() {
  // worm can spawn only in deepwatercell that are at day
  let l = deepwatercelllist.length;
  let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
  let svg2 = document.getElementById("maincontainer");

  // each deepwatercell gets a change to spawn a worm
  for (let i = 0; i < l; i++) {
    // if there isn't already too many worms
    if (activeworm.length < targetwormpopulation) {
      // if the cell isn't occupied by a worm already
      let cellisfreeforworm = true;
      for (let j = 0; j < activeworm.length; j++) {
        if (deepwatercelllist[i] === activeworm[j][0]) {
          cellisfreeforworm = false;
        }
      }
      if (cellisfreeforworm === true) {
        // cell get a  % of chance to spawn
        if (Math.random() > 0.995) {
          // which is validated if the cell is at day
          // costly check last ?
          // test if a cell is at day copy of check made for tornado spawning
          let pointObj = svg2.createSVGPoint();
          pointObj.x = -currentnightpos + datamap[deepwatercelllist[i]][0];
          pointObj.y = datamap[deepwatercelllist[i]][1];
          if (!newselec.isPointInFill(pointObj)) {
            let orientation = Math.floor(4 * Math.random());
            let possibleorientation = ["N", "W", "S", "E"];
            // console.log( "a worm could have been spawned in cell : " + deepwatercelllist[i] );
            // worms are [array] not {object}
            // their property are accessed through element[i]
            activeworm.push([
              // element[0]: position cell id
              deepwatercelllist[i],
              //  element[1]: date of birth
              timecounter,
              //  element[2]: direction faced
              possibleorientation[orientation],
              //  element[3] state of animation
              0,
              //  element[4] target ( same as origin at birth)
              deepwatercelllist[i],
              //  element[5] number of frame left to reach target (frame before moving at birth)
              10,
              // element[6]
              
            ]);
          }
        }
      }
    }
  }

  // console.log(activeworm);
}

// function to animate the worms
function animateworms(timecounter) {
  let staggerer = 50;
  if (arewormsroaming === true) {
    // stagger update for spawning new worm
    if (timecounter % staggerer === 0) {
      populateworms();
    }
    // stagger less the animation of the worms
    if (timecounter % (staggerer / 10) === 0) {
      at_wormsbase(timecounter);
    }
  } else {
    let newselec = d3.selectAll("[isworm]");
    newselec.remove();
    activeworm = [];
  }
}

// function called for worm animation when they just spawn
function at_wormsbase(timecounter) {
  // remove old worms
  // maybe smarter to just update pic ? performance ?
  let newselec2 = d3.selectAll("[isworm]");
  newselec2.remove();
  let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];

  for (element of activeworm) {
    // pick the correct sheet orientation
    switch (element[2]) {
      case "N":
        break;
      case "S":
        break;
      case "E":
        break;
      case "W":
        break;
    }
    //step
    switch (element[3]) {
      case 0:
        wormaligment = element[3];
        element[3] = 1;
        break;

      case 1:
        wormaligment = element[3];
        element[3] = 2;
        break;

      case 2:
        wormaligment = element[3];
        element[3] = 0;
        break;
    }
    // make sure the worm is moving, has a target cell to go to and update the worm position in steps toward its target with an offset added to coordinates
    at_wb_wormspicktarget(element);
    // create a worm at the location of the deepwatercell center of cell

    let originx = datamap[element[0]][0];
    let originy = datamap[element[0]][1];
    let xoffsetforsize = tornadosize / 1.5;
    let yoffsetforsize = tornadosize / 1.5;

    svg
      .append("image")
      .attr("isworm", true)
      .attr("href", "pic/SandWorm" + element[2] + "1.png")
      // worm have same size as tornado for now
      .attr("x", originx - xoffsetforsize)
      .attr("y", originy - yoffsetforsize)
      .attr("height", 1.5 * tornadosize)
      .attr("width", 1.5 * tornadosize)
      .attr("image-rendering", "pixelated")
      .attr("image-rendering", "crisp-edges")
      .attr("viewBox", "0 0 24 24")
      .attr("preserveAspectRatio", alignmentorder[wormaligment])
      .attr("age", timecounter - element[1]);
  }
}

//function called for worm picking a destination
function at_wb_wormspicktarget(element) {
  // if the target cell is the same cell as curent position
  if (element[0] === element[4]) {
    // if the worm has no more frame to reach the center of target cell it's time to move
    if (element[5] === 0) {
      // move
    }
    // if the worm still has some distance to move before needing a new destination cell
    else {
      // update the number of frame left
      element[5] -= 1;
    }
  }

  //console.log(adjacencysuperarray[element[0]]);
}
