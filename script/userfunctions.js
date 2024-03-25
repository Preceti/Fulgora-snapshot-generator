// this file is used to link some display or data manipulation function to a symbolic name that can be attached to button in the UI file or to hotkey in the inputhandler file
// this is where things like what is currently displayed should be checked as the datamanipulation and display should be blind and only aiming at doing their task not checking context

// function of smoothing
function smoothing(centroidcoordinatearray) {
  drawallcentroids();
  replacecentroids(centroidcoordinatearray);
}

// better function of smoothing
function smoothing2() {
  updatecentroid();
  replacedatamapwithcentroids();
  updatesvgpathbase(FSG.MAIN.delaunayd, FSG.MAIN.voronoid);
}


// function to smooth only 1 time
function fastsmoothing() {
    for (let i = 5; i >= 0; i--) {
        updatecentroid();
        replacedatamapwithcentroids();
      }
    
      updatesvgpathbase(FSG.MAIN.delaunayd, FSG.MAIN.voronoid);
    }
    

// function of smoothing that can take a number and smooth that number of time
function deepsmoothing(smoothnesstarget) {
  for (let i = smoothnesstarget; i >= 0; i--) {
    updatecentroid();
    replacedatamapwithcentroids();
  }
  updatesvgpathbase(FSG.MAIN.delaunayd, FSG.MAIN.voronoid);
}


