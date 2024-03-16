// no sound by default, need be read before script
var ambiantsound ="off";
// Fulgora sound file list
const FulgoraThunderfiles = [
    "sound/Thunder.mp3"  
  ];

const FulgoraWindfiles=[
    "sound/Wind.mp3"
];


  
  // Fulgora array storing each sound as audio
  let FulgoraThunder = [];
  FulgoraThunderfiles.forEach((element) => {
    FulgoraThunder.push(new Audio(element));
  });
  let FulgoraWind = [];
  FulgoraWindfiles.forEach((element) => {
    FulgoraWind.push(new Audio(element));
  });



function customrepeatplay(targetArray) {
    if (!targetArray) {
      return;
    }
    let target = targetArray.find((sound) => !sound.busy);
    if (!target) {
      return;
    }
  

    target.busy = true;
    target.source = targetArray;
    target.addEventListener("ended", setCanplay, false);
    target.play();
  
  
  }

  function setCanplay(event) {
    event.target.removeEventListener("ended", setCanplay, false);
    event.target.busy = false;
  
    if( ambiantsound= "playing"){
   customrepeatplay(event.target.source)}

  }


  function stopsound(targetArray){
    if (!targetArray) {
      return;
    }
    let target = targetArray.find((sound) => sound.busy);
    if (!target) {
      return;
    }
    target.pause()
    target.busy =false;
    ambiantsound ="off"

  }
  