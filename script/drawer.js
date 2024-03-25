// Drawer is the drawing that is automated in the updateloop
// whereas displayfunctions are the drawing function initiated by user



// function to draw the shading as a svg
function drawtheshading(width,height) {
    // create a path for shading
    // then this will be translated
    // it doesn't need to have the currentnightpos updating anymore and they are 0 when the function is called just once
    pathdargument = d3.path();
    // drawn schematics required for understanding =>
    // x are points designed by "beziercurveto"
    // c are control points duplicated
    // à represent path that slide
    // 0 is origin or path
    //////////////////////////////////////////////////////////////////////
    //x.......c..ààààxàààà..c..............c..ààààxàààà..c......x.......//
    //.........àà.........àà................àà.........àà...............//
    //........à.............à..............à.............à..............//
    //........x.............x..............x.............x..............//
    //........à.............à..............à.............à..............//
    //......àà...............àà..........àà...............àà............//
    //xàààà...c.............c..àààà0àààà...c.............c..ààààx.......//
    //////////////////////////////////////////////////////////////////////
    // needlessly computationnaly expensive, but i wanted to try and use bezier curves
  
    pathdargument.moveTo(0 + currentnightpos, 0.98 * height);
    pathdargument.bezierCurveTo(
      0.15 * width + currentnightpos,
      0.98 * height,
      0.15 * width + currentnightpos,
      0.98 * height,
      0.15 * width + currentnightpos,
      0.5 * height
    );
    pathdargument.bezierCurveTo(
      0.15 * width + currentnightpos,
      0.05 * height,
      0.15 * width + currentnightpos,
      0.05 * height,
      0.5 * width + currentnightpos,
      0.05 * height
    );
    pathdargument.bezierCurveTo(
      0.85 * width + currentnightpos,
      0.05 * height,
      0.85 * width + currentnightpos,
      0.05 * height,
      0.85 * width + currentnightpos,
      0.5 * height
    );
    pathdargument.bezierCurveTo(
      0.85 * width + currentnightpos,
      0.98 * height,
      0.85 * width + currentnightpos,
      0.98 * height,
      width + currentnightpos,
      0.98 * height
    );
    pathdargument.lineTo(width + currentnightpos, 0);
    pathdargument.lineTo(0 + currentnightpos2, 0);
    pathdargument.lineTo(0 + currentnightpos2, 0.98 * height);
    pathdargument.bezierCurveTo(
      0.15 * width + currentnightpos2,
      0.98 * height,
      0.15 * width + currentnightpos2,
      0.98 * height,
      0.15 * width + currentnightpos2,
      0.5 * height
    );
    pathdargument.bezierCurveTo(
      0.15 * width + currentnightpos2,
      0.05 * height,
      0.15 * width + currentnightpos2,
      0.05 * height,
      0.5 * width + currentnightpos2,
      0.05 * height
    );
    pathdargument.bezierCurveTo(
      0.85 * width + currentnightpos2,
      0.05 * height,
      0.85 * width + currentnightpos2,
      0.05 * height,
      0.85 * width + currentnightpos2,
      0.5 * height
    );
    pathdargument.bezierCurveTo(
      0.85 * width + currentnightpos2,
      0.98 * height,
      0.85 * width + currentnightpos2,
      0.98 * height,
      width + currentnightpos2,
      0.98 * height
    );
  
    FSG.MAIN.svg
      .append("path")
      .attr("d", pathdargument)
      .attr("opacity", 0.5)
      .attr("fill-color", "black")
      .attr("daynight", true)
      .attr("transform", "translate(0," + currentnightpos + ")");
  }
  
  // function drawing circle for "lights" in passable cells at night
  function turnonthelights(timecounter,passablecelllist,datamap,svg) {
    // stagger the update for "lights"
    if (lightmode === "on") {
      if (timecounter % 15 === 0) {
        let newselec2 = d3.select("[ispointsforlight]");
        newselec2.remove();
        //it works but i can't tell why ._groups[0][0]  is necessary??
        let newselec = d3.selectAll("path" + "[daynight]")._groups[0][0];
        let svg2 = document.getElementById("maincontainer");
        if (newselec) {
          // 3rd version takes only passable cells, and draw 1 path for all points
          // random radius makes a gloow effect with the fast refresh from night moving
          let pathjoiningpointsforlights = d3.path();
          for (let i = 0; i < passablecelllist.length; i++) {
            var pointObj = svg2.createSVGPoint();
            // create fake invisible points with same offset as currentnightpos to check for collision with the translated path that represent night shading
            pointObj.x = -currentnightpos + datamap[passablecelllist[i]][0];
            pointObj.y = datamap[passablecelllist[i]][1];
            if (newselec.isPointInFill(pointObj)) {
              let radius = 3 + Math.round(1 * Math.random());
              pathjoiningpointsforlights.moveTo(
                datamap[passablecelllist[i]][0] + radius,
                datamap[passablecelllist[i]][1]
              );
              pathjoiningpointsforlights.arc(
                datamap[passablecelllist[i]][0],
                datamap[passablecelllist[i]][1],
                radius,
                // with a different start angle it doesn't make a full circle i like the look
                -3,
                1
              );
            }
            //console.log(svg2)
          }
  
          FSG.MAIN.svg
            .append("path")
            .attr("d", pathjoiningpointsforlights)
            .attr("fill", "yellow")
            .attr("ispointsforlight", "true");
        }
        newselec = 0;
        svg2 = 0;
      }
    } else {
      let newselec2 = d3.select("[ispointsforlight]");
      newselec2.remove();
    }
  }
  