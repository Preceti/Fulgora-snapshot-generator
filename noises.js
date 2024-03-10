// init
var districounter = 0;
// noise and randomness experiments
// probably a terrible system to order things at least it's easy to cycle through when clicking
// no idea why this works
// each element in this distribution list is a function that is called to generate some random numbers
var distrilist = [
  //0 to 3
  d3.randomBates(2),
  d3.randomBates(3),
  d3.randomBates(5),
  d3.randomBates(10),
  // 4 and 5
  d3.randomIrwinHall(0.95),
  d3.randomIrwinHall(1.1),
  //6 to 9
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
];

// function to change the type of distribution of the random points
function cyclerandomdistrib() {
  districounter = (districounter + 1) % distrilist.length;
  datamap = [];
  var distri = distrilist[districounter];
  switch (districounter) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [Math.round(width * distri()), Math.round(height * distri())];
      });
      console.log("case 0-5");

      break;
    case 6:
    case 7:
    case 8:
    case 9:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[1]())];
      });
      console.log("case 6-9");
      break;

    // trying something fancy here, let's take only half the points randomly and the other half their mirror !
    // diagonal axis mirror
    case 10:
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[1]())];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([width - datamap[i][0], height - datamap[i][1]]);
      }
      console.log("case 10");
      break;
    // horizontal axis mirror
    case 11:
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[1]())];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([datamap[i][0], height - datamap[i][1]]);
      }

      console.log("case 11");
      break;
    //vertical axis mirror

    case 12:
      datamap = Array.from({ length: numberofcellsatstart / 2 }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[1]())];
      });
      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push([width - datamap[i][0], datamap[i][1]]);
      }

      console.log("case 12");
      break;

    // 3 islands
    case 13:
      datamap = Array.from({ length: numberofcellsatstart / 3 }).map(() => {
        return [Math.round(distri[0]()), Math.round(distri[3]())];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [Math.round(distri[1]()), Math.round(distri[4]())],
          [Math.round(distri[2]()), Math.round(distri[5]())]
        );
      }
      console.log("case 13");
      break;
    // weibull 10
    case 14:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(0.5 * width * distri()),
          Math.round(0.5 * height * distri()),
        ];
      });
      console.log("case 14");
      break;
    // weibull 5
    case 15:
      datamap = Array.from({ length: numberofcellsatstart }).map(() => {
        return [
          Math.round(0.5 * width * distri()),
          Math.round(0.5 * height * distri()),
        ];
      });
      console.log("case 15");
      break;
    // weibull  negative mirrored lerped and clamped
    case 16:
      // add 1/4 of the points first, then mirror diagonaly for another 1/4 then horizontally or vertically
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.clamp(0, width, Math.round(0.2 * width * distri())),
          Math.clamp(0, height, Math.round(0.2 * height * distri())),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [Math.round(datamap[i][0]), Math.round(height - datamap[i][1])],
          [Math.round(width - datamap[i][0]), Math.round(datamap[i][1])],
          [
            Math.round(width - datamap[i][0]),
            Math.round(height - datamap[i][1]),
          ]
        );
      }

      console.log("case 16");
      break;

    // weibull negative mirrored lerped and clamped  2
    case 17:
      // add 1/4 of the points first, then mirror diagonaly for another 1/4 then horizontally or vertically
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.clamp(0, width, Math.round(0.3 * width * distri())),
          Math.clamp(0, height, Math.round(0.3 * height * distri())),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [Math.round(datamap[i][0]), Math.round(height - datamap[i][1])],
          [Math.round(width - datamap[i][0]), Math.round(datamap[i][1])],
          [
            Math.round(width - datamap[i][0]),
            Math.round(height - datamap[i][1]),
          ]
        );
      }

      console.log("case 17");
      break;

    // weibull negative mirrored lerped and clamped  3
    case 18:
      datamap = Array.from({ length: numberofcellsatstart / 4 }).map(() => {
        return [
          Math.round(0.1 * width * distri()),
          Math.round(0.1 * height * distri()),
        ];
      });

      for (let i = datamap.length - 1; i >= 0; i--) {
        datamap.push(
          [Math.round(datamap[i][0]), Math.round(height - datamap[i][1])],
          [Math.round(width - datamap[i][0]), Math.round(datamap[i][1])],
          [
            Math.round(width - datamap[i][0]),
            Math.round(height - datamap[i][1]),
          ]
        );
      }

      console.log("case18");
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
