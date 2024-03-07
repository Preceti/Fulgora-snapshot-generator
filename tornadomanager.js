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
    aretornadoesactive = false;
  }
}

// manage tornadoes existence
function repopulatetornadoes() {
  let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
  let svg2 = document.getElementById("maincontainer");

  //generate baby tornado
  for (let i = 0; i < impassablecelllist.length; i++) {
    if (!tornadoprespawner.includes(impassablecelllist[i]) && !tornadospawner.includes(impassablecelllist[i])
      )
     {
      let pointObj = svg2.createSVGPoint();
      pointObj.x = -currentnightpos + datamap[impassablecelllist[i]][0];
      pointObj.y = datamap[impassablecelllist[i]][1];
      if (newselec.isPointInFill(pointObj)) {
        diceroll = Math.random();
        if (diceroll <= 0.05) {
          let secondroll = Math.round(2*Math.random());
          if (secondroll>0.5){
            tornadoprespawner.push([impassablecelllist[i], 9,"S"]);
          }else{
            tornadoprespawner.push([impassablecelllist[i], 9,"T"]);
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
    // if fake point is at night true point is too
    if (!newselec.isPointInFill(pointObj)) {
      let diceroll = Math.random();
      if (diceroll > 0.30) {
        tornadopostspawner.push([tornadospawner[i],9])
        tornadospawner.splice(i, 1);
      }
    }
    // also remove some tornadoes that are still at night, but very few, this is to avoid region always at night to stockpile
    else {
      let diceroll = Math.random();
      if (diceroll < 0.08) {
        tornadopostspawner.push([tornadospawner[i],9])
        tornadospawner.splice(i, 1);
      }
    }
  }
}

// function used to promote a babytornado into a real one
function promotebabytornado() {
  for (let i = tornadoprespawner.length - 1; i >= 0; i--) {
    // create a baby tornado at the location of the tornadoprespwaner center of cell
    if (tornadoprespawner[i][1] == 0) {

      tornadospawner.push(tornadoprespawner[i][0]);
      tornadoprespawner.splice(i, 1);
    } else if (tornadoprespawner[i][1] > 0) {
      tornadoprespawner[i][1] -= 1;
    }
  }
}

function retireoldtornado(){
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
  // stagger animation
  let staggerer = 5;
  if (timecounter % 100 === 0) {
    repopulatetornadoes();
  }

  if (timecounter % staggerer === 0) {
    promotebabytornado();
    retireoldtornado();
    let numberofsheetfortornadoes = 4;
    let maxnumberofimageonsheetbecauseofsvg = 3;
    let babytornadoaligment =
      (timecounter % (staggerer * maxnumberofimageonsheetbecauseofsvg)) /
      staggerer;
    let animationaligment =
      (timecounter % (staggerer * maxnumberofimageonsheetbecauseofsvg)) /
      staggerer;
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
    let babyanimationsheet = Math.ceil(
      (Math.floor(
        (timecounter % (staggerer * 3 * maxnumberofimageonsheetbecauseofsvg)) /
          staggerer
      ) +
        1) /
        maxnumberofimageonsheetbecauseofsvg
    );
    let papyanimationsheet =Math.ceil(
      (Math.floor(
        (timecounter % (staggerer * 3 * maxnumberofimageonsheetbecauseofsvg)) /
          staggerer
      ) +
        1) /
        maxnumberofimageonsheetbecauseofsvg
    );
    let alignmentorder = ["xMinYMin slice", "xMidYMin slice", "xMaxYMin slice"];
    
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

    // delete old animation
    // possible to delete by group ? for performance ?
    let newselec = d3.selectAll("[istornado]");
    newselec.remove();
    let newselec2 = d3.selectAll("[isbbtornado]");
    newselec2.remove();
    let newselec3 = d3.selectAll("[isoldtornado]");
    newselec3.remove();
 

    for (element2 of tornadoprespawner) {
     // how many frame till promotion ?
      switch ( 9 - element2[1]) {
        case 9: babyanimationsheet = 3
         babytornadoaligment = 2 ;
         break
        case 8: babyanimationsheet = 3
         babytornadoaligment = 1 ;
         break
        case 7: babyanimationsheet = 3 
         babytornadoaligment = 0 ;
         break
        case 6: babyanimationsheet = 2 
         babytornadoaligment = 2 ;
         break
        case 5: babyanimationsheet = 2 
         babytornadoaligment = 1 ;
         break
        case 4: babyanimationsheet = 2 
         babytornadoaligment = 0 ;
         break
        case 3: babyanimationsheet = 1 
         babytornadoaligment = 2 ;
         break
        case 2: babyanimationsheet = 1 
         babytornadoaligment = 1 ;
         break
        case 1: babyanimationsheet = 1 
         babytornadoaligment = 0 ;
         break
      } 

      // create a baby tornado at the location of the tornadoprespwaner center of cell
      svg
        .append("image")
        .attr("isbbtornado", true)
        .attr("href", "pic/BbSandstorm"+element2[2]+babyanimationsheet + ".png")
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

    for (element3 of tornadopostspawner){

 // how many frame till promotion ?
 switch ( 9 - element3[1]) {
  case 9: papyanimationsheet = 3
   papytornadoaligment = 2 ;
   break
  case 8: papyanimationsheet = 3
  papytornadoaligment = 1 ;
   break
  case 7: papyanimationsheet = 3
  papytornadoaligment = 0 ;
   break
  case 6: papyanimationsheet = 2
  papytornadoaligment = 2 ;
   break
  case 5: papyanimationsheet = 2
  papytornadoaligment = 1 ;
   break
  case 4: papyanimationsheet = 2
  papytornadoaligment = 0 ;
   break
  case 3: papyanimationsheet = 1
  papytornadoaligment = 2 ;
   break
  case 2:papyanimationsheet = 1
  papytornadoaligment = 1 ;
   break
  case 1: papyanimationsheet = 1
  papytornadoaligment = 0 ;
   break
} 
  // create a baby tornado at the location of the tornadoprespwaner center of cell
  svg
  .append("image")
  .attr("isoldtornado", true)
  .attr("href", "pic/OldSandstormS"+papyanimationsheet + ".png")
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
}

// function that remove all tornadoes and stop their spawn
function deactivatetornadoes() {
  tornadospawner = [];
  tornadoprespawner = [];
}
