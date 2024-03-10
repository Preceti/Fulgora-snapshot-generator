// function to manage when to activate the tornadoes
function tornadomanager() {
  if (!aretornadoesactive) {
    // first setup conditions for sandstorm :
    if (!isbackgroundcoloractivated || isbackgroundcoloractivated) {
      isbackgroundcoloractivated = true;
      fbackgroundcolors();
    }
    if (impassablemode != "water" || impassablemode === "water") {
      impassablecelllist = [];
      let newselec = d3.selectAll('[isimpassable="yes"]');
      newselec.remove();
      makeallwaterimpassable();
      identifypassable();
      impassablemode = "water";
      paintimpassable();
    }
    if (isimpassableactivated === true || isimpassableactivated != true) {
      isimpassableactivated = false;
      hideimpassableterrain();
    }
    if (landmasses) {
      landmasses = "none";
      landmassesmanager();
    }
    if (ambiantsound != "playing") {
      ambiantsound = "playing";
      customrepeatplay(FulgoraThunder);
      customrepeatplay(FulgoraWind);
    }

    if (daynight === "off") {
      daynight = "on";
      daynightcycler();
    }
    // put some cellID in the list of cell that are spawning a tornado for init
    repopulatetornadoes();

    aretornadoesactive = true;
  }
  // stop the tornadoes
  else {
    if (daynight === "on") {
      daynight = "off";
      daynightcycler();
    }

    deactivatetornadoes();
    
  }
}

// manage tornadoes existence
function repopulatetornadoes() {
  let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
  let svg2 = document.getElementById("maincontainer");

  //generate baby tornado
  for (let i = 0; i < impassablecelllist.length; i++) {
    // on tiles that are not already baby tornado or regular tornado or old tornado
    if (
      !tornadoprespawner.includes(impassablecelllist[i]) &&
      !tornadospawner.includes(impassablecelllist[i]) &&
      !tornadopostspawner.includes(impassablecelllist[i])
    ) {
      // test if a cell is at night
      let pointObj = svg2.createSVGPoint();
      pointObj.x = -currentnightpos + datamap[impassablecelllist[i]][0];
      pointObj.y = datamap[impassablecelllist[i]][1];
      if (newselec.isPointInFill(pointObj)) {
        // if so there is a chance to spawn a tornado
        diceroll = Math.random();
        if (diceroll <= 0.05) {
          // if so it can be either a S-class tornado or a T-class baby tornado which correspond to different sprite sheet
          let secondroll = Math.round(2 * Math.random());
          if (secondroll > 0.5) {
            tornadoprespawner.push([impassablecelllist[i], 9, "S"]);
          } else {
            tornadoprespawner.push([impassablecelllist[i], 9, "T"]);
          }
        }
      }
    }
  }

  // remove some tornadoes that are no longer at night
  for (let i = 0; i < tornadospawner.length; i++) {
    let pointObj = svg2.createSVGPoint();
    pointObj.x = -currentnightpos + datamap[tornadospawner[i]][0];
    pointObj.y = datamap[tornadospawner[i]][1];
    // if fake point is at not at night neither is true point
    if (!newselec.isPointInFill(pointObj)) {
      let diceroll = Math.random();
      if (diceroll > 0.3) {
        // tornado become old tornado
        tornadopostspawner.push([tornadospawner[i], 9]);
        tornadospawner.splice(i, 1);
      }
    } else {
      let diceroll = Math.random();
      // also remove some tornadoes that are still at night, but very few, this is to avoid region always at night to stockpile
      if (diceroll < 0.08) {
        tornadopostspawner.push([tornadospawner[i], 9]);
        tornadospawner.splice(i, 1);
      }
    }
  }
}

// function used to promote a babytornado into a real one
function promotebabytornado() {
  // test all baby tornado for the number of frame left before promotion = end of growing animation
  for (let i = tornadoprespawner.length - 1; i >= 0; i--) {
    // create an adult  tornado at the location of the tornadoprespwaner center of cell if it's time
    if (tornadoprespawner[i][1] == 0) {
      tornadospawner.push(tornadoprespawner[i][0]);
      tornadoprespawner.splice(i, 1);
      // otherwise decrease the number of frame before promotion by 1
    } else if (tornadoprespawner[i][1] > 0) {
      tornadoprespawner[i][1] -= 1;
    }
  }
}

