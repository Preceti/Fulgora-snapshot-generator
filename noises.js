// init
var districounter = 0;
// noise and randomness experiments
// probably a terrible system to order things at least it's easy to cycle through when clicking

// function to change the type of distribution of the random points
function cyclerandomdistrib(param) {
  //that was probably a mistake to add all those remaps
  // those need to all be offset to account for the UIheight hence
  let heightmin = 0; // UIheight;
  let heightmax = height;
  //  Math.remap(0,height,heightmin,heightmax,y)

  // no idea why this works
  // each element in this distribution list is a function that is called to generate some random numbers
  var distrilist = [
    //0 to 3
    d3.randomBates(2),
    d3.randomBates(3),
    d3.randomBates(5),
    d3.randomBates(10),
    // 4 and 5
    [d3.randomIrwinHall(width / 200), d3.randomIrwinHall(height / 200)],
    [d3.randomIrwinHall(width / 1000), d3.randomIrwinHall(height / 1000)],
    //6 to 9 need to work so as to have less points on top of each other
    [d3.randomBinomial(width, 0.1), d3.randomBinomial(height, 0.1)],
    [d3.randomBinomial(width, 0.3), d3.randomBinomial(height, 0.3)],
    [d3.randomBinomial(width, 0.5), d3.randomBinomial(height, 0.5)],
    [d3.randomBinomial(width, 0.8), d3.randomBinomial(height, 0.8)],
    // 10 - 12
    [d3.randomBinomial(width, 0.3), d3.randomBinomial(height, 0.3)],
    [d3.randomBinomial(width, 0.5), d3.randomBinomial(height, 0.1)],
    [d3.randomBinomial(width, 0.1), d3.randomBinomial(height, 0.5)],
    // 13
    [
      d3.randomBinomial(width, 0.25),
      d3.randomBinomial(width, 0.5),
      d3.randomBinomial(width, 0.75),
      d3.randomBinomial(height, 0.25),
      d3.randomBinomial(height, 0.5),
      d3.randomBinomial(height, 0.75),
    ],
    // 14
    d3.randomWeibull(10),
    // 15
    d3.randomWeibull(5),
    //16
    d3.randomWeibull(-5),
    // 17- 18
    d3.randomWeibull(-1),
    d3.randomWeibull(-1),
    //19-22
    d3.randomCauchy(0, 1),
    d3.randomCauchy(0, 0.1),
    d3.randomCauchy(0, 0.5),
    d3.randomCauchy(0, 2),
    //23-26
    d3.randomLogistic(0, 1),
    d3.randomLogistic(0, 2),
    d3.randomLogistic(0, 3),
    d3.randomLogistic(0, 4),
    //27-30 not enough points shown , but i like the grid, need improvement
    [d3.randomPoisson(width), d3.randomPoisson(height)],
    [d3.randomPoisson(width / 10), d3.randomPoisson(height / 10)],
    [d3.randomPoisson(width / 20), d3.randomPoisson(height / 20)],
    [d3.randomPoisson(width / 50), d3.randomPoisson(height / 50)],
    //31-32 grids ( no random)
    [],
    [],
    //33-37 circle experiments
    [],
    [],
    [],
    [],
    [],
  ];

  // every click with the "c" key pressed increase the counter by 1 changing which function is used from the distrilist
  // some functions from the distrilist are very generic and require particular code to generate proper data
  // this is found at each case
  // no param is default
  if (!param) {
    districounter = (districounter + 1) % distrilist.length;
  }
  //param previous means going reverse in the distribution list
  if (param === "previous") {
    districounter = (districounter - 1) % distrilist.length;
    if (districounter < 0) {
      districounter = distrilist.length - 1;
    }
  }

  // param next means going forward in the distribution list
  if (param === "next") {
    districounter = (districounter + 1) % distrilist.length;
  }
  if (param === "shuffle") {
    districounter = Math.floor(Math.random() * distrilist.length);
  }

  // reset previous data
  datamap = [];
  // init counter or reuse  global var position
  var distri = distrilist[districounter];

  let centerofscreen = [
    (1 / 2) * width,
    (1 / 2) * (heightmax - heightmin) + heightmin,
  ];
  let radius = (1 / 3) * (heightmax - heightmin);

  // how many row and columns for grid when one
  // default settings can be overwritten in special case
  let targetrowcount = 10;
  let targetcolumncount = 20;
  // if previous are selected the % is ignored for case 36
  let percentageofcellusedforbackgroundgrid = 50;
  let cellforgrid = [0, false];
  let xpadding = 0;
  let ypadding = 0;

  switch (districounter) {
    // randombates
    case 0:
    case 1:
    case 2:
    case 3:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(width * distri()),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(height * distri())
          ),
        ];
      });
      console.log("case 0-3");

      break;
    // IrvinHall
    case 4:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(200 * distri[0]()),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(200 * distri[1]())
          ),
        ];
      });
      console.log("case 4");

      break;
    case 5:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(1000 * distri[0]()),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(1000 * distri[1]())
          ),
        ];
      });
      console.log("case 5");

      break;
    // binomials
    case 6:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.remap(
            0,
            0.2 * width,
            heightmin,
            heightmax,
            Math.round(distri[0]())
          ),
          Math.remap(
            0,
            0.2 * height,
            heightmin,
            heightmax,
            Math.round(distri[1]())
          ),
        ];
      });
      console.log("case 6");
      break;
    case 7:
    case 8:
    case 9:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[1]())];
      });
      console.log("case 7-9");
      break;
    // trying something fancy here, let's take only half the points randomly and the other half their mirror !
    case 10:
      // diagonal axis mirror
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [
          Math.round(distri[0]()),
          Math.remap(0, height, heightmin, heightmax, Math.round(distri[1]())),
        ];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([
          width - datamap[i][0],
          Math.remap(0, height, heightmin, heightmax, height - datamap[i][1]),
        ]);
      }
      console.log("case 10");
      break;
    // horizontal axis mirror
    case 11:
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [
          Math.round(distri[0]()),
          Math.remap(0, height, heightmin, heightmax, Math.round(distri[1]())),
        ];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([
          datamap[i][0],
          Math.remap(0, height, heightmin, heightmax, height - datamap[i][1]),
        ]);
      }

      console.log("case 11");
      break;
    //vertical axis mirror
    case 12:
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [
          Math.round(distri[0]()),
          Math.remap(0, height, heightmin, heightmax, Math.round(distri[1]())),
        ];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([
          width - datamap[i][0],
          Math.remap(0, height, heightmin, heightmax, datamap[i][1]),
        ]);
      }

      console.log("case 12");
      break;
    // 3 islands
    case 13:
      datamap = Array.from({ length: numberofcellsatstart / 3 }).map(() => {
        return [
          Math.round(distri[0]()),
          Math.remap(0, height, heightmin, heightmax, Math.round(distri[3]())),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [
            Math.round(distri[1]()),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(distri[4]())
            ),
          ],
          [
            Math.round(distri[2]()),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(distri[5]())
            ),
          ]
        );
      }
      console.log("case 13");
      break;
    // weibull 10
    case 14:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(0.5 * width * distri()),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(0.5 * height * distri())
          ),
        ];
      });
      console.log("case 14");
      break;
    // weibull 5
    case 15:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(0.5 * width * distri()),

          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(0.5 * height * distri())
          ),
        ];
      });
      console.log("case 15");
      break;
    // weibull  negative mirrored clamped
    case 16:
      // add 1/4 of the points first, then mirror diagonaly for another 1/4 then horizontally or vertically
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.clamp(0, width, Math.round(0.2 * width * distri())),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.clamp(0, height, Math.round(0.2 * height * distri()))
          ),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [
            Math.round(datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ]
        );
      }

      console.log("case 16");
      break;
    // weibull negative mirrored clamped  2

    case 17:
      // add 1/4 of the points first, then mirror diagonaly for another 1/4 then horizontally or vertically
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.clamp(0, width, Math.round(0.3 * width * distri())),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.clamp(0, height, Math.round(0.3 * height * distri()))
          ),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [
            Math.round(datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ]
        );
      }

      console.log("case 17");
      break;
    // weibull negative mirrored clamped  3
    case 18:
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.round(0.1 * width * distri()),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(0.1 * height * distri())
          ),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [
            Math.round(datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(datamap[i][1])
            ),
          ],
          [
            Math.round(width - datamap[i][0]),
            Math.remap(
              0,
              height,
              heightmin,
              heightmax,
              Math.round(height - datamap[i][1])
            ),
          ]
        );
      }

      console.log("case18");
      break;
    // Cauchy clamped and remapped
    case 19:
    case 20:
    case 21:
    case 22:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.remap(-5, 5, 0, width, Math.clamp(-5, 5, distri())),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.remap(-5, 5, 0, height, Math.clamp(-5, 5, distri()))
          ),
        ];
      });

      console.log("case19-22");
      break;
    // logistic clamped and remapped
    case 23:
    case 24:
    case 25:
    case 26:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.remap(-10, 10, 0, width, Math.clamp(-10, 10, distri())),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.remap(-10, 10, 0, height, Math.clamp(-10, 10, distri()))
          ),
        ];
      });

      console.log("case23-26");
      break;
    // poisson
    // doesn't work as well as expected
    // maybe just make lattice of points from center ?
    case 27:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(distri[0]() / 2),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(distri[1]()) / 2
          ),
        ];
      });
      console.log("case 27");
      break;
    case 28:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(distri[0]() * 5),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(distri[1]()) * 5
          ),
        ];
      });
      console.log("case 28");
      break;
    case 29:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          distri[0]() * 10,
          Math.remap(0, height, heightmin, heightmax, distri[1]() * 10),
        ];
      });
      console.log("case 29");
      break;
    case 30:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(distri[0]() * 25),
          Math.remap(
            0,
            height,
            heightmin,
            heightmax,
            Math.round(distri[1]()) * 25
          ),
        ];
      });
      console.log("case 30");

      break;
    // grids
    case 31:
      // start top left
      datamap = [];
      for (let i = 0; i < numberofcellsatstart; i++) {
        let x = Math.floor((1 + i) * Math.sqrt(averagecellarea)) % width;
        let y =
          (((1 + i) / (width / Math.sqrt(averagecellarea))) *
            Math.sqrt(averagecellarea)) %
          height;
        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }
      console.log("case 31");
      break;
    case 32:
      // start mid with random offset
      datamap = [];
      for (let i = 0; i < numberofcellsatstart; i++) {
        // max offset in pixel renewed every reset
        let noise = 5;
        // not sure anymore
        let j = (i + 0.5 * numberofcellsatstart) % numberofcellsatstart;
        // not sure anymore
        let x =
          Math.floor(((1 + j) * Math.sqrt(averagecellarea)) % width) +
          // number between -1 or 1 that get multiplied by "noise" to create random offset
          2 * (0.5 - Math.random()) * noise;
        let y =
          ((Math.floor(
            (1 + j) / Math.floor(width / Math.sqrt(averagecellarea))
          ) *
            Math.sqrt(averagecellarea)) %
            height) +
          // number between -1 or 1 that get multiplied by "noise" to create random offset
          2 * (0.5 - Math.random()) * noise;
        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }
      console.log("case 32");

      break;
    // 33  fail experiment attempt at circle donut that looked funny kept to investigate
    case 33:
      datamap = [];
      radius = (1 / 3) * width;
      for (let i = 0; i < numberofcellsatstart; i++) {
        x = Math.remap(
          0,
          1,
          centerofscreen[0] - radius,
          centerofscreen[0] + radius,
          2 * Math.random()
        );
        y = Math.sqrt(Math.abs(radius - Math.pow(x, 2)));

        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }

      console.log("case 33");
      break;

    // 34 bare circle not as good as expected
    case 34:
      datamap = [];
      radius = (1 / 3) * height;
      for (let i = 0; i < numberofcellsatstart / 2; i++) {
        // pick some x coordinate that belong to a circle of given radius and center of screen
        // this by remapping random [0:2] to [center+/-radius]
        x = Math.remap(
          0,
          2,
          centerofscreen[0] - radius,
          centerofscreen[0] + radius,
          2 * Math.random()
        );
        // proceed to find the corresponding y coordinate that goes to the previous x point
        // upper half = positive y only
        y =
          centerofscreen[1] -
          Math.sqrt(
            -Math.pow(centerofscreen[0], 2) +
              2 * centerofscreen[0] * x +
              Math.pow(radius, 2) -
              Math.pow(x, 2)
          );

        // push the point and the bottom half as mirror
        datamap.push([x, heightmin + y]);
        datamap.push([x, heightmax - y]);
      }

      console.log("case 34");
      break;

    // circle still but this time pushed upon a loose grid to prevent too much relaxation of original shape
    case 35:
      datamap = [];
      // grid sucks
      for (let i = 0; i < numberofcellsatstart / 10; i++) {
        let x = Math.floor((1 + 10 * i) * Math.sqrt(averagecellarea)) % width;
        let y =
          (((1 + 10 * i) / (width / Math.sqrt(averagecellarea))) *
            Math.sqrt(averagecellarea)) %
          height;

        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }

      radius = (1 / 3) * height;
      for (let i = 0; datamap.length < numberofcellsatstart; i++) {
        // pick some x coordinate that belong to a circle of given radius and center of screen
        // this by remapping random [0:2] to [center+/-radius]
        x = Math.remap(
          0,
          2,
          centerofscreen[0] - radius,
          centerofscreen[0] + radius,
          2 * Math.random()
        );
        // proceed to find the corresponding y coordinate that goes to the previous x point
        // upper half = positive y only
        y =
          centerofscreen[1] -
          Math.sqrt(
            -Math.pow(centerofscreen[0], 2) +
              2 * centerofscreen[0] * x +
              Math.pow(radius, 2) -
              Math.pow(x, 2)
          );

        // push the point and the bottom half as mirror
        datamap.push([x, heightmin + y]);
        datamap.push([x, heightmax - y]);
      }

      console.log("case 35");
      break;
    // improved upon previous grid  and better choosing the distribution of x's to fit the circle
    // can choose the number of column and row of the grid but doesn't properly work with % of cell used for grid
    case 36:
      datamap = [];
      // how many row and columns
      targetrowcount = 10;
      targetcolumncount = 20;
      // if previous are selected the % is ignored
      percentageofcellusedforbackgroundgrid = 50;
      cellforgrid = [0, false];
      xpadding = 0;
      ypadding = 0;
      // if no spec
      if (targetrowcount != 0 && targetcolumncount != 0) {
        // number of cell on the grid is number of row * number of columns
        cellforgrid[0] = targetcolumncount * targetrowcount;
        // we will use this computed number and not the %
        cellforgrid[1] = true;
        // calculate spacing between 2 points
        xpadding = width / targetcolumncount;
        ypadding = height / targetrowcount;
      } else {
        cellforgrid[0] =
          (numberofcellsatstart * percentageofcellusedforbackgroundgrid) / 100;
      }
      if (cellforgrid[1] === false) {
        // experiment finished next case
        targetcolumncount =
          (width / height) *
          cellforgrid[0] *
          Math.floor(Math.sqrt(cellforgrid[0]));
        targetrowcount = (height / width) * targetcolumncount;
        xpadding = width / targetcolumncount;
        ypadding = xpadding;
      }

      // making the grid easy to custom and nice was more difficult than the circle :(
      for (let i = 0; i < cellforgrid[0]; i++) {
        // square grid
        let x = xpadding / 2 + (Math.floor(i * xpadding) % width);
        let y = ypadding / 2 + Math.floor(i / targetcolumncount) * ypadding;

        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }

      radius = (1 / 3) * height;
      for (let i = 0; datamap.length < numberofcellsatstart; i++) {
        // pick some x coordinate that belong to a circle of given radius and center of screen
        // this by remapping random [0:2] to [center+/-radius]
        x = Math.remap(
          0,
          2,
          centerofscreen[0] - radius,
          centerofscreen[0] + radius,
          2 * Math.random()
        );
        // proceed to find the corresponding y coordinate that goes to the previous x point
        // upper half = positive y only
        y =
          centerofscreen[1] -
          Math.sqrt(
            -Math.pow(centerofscreen[0], 2) +
              2 * centerofscreen[0] * x +
              Math.pow(radius, 2) -
              Math.pow(x, 2)
          );

        // push the point and the bottom half as mirror
        datamap.push([x, heightmin + y]);
        datamap.push([x, heightmax - y]);
        // idea : also push the same thing but with a 90° rotation, this way it isn't scarecely populated left and right due to circle being almost vertical
        // really it's easier to picture and math remapping/linear interpolaton than rotation of coordinate i found as fun to make !

        datamap.push([
          Math.remap(
            centerofscreen[1] - radius,
            centerofscreen[1],
            centerofscreen[0] - radius,
            centerofscreen[0],
            heightmin + y
          ),
          Math.remap(
            centerofscreen[0] - radius,
            centerofscreen[0] + radius,
            centerofscreen[1] - radius,
            centerofscreen[1] + radius,
            x
          ),
        ]);
        datamap.push([
          width -
            Math.remap(
              centerofscreen[1] - radius,
              centerofscreen[1],
              centerofscreen[0] - radius,
              centerofscreen[0],
              heightmin + y
            ),
          Math.remap(
            centerofscreen[0] - radius,
            centerofscreen[0] + radius,
            centerofscreen[1] - radius,
            centerofscreen[1] + radius,
            x
          ),
        ]);
      }

      console.log("case 36");
      break;
      // grid work ok and circle too, next step maybe adding some blur in the circle to reduce the need for expensive smoothing and better control over look
    case 37:
      datamap = [];
      // how many row and columns
      targetrowcount = 0;
      targetcolumncount = 0;
      // if previous are selected the % is ignored
      percentageofcellusedforbackgroundgrid = 50;
      cellforgrid = [0, false];
      xpadding = 0;
      ypadding = 0;
      // if  spec
      if (targetrowcount != 0 && targetcolumncount != 0) {
        // number of cell on the grid is number of row * number of columns
        cellforgrid[0] = targetcolumncount * targetrowcount;
        // we will use this computed number and not the %
        cellforgrid[1] = true;
        // calculate spacing between 2 points
        xpadding = width / targetcolumncount;
        ypadding = height / targetrowcount;
      }
      // if no spec
      else {
        // this will be number of cell
        cellforgrid[0] =
          (numberofcellsatstart * percentageofcellusedforbackgroundgrid) / 100;
      }
      if (cellforgrid[1] === false) {
        // we will try to make a grid where all tile are square
        // lets find how many row and column
        targetcolumncount = Math.floor(
          Math.sqrt(width / height) * Math.sqrt(cellforgrid[0])
        );
        targetrowcount = Math.floor(
          Math.sqrt(cellforgrid[0]) / Math.sqrt(width / height)
        );

        // not the best x)
        // targetcolumncount =(width / height)/width * cellforgrid[0] *  Math.floor(Math.sqrt(cellforgrid[0]));
        // targetrowcount = (height / width) * targetcolumncount;
        xpadding = width / targetcolumncount;
        ypadding = xpadding;
      }

      // making the grid easy to custom and nice was more difficult than the circle :(
      for (let i = 0; i < cellforgrid[0]; i++) {
        // square grid
        let x = xpadding / 2 + (Math.floor(i * xpadding) % width);
        let y = ypadding / 2 + Math.floor(i / targetcolumncount) * ypadding;

        datamap.push([x, Math.remap(0, height, heightmin, heightmax, y)]);
      }

      radius = (1 / 3) * height;
      for (let i = 0; datamap.length < numberofcellsatstart; i++) {
        // pick some x coordinate that belong to a circle of given radius and center of screen
        // this by remapping random [0:2] to [center+/-radius]
        x = Math.remap(
          0,
          2,
          centerofscreen[0] - radius,
          centerofscreen[0] + radius,
          2 * Math.random()
        );
        // proceed to find the corresponding y coordinate that goes to the previous x point
        // upper half = positive y only
        y =
          centerofscreen[1] -
          Math.sqrt(
            -Math.pow(centerofscreen[0], 2) +
              2 * centerofscreen[0] * x +
              Math.pow(radius, 2) -
              Math.pow(x, 2)
          );

        // push the point and the bottom half as mirror
        datamap.push([x, heightmin + y]);
        datamap.push([x, heightmax - y]);
        // idea : also push the same thing but with a 90° rotation, this way it isn't scarecely populated left and right due to circle being almost vertical
        // really it's easier to picture and math remapping/linear interpolaton than rotation of coordinate i found as fun to make !

        datamap.push([
          Math.remap(
            centerofscreen[1] - radius,
            centerofscreen[1],
            centerofscreen[0] - radius,
            centerofscreen[0],
            heightmin + y
          ),
          Math.remap(
            centerofscreen[0] - radius,
            centerofscreen[0] + radius,
            centerofscreen[1] - radius,
            centerofscreen[1] + radius,
            x
          ),
        ]);
        datamap.push([
          width -
            Math.remap(
              centerofscreen[1] - radius,
              centerofscreen[1],
              centerofscreen[0] - radius,
              centerofscreen[0],
              heightmin + y
            ),
          Math.remap(
            centerofscreen[0] - radius,
            centerofscreen[0] + radius,
            centerofscreen[1] - radius,
            centerofscreen[1] + radius,
            x
          ),
        ]);
      }

      console.log("case 37");
      break;
  }

  delaunayd = d3.Delaunay.from(datamap);
  voronoid = delaunayd.voronoi([0, 0, width, height]);
  drawingbase(delaunayd, voronoid);
  console.log(
    "distribution of randompoint used was number :" +
      (districounter + 1) +
      " out of" +
      distrilist.length
  );
  console.log(datamap);
}

// some other math function
// transform value to fit interval if need be
Math.clamp = function (min, max, value) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }

  return value;
};

// Linear interpolation between 2 value according to amount between 0 and 1
Math.lerp = function (value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return (1 - amount) * value1 + amount * value2;
};

// same accepting negative value for extrapolation
Math.lexp = function (a, b, t) {
  return (1 - t) * a + b * t;
};

// inverse linear interpolation
Math.invlerp = function (a, b, v) {
  return (v - a) / (b - a);
};

// remap a v belonging to min1-max1 to its equivalent between min2-max2
Math.remap = function (min1, max1, min2, max2, v) {
  let t = Math.invlerp(min1, max1, v);
  return Math.lexp(min2, max2, t);
};
