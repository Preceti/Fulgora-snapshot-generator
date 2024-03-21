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
              // element[6] number of total frame for this path
              20,
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
    // make sure the worm is moving, has a target cell to go to and update the worm position in steps toward its target with an offset added to coordinates
    let xoffsetforsize = tornadosize / 1.5;
    let yoffsetforsize = tornadosize / 1.5;

    // also does orientation ?
    let futurepos = at_wb_wormspicktarget(element);
    if (element === activeworm[activeworm.length - 1]) {
      // draw path with different ID here to have a sticky path of a worm for debug
      /*
     svg
     .append("image")
     .attr("iswormfortest", true)
    .attr("href", "pic/SandWorm" + element[2] + "1.png")
    // worm have same size as tornado for now
     .attr("x", futurepos[0] - 1 * xoffsetforsize)
     .attr("y", futurepos[1] - 1 * yoffsetforsize)
     .attr("height", 1.5 * tornadosize)
     .attr("width", 1.5 * tornadosize)
     .attr("image-rendering", "pixelated")
     .attr("image-rendering", "crisp-edges")
     .attr("preserveAspectRatio", alignmentorder[wormaligment])
     .attr("age", timecounter - element[1]);
    
*/
      // console.log(" last worm did a thing")
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
    // console.log (element[2])
    svg
      .append("image")
      .attr("isworm", true)
      .attr("href", "pic/SandWorm" + element[2] + "1.png")
      // worm have same size as tornado for now
      .attr("x", futurepos[0] - 1 * xoffsetforsize)
      .attr("y", futurepos[1] - 1 * yoffsetforsize)
      .attr("height", 1.5 * tornadosize)
      .attr("width", 1.5 * tornadosize)
      .attr("image-rendering", "pixelated")
      .attr("image-rendering", "crisp-edges")
      .attr("preserveAspectRatio", alignmentorder[wormaligment])
      .attr("age", timecounter - element[1]);
  }
}

//function called for worm picking a destination
function at_wb_wormspicktarget(element) {
  // defined here as potentially worms can have different speed ?
  // unit is pixel moved between 2 animation frame
  // should be set related to size of worm once stable, itself related to size of tornado itself based on average cell area
  let wormmovingspeed = 2*(tornadosize / 10);
  // if the worm has no more frame to reach destination
  if (element[5] === 1) {
    // make old target as as origin for next path
    element[0] = element[4];
    //pick a new neighbouring tile for target destination
    // maybe avoid landmass ? so they look more animated of intent ?
    // adjacency array per force ? type of entity ? swimmer / walker / flyer ?

    let diceroll = Math.floor(
      adjacencysuperarray[element[0]].length * Math.random()
    );
    element[4] = adjacencysuperarray[element[0]][diceroll];

    // make things clear for human
    let originx = datamap[element[0]][0];
    let originy = datamap[element[0]][1];
    let targetx = datamap[element[4]][0];
    let targety = datamap[element[4]][1];
    let dx = targetx - originx;
    let dy = targety - originy;

    // Math for where worm is looking
    // negative sign due to y increasing when going DOWN in the svg system of coordinate
    let theta = Math.atan2(dx, -dy); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)

    function orientation(theta, element2) {
      // pick the correct sheet orientation given the angle in degree where 0 is north is there is one
      if (theta) {
        if (theta >= 347.5 || theta < 22.5) {
          element[2] = "N";
          //  console.log("N");
        } else if (theta >= 22.5 && theta < 67.5) {
          element[2] = "NE";
          //  console.log("NE");
        } else if (theta >= 67.5 && theta < 112.5) {
          element[2] = "E";
          //  console.log("E");
        } else if (theta >= 112.5 && theta < 157.5) {
          element[2] = "SE";
          // console.log("SE");
        } else if (theta >= 157.5 && theta < 202.5) {
          element[2] = "S";
          //  console.log("S");
        } else if (theta >= 202.55 && theta < 247.5) {
          element[2] = "SW";
          // console.log("SW");
        } else if (theta >= 247.5 && theta < 302.5) {
          element[2] = "W";
          // console.log("W");
        } else if (theta >= 302.5 && theta < 347.5) {
          element[2] = "NW";
          // console.log("NW");
        } else {
          console.log("something wrong happened error");
        }
        // return the letters needed to finish the name of the image that just got computed
        return element[2];
      }
      // return the letters needed to finish the name of the image that were there already
      else return element2;
    }
    // pick the correct sheet orientation given the angle in degree where 0 is north is there is one
    element[2] = orientation(theta, element[2]);

    // calculate distance to target cell
    let distancetotarget = Math.hypot(dx, dy);

    // calculate how many frame to reach target based on worms moving speed and set it as current and total
    element[5] = Math.ceil(distancetotarget / wormmovingspeed);
    element[6] = Math.ceil(distancetotarget / wormmovingspeed);

    // take the segment between origin cell and target cell center and divide it into equal segment the length of the worm speed
    // position is going to be each point successively
    // ex: if path is long enough for 12 time the distance the worm moves between 2 updates
    // then element[6] and [5] are set to 12, and element [5] will be decreased each update 11 10 9 8 7 6 ... switching position between the 12 intermediates
    // lerp function defined in noises.js
    let nextx = Math.lerp(originx, targetx, 1 - element[5] / element[6]);
    let nexty = Math.lerp(originy, targety, 1 - element[5] / element[6]);
    // supposedly this will only be read when [5]=[6] and yield origin coordinate
    return [nextx, nexty];
  }
  // if the worm still has some distance to move before needing a new destination cell
  // most of the time worms is not picking a new destination
  else {
    // update the number of frame left
    element[5] = element[5] - 1;

    // calculate future position
    let originx = datamap[element[0]][0];
    let originy = datamap[element[0]][1];
    let targetx = datamap[element[4]][0];
    let targety = datamap[element[4]][1];
    let nextx = Math.lerp(originx, targetx, 1 - element[5] / element[6]);
    let nexty = Math.lerp(originy, targety, 1 - element[5] / element[6]);

    return [nextx, nexty];
  }
}