// function used to promote an adult tornado to a caster tornado
function promotetocaster() {
  let svg2 = document.getElementById("maincontainer");
  let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];

  for (let i = 0; i < tornadospawner.length; i++) {
    let diceroll = Math.random();
    if (diceroll > 0.97) {
      // check if the tornadospawner is not already a caster too
      let istornadoacaster = false;
      for (let j = 0; j < tornadoprecaster.length; j++) {
        if (tornadoprecaster[j][0] == tornadospawner[i]) {
          istornadoacaster = true;
        }
      }

      if (!istornadoacaster) {
        // Check if the current tornado is still at night

        let pointObj = svg2.createSVGPoint();
        pointObj.x = -currentnightpos + datamap[tornadospawner[i]][0];
        pointObj.y = datamap[tornadospawner[i]][1];
        // if fake point is at  at night
        if (newselec.isPointInFill(pointObj)) {
          tornadoprecaster.push([tornadospawner[i], 8]);
        }
      }
    }
  }
}

// function used to retire old tornados
function retireoldtornado() {
  for (let i = tornadopostspawner.length - 1; i >= 0; i--) {
    // remove a tornado without animation from the list
    if (tornadopostspawner[i][1] == 0) {
      tornadopostspawner.splice(i, 1);
    } else if (tornadopostspawner[i][1] > 0) {
      tornadopostspawner[i][1] -= 1;
    }
  }
}

//function called to animate the tornadoes in the update loop
// attempt at keeping thing here purely cosmetic
//the tornado look the same as the .gif but at this point it's the gif that would need improvement
function animatetornadoes(timecounter) {
  if (aretornadoesactive===true){
 
  // stagger animation
  let staggerer = 5;

  // update the state of tornado relative to their age for night time
  if (timecounter % 100 === 0) {
    repopulatetornadoes();
  }
  // update the state of adult tornado a bit more often to make lightning more sudden

  // update the animation of tornado
  if (timecounter % staggerer === 0) {
    promotebabytornado();
    retireoldtornado();
    promotetocaster();

    // function of animation
    at_bbtornado(timecounter, staggerer);
    at_tornado(timecounter, staggerer);
    at_castertornado();
    at_oldtornado(timecounter, staggerer);

    // explanations
    /*let alignmentorder = [
      "xMinYMin slice",
      "xMidYMin slice",
      "xMaxYMin slice",
      "xMinYMid slice",
      "xMidYMid slice",
      "xMaxYMid slice",
      "xMinYMax slice",
      "xMidYMax slice",
      "xMaxYMax slice",
    ];
        // for now only 1 slide in height, so only YMin used.
        // possible up to 9 , performance ?
        // 4 different sheet, for 12 frame
        // explanation doesn't work dunno why can't use more than 1 row 
  
        ///////////////////////////////////////////////
        //xMin.......xMid..............xMax//........//
        ///////////////////////////////////////////////
        //111111111112222222222233333333333//Ymin....//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        ///////////////////////////////////////////////
        //444444444445555555555566666666666//Ymid....//
        //444444444445555555555566666666666//........//
        //444444444445555555555566666666666//........//
        //444444444445555555555566666666666//........//
        //444444444445555555555566666666666//........//
        ///////////////////////////////////////////////
        //777777777778888888888899999999999//YMax....//
        //777777777778888888888899999999999//........//
        //777777777778888888888899999999999//........//
        //777777777778888888888899999999999//........//
        //777777777778888888888899999999999//........//
        ///////////////////////////////////////////////
  
  
  
        */
  }


  if (timecounter %  Math.floor(staggerer/2) === 0) {  
    at_castertornado();
  }
}}

