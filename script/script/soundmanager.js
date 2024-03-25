// some part here are "loading"

// no sound by default, need be read before script
FSG.SOUND.ambiantsound = "off";

// Fulgora sound file list
 FSG.SOUND.FulgoraThunderfiles = ["sound/Thunder.mp3"];
 FSG.SOUND.FulgoraWindfiles = ["sound/Wind.mp3"];

// putting 5 here allow to here at most 5 at the same time when clicking super fast
FSG.SOUND.Swooshfiles = [
  "sound/Swoosh.mp3",
  "sound/Swoosh.mp3",
  "sound/Swoosh.mp3",
  "sound/Swoosh.mp3",
  "sound/Swoosh.mp3",
];

FSG.SOUND.Woodpeckerfiles = [
  "sound/Woodpecker.mp3",
  "sound/Woodpecker.mp3",
  "sound/Woodpecker.mp3",
  "sound/Woodpecker.mp3",
];

FSG.SOUND.poomsplashfiles = [
  "sound/poomsplash.mp3",
  "sound/poomsplash.mp3",
  "sound/poomsplash.mp3",
  "sound/poomsplash.mp3",
];


// Fulgora array storing each sound as audio
 FSG.SOUND.FulgoraThunder = [];
FSG.SOUND.FulgoraThunderfiles.forEach((element) => {
  FSG.SOUND.FulgoraThunder.push(new Audio(element));
});
 FSG.SOUND.FulgoraWind = [];
FSG.SOUND.FulgoraWindfiles.forEach((element) => {
  FSG.SOUND.FulgoraWind.push(new Audio(element));
});

 FSG.SOUND.Swoosh = [];
FSG.SOUND.Swooshfiles.forEach((element) => {
  FSG.SOUND.Swoosh.push(new Audio(element));
});

 FSG.SOUND.Woodpecker = [];
FSG.SOUND.Woodpeckerfiles.forEach((element) => {
  FSG.SOUND.Woodpecker.push(new Audio(element));
});

FSG.SOUND.poomsplash = [];
FSG.SOUND.poomsplashfiles.forEach((element) => {
  FSG.SOUND.poomsplash.push(new Audio(element));
});



// function used to play sound that need to repeat once they are finished
FSG.SOUND.customrepeatplay=function(targetArray,repeat) {
  // if we tried to call a sound that doesn't exist we can't play
  if (!targetArray) {
    return;
  }
  // otherwise amongst the list wee need to find a non-busy one
  let target = targetArray.find((sound) => !sound.busy);
  // if all sounds are busy we don't add noise
  if (!target) {
    return;
  }

  // if there is one not busy, it is made busy
  target.busy = true;
  // it remember the source so that it can call itself once finished
  target.source = targetArray;
  if(repeat===true){
    target.repeat=true
  }else{
    target.repeat=false
  }
  // add an event listenener so call a function that will un-busy it and replay if needed
  target.addEventListener("ended", FSG.SOUND.setCanplay, false);
  // finally we get to hear something !
  target.play();
}

// function that is called automatically to replay a sound if it's still required
FSG.SOUND.setCanplay=function(event) {
  // remove the event listener that called the function
  event.target.removeEventListener("ended", FSG.SOUND.setCanplay, false);
  // update the sound status
  event.target.busy = false;
  // sound not be just ambiant sound but refer to the source for now it just check if it should still play and replay
  if ((event.target.repeat === true)) {
    FSG.SOUND.customrepeatplay(event.target.source);
  }
}

// function used to pause a sound that would otherwise be playing repeatdly
FSG.SOUND.stopsound =function(targetArray) {
  // if the sound isn't playing there is no need to throw error
  if (!targetArray) {
    return;
  }
  // otherwise we need to find the busy sound
  let target = targetArray.find((sound) => sound.busy);
  // if there is none
  if (!target) {
    return;
  }
  // if a sound to stop is found the event listener is removed
  target.removeEventListener("ended", FSG.SOUND.setCanplay, false);
  // the sound is put in pause. Can't delete ? do not use if track need to be replayed from start 
  target.pause();
  // the target is un-busy
  target.busy = false;
  // should not be just ambiant sound , should refer to the source
  FSG.SOUND.ambiantsound = "off";
}
