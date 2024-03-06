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
  
      activatetornadoes();
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
  
  // function called before displaying tornadoes for init
  // also called regularly by next function to update where are the tornadoes
  // attempt at making the logic for tornado movement and impact here
  function activatetornadoes() {
    if (!aretornadoesactive) {
    // this code is for when tornado are not "yet" active
      // reset list if there was one
      tornadospawner = [];
      // select the proper element on which to display the tornado and math their collision logic
      let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
      let svg2 = document.getElementById("maincontainer");
  
      // pick a definite proportion of random impassable cells [ That are at night ] that will be spawner until deactivated
      // create fake invisible points with same offset as currentnightpos to check for collision with the translated path that represent night shading
      for (let i=0; i<impassablecelllist.length;i++) {      
       let  pointObj = svg2.createSVGPoint();      
        pointObj.x = -currentnightpos + datamap[impassablecelllist[i]][0];
        pointObj.y = datamap[impassablecelllist[i]][1];
        // if fake point is at night true point is too
        if (newselec.isPointInFill(pointObj)) { 
            // small chance to become a tornadospawner
          let diceroll = 0.99 < Math.random();     
          if (diceroll === true) {
            tornadospawner.push(impassablecelllist[i]);
          }
        } 
      }
    } else {

      // this code is for when tornado are  active and being updated

       // select the proper element on which to display the tornado and math their collision logic
      let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
      let svg2 = document.getElementById("maincontainer");
      
      // pick a definite proportion of random impassable cells [ That are at night ] that will be spawner for the duration of the activation
      // create fake invisible points with same offset as currentnightpos to check for collision with the translated path that represent night shading
      // same as previous to populate with new cells
      for (let i=0; i<impassablecelllist.length;i++) {      
        let pointObj = svg2.createSVGPoint();      
       pointObj.x = -currentnightpos + datamap[impassablecelllist[i]][0];
       pointObj.y = datamap[impassablecelllist[i]][1];
       // if fake point is at night true point is too
       if (newselec.isPointInFill(pointObj)) { 
         let diceroll =  Math.random();
    
         if (diceroll >0.96) {
           tornadospawner.push(impassablecelllist[i]);
         }
       } 
     }
  
     // remove some tornadoes that are no longer at night
     for (let i=0; i<tornadospawner.length;i++) {      
      let   pointObj = svg2.createSVGPoint();      
        pointObj.x = -currentnightpos + datamap[tornadospawner[i]][0];
        pointObj.y = datamap[tornadospawner[i]][1];
        // if fake point is at night true point is too
        if (!newselec.isPointInFill(pointObj)) { 
          let diceroll =  Math.random();     
          if (diceroll > 0.25 ) {
            tornadospawner.splice(i,1);
          }
        } 
        // also remove some tornadoes that are still at night, but very few, this is to avoid region always at night to stockpile
        else{
          let diceroll =  Math.random();     
          if (diceroll < 0.08 ) {
            tornadospawner.splice(i,1);
          }
  
        }
      };
    }
  }
  
  //function called to animate the tornadoes in the update loop
  // attempt at keeping thing here purely cosmetic
  //the tornado look the same as the .gif but at this point it's the gif that would need improvement
  function animatetornadoes(timecounter) {
    if (aretornadoesactive) {
      // stagger animation
      let staggerer = 5;
      if (timecounter % 100 === 0) {
        activatetornadoes();
      }
  
      if (timecounter % staggerer === 0) {
        // if staggerer=10 following part will transform 10 20 30 40 50 60 ... 1000 into 1 1 1 2 2 2 3 3 3 4 4 4 1 1 1  ....
        let numberofsheetfortornadoes = 4;
        let maxnumberofimageonsheetbecauseofsvg = 3;
        let usefulnumber1 =
          staggerer *
          numberofsheetfortornadoes *
          maxnumberofimageonsheetbecauseofsvg;
        let animationsheet = Math.ceil(
          (Math.floor((timecounter % usefulnumber1) / staggerer) + 1) /
            maxnumberofimageonsheetbecauseofsvg
        );
        let animationaligment = timecounter % maxnumberofimageonsheetbecauseofsvg;
        let alignmentorder = [
          "xMinYMin slice",
          "xMidYMin slice",
          "xMaxYMin slice",
        ];
        // explanations
        /*
        // for now only 1 slide in height, so only YMin used.
        // possible up to 9 , performance ?
        // 4 different sheet, for 12 frame
  
        ///////////////////////////////////////////////
        //xMin.......xMid..............xMax//........//
        ///////////////////////////////////////////////
        //111111111112222222222233333333333//Ymin....//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        //111111111112222222222233333333333//........//
        ///////////////////////////////////////////////
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//Ymid....//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        ///////////////////////////////////////////////
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//YMax....//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        //AAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC//........//
        ///////////////////////////////////////////////
  
  
  
        */
  
        // delete old animation
        // possible to delete by group ? for performance ?
        let newselec = d3.selectAll("[istornado]");
        newselec.remove();
        for (element of tornadospawner) {
          // create a tornado at the location of the tornadospwaner center of cell
          // should be made smarter so that tornado can move
          // and throw lightning bolts ?
          svg
            .append("image")
            .attr("istornado", true)
            .attr("href", "pic/SandstormS" + animationsheet + ".png")
            .attr("x", datamap[element][0] - tornadosize / 2)
            .attr("y", datamap[element][1] - tornadosize / 1.2)
            .attr("height", tornadosize)
            .attr("width", tornadosize)
            .attr("viewBox", "0 0 32 32")
            //  .attr( "preserveAspectRatio","xMinYMin slice")
            .attr("preserveAspectRatio", alignmentorder[animationaligment])
            .attr("ID", tornadospawner.indexOf(element));
        }
      }
    }
  }
  
  // function that remove all tornadoes and stop their spawn
  function deactivatetornadoes() {
    tornadospawner = [];
  }
  