// function used to update the drawing of the baby tornadoo
function at_bbtornado(timecounter, staggerer) {
  let maxnumberofimageonsheetbecauseofsvg = 3;
  let babytornadoaligment =
    (timecounter % (staggerer * maxnumberofimageonsheetbecauseofsvg)) /
    staggerer;
  let babyanimationsheet = Math.ceil(
    (Math.floor(
      (timecounter % (staggerer * 3 * maxnumberofimageonsheetbecauseofsvg)) /
        staggerer
    ) +
      1) /
      maxnumberofimageonsheetbecauseofsvg
  );
  let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];

  let newselec2 = d3.selectAll("[isbbtornado]");
  newselec2.remove();

  for (element2 of tornadoprespawner) {
    // how many frame till promotion ?
    switch (9 - element2[1]) {
      case 9:
        babyanimationsheet = 3;
        babytornadoaligment = 2;
        break;
      case 8:
        babyanimationsheet = 3;
        babytornadoaligment = 1;
        break;
      case 7:
        babyanimationsheet = 3;
        babytornadoaligment = 0;
        break;
      case 6:
        babyanimationsheet = 2;
        babytornadoaligment = 2;
        break;
      case 5:
        babyanimationsheet = 2;
        babytornadoaligment = 1;
        break;
      case 4:
        babyanimationsheet = 2;
        babytornadoaligment = 0;
        break;
      case 3:
        babyanimationsheet = 1;
        babytornadoaligment = 2;
        break;
      case 2:
        babyanimationsheet = 1;
        babytornadoaligment = 1;
        break;
      case 1:
        babyanimationsheet = 1;
        babytornadoaligment = 0;
        break;
    }

    // create a baby tornado at the location of the tornadoprespwaner center of cell
    svg
      .append("image")
      .attr("isbbtornado", true)
      .attr(
        "href",
        "pic/BbSandstorm" + element2[2] + babyanimationsheet + ".png"
      )
      .attr("x", datamap[element2[0]][0] - tornadosize / 2)
      .attr("y", datamap[element2[0]][1] - tornadosize / 1.2)
      .attr("height", tornadosize)
      .attr("width", tornadosize)
      .attr("image-rendering", "pixelated")
      .attr("image-rendering", "crisp-edges")
      .attr("viewBox", "0 0 32 32")
      .attr("preserveAspectRatio", alignmentorder[babytornadoaligment])
      .attr("frameleft", element2[1])
      .attr("ID", tornadoprespawner.indexOf(element2));
  }
}

// function used to update the drawing of the regular tornado
function at_tornado(timecounter, staggerer) {
  let numberofsheetfortornadoes = 4;
  let maxnumberofimageonsheetbecauseofsvg = 3;
  let animationaligment =
    (timecounter % (staggerer * maxnumberofimageonsheetbecauseofsvg)) /
    staggerer;

  let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];
  // if staggerer=10 following part will transform 10 20 30 40 50 60 ... 1000 into 1 1 1 2 2 2 3 3 3 4 4 4 1 1 1  ....
  let tornadoanimationsheet = Math.ceil(
    (Math.floor(
      (timecounter %
        (staggerer *
          numberofsheetfortornadoes *
          maxnumberofimageonsheetbecauseofsvg)) /
        staggerer
    ) +
      1) /
      maxnumberofimageonsheetbecauseofsvg
  );
  let newselec = d3.selectAll("[istornado]");
  newselec.remove();

  for (element of tornadospawner) {
    // create a tornado at the location of the tornadospwaner center of cell
    // should be made smarter so that tornado can move
    // and throw lightning bolts ?
    svg
      .append("image")
      .attr("istornado", true)
      .attr("href", "pic/SandstormS" + tornadoanimationsheet + ".png")
      .attr("x", datamap[element][0] - tornadosize / 2)
      .attr("y", datamap[element][1] - tornadosize / 1.2)
      .attr("height", tornadosize)
      .attr("width", tornadosize)
      .attr("image-rendering", "pixelated")
      .attr("image-rendering", "crisp-edges")
      .attr("viewBox", "0 0 32 32")
      .attr("preserveAspectRatio", alignmentorder[animationaligment])
      .attr("ID", tornadospawner.indexOf(element));
  }
}

//function used to update the drawing of the old tornado
function at_oldtornado(timecounter, staggerer) {
  let maxnumberofimageonsheetbecauseofsvg = 3;
  let papyanimationsheet = Math.ceil(
    (Math.floor(
      (timecounter % (staggerer * 3 * maxnumberofimageonsheetbecauseofsvg)) /
        staggerer
    ) +
      1) /
      maxnumberofimageonsheetbecauseofsvg
  );
  let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];
  let newselec3 = d3.selectAll("[isoldtornado]");
  newselec3.remove();

  for (element3 of tornadopostspawner) {
    // how many frame till promotion ?
    switch (9 - element3[1]) {
      case 9:
        papyanimationsheet = 3;
        papytornadoaligment = 2;
        break;
      case 8:
        papyanimationsheet = 3;
        papytornadoaligment = 1;
        break;
      case 7:
        papyanimationsheet = 3;
        papytornadoaligment = 0;
        break;
      case 6:
        papyanimationsheet = 2;
        papytornadoaligment = 2;
        break;
      case 5:
        papyanimationsheet = 2;
        papytornadoaligment = 1;
        break;
      case 4:
        papyanimationsheet = 2;
        papytornadoaligment = 0;
        break;
      case 3:
        papyanimationsheet = 1;
        papytornadoaligment = 2;
        break;
      case 2:
        papyanimationsheet = 1;
        papytornadoaligment = 1;
        break;
      case 1:
        papyanimationsheet = 1;
        papytornadoaligment = 0;
        break;
    }
    // create an old tornado at the location of the tornadopostspwaner center of cell
    svg
      .append("image")
      .attr("isoldtornado", true)
      .attr("href", "pic/OldSandstormS" + papyanimationsheet + ".png")
      .attr("x", datamap[element3[0]][0] - tornadosize / 2)
      .attr("y", datamap[element3[0]][1] - tornadosize / 1.2)
      .attr("height", tornadosize)
      .attr("width", tornadosize)
      .attr("image-rendering", "pixelated")
      .attr("image-rendering", "crisp-edges")
      .attr("viewBox", "0 0 32 32")
      .attr("preserveAspectRatio", alignmentorder[papytornadoaligment])
      .attr("frameleft", element3[1])
      .attr("ID", tornadopostspawner.indexOf(element3));
  }
}

// function used to update the drawing associated with a caster tornado
function at_castertornado() {
  // console.log(tornadoprecaster)

  let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];
  let newselec4 = d3.selectAll("[iscastingtornado]");
  newselec4.remove();

  for (element4 of tornadoprecaster) {
    // how many frame before end ?
    switch (9 - element4[1]) {
      case 9:
        casteranimationsheet = 3;
        castertornadoaligment = 2;
        break;
      case 8:
        casteranimationsheet = 3;
        castertornadoaligment = 1;
        break;
      case 7:
        casteranimationsheet = 3;
        castertornadoaligment = 0;
        break;
      case 6:
        casteranimationsheet = 2;
        castertornadoaligment = 2;
        break;
      case 5:
        casteranimationsheet = 2;
        castertornadoaligment = 1;
        break;
      case 4:
        casteranimationsheet = 2;
        castertornadoaligment = 0;
        break;
      case 3:
        casteranimationsheet = 1;
        castertornadoaligment = 2;
        break;
      case 2:
        casteranimationsheet = 1;
        castertornadoaligment = 1;
        break;
      case 1:
        casteranimationsheet = 1;
        castertornadoaligment = 0;
        break;
    }
    // create an charging lightning orb
    element4[1] -= 1;
    svg
      .append("image")
      .attr("iscastingtornado", true)
      .attr("href", "pic/BbLightningS" + casteranimationsheet + ".png")
      .attr("x", datamap[element4[0]][0] - tornadosize / 2)
      // make the lighting appear at the head not feet of tornado otherwise it look ridiculous
      .attr("y", datamap[element4[0]][1] - 1.2*tornadosize )
      .attr("height", tornadosize)
      .attr("width", tornadosize)
      .attr("viewBox", "0 0 32 32")
      .attr("image-rendering", "pixelated")

      .attr("preserveAspectRatio", alignmentorder[castertornadoaligment])
      .attr("frameleft", element4[1] - 1)
      .attr("ID", tornadoprecaster.indexOf(element4));
  }
  for (element4 of tornadoprecaster) {
    if (element4[1] < 0) {
      tornadoprecaster.splice(tornadoprecaster.indexOf(element4), 1);
    }
  }
}

// function that remove all tornadoes and stop their spawn
function deactivatetornadoes() {
  tornadospawner = [];
  tornadoprespawner = [];
  aretornadoesactive = false;
}
