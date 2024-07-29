//Consistency
function realismGo() {
   console.log("Realism Pack running")
   ui.notification.show("This addon is not longer being updated. At some point I'll have an addon manager that allows you to *select* which of the Realism Pack's </br> features you would like to use.")
}

console.log("Original scripts for immersion SFX, stall buffet, carrier catapults, shaders, and lift-based wingflex from AriakimTaiyo, Livery Selector and 3.5+ spoilers arming from Kolos26");


function gBreath() {
   if (geofs.animation.values.loadFactor >= 3) {
audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/cutgbreath.mp3")
	}
}
function flankerStall() {
   if (geofs.aircraft.instance.id == 18 && geofsAddonAircraft.isSu27 == 1 && geofs.animation.values.cobraMode == 1) {
audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/flankerstall.m4a")
	}
}
gBreathInt = setInterval(function(){gBreath()},3500)
flankerStallInt = setInterval(function(){flankerStall()},3000)

/* The chat website used for this is broken at this time :(
    let addonChat = document.createElement("li");
    addonChat.innerHTML = '<li><iframe width="1000", height="1500", left=350,top=50, src="https://chat.hyperjs.ml/GeoFS", title="Addon chat"</iframe></li>';
    document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-preference-list geofs-preferences")[0].appendChild(addonChat);
*/
    //this breaks things if its run before terrain has loaded
    //geofs.api.waterDetection.create();
    lagReductionInterval = setInterval(function () {
        geofs.savePreferencesPanel();
        geofs.api.renderingSettings.degradedCollisions = true;
        geofs.api.renderingSettings.lowResRunways = true;
    }, 100);
    geofs.animation.values.shake = null
    function getShake() {
        geofs.animation.values.shake = geofs.animation.values.aoa * Math.random();
    }
    function doShake() {
      getShake() 
      if (geofs.animation.values.aoa >= 10 && geofs.aircraft.instance.id != 4) {
      geofs.camera.translate(0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake)
      setTimeout(function(){
        geofs.camera.translate(-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake)
      },1)
      }
    }
    shakeInterval = setInterval(function(){doShake()},10)
    gSoundInt = setInterval(function(){
       if (geofs.animation.values.accZ >= 50 && geofs.animation.values.view == "cockpit") {
    audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/wind.mp3")
        }
       if (geofs.animation.values.accZ >= 70 && geofs.animation.values.view == "cockpit") {
    audio.impl.html5.playFile("https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/wind.mp3")
        }
    },1000)
    propwashInt = setInterval(function(){
        if (geofs.aircraft.instance.id == 21 || geofs.aircraft.instance.id == 2 || geofs.aircraft.instance.id == 2808 || geofs.aircraft.instance.id == 1 || geofs.aircraft.instance.id == 8 || geofs.aircraft.instance.id == 12 || geofs.aircraft.instance.id == 13 || geofs.aircraft.instance.id == 40 || geofs.aircraft.instance.id == 1069 || geofs.aircraft.instance.id == 2750 || geofs.aircraft.instance.id == 4251)  {
    if (geofsAddonAircraft.isTruck != 1) {
    geofs.aircraft.instance.airfoils.forEach(function(e){
    if (e.forceDirection == 2) {
       e.propwash = 0.005
    } else {
       e.propwash = 0.01
    }
    })
    geofs.aircraft.instance.setup.parts[0].centerOfMass = [geofs.animation.values.rpm/1000, 0, 0]
       }
        }
    })
blackoutLoadInt = setInterval(function(){
   if (geofs.fx.atmosphere.atmospherePostProcessStage._ready == true) {
geofs["overlayG.glsl"] = "" + `
uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;
uniform float strength;

vec4 vignette(float strength, vec2 coordinate, vec2 texCoord) {
	vec2 uv = coordinate.xy / czm_viewport.zw;  
       uv *=  1.0 - uv.yx;
    
    float vig = (uv.x*uv.y) * 15.0; 
    
    vig = pow(vig, strength);
    return mix(vec4(vig), texture2D(colorTexture, texCoord), vig); 
}

vec4 grayOut(float strength, vec2 coordinate, vec2 texCoord) {
  vec4 initialCol = vignette(strength * 20.0, coordinate, texCoord);
  vec4 grayCol = vec4(vec3(initialCol.r), 1.0);
  return mix(initialCol, grayCol, strength * 3.0);
}

vec4 blur(float strength, vec2 coordinate, vec2 texCoord) {
 float radius = strength / 10.0;
 vec4 initialCol  = grayOut(strength, coordinate, texCoord);
 vec4 blurCol1    = grayOut(strength, coordinate + vec2(radius, 0.0), texCoord + vec2(radius, 0.0));
 vec4 blurCol2    = grayOut(strength, coordinate + vec2(-radius, 0.0), texCoord + vec2(-radius, 0.0));
 vec4 blurCol3    = grayOut(strength, coordinate + vec2(0.0, radius), texCoord + vec2(0.0, radius));
 vec4 blurCol4    = grayOut(strength, coordinate + vec2(0.0, -radius), texCoord + vec2(0.0, -radius));
 vec4 blurColr1   = grayOut(strength, coordinate + vec2(radius, radius), texCoord + vec2(radius, radius));
 vec4 blurColr2   = grayOut(strength, coordinate + vec2(radius, -radius), texCoord + vec2(radius, -radius));
 vec4 blurColr3   = grayOut(strength, coordinate + vec2(-radius, -radius), texCoord + vec2(-radius, -radius));
 vec4 blurColr4   = grayOut(strength, coordinate + vec2(-radius, -radius), texCoord + vec2(-radius, -radius));
  return mix(initialCol, mix(vec4(blurCol1 + blurCol2 + blurCol3 + blurCol4) / 4.0, vec4(blurColr1 + blurColr2 + blurColr3 + blurColr4) / 4.0, 0.25), strength * 2.0);
 
}

void main() {
  gl_FragColor = blur(strength, gl_FragCoord.xy, v_textureCoordinates);
}
`
let timer = 0;
let initTime = 0;
let holdT = 0;
let timerCheck = null;
let boInit = false;

function getStrength() {
  if (timer >= 0.6) {
    if (!timerCheck) timerCheck = setInterval(function(){
      if (timer < 0.6) {
      clearInterval(timerCheck);
      timerCheck = null;
      }
    }, 100)
  }
  var g = geofs.animation.values.loadFactor;
  if (g > 9 && geofs.animation.values.view == "cockpit") {
    initTime += 0.05; //0.01, speed of blackout effect
    //console.log(initTime);
    if (initTime > 0.1) boInit = true; //1, time delay before blackout
    if (boInit) {
      if (timer < 1) timer += 0.001 * ((g - 5) / 10) * (1 + timer / 10);
      if (timer == 1 && holdT < 10) holdT = timer += 0.001 * ((g - 5) / 10) * (1 + timer / 10);
      return timer;
    } else {
      return 0;
    }
  } else {
      initTime = 0;
      if (holdT > 0) holdT -= 0.0005;
      if (timer > 0 && holdT == 0) timer -= 0.0005;
      if (timer <= 0) boInit = false;
      return timer;
  }
}

geofs.fx.overg = {
  create: function() {
    geofs.fx.overg.shader = new Cesium.PostProcessStage({
      fragmentShader : geofs["overlayG.glsl"],
      uniforms: {
        strength: 0.0,
      }
    })
    geofs.api.viewer.scene.postProcessStages.add(geofs.fx.overg.shader);
  },
  update: function() {
    geofs.fx.overg.shader.uniforms.strength = getStrength();
  }
};

//make this only execute if the advanced atmosphere is done loading
//geofs.fx.atmosphere.atmospherePostProcessStage._ready
geofs.fx.overg.create()
blackoutEffectInterval = setInterval(function(){geofs.fx.overg.update();}, 10)
clearInterval(blackoutLoadInt)
   }
}, 1000)
    function fixSpin() {
        if (geofs.aircraft.instance.id == 2948 || geofs.aircraft.instance.id == 2581) {
            var pitch = geofs.animation.values.atilt;
            setTimeout(() => {
                if (geofs.animation.values.atilt + 50 < pitch || geofs.animation.values.atilt - 50 > pitch) {
                    geofs.aircraft.instance.definition.minimumSpeed = 600;
                    console.log("Spin detected");
                    geofs.flyToCamera();
                    console.log("Spin fixed");
                    setTimeout(() => {
                        geofs.aircraft.instance.definition.minimumSpeed = 250;
                    }, 5000);
                }
            }, 500);
        }
        if (geofs.aircraft.instance.id == 2808 || geofs.aircraft.instance.id == 3460) {
            var pitch = geofs.animation.values.atilt;
            setTimeout(() => {
                if (geofs.animation.values.atilt + 50 < pitch || geofs.animation.values.atilt - 50 > pitch) {
                    geofs.aircraft.instance.definition.minimumSpeed = 200;
                    console.log("Spin detected");
                    geofs.flyToCamera();
                    console.log("Spin fixed");
                    setTimeout(() => {
                        geofs.aircraft.instance.definition.minimumSpeed = 200;
                    }, 5000);
                }
            }, 500);
        }
        if (geofs.aircraft.instance.id == 2988) {
            var pitch = geofs.animation.values.atilt;
            setTimeout(() => {
                if (geofs.animation.values.atilt + 50 < pitch || geofs.animation.values.atilt - 50 > pitch) {
                    geofs.aircraft.instance.definition.minimumSpeed = 1000;
                    console.log("Spin detected");
                    geofs.flyToCamera();
                    console.log("Spin fixed");
                    setTimeout(() => {
                        geofs.aircraft.instance.definition.minimumSpeed = 250;
                    }, 5000);
                }
            }, 500);
        }
    }
    fixyFixy = setInterval(function () {
        fixSpin();
    }, 1000);
    geofs.aircraftList["1000"].dir = "|models|aircraft|generics|c182|";
    var aircraftChecked = new Boolean(0);
    var script2 = document.createElement("script");
    script2.src = "https://raw.githack.com/NVB9ALT/GeoFS-Aircraft-Changes/main/Aircraft-fixes.js";
    document.body.appendChild(script2);
    script2.onload = function () {
        realismify();
    };
/* //Removed for now because it's buggy at certain times of day (flickering stars at dawn/dusk)
   //Besides, it didn't work anyway - probably overwritten by some other part of the GeoFS enviro engine
   //TODO: new implementation (possibly create new skybox?)
    function showTheStars() {
        if (geofs.aircraft.instance.altitude >= 80000 || geofs.isNight == 1) {
            geofs.api.viewer.scene.skyBox.show = 1;
        } else {
            geofs.api.viewer.scene.skyBox.show = 0;
        }
    }
    starsInterval = setInterval(function () {
        showTheStars();
    }, 1000);
*/
    function runBladeCollisions() {
        if (geofs.animation.values.aroll > 70 || geofs.animation.values.aroll < -70) {
            if (geofs.animation.values.haglFeet <= 5 && geofs.preferences.crashDetection == 1) {
                if (geofs.aircraft.instance.id == 9 || geofs.aircraft.instance.id == 52 || geofs.aircraft.instance.id == 2840 || geofs.aircraft.instance.id == 4090) {
                    geofs.aircraft.instance.crash();
                }
            }
        }
    }
    bladeCollisionInterval = setInterval(function () {
        runBladeCollisions();
    }, 1000);
    function runTurbAccel() {
        if (geofs.aircraft.instance.definition.maxRPM == 10000) {
            if (geofs.animation.values.rpm < 5999) {
                geofs.aircraft.instance.definition.engineInertia = 0.2;
            }
            if (geofs.animation.values.rpm >= 6000 && geofs.animation.values.rpm < 6999) {
                geofs.aircraft.instance.definition.engineInertia = 0.5;
            }
            if (geofs.animation.values.rpm >= 7000) {
                geofs.aircraft.instance.definition.engineInertia = 1;
            }
        }
    }
    turbAccelInt = setInterval(function () {
        runTurbAccel();
    }, 100);
    var scriptC = document.createElement("script");
    scriptC.src = "https://cdn.jsdelivr.net/gh/NVB9ALT/Weather-Mods@main/Advanced-2d-CloudsD.js";
    document.body.appendChild(scriptC);
    scriptC.onload = function () {
        fixCloudsDensity();
    };
    //kludge fix
    geofs.cons = true;
    var scriptCCP = document.createElement("script");
    scriptCCP.src = "https://raw.githack.com/NVB9ALT/GeoFS-Clickable-Cockpits/personal-proxy-config/main.js";
    document.body.appendChild(scriptCCP);
    scriptCCP.onload = function () {
        runClickableCockpits();
    };
    var scriptVC = document.createElement("script");
    scriptVC.src = "https://raw.githack.com/NVB9ALT/GeoFS-Effects-Rework/main/vortexCon.js";
    document.body.appendChild(scriptVC);
    scriptVC.onload = function () {
        runVortexCons();
    };
    var scriptFBW = document.createElement("script");
    scriptFBW.src = "https://raw.githack.com/NVB9ALT/Fighter-jet-FBW/main/main.js";
    document.body.appendChild(scriptFBW);
    scriptFBW.onload = function () {
        addFBW()
    }

shaLoaded = 0
loadInterval = setInterval(function(){
	if (shaLoaded == 0 && geofs.fx.overg.shader) {
    var scriptSHA = document.createElement("script");
    scriptSHA.src = "https://raw.githack.com/Ariakim-Taiyo/GeoFS-Shaders-Repository/main/SSR/SSR.js";
    document.body.appendChild(scriptSHA);
    shaLoaded = 1
	}
}, 1000)
    var scriptSB = document.createElement("script");
    scriptSB.src = "https://raw.githack.com/NVB9ALT/GeoFS-sound-changes/main/main.js";
    document.body.appendChild(scriptSB);
    scriptSB.onload = function () {
        addEffects();
    };
    var scriptCCI = document.createElement("script");
    scriptCCI.src = "https://raw.githack.com/NVB9ALT/Fixed-CC-PFDs-and-HUDs/main/fix.js";
    document.body.appendChild(scriptCCI);
    scriptCCI.onload = function () {
        redoPFDSHUDS();
    };
    var scriptEJ = document.createElement("script");
    scriptEJ.src = "https://cdn.jsdelivr.net/gh/NVB9ALT/Fighter-jet-ejections@main/mainG.js";
    document.body.appendChild(scriptEJ);
    scriptEJ.onload = function () {
        runEjections();
    };

geofs.aircraft.instance.animationValue.spoilerArming = 0

controls.setters.setSpoilerArming = {
    label: "Spoiler Arming",
    set: function () {
        if (!geofs.aircraft.instance.groundContact && controls.airbrakes.position === 0){
        geofs.aircraft.instance.animationValue.spoilerArming = 1
        }
    },
};

controls.setters.setAirbrakes= {
    label: "Air Brakes",
    set: function () {
        controls.airbrakes.target = 0 == controls.airbrakes.target ? 1 : 0;
        controls.setPartAnimationDelta(controls.airbrakes);
        geofs.aircraft.instance.animationValue.spoilerArming = 0
    },
}

instruments.definitions.spoilers.overlay.overlays[3] = {
    anchor: { x: 0, y: 0 },
    size: { x: 50, y: 50 },
    position: { x: 0, y: 0 },
    animations: [{ type: "show", value: "spoilerArming", when: [1] }],
    class: "control-pad-dyn-label green-pad",
    text: "SPLR<br/>ARM",
    drawOrder: 1
};

instruments.init(geofs.aircraft.instance.setup.instruments)

$(document).keydown(
    function (e) {
        if (e.which == 16){ //spoiler arming key is shift
            controls.setters.setSpoilerArming.set()
        }
    }
)

setInterval(
    function(){
        if(geofs.aircraft.instance.animationValue.spoilerArming === 1 && geofs.aircraft.instance.groundContact && controls.airbrakes.position === 0){
            controls.setters.setAirbrakes.set();
            geofs.aircraft.instance.animationValue.spoilerArming = 0;
        }
    },
100)

//add spoiler indicator for those planes that do not have it by themselves
setInterval(
    function(){
        if(["3292", "3054"].includes(geofs.aircraft.instance.id) && geofs.aircraft.instance.setup.instruments["spoilers"] === undefined){
            geofs.aircraft.instance.setup.instruments["spoilers"] = "";
            instruments.init(geofs.aircraft.instance.setup.instruments);
        }
    },
500)

    var scriptKCAS = document.createElement("script");
    scriptKCAS.src = "https://raw.githack.com/NVB9ALT/Bookmarklet_AP-Plus-Plus_and_FMC/main/Realistic%20KIAS.js";
    document.body.appendChild(scriptKCAS);
    scriptKCAS.onload = function () {
        runTrueKias();
    };
    var scriptML = document.createElement("script");
    scriptML.src = "https://raw.githack.com/kolos26/GEOFS-LiverySelector/main/main.js";
    document.body.appendChild(scriptML);
    localStorage.favorites = "";
    ui.notification.show("Favorite livery selections are possibly not saved at this time.")

    function lookBack() {
        if (geofs.camera.currentModeName == "cockpit" && geofsAddonAircraft.isF117 != 1) {
            geofs.camera.currentDefinition.position[0] = geofs.aircraft.instance.definition.cameras.cockpit.position[0] + geofs.camera.definitions["cockpit"].orientations.current[0] / 1000;
        }
    }
    lookBackInterval = setInterval(function () {
        lookBack();
    }, 100);
    var script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/gh/NVB9ALT/GeoFs-Carrier-Catapults-from-AriakimTaiyo@main/catapultsY.js";
    document.body.appendChild(script2);
    script2.onload = function () {
        runCatapults();
    };
    function checkOverlays() {
    if (Object.values(geofs.runways.nearRunways)[0].icao == "VNLK") {
       void(0)
    } else {
    geofs.runways.setRunwayModelVisibility(0)
    }
    };checkOverlayInt = setInterval(function(){checkOverlays()},1000)
    
    console.log("Original immersion SFX scripts copyright Ariakim Taiyo");
    console.log("Modified by NVB9 and Kolos26");
    
    //variable to tell if the script has run or not
    var b737Sounds = 0
    soundInt = null;
    tcasIntervalAnnounce = null;
    effectInterval = null;
    accelInt = null;
    flexInterval = null;
    
    function checkForBoeing737() {
    if (geofs.aircraft.instance.id == 4 || geofs.aircraft.instance.id == 3054) { //if the aircraft currently being flown is a 737
    if (b737Sounds != geofs.aircraft.instance.id){ //if the script hasn't already run on this aircraft
    //preventing errors
            clearInterval(soundInt);
            clearInterval(tcasIntervalAnnounce);
            clearInterval(accelInt);
            clearInterval(flexInterval);
    //running the script
    var script737 = document.createElement('script'); 
    script737.src="https://raw.githack.com/AbnormalHuman/GeoFS-737-Immersion-SFX/main/index.js";
    document.body.appendChild(script737);
    script737.onload = function(){clearInterval(tcasIntervalAnnounce)};
    
    //script has run now, so we change scriptHasRun to avoid having the script execute multiple times per aircraft instance
    //this avoids massive lag
    b737Sounds = geofs.aircraft.instance.id
          }
       }
    //if the aircraft isn't a 737
    else {
    //clearing the script when the aircraft isn't a 737 to avoid filling up the console with errors
    if (typeof soundInt != undefined) {
       clearInterval(soundInt)
       clearInterval(tcasIntervalAnnounce)
       clearInterval(accelInt)
       clearInterval(flexInterval)
    } else {
    void(0)
    };
    //making sure the script can run again next time a 737 is selected
        b737Sounds = 0
       }
    }
    
    //running the above function once per second
    checkInterval = setInterval(function(){
    checkForBoeing737()
    }, 1000)
    
    var b777sounds = new Boolean(0)
    
    function checkForBoeing777() {
    
    if (geofs.aircraft.instance.id == 240 || geofs.aircraft.instance.id == 25 || geofs.aircraft.instance.id == 4402) {
    if (b777sounds == 0){
    
    var script777 = document.createElement('script'); 
    script777.src="https://cdn.jsdelivr.net/gh/NVB9ALT/777-Realism-Overhaul-for-Realism-Addon@main/indexA.js";
    document.body.appendChild(script777);
    script777.onload = function (){change777s()}
    
    b777sounds = 1
          }
       } else {
    if (typeof effectInterval != undefined) {
       clearInterval(effectInterval)
    } else {
       void(0)
    }
        b777sounds = 0
       }
    }
    
    checkInterval1 = setInterval(function(){
    checkForBoeing777()
    }, 1000)
    
    //variable to tell if the script has run or not
        var a320Sounds = 0
    
        function checkFora320() {
        if (geofs.aircraft.instance.id == 2865 || geofs.aircraft.instance.id == 2870 || geofs.aircraft.instance.id == 2871 || geofs.aircraft.instance.id == 242 || geofs.aircraft.instance.id == 2843 || geofs.aircraft.instance.id == 2899 || geofs.aircraft.instance.id == 24 || geofs.aircraft.instance.id == 2973) { //if the aircraft currently being flown is a320 or a220 or a350
        if (a320Sounds != geofs.aircraft.instance.id){ //if the script hasn't already run on this aircraft
        //preventing errors
                clearInterval(soundInt);
                clearInterval(tcasIntervalAnnounce);
                clearInterval(accelInt);
                clearInterval(flexInterval);
        //running the script
        var a320script = document.createElement('script'); 
        a320script.src="https://raw.githack.com/kolos26/geofs-a320neo-sounds-byAriakimTaiyo/main/sounds.js";
        document.body.appendChild(a320script);
    
        //script has run now, so we change scriptHasRun to avoid having the script execute multiple times per aircraft instance
        //this avoids massive lag
        a320Sounds = geofs.aircraft.instance.id
            }
        }
        //if the aircraft isn't a 320
        else {
            //making sure the script can run again next time a 320 is selected
            a320Sounds = 0
        }
        }
    
        //running the above function once per second
        checkInterval2 = setInterval(function(){
        checkFora320()
        }, 1000)
    
    
    
    //Add them in the places where the normal PFDs & HUDs are
    
    geofs.calculatedAOA = null;
    function normalizeAroll() {
       var normalized = null;
    if (geofs.animation.values.aroll < 0) {
       normalized = geofs.animation.values.aroll * -1
    } else {
       normalized = geofs.animation.values.aroll
    }
       return normalized
    }
    function verifyAoA() {
       var verticalComp = normalizeAroll() - geofs.animation.values.atilt
        var zeroedGLoad = geofs.animation.values.loadFactor - 1
        var climbrate = geofs.animation.values.verticalSpeed //in ft/min or something similar
        var pitchControl = geofs.animation.values.pitch
        var rollControl = geofs.animation.values.roll
        var originalAOA = geofs.animation.values.aoa
        geofs.calculatedAOA = pitchControl//for now
    }
    aoaInterval = setInterval(function(){verifyAoA()},10)
    
    //now includes machmeter!
    instruments.renderers.genericHUD = function (a) {
            var b = exponentialSmoothing("smoothKias", geofs.animation.getValue("kias"), 0.1),
                c = [256, 256],
                d = a.canvasAPI.context;
            a.canvasAPI.clear();
            d.fillStyle = "#00ff00";
            d.strokeStyle = "#00ff00";
            d.save();
            d.beginPath();
            d.arc(c[0], c[1], 200, 0, 6.28);
            d.clip();
            a.drawGrads(a.canvasAPI, {
                position: c,
                center: [100, 100],
                zero: [100, 100],
                size: [200, 200],
                orientation: "y",
                direction: -1,
                rotation: geofs.animation.getValue("aroll") * DEGREES_TO_RAD,
                value: -geofs.animation.getValue("atilt"),
                interval: 5,
                pixelRatio: 20,
                pattern: [
                    [
                        {
                            length: 40,
                            offset: { x: -50, y: 0 },
                            legend: !0,
                            legendOffset: { x: -80, y: 5 },
                            process: function (e) {
                                return Math.round(e);
                            },
                        },
                        {
                            length: 40,
                            offset: { x: 10, y: 0 },
                            legend: !0,
                            legendOffset: { x: 60, y: 5 },
                            process: function (e) {
                                return Math.round(e);
                            },
                        },
                    ],
                ],
            });
            d.restore();
            a.canvasAPI.drawRotatedSprite({ image: a.images.overlays, origin: [248, 0], size: [36, 28], center: [18, 210], destination: [256, 256], rotation: geofs.animation.getValue("aroll") * DEGREES_TO_RAD, translation: [0, 0] });
            d.drawImage(a.images.background, 0, 0);
            a.canvasAPI.drawSprite({
                image: a.images.overlays,
                origin: [230, 239],
                size: [51, 30],
                center: [26, 15],
                destination: c,
                    //, clamp(100 * geofs.calculatedAOA, -150, 150)
                translation: [clamp(6.5 * geofs.animation.getValue("NAV1CourseDeviation"), -75, 75), clamp(300 * geofs.calculatedAOA, -250, 250)],
            });
            d.lineWidth = 2;
            d.font = "20px sans-serif";
            d.textAlign = "right";
            d.save();
            d.beginPath();
            d.rect(84, 116, 70, 280);
            d.rect(68, 243, 75, 25);
            d.clip("evenodd");
            a.drawGrads(a.canvasAPI, {
                position: [104, 116],
                zero: [0, 140],
                size: [50, 280],
                orientation: "y",
                direction: -1,
                value: b,
                interval: 10,
                pixelRatio: 1.3,
                align: "right",
                pattern: [
                    [{ length: -10, legend: !0, legendOffset: { x: -14, y: 7 } }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                    [{ length: -10 }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                    [{ length: -7 }],
                ],
                sprites: [{ image: a.images.overlays, origin: [143, 0], size: [25, 27], center: [-8, 13], value: geofs.autopilot.values.speed, clamp: !0 }],
            });
            d.restore();
            d.save();
            d.beginPath();
            d.rect(358, 116, 47, 280);
            d.rect(368, 243, 75, 25);
            d.clip("evenodd");
            a.drawGrads(a.canvasAPI, {
                position: [358, 116],
                zero: [0, 140],
                size: [47, 280],
                orientation: "y",
                direction: -1,
                value: geofs.animation.getValue("altitude"),
                interval: 100,
                pixelRatio: 0.13,
                pattern: [
                    [
                        {
                            length: 10,
                            legend: !0,
                            legendOffset: { x: 47, y: 7 },
                            process: function (e) {
                                return Math.round(e / 100);
                            },
                        },
                    ],
                    [{ length: 7 }],
                    [{ length: 7 }],
                    [{ length: 7 }],
                    [{ length: 7 }],
                ],
                sprites: [
                    { image: a.images.overlays, origin: [223, 0], size: [25, 62], center: [5, 31], value: geofs.autopilot.values.altitude, clamp: !0 },
                    { image: a.images.overlays, origin: [383, 0], size: [42, 255], center: [0, 0], value: geofs.animation.values.haglFeet },
                ],
            });
            d.restore();
            d.save();
            d.beginPath();
            d.rect(173, 440, 165, 30);
            d.clip("evenodd");
            d.textAlign = "center";
            a.drawGrads(a.canvasAPI, {
                position: [173, 440],
                zero: [82, 0],
                size: [165, 30],
                orientation: "x",
                direction: 1,
                value: geofs.animation.getValue("heading360"),
                interval: 5,
                pixelRatio: 7.25,
                pattern: [
                    [
                        {
                            length: 10,
                            legend: !0,
                            legendOffset: { x: 0, y: 30 },
                            process: function (e) {
                                return Math.round(fixAngle360(e) / 10);
                            },
                        },
                    ],
                    [{ length: 5 }],
                ],
            });
            d.restore();
            d.font = "20px sans-serif";
            d.textAlign = "right";
            d.fillText(Math.round(geofs.animation.getValue("kias")), 129, 264);
            d.fillText(Math.round(geofs.animation.getValue("altitude")), 441, 264);
            d.fillText(Math.round(geofs.calculatedAOA), 410, 426);
            d.fillText("M " + geofs.animation.getValue("mach").toFixed(2), 150, 425);
            c = b = a = "";
            geofs.autopilot.on && ((a = "SPD"), "NAV" == geofs.autopilot.mode ? ((b = "NAV"), geofs.autopilot.VNAV ? ((b = "LOC"), (c = "G/S")) : (c = "ALT")) : ((b = "HDG"), (c = "ALT")));
            d.fillText(a, 143, 446);
            d.fillText(c, 143, 466);
            d.fillText(b, 143, 486);
            d.textAlign = "left";
            d.fillText("G " + geofs.animation.getValue("loadFactor").toFixed(1), 143, 110);
        }
    
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    
    var droptankF16 = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/370_gal_drop_tank.glb"
    var condensationConesLarge = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/concones.glb"
    var condensationConesSmall = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/concones2.glb"
    var machCone = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/shockcone.glb"
    var parachute = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/parachute-proper.glb"
    var rainEffect = "https://geo-fs.com/models/precipitations/rain.gltf"
    var f18Afterburner = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/geofsf-a18cafterburner.glb"
    var f18GearUp = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/geofsf-a-18cgearup.glb"
    var f18GearDown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/geofsf-a-18cgeardown.glb"
    var f18Cockpit = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-18-cockpit.glb"
    var f18Airbrake = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-18-airbrake.glb"
    var mig17GearUp = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-17-gear-up.glb"
    var mig17GearDown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-17-gear-down.glb"
    var mig17speedbrake = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-17-speedbrakes.glb"
    var mig17Afterburner = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-17-afterburner.glb"
    var truckModel = "https://geo-fs.com/models/objects/vehicles/truck/multiplayer.glb"
    var su27airbrake = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/su-27_airbrake.glb"
    var f14airbrake = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_speedbrake.glb"
    var f14gearup = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_main_gear_up.glb"
    var f14geardown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_main_gear_down.glb"
    var f14wingstraight = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_wings_straight.glb"
    var f14wingswept = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_wings_swept.glb"
    var f14tailhookup = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f14a_tailhook_up.glb"
    var f14tailhookdown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f14a_tailhook_down.glb"
    var f14cockpit = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a_cockpit.glb"
    var f14burner = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f-14a-ab.glb"
    var e7antenna = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/e-7_wedgetail_antenna.glb"
    var mig21gearup = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_gear_up.glb"
    var mig21geardown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_gear_down.glb"
    var mig21afterburner = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_blowtorch.glb"
    var mig21droptank = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_fuel_tank.glb"
    var mig21nozzle = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_nozzle.glb"
    var mig21cockpit = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-21_cockpit.glb"
    var MsG = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/morane-saulnier_g.glb"
    var MsGprop = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/morane-saulnier_g_prop.glb"
    var MsGcockpit = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/morane-saulnier_g_cockpit.glb"
    var f117GearUp = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f117_gear_up.glb"
    var f117GearDown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f117_gear_down.glb"
    var f117cockpit = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/f117-cockpit.glb"
    var mig25geardown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-25_gear_down_2.glb"
    var mig25gearup = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-25_gear_up_2.glb"
    var mig25ab = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-25_afterburner_2.glb"
    var mig25flapsup = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-25_flaps_up_2.glb"
    var mig25flapsdown = "https://142420819-645052386429616373.preview.editmysite.com/uploads/1/4/2/4/142420819/mig-25_flaps_down_2.glb"
    
    let geofsAddonAircraft = {};
    geofsAddonAircraft.isFA18 = 0
    geofsAddonAircraft.isMig17 = 0
    geofsAddonAircraft.isTruck = 0
    geofsAddonAircraft.isF14A = 0
    geofsAddonAircraft.isE7 = 0
    geofsAddonAircraft.isMiG21 = 0
    geofsAddonAircraft.isMSG = 0
    geofsAddonAircraft.isF117 = 0
    geofsAddonAircraft.isMiG25 = 0

    geofs.debug.createMiG25GearDown = function() {
       geofs.debug.MiG25GearDown = {};
       geofs.debug.MiG25GearDown.model = new geofs.api.Model(mig25geardown)
    }
    geofs.debug.loadMiG25GearDown = function() {
       geofs.debug.MiG25GearDown || geofs.debug.createMiG25GearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG25GearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-25 Gear Down loading error. " + e)
        }
    }

    geofs.debug.createMiG25GearUp = function() {
       geofs.debug.MiG25GearUp = {};
       geofs.debug.MiG25GearUp.model = new geofs.api.Model(mig25gearup)
    }
    geofs.debug.loadMiG25GearUp = function() {
       geofs.debug.MiG25GearUp || geofs.debug.createMiG25GearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG25GearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-25 Gear Up loading error. " + e)
        }
    }

    geofs.debug.createMiG25FlapsUp = function() {
       geofs.debug.MiG25FlapsUp = {};
       geofs.debug.MiG25FlapsUp.model = new geofs.api.Model(mig25flapsup)
    }
    geofs.debug.loadMiG25FlapsUp = function() {
       geofs.debug.MiG25FlapsUp || geofs.debug.createMiG25FlapsUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG25FlapsUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-25 Flaps Up loading error. " + e)
        }
    }

    geofs.debug.createMiG25FlapsDown = function() {
       geofs.debug.MiG25FlapsDown = {};
       geofs.debug.MiG25FlapsDown.model = new geofs.api.Model(mig25flapsdown)
    }
    geofs.debug.loadMiG25FlapsDown = function() {
       geofs.debug.MiG25FlapsDown || geofs.debug.createMiG25FlapsDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG25FlapsDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-25 Flaps Down loading error. " + e)
        }
    }

    geofs.debug.createMiG25AB = function() {
       geofs.debug.MiG25AB = {};
       geofs.debug.MiG25AB.model = new geofs.api.Model(mig25ab)
    }
    geofs.debug.loadMiG25AB = function() {
       geofs.debug.MiG25AB || geofs.debug.createMiG25AB()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG25AB.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-25 Afterburner loading error. " + e)
        }
    }

    geofs.debug.createF117GearUp = function() {
       geofs.debug.F117GearUp = {};
       geofs.debug.F117GearUp.model = new geofs.api.Model(f117GearUp)
    }
    geofs.debug.loadF117GearUp = function() {
       geofs.debug.F117GearUp || geofs.debug.createF117GearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F117GearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-117 Nighthawk Gear Up loading error. " + e)
        }
    }
    geofs.debug.createF117Cockpit = function() {
       geofs.debug.F117Cockpit = {};
       geofs.debug.F117Cockpit.model = new geofs.api.Model(f117cockpit)
    }
    geofs.debug.loadF117Cockpit = function() {
       geofs.debug.F117Cockpit || geofs.debug.createF117Cockpit()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F117Cockpit.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-117 Nighthawk Cockpit loading error. " + e)
        }
    }
    geofs.debug.createF117GearDown = function() {
       geofs.debug.F117GearDown = {};
       geofs.debug.F117GearDown.model = new geofs.api.Model(f117GearDown)
    }
    geofs.debug.loadF117GearDown = function() {
       geofs.debug.F117GearDown || geofs.debug.createF117GearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F117GearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-117 Nighthawk Gear Down loading error. " + e)
        }
    }
    
    geofs.debug.createMsG = function() {
       geofs.debug.MsG = {};
        geofs.debug.MsG.model = new geofs.api.Model(MsG)
    }
    geofs.debug.loadMSG = function() {
       geofs.debug.MsG || geofs.debug.createMsG()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MsG.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Morane-Saulnier G loading error. " + e)
        }
    };
    geofs.debug.createMsGcockpit = function() {
       geofs.debug.MsGcockpit = {};
        geofs.debug.MsGcockpit.model = new geofs.api.Model(MsGcockpit)
    }
    geofs.debug.loadMSGcockpit = function() {
       geofs.debug.MsGcockpit || geofs.debug.createMsGcockpit()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MsGcockpit.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Morane-Saulnier G cockpit loading error. " + e)
        }
    };
    geofs.debug.createMsGprop = function() {
       geofs.debug.MsGprop = {};
        geofs.debug.MsGprop.model = new geofs.api.Model(MsGprop)
    }
    geofs.debug.loadMSGprop = function() {
       geofs.debug.MsGprop || geofs.debug.createMsGprop()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = [M33.getOrientation(geofs.aircraft.instance.object3d._rotation)[0], M33.getOrientation(geofs.aircraft.instance.object3d._rotation)[1], M33.getOrientation(geofs.aircraft.instance.object3d._rotation)[2]];
            geofs.debug.MsGprop.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Morane-Saulnier G propeller loading error. " + e)
        }
    };

    geofs.debug.createMig21Nozzle = function() {
       geofs.debug.Mig21Nozzle = {};
        geofs.debug.Mig21Nozzle.model = new geofs.api.Model(mig21nozzle)
    }
    geofs.debug.loadMig21Nozzle = function() {
       geofs.debug.Mig21Nozzle || geofs.debug.createMig21Nozzle()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21Nozzle.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Nozzle loading error. " + e)
        }
    };
    geofs.debug.createMig21Cockpit = function() {
       geofs.debug.Mig21Cockpit = {};
        geofs.debug.Mig21Cockpit.model = new geofs.api.Model(mig21cockpit)
    }
    geofs.debug.loadMig21Cockpit = function() {
       geofs.debug.Mig21Cockpit || geofs.debug.createMig21Cockpit()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21Cockpit.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Cockpit loading error. " + e)
        }
    };
    geofs.debug.createMig21GearUp = function() {
       geofs.debug.Mig21GearUp = {};
        geofs.debug.Mig21GearUp.model = new geofs.api.Model(mig21gearup)
    }
    geofs.debug.loadMig21GearUp = function() {
       geofs.debug.Mig21GearUp || geofs.debug.createMig21GearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21GearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Gear Up loading error. " + e)
        }
    };
    geofs.debug.createMig21GearDown = function() {
       geofs.debug.Mig21GearDown = {};
        geofs.debug.Mig21GearDown.model = new geofs.api.Model(mig21geardown)
    }
    geofs.debug.loadMig21GearDown = function() {
       geofs.debug.Mig21GearDown || geofs.debug.createMig21GearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21GearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Gear Down loading error. " + e)
        }
    };
    geofs.debug.createMig21AB = function() {
       geofs.debug.Mig21AB = {};
        geofs.debug.Mig21AB.model = new geofs.api.Model(mig21afterburner)
    }
    geofs.debug.loadMig21AB = function() {
       geofs.debug.Mig21AB || geofs.debug.createMig21AB()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21AB.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Afterburner loading error. " + e)
        }
    };
    geofs.debug.createMig21Tank = function() {
       geofs.debug.Mig21Tank = {};
        geofs.debug.Mig21Tank.model = new geofs.api.Model(mig21droptank)
    }
    geofs.debug.loadMig21Tank = function() {
       geofs.debug.Mig21Tank || geofs.debug.createMig21Tank()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.Mig21Tank.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mig-21 Drop Tank loading error. " + e)
        }
    };

    geofs.debug.createF14AGearUp = function() {
       geofs.debug.F14AGearUp = {};
        geofs.debug.F14AGearUp.model = new geofs.api.Model(f14gearup)
    }
    geofs.debug.loadF14AGearUp = function() {
       geofs.debug.F14AGearUp || geofs.debug.createF14AGearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14AGearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A Gear Up loading error. " + e)
        }
    };
    geofs.debug.createF14AGearDown = function() {
       geofs.debug.F14AGearDown = {};
        geofs.debug.F14AGearDown.model = new geofs.api.Model(f14geardown)
    }
    geofs.debug.loadF14AGearDown = function() {
       geofs.debug.F14AGearDown || geofs.debug.createF14AGearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14AGearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A Gear Down loading error. " + e)
        }
    };
    geofs.debug.createF14AWingStraight = function() {
       geofs.debug.F14AWingStraight = {};
        geofs.debug.F14AWingStraight.model = new geofs.api.Model(f14wingstraight)
    }
    geofs.debug.loadF14AWingStraight = function() {
       geofs.debug.F14AWingStraight || geofs.debug.createF14AWingStraight()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14AWingStraight.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A Straight Wings loading error. " + e)
        }
    };
    geofs.debug.createF14AWingSwept = function() {
       geofs.debug.F14AWingSwept = {};
        geofs.debug.F14AWingSwept.model = new geofs.api.Model(f14wingswept)
    }
    geofs.debug.loadF14AWingSwept = function() {
       geofs.debug.F14AWingSwept || geofs.debug.createF14AWingSwept()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14AWingSwept.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A Swept Wings loading error. " + e)
        }
    };
    geofs.debug.createF14ASpeedbrake = function() {
       geofs.debug.F14ASpeedbrake = {};
        geofs.debug.F14ASpeedbrake.model = new geofs.api.Model(f14airbrake)
    }
    geofs.debug.loadF14ASpeedbrake = function() {
       geofs.debug.F14ASpeedbrake || geofs.debug.createF14ASpeedbrake()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14ASpeedbrake.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A speedbrake loading error. " + e)
        }
    };
    geofs.debug.createF14ACockpit = function() {
       geofs.debug.F14ACockpit = {};
        geofs.debug.F14ACockpit.model = new geofs.api.Model(f14cockpit)
    }
    geofs.debug.loadF14ACockpit = function() {
       geofs.debug.F14ACockpit || geofs.debug.createF14ACockpit()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14ACockpit.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A cockpit loading error. " + e)
        }
    };
    geofs.debug.createF14ABurner = function() {
       geofs.debug.F14ABurner = {};
        geofs.debug.F14ABurner.model = new geofs.api.Model(f14burner)
    }
    geofs.debug.loadF14ABurner = function() {
       geofs.debug.F14ABurner || geofs.debug.createF14ABurner()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F14ABurner.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F-14A afterburner loading error. " + e)
        }
    };
    
    geofs.debug.createTruck = function() {
       geofs.debug.truck = {};
        geofs.debug.truck.model = new geofs.api.Model(truckModel)
    }
    geofs.debug.loadTruck = function() {
       geofs.debug.truck || geofs.debug.createTruck()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.truck.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Truck model loading error. " + e)
        }
    };

    geofs.debug.createSu27Airbrake = function() {
       geofs.debug.su27airbrake = {};
        geofs.debug.su27airbrake.model = new geofs.api.Model(su27airbrake)
    }
    geofs.debug.loadSu27Airbrake = function() {
       geofs.debug.su27airbrake || geofs.debug.createSu27Airbrake()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.su27airbrake.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Su-27 airbrake loading error. " + e)
        }
    };

    geofs.debug.createF18GearUp = function() {
       geofs.debug.F18GearUp = {};
        geofs.debug.F18GearUp.model = new geofs.api.Model(f18GearUp)
    }
    geofs.debug.loadF18GearUp = function() {
       geofs.debug.F18GearUp || geofs.debug.createF18GearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F18GearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F18 Gear Up loading error. " + e)
        }
    };
    geofs.debug.createF18GearDown = function() {
       geofs.debug.F18GearDown = {};
        geofs.debug.F18GearDown.model = new geofs.api.Model(f18GearDown)
    }
    geofs.debug.loadF18GearDown = function() {
       geofs.debug.F18GearDown || geofs.debug.createF18GearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F18GearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F18 Gear Down loading error. " + e)
        }
    };
    geofs.debug.createF18AB = function() {
       geofs.debug.F18AB = {};
        geofs.debug.F18AB.model = new geofs.api.Model(f18Afterburner)
    }
    geofs.debug.loadF18AB = function() {
       geofs.debug.F18AB || geofs.debug.createF18AB()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F18AB.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F18 AB loading error. " + e)
        }
    };
    geofs.debug.createF18Cockpit = function() {
       geofs.debug.F18Cockpit = {};
        geofs.debug.F18Cockpit.model = new geofs.api.Model(f18Cockpit)
    }
    geofs.debug.loadF18Cockpit = function() {
       geofs.debug.F18Cockpit || geofs.debug.createF18Cockpit()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F18Cockpit.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F18 cockpit loading error. " + e)
        }
    };
    geofs.debug.createF18Airbrake = function() {
       geofs.debug.F18Airbrake = {};
        geofs.debug.F18Airbrake.model = new geofs.api.Model(f18Airbrake)
    }
    geofs.debug.loadF18Airbrake = function() {
       geofs.debug.F18Airbrake || geofs.debug.createF18Airbrake()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F18Airbrake.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F18 airbrake loading error. " + e)
        }
    };
        
    geofs.debug.createMiG17GearUp = function() {
       geofs.debug.MiG17GearUp = {};
        geofs.debug.MiG17GearUp.model = new geofs.api.Model(mig17GearUp)
    }
    geofs.debug.loadMiG17GearUp = function() {
       geofs.debug.MiG17GearUp || geofs.debug.createMiG17GearUp()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG17GearUp.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-17 Gear Up loading error. " + e)
        }
    };
    geofs.debug.createMiG17GearDown = function() {
       geofs.debug.MiG17GearDown = {};
        geofs.debug.MiG17GearDown.model = new geofs.api.Model(mig17GearDown)
    }
    geofs.debug.loadMiG17GearDown = function() {
       geofs.debug.MiG17GearDown || geofs.debug.createMiG17GearDown()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG17GearDown.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-17 Gear Down loading error. " + e)
        }
    };
    geofs.debug.createMiG17AB = function() {
       geofs.debug.MiG17AB = {};
        geofs.debug.MiG17AB.model = new geofs.api.Model(mig17Afterburner)
    }
    geofs.debug.loadMiG17AB = function() {
       geofs.debug.MiG17AB || geofs.debug.createMiG17AB()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG17AB.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-17 AB loading error. " + e)
        }
    };
    geofs.debug.createMiG17Speedbrake = function() {
       geofs.debug.MiG17Speedbrake = {};
        geofs.debug.MiG17Speedbrake.model = new geofs.api.Model(mig17speedbrake)
    }
    geofs.debug.loadMiG17Speedbrake = function() {
       geofs.debug.MiG17Speedbrake || geofs.debug.createMiG17Speedbrake()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.MiG17Speedbrake.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("MiG-17 speedbrake loading error. " + e)
        }
    };
        
    geofs.debug.loadF16Tank = function() {
       geofs.debug.F16Tank || geofs.debug.createF16Tank()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.F16Tank.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("F16 tank loading error. " + e)
        }
    };

    geofs.debug.createMachCone = function() {
       geofs.debug.machCone = {};
        geofs.debug.machCone.model = new geofs.api.Model(machCone)
    }
    geofs.debug.loadMachCone = function() {
       geofs.debug.machCone || geofs.debug.createMachCone()
        try {
             geofs.debug.machCone.model._model.color.alpha = 0.9
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.machCone.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Mach cone loading error. " + e)
        }
    };

    geofs.debug.createParachute = function() {
       geofs.debug.parachute = {};
        geofs.debug.parachute.model = new geofs.api.Model(parachute)
    }
    geofs.debug.loadParachute = function() {
       geofs.debug.parachute || geofs.debug.createParachute()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.parachute.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Parachute loading error. " + e)
        }
    };

    geofs.debug.createConConesLarge = function() {
       geofs.debug.conConeLarge = {};
        geofs.debug.conConeLarge.model = new geofs.api.Model(condensationConesLarge)
    }
    geofs.debug.loadConConesLarge = function() {
       geofs.debug.conConeLarge || geofs.debug.createConConesLarge()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([Math.floor(Math.random() * 2) * 0.05, Math.floor(Math.random() * 2) * 0.05, Math.floor(Math.random() * 2) * 0.05], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.conConeLarge.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Condensation cone loading error. " + e)
        }
    };

    geofs.debug.createConConesSmall = function() {
       geofs.debug.conConeSmall = {};
        geofs.debug.conConeSmall.model = new geofs.api.Model(condensationConesSmall)
    }
    geofs.debug.loadConConesSmall = function() {
       geofs.debug.conConeSmall || geofs.debug.createConConesSmall()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([Math.floor(Math.random() * 2) * 0.05, Math.floor(Math.random() * 2) * 0.05, Math.floor(Math.random() * 2) * 0.05], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.conConeSmall.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("Condensation cone loading error. " + e)
        }
    };

    geofs.debug.createE7Antenna = function() {
       geofs.debug.E7Antenna = {};
        geofs.debug.E7Antenna.model = new geofs.api.Model(e7antenna)
    }
    geofs.debug.loadE7Antenna = function() {
       geofs.debug.E7Antenna || geofs.debug.createE7Antenna()
        try {
            var c = V3.add(geofs.aircraft.instance.llaLocation, xyz2lla([0, 0, 0], geofs.aircraft.instance.llaLocation)),
                d = M33.getOrientation(geofs.aircraft.instance.object3d._rotation);
            geofs.debug.E7Antenna.model.setPositionOrientationAndScale(c, d);
        } catch (e) {
            throw("E-7 AEW&C antenna loading error. " + e)
        }
    };

    geofs.debug.update = function (a) {
        geofs.debug.fps = exponentialSmoothing("fps", 1e3 / a).toPrecision(2);
        if (geofs.debugOn) {
            if ((a = $(".debugPointName")[0])) {
                a = a.value;
                var b = geofs.aircraft.instance.parts[a],
                    c = instruments.list[a];
                if (b) {
                    var d = $(".debugCollisionPointIndex")[0].value;
                    d
                        ? ((d = b.collisionPoints[parseInt(d)] || b.points[d]), geofs.debug.placeAxis(b.object3d.getWorldFrame(), d.worldPosition))
                        : ($(".debugShowForceSource")[0].checked && geofs.debug.placeAxis(b.object3d.getWorldFrame(), b.points.forceSourcePoint.worldPosition),
                          $(".debugShowForceDirection")[0].checked && geofs.debug.placeAxis(b.object3d.getWorldFrame(), b.points.forceDirection.worldPosition),
                          $(".debugShowLocalPosition")[0].checked && geofs.debug.placeAxis(b.object3d.getWorldFrame(), b.object3d.worldPosition),
                          $(".debugShowsuspensionOrigin")[0].checked && geofs.debug.placeAxis(b.object3d.getWorldFrame(), b.points.suspensionOrigin.worldPosition));
                    $(".debugPartData").html("Node Origin: " + b.object3d._nodeOrigin);
                }
                c && c.definition.cockpit && ((b = c.definition.cockpit.position), geofs.debug.placeAxis(geofs.aircraft.instance.object3d.getWorldFrame(), b.worldPosition));
                "camera" == a && ((b = geofs.aircraft.instance.definition.camera.cockpit), geofs.aircraft.instance.object3d.setVectorWorldPosition(b), geofs.debug.placeAxis(geofs.aircraft.instance.object3d.getWorldFrame(), b.worldPosition));
            }
            geofs.debug.placingObjectId = $(".objectId").val();
            geofs.debug.placingObjectId &&
                $(".geofs-debugObjectLlaHtr").text(geofs.objects.getLla(geofs.debug.placingObjectId) + " " + geofs.objects.getHtr(geofs.debug.placingObjectId) + " " + geofs.objects.getScale(geofs.debug.placingObjectId));
        }
         // brake parachute
         if (geofs.aircraft.instance.id == 7) { //compile database
      if (geofs.animation.values.airbrakesTarget > 0 && geofs.animation.values.kias >= 10 && geofs.animation.values.kias <= 200) {
    geofs.debug.loadParachute()
    //increase drag a lot without having it increment (somehow)
    //separate function for each aircraft? would definitely be doable
    geofs.aircraft.instance.definition.dragFactor = 10
      } else {
    geofs.aircraft.instance.definition.dragFactor = 0.5
      }
         }
      if (geofsAddonAircraft.isSu27 == 1 && geofs.animation.values.airbrakesTarget > 0) {
        geofs.debug.loadSu27Airbrake()
      }
      if (geofs.animation.values.mach > 0.95 && geofs.animation.values.mach < 1.05 && geofs.aircraft.instance.id != 2364 && geofs.cons == true) {
         geofs.debug.loadMachCone()
      }
      if (geofs.aircraft.instance.id == 18 && geofs.animation.values.kias > 50 && geofs.animation.values.accZ > 60 && geofs.cons == true && geofsAddonAircraft.isFA18 != 1 ) {
        geofs.debug.loadConConesLarge()
      }
      if (geofs.aircraft.instance.id == 18 && geofs.animation.values.kias > 50 && geofs.animation.values.accZ > 60 && geofs.cons == true && geofsAddonAircraft.isFA18 == 1 ) {
        geofs.debug.loadConConesSmall()
      }
      if (geofs.aircraft.instance.id == 7 && geofs.animation.values.kias > 50 && geofs.animation.values.accZ > 60 && geofs.cons == true && geofsAddonAircraft.isMiG21 != 1) {
        geofs.debug.loadConConesSmall()
      }
      if (geofs.aircraft.instance.id == 2857 && geofs.animation.values.kias > 50 && geofs.animation.values.accZ > 60 && geofs.cons == true) {
        geofs.debug.loadConConesSmall()
      }
      //load cockpit for DHC-8 Q400
      //edit emb120 cockpit in vectary
      if (geofs.aircraft.instance.id == 247 && geofs.camera.currentModeName == "cockpit") {
        void(0) //placeholder
      }
    
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" && geofs.animation.values.gearTarget == 1) {
        geofs.debug.loadF14AGearUp()
      }
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" && geofs.animation.values.gearTarget == 0) {
        geofs.debug.loadF14AGearDown()
      }
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" && controls.optionalAnimatedPart.target == 0) {
        geofs.debug.loadF14AWingStraight()
      }
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" && controls.optionalAnimatedPart.target == 1) {
        geofs.debug.loadF14AWingSwept()
      }
      //if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" &&) {
      //}
      //if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" &&) {
      //}
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view != "cockpit" && geofs.animation.values.airbrakesTarget == 1) {
        geofs.debug.loadF14ASpeedbrake()
      }
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.view == "cockpit") {
        geofs.debug.loadF14ACockpit()
      }
      if (geofsAddonAircraft.isF14A == 1 && geofs.animation.values.rpm > 9100) {
	 geofs.debug.loadF14ABurner()
      }
    
      if (geofsAddonAircraft.isFA18 == 1 && geofs.animation.values.airbrakesTarget == 1) {
        geofs.debug.loadF18Airbrake()  
      }
      if (geofsAddonAircraft.isFA18 == 1 && geofs.animation.values.gearTarget == 0) {
        geofs.debug.loadF18GearDown()
      }
      if (geofsAddonAircraft.isFA18 == 1 && geofs.animation.values.gearTarget == 1) {
        geofs.debug.loadF18GearUp()
      }
      if (geofsAddonAircraft.isFA18 == 1 && geofs.animation.values.rpm >= 9100) {
        geofs.debug.loadF18AB()
      }
      if (geofsAddonAircraft.isFA18 == 1 && geofs.animation.values.view == "cockpit") {
        geofs.debug.loadF18Cockpit()
      }
    
      if (geofsAddonAircraft.isMig17 == 1 && geofs.animation.values.airbrakesTarget == 1) {
        geofs.debug.loadMiG17Speedbrake()
      }
      if (geofsAddonAircraft.isMig17 == 1 && geofs.animation.values.gearTarget == 0 && geofs.animation.values.view != "cockpit") {
        geofs.debug.loadMiG17GearDown()
      }
      if (geofsAddonAircraft.isMig17 == 1 && geofs.animation.values.gearTarget == 1 && geofs.animation.values.view != "cockpit") {
        geofs.debug.loadMiG17GearUp()
      }
      if (geofsAddonAircraft.isMig17 == 1 && geofs.animation.values.rpm >= 9100) {
        geofs.debug.loadMiG17AB()
      }
      if (geofsAddonAircraft.isE7 == 1) {
        geofs.debug.loadE7Antenna()
      }
      if (geofsAddonAircraft.isMiG21 == 1 && geofs.animation.values.gearTarget == 0 && geofs.animation.values.view != "cockpit") {
          geofs.debug.loadMig21GearDown()
          geofs.debug.loadMig21Nozzle()
      }
      if (geofsAddonAircraft.isMiG21 == 1 && geofs.animation.values.gearTarget == 1 && geofs.animation.values.view != "cockpit") {
          geofs.debug.loadMig21GearUp()
          geofs.debug.loadMig21Nozzle()
      }
      if (geofsAddonAircraft.isMiG21 == 1 && geofs.animation.values.view == "cockpit") {
          geofs.debug.loadMig21Cockpit()
      }
      if (geofsAddonAircraft.isMiG21 == 1 && geofs.animation.values.rpm >= 9100) {
          geofs.debug.loadMig21AB()
      }
      if (geofsAddonAircraft.isMiG21 == 1 && controls.optionalAnimatedPart.target == 1) {
          geofs.debug.loadMig21Tank()
      }
      if (geofsAddonAircraft.isMSG == 1 && geofs.animation.values.view != "cockpit") {
          geofs.debug.loadMSG();
      }
      if (geofsAddonAircraft.isMSG == 1 && geofs.animation.values.view != "cockpit" && geofs.animation.values.enginesOn == 0) {
          geofs.debug.loadMSGprop();
      }
      if (geofsAddonAircraft.isMSG == 1 && geofs.animation.values.view == "cockpit") {
          geofs.debug.loadMSGcockpit();
      }
      if (geofsAddonAircraft.isF117 == 1 && geofs.animation.values.gearTarget == 1 && geofs.animation.values.view != "cockpit") {
         geofs.debug.loadF117GearUp();
      }
      if (geofsAddonAircraft.isF117 == 1 && geofs.animation.values.gearTarget == 0 && geofs.animation.values.view != "cockpit") {
         geofs.debug.loadF117GearDown();
      }
      if (geofsAddonAircraft.isF117 == 1 && geofs.animation.values.view == "cockpit") {
         geofs.debug.loadF117Cockpit();
      }
      if (geofsAddonAircraft.isMiG25 == 1 && geofs.animation.values.gearTarget == 1) {
	 geofs.debug.loadMiG25GearUp()
	 geofs.debug.loadMiG25FlapsUp()
      }
      if (geofsAddonAircraft.isMiG25 == 1 && geofs.animation.values.gearTarget == 0) {
	 geofs.debug.loadMiG25GearDown()
	 geofs.debug.loadMiG25FlapsDown()
      }
      if (geofsAddonAircraft.isMiG25 == 1 && geofs.animation.values.rpm > 9000) {
	 geofs.debug.loadMiG25AB()
      }
        
      if (geofsAddonAircraft.isTruck == 1) {
        geofs.debug.loadTruck()  
      }
    };

/*
flight.setAnimationValues = function (a, b) {
//a = e from flight.tick
    var c = geofs.aircraft.instance,
        d = geofs.animation.values,
        e = c.llaLocation[2] * METERS_TO_FEET,
        g = (60 * (e - c.oldAltitude * METERS_TO_FEET)) / a;
    c.oldAltitude = c.llaLocation[2];
    var f = fixAngle(weather.currentWindDirection - c.htr[0]),
        k = c.engine.rpm * c.definition.RPM2PropAS * a;
    d.acceleration = M33.transform(M33.transpose(c.object3d._rotation), c.rigidBody.v_acceleration);
    d.accX = d.acceleration[0];
    d.accY = d.acceleration[1];
    d.accZ = d.acceleration[2];
    d.loadFactor = d.acceleration[2] / GRAVITY;
    d.slipball = exponentialSmoothing("slipball", d.acceleration[0], 0.02);
    d.ktas = c.trueAirSpeed * MS_TO_KNOTS;
    d.kiasChangeRate = (d.ktas - d.ktas) * a;
    d.kias = d.kcas;
    d.kiasUnits = d.ktas % 10;
    d.kiasTens = d.ktas % 100;
    d.kiasHundreds = d.ktas % 1e3;
    d.kiasThousands = d.ktas % 1e4;
    d.groundSpeed = c.groundSpeed;
    d.groundSpeedKnt = c.groundSpeed * MS_TO_KNOTS;
    d.altitudeMeters = c.llaLocation[2];
    d.altitude = e;
    d.haglMeters = geofs.relativeAltitude;
    d.haglFeet = geofs.relativeAltitude * METERS_TO_FEET;
    d.groundElevationFeet = geofs.groundElevation * METERS_TO_FEET;
    d.verticalSpeed = g;
    d.climbrate = g;
    d.aoa = c.angleOfAttackDeg;
    d.turnrate = (60 * fixAngle(c.htr[0] - d.heading)) / a;
    d.pitchrate = (60 * fixAngle(c.htr[1] - d.atilt)) / a;
    d.heading = c.htr[0];
    d.heading360 = fixAngle360(c.htr[0]);
    d.atilt = c.htr[1];
    d.aroll = c.htr[2];
    d.enginesOn = c.engine.on;
    d.engineVibration = 100 < c.engine.rpm ? Math.random() * clamp(1e3 / c.engine.rpm, 0, 1) : 0;
    d.prop = fixAngle360(d.prop + k);
    d.thrust = c.totalThrust;
    d.rpm = c.engine.rpm;
    d.throttle = controls.throttle;
    d.mixture = controls.mixture;
    d.carbHeat = controls.carbHeat;
    d.smoothThrottle = exponentialSmoothing("throttle", d.throttle, 0.02);
    d.pitch = controls.pitch;
    d.rawPitch = controls.rawPitch;
    d.roll = controls.roll;
    d.yaw = controls.yaw;
    d.rawYaw = controls.rawYaw;
    d.trim = controls.elevatorTrim;
    d.brakes = controls.brakes;
    d.gearPosition = controls.gear.position;
    d.invGearPosition = 1 - controls.gear.position;
    d.gearTarget = controls.gear.target;
    d.flapsValue = controls.flaps.position / controls.flaps.maxPosition;
    d.accessoriesPosition = controls.accessories.position;
    d.flapsPosition = controls.flaps.position;
    d.flapsTarget = controls.flaps.target;
    d.flapsPositionTarget = controls.flaps.positionTarget;
    d.flapsMaxPosition = controls.flaps.maxPosition;
    d.airbrakesPosition = controls.airbrakes.position;
    d.optionalAnimatedPartPosition = controls.optionalAnimatedPart.position;
    d.airbrakesTarget = controls.airbrakes.target;
    d.parkingBrake = c.brakesOn;
    d.groundContact = c.groundContact ? 1 : 0;
    d.arrestingHookTension = c.arrestingCableContact ? V3.length(c.arrestingCableContact.force) : 0;
    d.airTemp = weather.atmosphere.airTempAtAltitude;
    d.mach = c.trueAirSpeed / (331.3 + 0.606 * weather.atmosphere.airTempAtAltitude);
    d.machUnits = Math.floor(d.mach);
    d.machTenth = Math.floor(10 * (d.mach % 1).toPrecision(2));
    d.machHundredth = Math.floor(100 * (d.mach % 0.1).toPrecision(2));
    d.altTenThousands = e % 1e5;
    d.altThousands = e % 1e4;
    d.altHundreds = e % 1e3;
    d.altTens = e % 100;
    d.altTensShift = Math.floor((e % 1e5) / 1e4);
    d.altUnits = e % 10;
    d.relativeWind = f;
    d.windSpeed = weather.currentWindSpeed;
    d.windSpeedLabel = parseInt(weather.currentWindSpeed) + " kts";
    d.view = geofs.camera.currentView;
    d.envelopeTemp = c.envelopeTemp;
    d["aircraft.maxAngularVRatio"] = c.maxAngularVRatio;
    d.rollingSpeed = c.groundContact ? c.velocityScalar : 0;
    "free" == geofs.camera.currentModeName || "chase" == geofs.camera.currentModeName
        ? ((c = geofs.utils.llaDistanceInMeters(geofs.camera.lla, c.llaLocation)), (d.cameraAircraftSpeed = (d.cameraAircraftDistance - c) / a), (d.cameraAircraftDistance = c))
        : ((d.cameraAircraftSpeed = 0), (d.cameraAircraftDistance = 0));
    d.geofsTime = b;
    geofs.api.postMessage({ animationValues: d });
};
geofs.kiasOn = 1
*/

geofsAddonAircraft = {};
//Generic addon aircraft tailhook:
//Any aircraft running this tailhook MUST run the function on an interval of 10ms or the hook only has 10% the strength
//All these functions made by AriakimTaiyo
geofsAddonAircraft.wireLLAs = [[37.779434570552304, -122.60905835885147, 25]]; //geofs.aircraft.instance.llaLocation
geofsAddonAircraft.stopForce = -(geofs.aircraft.instance.rigidBody.mass * 1.1);
geofsAddonAircraft.landed = 0;
geofsAddonAircraft.resolveForceVector = function(force, angle) {
  var fx = force * (Math.cos(angle * (Math.PI/180)));
  var fy = force * (Math.sin(angle * (Math.PI/180)));
  return [fx, fy, 0];
}
geofsAddonAircraft.distance = function (pos1, pos2) {
  var a = pos2[0] - pos1[0];
  var b = pos2[1] - pos1[1];
  var c = pos2[2] - pos1[2];
  return Math.sqrt(a * a + b * b + c * c); 
}
//Master function
//This has a bug where at low FPS, it misses that window where groundSpeedKnt < qty and kachows you off the back of the carrier
//but I'm not gonna bother fixing it because approaching the carrier with CC multiplayer models turned on literally crashes my computer
//The inconsiderate CCs think people playing GeoFS on school Chromebooks have 1000 dollars to drop on a PC that can run MSFS
//which we obviously don't
geofsAddonAircraft.runAddonTailhook = function(){
   geofsAddonAircraft.wireLLAs.forEach(function(e){
if (geofs.animation.values.gearPosition == 0 && geofsAddonAircraft.landed == 0 && geofs.animation.values.groundContact == 1 && geofsAddonAircraft.distance(geofs.aircraft.instance.llaLocation, e) < 10) {
   console.log("Hooking detected")
   geofs.aircraft.instance.rigidBody.applyCentralImpulse([geofsAddonAircraft.resolveForceVector(geofsAddonAircraft.stopForce, geofs.animation.values.heading360)[1], geofsAddonAircraft.resolveForceVector(geofsAddonAircraft.stopForce, geofs.animation.values.heading360)[0], geofsAddonAircraft.resolveForceVector(geofsAddonAircraft.stopForce, geofs.animation.values.heading360)[2]])
}
   })
	if (geofs.animation.values.groundSpeedKnt < 10 && geofs.animation.values.groundContact == 1) {
geofsAddonAircraft.landed = 1
console.log("Landed")
	}
	if (geofs.animation.values.groundContact == 0) {
geofsAddonAircraft.landed = 0
console.log("Airborne")
	}
}
//-----F/A-18C Hornet-----------------------------------------------------------------------------------------------------
//adding the button
geofsAddonAircraft.runFA18 = function(){
   console.log("Loading F/A-18C. Model credit cs09736. Model loaded under CC Attribution Share-Alike Liscense.")
   geofs.aircraft.instance.change(18, 4)
}
f18Li = document.createElement("li");
f18Li.innerHTML = '<div><img src="https://w7.pngwing.com/pngs/871/313/png-transparent-boeing-f-a-18e-f-super-hornet-mcdonnell-douglas-f-a-18-hornet-battlefield-3-rogerson-aircraft-corporation-airplane-boeing-767-video-game-fighter-aircraft-airplane.png">F/A-18C Hornet</div>';
f18Li.addEventListener("click", geofsAddonAircraft.runFA18);
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(f18Li)

geofs.f18instruments = new Boolean(0)
//the actual implementation lol:
function runHornet() {
   if (geofs.aircraft.instance.id == 18 && geofs.aircraft.instance.liveryId == 4) {
//removing the thrust vectoring
geofs.aircraft.instance.definition.parts[46].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[46].animations[1].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[1].ratio = 0.069;
//fcs (alpha and G limiter) and paddle switch
//Push controls forwards 0.02
//aoa > 0.09? or check if "stall" is lit
   if (geofs.animation.values.cobraMode == 1) {
geofs.aircraft.instance.definition.parts[2].area = 25
geofs.aircraft.instance.definition.parts[12].stalls = true
geofs.aircraft.instance.definition.parts[13].stalls = true
if (geofs.animation.values.airbrakesTarget > 0) {
   geofs.aircraft.instance.definition.dragFactor = 6
} else if (geofs.animation.values.accZ >= 30) {
   geofs.aircraft.instance.definition.dragFactor = 5
} else {
   geofs.aircraft.instance.definition.dragFactor = 0.9
}
   } else {
geofs.aircraft.instance.definition.parts[2].area = 17
geofs.aircraft.instance.definition.parts[12].stalls = false
geofs.aircraft.instance.definition.parts[13].stalls = false
if (geofs.animation.values.airbrakesTarget > 0) {
   geofs.aircraft.instance.definition.dragFactor = 6
} else if (geofs.animation.values.accZ >= 50) {
   geofs.aircraft.instance.definition.dragFactor = 5
} else {
   geofs.aircraft.instance.definition.dragFactor = 0.9
}
   }
//making the LERX stall like a delta wing (bc it kinda is)
geofs.aircraft.instance.definition.parts[2].stallIncidence = 25
geofs.aircraft.instance.definition.parts[2].zeroLiftIncidence = 70
//The actual wings have delayed lift loss, because the leading edge vortex streaming off the LERX
//sticks to the wing and maintains the pressure differential
geofs.aircraft.instance.definition.parts[3].stallIncidence = 25
geofs.aircraft.instance.definition.parts[3].zeroLiftIncidence = 50
geofs.aircraft.instance.definition.parts[3].area = 15
geofs.aircraft.instance.definition.parts[4].stallIncidence = 25
geofs.aircraft.instance.definition.parts[4].zeroLiftIncidence = 50
geofs.aircraft.instance.definition.parts[4].area = 15
//Tuning the stabilizer area
geofs.aircraft.instance.definition.parts[11].area = 3
//Adjusting engine power
geofs.aircraft.instance.engines[0].thrust = 50000
geofs.aircraft.instance.engines[0].afterBurnerThrust = 87000
geofs.aircraft.instance.engines[1].thrust = 50000
geofs.aircraft.instance.engines[1].afterBurnerThrust = 87000
//Maintaining 1:1 TWR
geofs.aircraft.instance.definition.mass = 17000
audio.soundplayer.setRate(geofs.aircraft.instance.definition.sounds[3].id, 0.5) //Sound pitch modification
//Tailhook
geofsAddonAircraft.runAddonTailhook()
//Replacing the tires lol
geofs.aircraft.instance.definition.contactProperties = {
        "wheel": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
        	"rollingFriction": 0.00001,
            "damping": 1
        },
        "frame": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
            "damping": 1
        },
	    "airfoil": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
            "damping": 1
        },
        "hook": {
            "frictionCoef": 2,
            "dynamicFriction": 0.01,
            "damping": 1
        }
    };
//Adding the airbrake
geofs.aircraft.instance.definition.airbrakesTravelTime = 1;
geofs.aircraft.instance.definition.instruments.spoilers = "";
geofs.aircraft.instance.definition.instruments.correctHUD = {
            "cockpit": {
                "position": [-0.01, 8.3, 1.23],
                "scale": 0.4
            },
            "animations": [
                {"value": "view", "type": "show", "eq": "cockpit"}
            ]
	}
if (geofs.f18instruments == 0) {
   instruments.init(geofs.aircraft.instance.setup.instruments)
   geofs.f18instruments = 1
}
setTimeout(() => {
   geofsAddonAircraft.isFA18 = 1
},5000)
setTimeout(() => {
   	 geofs.aircraft.instance.definition.parts[0].animations[0].value = "rpm"
	 geofs.aircraft.instance.definition.parts[0].animations[0].gt = -1
   	 geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].value = "rpm"
	 geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].gt = -1
	 geofs.aircraft.instance.definition.parts[50].animations[0].gt = 100000
	 geofs.aircraft.instance.definition.parts[55].animations[0].gt = 100000
},10000)
   } else {
geofsAddonAircraft.isFA18 = 0
geofs.f18instruments = 0
   }
}
checkRunHornetInterval = setInterval(function(){runHornet()},10)

//-----Mig-17 Fresco-----------------------------------------------------------------------------------------------------
geofsAddonAircraft.isMig17 = 0
geofsAddonAircraft.runMiG17 = function(){
   console.log("Loading MiG-17. Model credit manilov.ap")
}
mig17Li = document.createElement("li");
mig17Li.innerHTML = '<div><img src="https://finescale.com/~/media/images/workbench-reviews/2020/february-2020/fsmwb1219_zvezda_mig17_01.jpg">Mikoyan-Gurevich MiG-17 "Fresco"</div>';
mig17Li.addEventListener("click", geofsAddonAircraft.runMiG17);
//this works actually
mig17Li.setAttribute("data-aircraft", 3)
mig17Li.setAttribute("data-livery", 1)
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(mig17Li)
function runMiG17() {
   if (geofs.aircraft.instance.id == 3 && geofs.aircraft.instance.liveryId == 1) {
geofs.aircraft.instance.definition.parts[3].area = 3
geofs.aircraft.instance.definition.parts[4].area = 3
geofs.aircraft.instance.definition.parts[8].liftFactor = 7
geofs.aircraft.instance.definition.parts[9].liftFactor = 7
geofs.aircraft.instance.definition.parts[8].dragFactor = 1
geofs.aircraft.instance.definition.parts[9].dragFactor = 1
geofs.aircraft.instance.definition.parts[16].liftFactor = 8
geofs.aircraft.instance.engines[0].thrust = 15000
geofs.aircraft.instance.engines[1].thrust = 15000
geofs.aircraft.instance.engines[0].afterBurnerThrust = 20000
geofs.aircraft.instance.engines[1].afterBurnerThrust = 20000
   if (geofs.animation.values.view == "cockpit") {
geofs.aircraft.instance.cockpitSetup.parts[1].object3d.model._model.color.alpha = 0
   }
setTimeout(() => {
   geofsAddonAircraft.isMig17 = 1
},5000)
setTimeout(() => {
   geofs.aircraft.instance.definition.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[0].animations[0].gt = -1
},10000)
   } else {
geofsAddonAircraft.isMig17 = 0
   }
}
mig17Int = setInterval(function(){runMiG17()},100)

//-----Su-27 Flanker (the OG one)---------------------------------------------------------------------------------------
geofsAddonAircraft.isSu27 = new Boolean(0)
geofs.debug.su27Instruments = new Boolean(0)
geofsAddonAircraft.runSu27 = function(){
   geofs.aircraft.instance.change(18, 1)
}
flankerLi = document.createElement("li");
flankerLi.innerHTML = '<div><img src="images/planes/su35_1.png">Sukhoi Su-27 Flanker</div>';
flankerLi.addEventListener("click", geofsAddonAircraft.runSu27);
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(flankerLi)
function runSu27() {
if (geofs.aircraft.instance.id == 18 && geofs.aircraft.instance.liveryId == 1) {
geofsAddonAircraft.isSu27 = 1
geofs.aircraft.instance.definition.airbrakesTravelTime = 1
geofs.aircraft.instance.definition.accessoriesTravelTime = 0.1
geofs.aircraft.instance.definition.parts[46].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[46].animations[1].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[1].ratio = 0.069;
geofs.aircraft.instance.engines[0].thrust = 60000
geofs.aircraft.instance.engines[0].afterBurnerThrust = 80000
geofs.aircraft.instance.engines[1].thrust = 60000
geofs.aircraft.instance.engines[1].afterBurnerThrust = 80000
   geofs.aircraft.instance.definition.parts[46].animations[2] = {};
	geofs.aircraft.instance.definition.parts[46].animations[2].type = "rotate";
	geofs.aircraft.instance.definition.parts[46].animations[2].axis = "Z";
	geofs.aircraft.instance.definition.parts[46].animations[2].value = "roll";
	geofs.aircraft.instance.definition.parts[46].animations[2].ratio = -10;
	geofs.aircraft.instance.definition.parts[46].animations[2].currentValue = null;
	geofs.aircraft.instance.definition.parts[46].animations[2].rotationMethod = function(a) {
      this._rotation = M33.rotationZ(this._rotation, a)
   };
   geofs.aircraft.instance.definition.parts[51].animations[2] = {};
	geofs.aircraft.instance.definition.parts[51].animations[2].type = "rotate";
	geofs.aircraft.instance.definition.parts[51].animations[2].axis = "Z";
	geofs.aircraft.instance.definition.parts[51].animations[2].value = "roll";
	geofs.aircraft.instance.definition.parts[51].animations[2].ratio = -10;
	geofs.aircraft.instance.definition.parts[51].animations[2].currentValue = null;
	geofs.aircraft.instance.definition.parts[51].animations[2].rotationMethod = function(a) {
      this._rotation = M33.rotationZ(this._rotation, a)
   };
	geofs.aircraft.instance.definition.parts[48].animations[0].gt = 9100
	geofs.aircraft.instance.definition.parts[53].animations[0].gt = 9100
if (geofs.debug.su27Instruments == 0) {
geofs.aircraft.instance.setup.instruments = {
        "cdi": "",
        "compass": "",
        "airspeedSupersonic": "",
        "attitudeJet": "",
        "altitude": "",
        "varioJet": "",
        "rpmJet": "",
		"brakes": "",		
		"gear": "",
		"flaps": "",
		"spoilers": ""
}
instruments.init(geofs.aircraft.instance.setup.instruments)
geofs.debug.su27Instruments = 1
}
if (geofs.animation.values.airbrakesTarget > 0) {
   geofs.aircraft.instance.definition.dragFactor = 7.5
} else if (geofs.animation.values.accZ >= 60) {
   geofs.aircraft.instance.definition.dragFactor = 5
} else {
   geofs.aircraft.instance.definition.dragFactor = 0.5
}
if (geofs.animation.values.cobraMode == 1) {
   geofs.aircraft.instance.definition.parts[2].area = 40
} else {
   geofs.aircraft.instance.definition.parts[2].area = 10
}
   } else {
geofs.debug.su27Instruments = 0
geofsAddonAircraft.isSu27 = 0
	}
};
Su27Int = setInterval(function(){runSu27()},100)
//clearInterval(Su27Int)
//-----E-7 Wedgetail AEW&C------------------------------------------------------------------------------------------------
geofsAddonAircraft.isE7 = 0
geofsAddonAircraft.runE7 = function(){
   console.log("Loading E-7 Wedgetail AEW&C.")
}
e7Li = document.createElement("li");
e7Li.innerHTML = '<div><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/B737_AEW%26C_Wedgetail_cut_model.PNG/220px-B737_AEW%26C_Wedgetail_cut_model.PNG">E-7 Wedgetail AEW&C</div>';
e7Li.addEventListener("click", geofsAddonAircraft.runE7);
//this works actually
e7Li.setAttribute("data-aircraft", 3292)
e7Li.setAttribute("data-livery", 1)
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(e7Li)
function runE7Wedgetail() {
   if (geofs.aircraft.instance.id == 3292 && geofs.aircraft.instance.liveryId == 1) {
geofsAddonAircraft.isE7 = 1
geofs.aircraft.instance.definition.mass = 75000
   } else {
geofsAddonAircraft.isE7 = 0
	}
}
e7int = setInterval(function(){runE7Wedgetail()},100)
//-----MiG-21 Fishbed-----------------------------------------------------------------------------------------------------
geofsAddonAircraft.runMig21 = function(){
	console.log("Loading MiG-21 Fishbed. Model credit manilov.ap.")
	controls.optionalAnimatedPart.target = 1
}
mig21Li = document.createElement("li");
mig21Li.innerHTML = '<div><img src="http://atlas-content-cdn.pixelsquid.com/stock-images/russian-fighter-mig-21-fishbed-jet-q1ylV3E-600.jpg">Mikoyan-Gurevich MiG-21 "Fishbed"</div>';
mig21Li.addEventListener("click", geofsAddonAircraft.runMig21);
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(mig21Li)
mig21Li.setAttribute("data-aircraft", 7)
mig21Li.setAttribute("data-livery", 1)

geofs.mig21instruments = new Boolean(0)
//clearInterval(mig21Interval)
function runMiG21() {
if (geofs.aircraft.instance.id == 7 && geofs.aircraft.instance.liveryId == 1) {
	geofs.aircraft.instance.definition.parts[2].zeroLiftIncidence = 90
	geofs.aircraft.instance.definition.parts[3].zeroLiftIncidence = 90
	geofs.aircraft.instance.definition.parts[6].area = 1
if (geofs.animation.values.kias >= 150 && geofs.animation.values.kias <= 225) {
	geofs.aircraft.instance.definition.parts[7].area = 0.5
	geofs.aircraft.instance.definition.parts[8].area = 0.5
	geofs.aircraft.instance.definition.parts[2].area = 10
	geofs.aircraft.instance.definition.parts[3].area = 10
} else {
	geofs.aircraft.instance.definition.parts[7].area = 2
	geofs.aircraft.instance.definition.parts[8].area = 2
	geofs.aircraft.instance.definition.parts[2].area = 7
	geofs.aircraft.instance.definition.parts[3].area = 7
}
if (geofs.animation.values.aoa > 14) {
   geofs.aircraft.instance.definition.dragFactor = 6
} else if (geofs.animation.values.aoa > 5) {
   geofs.aircraft.instance.definition.dragFactor = 3
} else {
   geofs.aircraft.instance.definition.dragFactor = 0.4
}
	geofs.aircraft.instance.definition.mass = 21000
	geofs.aircraft.instance.engine.thrust = 40000
if (controls.optionalAnimatedPart.target == 0) {
	geofs.aircraft.instance.engine.afterBurnerThrust = 90000
} else {
   geofs.aircraft.instance.engine.afterBurnerThrust = 60000
}
	geofs.aircraft.instance.definition.parts[12].liftFactor = 5
geofs.aircraft.instance.setup.instruments = {
        "cdi": "",
        "compass": "",
        "airspeedSupersonic": "",
        "attitudeJet": "",
        "altitude": "",
        "varioJet": "",
        "rpmJet": "",
		"brakes": "",		
		"gear": "",
		"flaps": "",
		"spoilers": ""
}
if (geofs.mig21instruments == 0) {
   instruments.init(geofs.aircraft.instance.setup.instruments)
   geofs.mig21instruments = 1
}
setTimeout(() => {
   geofsAddonAircraft.isMiG21 = 1
 },5000)
setTimeout(() => {
   geofs.aircraft.instance.definition.parts[0].animations[0] = {"type": "hide", "value": "rpm", "gt": -1}
	geofs.aircraft.instance.definition.parts[41].animations[0].gt = 100000
 },10000)
if (geofs.animation.values.view == "cockpit") {
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].gt = -1
	geofs.camera.currentDefinition.position[2] = geofs.aircraft.instance.definition.cameras.cockpit.position[2] - 0.15
   }
} else {
   geofsAddonAircraft.isMiG21 = 0
	geofs.mig21instruments = 0
}
}
mig21Interval = setInterval(function(){runMiG21()},100)
//-----Morane-Saulneir "G"-----------------------------------------------------------------------------------------------------
geofsAddonAircraft.isMsG = 0
geofsAddonAircraft.runMsG = function(){
   console.log("Loading Morane-Saulnier G. Model credit manilov.ap")
}
MsGLi = document.createElement("li");
MsGLi.innerHTML = '<div>Morane-Saulnier Type G</div>';
MsGLi.addEventListener("click", geofsAddonAircraft.runMsG);
MsGLi.setAttribute("data-aircraft", 8)
MsGLi.setAttribute("data-livery", 3)
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(MsGLi)
function runMsG() {
if (geofs.aircraft.instance.id == 8 && geofs.aircraft.instance.liveryId == 3) {
	geofs.aircraft.instance.definition.parts[4].area = 3
	geofs.aircraft.instance.definition.parts[5].area = 3
	geofs.aircraft.instance.definition.parts[6].area = 3
	geofs.aircraft.instance.definition.parts[7].area = 3
	geofs.aircraft.instance.definition.mass = 300
	geofs.aircraft.instance.definition.parts[30].thrust = 1500
	geofs.aircraft.instance.definition.parts[8].area = 0.069
	geofs.aircraft.instance.definition.parts[9].area = 0.069
	geofs.aircraft.instance.definition.parts[10].area = 0.2
	geofs.aircraft.instance.definition.parts[11].area = 0.2
	geofs.aircraft.instance.definition.dragFactor = 0.7
	geofs.aircraft.instance.definition.autopilot = false
   geofsAddonAircraft.isMSG = 1
	geofs.aircraft.instance.definition.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[0].animations[0].gt = -1
	if (geofs.animation.values.view == "cockpit") {
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].gt = -1
	}
} else {
geofsAddonAircraft.isMSG = 0	
}
}
msgInterval = setInterval(function(){runMsG()},100)
//----- F-117 -------------------------------------------------------------------------------------------------------------
geofsAddonAircraft.isF117 = 0;
geofs.debug.F117Instruments = 0;
geofsAddonAircraft.runF117 = function(){
   console.log("Loading F-117. Model credit manilov.ap")
}
f117Li = document.createElement("li");
f117Li.innerHTML = '<div><img src="https://cdn.shopify.com/s/files/1/0277/5197/2966/products/HA5807-3_1200x789.jpg">Lockheed F-117 "Nighthawk"</div>';
f117Li.addEventListener("click", geofsAddonAircraft.runF117);
//this works actually
f117Li.setAttribute("data-aircraft", 5)
f117Li.setAttribute("data-livery", 1)
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(f117Li)
function runF117() {
   if (geofs.aircraft.instance.id == 5 && geofs.aircraft.instance.liveryId == 1) {
	//Remove lights
	geofs.aircraft.instance.definition.parts[46].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[46].animations[0].lt = -1
   geofs.aircraft.instance.definition.parts[45].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[45].animations[0].lt = -1
	geofs.aircraft.instance.definition.parts[47].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[47].animations[0].lt = -1
   geofs.aircraft.instance.definition.parts[48].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[48].animations[0].lt = -1
   geofs.aircraft.instance.definition.parts[8].area = 5
setTimeout(() => {
	geofsAddonAircraft.isF117 = 1
},5000)
setTimeout(() => {
	geofs.aircraft.instance.definition.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[0].animations[0].gt = -1
}, 10000)
   //Wing area adjustment
	geofs.aircraft.instance.definition.parts[2].area = 4
	geofs.aircraft.instance.definition.parts[5].area = 4
	//Drag increase (flat panels = draggy airplane)
	geofs.aircraft.instance.definition.dragFactor = 0.5
	//Boost thrust to compensate for rise in dragFactor
	geofs.aircraft.instance.engines[0].thrust = 20000
	geofs.aircraft.instance.engines[1].thrust = 20000
	//remove flaps
	geofs.aircraft.instance.definition.flapsPositions = [0.01, 0.02, 0.03, 0.04, 0.05]
if (geofs.debug.F117Instruments == 0) {
	geofs.aircraft.instance.definition.instruments = {
        "hsi": "",
        "compass": "",
        "airspeedJet": "",
        "attitudeJet": "",
        "altitude": "",
        "varioJet": "",
        "rpmJet": "",
        "brakes": "",
        "gear": ""
}
	instruments.init(geofs.aircraft.instance.definition.instruments)
	geofs.debug.F117Instruments = 1
}
if (geofs.animation.values.view == "cockpit") {
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].gt = -1
	geofs.camera.currentDefinition.position[0] = geofs.aircraft.instance.definition.cameras.cockpit.position[0] + 0.35
	geofs.camera.currentDefinition.position[1] = geofs.aircraft.instance.definition.cameras.cockpit.position[1] - 0.2
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Stealth technology goes here (haven't been able to develop it)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   } else {
geofs.debug.F117Instruments = 0
geofsAddonAircraft.isF117 = 0
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//Stealth technology goes here (haven't been able to develop it)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	}
}
f117Int = setInterval(function(){runF117()},100)
//-----Grumman F-14A-----------------------------------------------------------------------------------------------------
geofsAddonAircraft.isF14A = 0
geofsAddonAircraft.F14AInstruments = 0
geofsAddonAircraft.runF14A = function(){
   console.log("Loading F-14A Tomcat. Model credit manilov.ap")
}
F14ALi = document.createElement("li");
F14ALi.innerHTML = '<div><img src="http://atlas-content-cdn.pixelsquid.com/stock-images/f-14-airplane-tomcat-fighter-jet-ENB74k2-600.jpg">Grumman F-14A Tomcat</div>';
F14ALi.addEventListener("click", geofsAddonAircraft.runF14A);
//this works actually
F14ALi.setAttribute("data-aircraft", 18)
F14ALi.setAttribute("data-livery", 6)
document.getElementsByClassName("geofs-list geofs-toggle-panel geofs-aircraft-list")[0].appendChild(F14ALi)
function runF14A() {
if (geofs.aircraft.instance.id == 18 && geofs.aircraft.instance.liveryId == 6) {
//Wing sweep physics
   if (geofs.animation.values.optionalAnimatedPartPosition < 1) {
geofs.aircraft.instance.definition.parts[3].area = 17
geofs.aircraft.instance.definition.parts[4].area = 17
geofs.aircraft.instance.definition.parts[2].area = 17
   } else {
geofs.aircraft.instance.definition.parts[3].area = 10
geofs.aircraft.instance.definition.parts[4].area = 10
geofs.aircraft.instance.definition.parts[2].area = 5
	}
//area refinements
geofs.aircraft.instance.definition.parts[11].area = 0.5
geofs.aircraft.instance.definition.parts[14].area = 5
geofs.aircraft.instance.definition.parts[15].area = 5
geofs.aircraft.instance.definition.parts[6].area = 5
geofs.aircraft.instance.definition.parts[5].area = 5
//removing the thrust vectoring
geofs.aircraft.instance.definition.parts[46].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[46].animations[1].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[0].ratio = 0.069;
geofs.aircraft.instance.definition.parts[51].animations[1].ratio = 0.069;
//TF30s having no thrust unless you go really fast
//mass is 25300 by default, try increasing it so thrust can increase as well
geofs.aircraft.instance.definition.mass = 35000
   if (geofs.animation.values.mach >= 1.75) {
geofs.aircraft.instance.engines[0].thrust = 85000
geofs.aircraft.instance.engines[0].afterBurnerThrust = 190000
geofs.aircraft.instance.engines[1].thrust = 85000
geofs.aircraft.instance.engines[1].afterBurnerThrust = 190000
	} else {
geofs.aircraft.instance.engines[0].thrust = 85000
geofs.aircraft.instance.engines[0].afterBurnerThrust = 145000
geofs.aircraft.instance.engines[1].thrust = 85000
geofs.aircraft.instance.engines[1].afterBurnerThrust = 145000
   }

//attempt at landing gear adjustment
geofs.aircraft.instance.definition.parts[17].collisionPoints[0][2] = -0.8
geofs.aircraft.instance.definition.parts[27].collisionPoints[0][2] = -0.8
//Sound adjustment
audio.soundplayer.setRate(geofs.aircraft.instance.definition.sounds[3].id, 0.5)
if (geofs.animation.values.view == "cockpit") {
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.cockpitSetup.parts[0].animations[0].gt = -1
geofs.camera.currentDefinition.position[1] = 6.4
geofs.camera.currentDefinition.position[2] = 1.08
}
//HUD
	geofs.aircraft.instance.setup.instruments.correctHUD = {
            "cockpit": {
                "position": [0, 7.109, 1.06],
                "scale": 0.65
            },
            "animations": [
                {"value": "view", "type": "show", "eq": "cockpit"}
            ]
	}
if (geofsAddonAircraft.F14AInstruments == 0) {
	instruments.init(geofs.aircraft.instance.setup.instruments)
   geofsAddonAircraft.F14AInstruments = 1
}
//Tailhook
geofsAddonAircraft.runAddonTailhook()
//Replacing the tires lol
geofs.aircraft.instance.definition.contactProperties = {
        "wheel": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
        	"rollingFriction": 0.00001,
            "damping": 1
        },
        "frame": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
            "damping": 1
        },
	    "airfoil": {
        	"frictionCoef": 2,
        	"dynamicFriction": 0.01,
            "damping": 1
        },
        "hook": {
            "frictionCoef": 2,
            "dynamicFriction": 0.01,
            "damping": 1
        }
    };
//Adding the airbrake
geofs.aircraft.instance.definition.airbrakesTravelTime = 1;
geofs.aircraft.instance.definition.instruments.spoilers = "";
if (geofs.animation.values.airbrakesTarget > 0) {
   geofs.aircraft.instance.definition.dragFactor = 7
} else {
   geofs.aircraft.instance.definition.dragFactor = 1.5
}
setTimeout(() => {
   geofsAddonAircraft.isF14A = 1
},5000)
setTimeout(() => {
	geofs.aircraft.instance.definition.parts[0].animations[0].value = "rpm"
	geofs.aircraft.instance.definition.parts[0].animations[0].gt = -1
	 geofs.aircraft.instance.definition.parts[50].animations[0].gt = 100000
	 geofs.aircraft.instance.definition.parts[55].animations[0].gt = 100000
},10000)} else {
   geofsAddonAircraft.isF14A = 0
   geofsAddonAircraft.F14AInstruments = 0
}
}
f14aInterval = setInterval(function(){runF14A()},10)
ui.notification.show("A321Neo addon by AriakimTaiyo and NVB9ALT. ILS IS included.")
//Note from NVB9: I modified some parts, expanded it a little, and added a bunch of labels in the code.

//TEMP NOTE: add APU sounds

let tiltToHold = 0;
let ils = true;
let deadZone = 0.02;
let pitchCenter = 0;
let rollTohold = 0;
let lastlla = [];
let velocityVec = 0;


// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}


function bearing(startLat, startLng, destLat, destLng) {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}
function getVV() {
  velocityVec = bearing(lastlla[0], lastlla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1])
}

function computePitch() {
  // implement tilt holding
  if (geofs.animation.values.groundContact == 0) {
  if (geofs.animation.values.accZ <= 30 && geofs.animation.values.accZ >= -30) {
  if (geofs.animation.values.pitch <= deadZone && geofs.animation.values.pitch >= -deadZone) {
    pitchStage1 = -(tiltToHold - geofs.animation.values.atilt) / 20
    pitchCenter = pitchStage1;
  }
  else {
    //stall protection
    if (geofs.animation.values.aoa <= 10) {
      pitchStage1 = -(tiltToHold - geofs.animation.values.atilt) / 5
      tiltToHold = geofs.animation.values.atilt - geofs.animation.values.pitch * 5
    }
    else {
      pitchStage1 = -(tiltToHold - geofs.animation.values.atilt) / 5
      tiltToHold = (geofs.animation.values.atilt - geofs.animation.values.pitch * 5) + 1
    }
  }
  geofs.animation.values.computedPitch = clamp(pitchStage1 + pitchCenter, -1, 1)
}
  else {
    geofs.animation.values.computedPitch = geofs.animation.values.pitch;
  }
  }
  else {
    geofs.animation.values.computedPitch = geofs.animation.values.pitch / 2;
  }
}

function computeRoll() {
    if (geofs.animation.values.groundContact == 0) {
  //roll stabilization from input
  if (rollTohold <= 30 && rollTohold >= -30) {
    rollTohold = rollTohold - geofs.animation.values.roll;
    geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1);
  }
  else {
    if (geofs.animation.values.aroll >= 0) {
      rollTohold = 29;
      geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1)
    }
    if (geofs.animation.values.aroll <= 0) {
      rollTohold = -29;
      geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1)
    }
  }
  }
  else {
    geofs.animation.values.computedRoll = geofs.animation.values.roll
  }
}

function computeYaw() {
  //yaw damper experiment. probably not good for crosswinds lol
  geofs.animation.values.computedYaw = geofs.animation.values.yaw
}

// get running average to dampen control inputs
let pitchInputs = [0, 0, 0, 0, 0, 0, 0];
let rollInputs = [0, 0, 0, 0, 0, 0, 0];
let yawInputs = [0, 0, 0, 0, 0, 0, 0];
geofs.animation.values.averagePitch = null;
geofs.animation.values.averageRoll = null;
geofs.animation.values.averageYaw = null;
geofs.animation.values.outerAveragePitch = null;
geofs.animation.values.outerAverageRoll = null;
geofs.animation.values.outerAverageYaw = null;
function pushInputs() {
  pitchInputs.push(geofs.animation.values.computedPitch);
  rollInputs.push(geofs.animation.values.computedRoll);
  yawInputs.push(geofs.animation.values.computedYaw);
}

function computeOutputs() {
  var pitchcheck = movingAvg(pitchInputs, 2, 2);
  var rollcheck = movingAvg(rollInputs, 2, 2);
  var yawcheck = movingAvg(yawInputs, 4, 4);
  geofs.animation.values.averagePitch = pitchcheck[pitchcheck.length - 3]
  geofs.animation.values.averageRoll = rollcheck[rollcheck.length - 3];
  geofs.animation.values.averageYaw = yawcheck[yawcheck.length - 3];
  geofs.animation.values.outerAveragePitch = clamp(geofs.animation.values.averagePitch / (geofs.animation.values.kias / 200), -1, 1);
  geofs.animation.values.outerAverageRoll = clamp(geofs.animation.values.averageRoll / (geofs.animation.values.kias / 100), -1, 1);
  geofs.animation.values.outerAverageYaw = clamp(geofs.animation.values.averageYaw / (geofs.animation.values.kias / 250), -1, 1);
}

function movingAvg(array, countBefore, countAfter) {
  if (countAfter == undefined) countAfter = 0;
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
    result.push(avg);
  }
  return result;
}
geofs.aircraft.instance.parts.elevleft.animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.parts.elevright.animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.parts.aileronleft.animations[0].value = "averageRoll"
geofs.aircraft.instance.parts.aileronright.animations[0].value = "averageRoll"
geofs.aircraft.instance.parts.rudder.animations[0].value = "averageYaw";

setInterval(function() {
  getVV()
  computeRoll();
  computePitch();
  computeYaw();
  pushInputs();
  computeOutputs();
}, 20)
setInterval(function() {
  lastlla = geofs.aircraft.instance.llaLocation
}, 200)

//engine simulations
let engineL = false;
let engineR = false;
let ptuBork = false;
let hydraulicsPL = 0;
let hydraulicsPR = 0;
let engRon = false;
let engLon = false;
let electricalOn = false;
let landingLightsOn = false;
let strobeOn = false;
let terrainGPWS = false;
geofs.animation.values.rpmL = 0;
geofs.animation.values.rpmR = 0;
geofs.animation.values.rpmLfan = 0;
geofs.animation.values.rpmRfan = 0;
geofs.animation.values.flapschange = 0;
geofs.animation.values.ptu = 0;

geofs.aircraft.instance.parts.fanleft.animations[0].value = "rpmLfan"
geofs.aircraft.instance.parts.fanright.animations[0].value = "rpmRfan"

function engineTest() {
  if (engineL) {
    geofs.aircraft.instance.engines[0].thrust = 147240;
  }
  else {
    geofs.aircraft.instance.engines[0].thrust = 0;
  }

  if (engineR) {
    geofs.aircraft.instance.engines[1].thrust = 147240;
  }
  else {
    geofs.aircraft.instance.engines[1].thrust = 0;
  }
};

function getHyraulics() {
  if (engineL || engLon) {
    hydraulicsPL = clamp(geofs.animation.values.rpmL, 0, 1000) / 2;
  }
  else {
    hydraulicsPL = 0;
  }
  if (engineR || engRon) {
    hydraulicsPR = clamp(geofs.animation.values.rpmR, 0, 1000) / 2;
  }
  else {
    hydraulicsPR = 0;
  }
}
function getRPMs() {
  if (engLon) {
    geofs.animation.values.rpmL = geofs.animation.values.rpmL + 2.5;
    if (geofs.animation.values.rpmL >= 1000) {
      engLon = false;
      engineL = true;
    }
  }
  if (engineL) {
    geofs.animation.values.rpmL = geofs.animation.values.rpm + 100;
  }
  if (engRon) {
    geofs.animation.values.rpmR = geofs.animation.values.rpmR + 2.5;
    if (geofs.animation.values.rpmR >= 1000) {
      engRon = false;
      engineR = true;
    }
  }
  if (engineR) {
    geofs.animation.values.rpmR = geofs.animation.values.rpm + 100;
  }
  geofs.animation.values.rpmLfan = geofs.animation.values.rpmL * geofs.api.viewer.clock.currentTime.secondsOfDay / 100;
  geofs.animation.values.rpmRfan = geofs.animation.values.rpmR * geofs.api.viewer.clock.currentTime.secondsOfDay / 100;
}

function getPTUBork() {
  if (engLon || engRon) {
    if (Math.abs(hydraulicsPL - hydraulicsPR) >= 100) {
      ptuBork = true;
      geofs.animation.values.ptu = 1;
    }
    else {
      ptuBork = false;
      geofs.animation.values.ptu = 0;
    }
  }
  else {
    ptuBork = false;
    geofs.animation.values.ptu = 0;
  }
}

var apu = new Boolean(0);

function APUtoggle(){
  if (apu == 0){
    apu = 1;
  }
  else {
    apu = 0;
  }
}

function startEngine(a) {
if (apu == 1 || engineL || engineR){
  audio.playStartup();
  if (a == "left" && geofs.animation.values.rpmL <= 999) {
    engLon = true;
    }
  if (a == "right" && geofs.animation.values.rpmR <= 999) {
    engRon = true;
    }
  }
}

//I modified the engine controls so each engine can be shut down independently, making things like simulating in-flight engine failure easier. I also added shutdown sounds. - NVB9

function stopEngineLeft() {
  audio.playShutdown();
  engineL = false;
  geofs.animation.values.rpmL = 0;


}
function stopEngineRight() {
  audio.playShutdown();
  engineR = false;
  geofs.animation.values.rpmR = 0;


}
simInterval = setInterval(function() {
  getHyraulics();
  getPTUBork()
  getRPMs();
  getFlapChange();
  engineTest();
}, 15)

//sound additions
//Thinking about adding reverse sounds, would toggle with reverse = true. 'Cause thrust reversers are distinctly loud. - NVB9

geofs.aircraft.instance.definition.sounds[0].effects.volume.value = "rpmL";
geofs.aircraft.instance.definition.sounds[0].effects.pitch.value = "rpmL";
geofs.aircraft.instance.definition.sounds[0].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo2.mp3"
geofs.aircraft.instance.definition.sounds[1].effects.volume.value = "rpmL";
geofs.aircraft.instance.definition.sounds[1].effects.pitch.value = "rpmL";
geofs.aircraft.instance.definition.sounds[1].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo2.mp3"
geofs.aircraft.instance.definition.sounds[2].effects.volume.value = "rpmL";
geofs.aircraft.instance.definition.sounds[2].effects.pitch.value = "rpmL";
geofs.aircraft.instance.definition.sounds[2].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo3.mp3"
geofs.aircraft.instance.definition.sounds[5].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/startupneo.mp3"

geofs.aircraft.instance.definition.sounds[7] = {}
geofs.aircraft.instance.definition.sounds[7].id = "rpm4"
geofs.aircraft.instance.definition.sounds[7].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo2.mp3"
geofs.aircraft.instance.definition.sounds[7].effects = { "volume": { "value": "rpmR", "ramp": [800, 950, 2500, 3500], "ratio": 1 }, "pitch": { "value": "rpmR", "ramp": [0, 20000, 20000, 20000], "offset": 1, "ratio": 1 } };
geofs.aircraft.instance.definition.sounds[8] = {}
geofs.aircraft.instance.definition.sounds[8].id = "rpm5"
geofs.aircraft.instance.definition.sounds[8].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo2.mp3"
geofs.aircraft.instance.definition.sounds[8].effects = { "volume": { "value": "rpmR", "ramp": [1000, 2500, 10000, 10000], "ratio": 1 }, "pitch": { "value": "rpmR", "ramp": [0, 20000, 20000, 20000], "offset": 1, "ratio": 1.5 } };
geofs.aircraft.instance.definition.sounds[9] = {}
geofs.aircraft.instance.definition.sounds[9].id = "rpm6"
geofs.aircraft.instance.definition.sounds[9].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/neo3.mp3"
geofs.aircraft.instance.definition.sounds[9].effects = { "volume": { "value": "rpmR", "ramp": [6000, 20000, 20000, 20000], "ratio": 1 }, "pitch": { "value": "rpmR", "ramp": [1000, 20000, 20000, 20000], "offset": 1, "ratio": 1.5 } };

geofs.aircraft.instance.definition.sounds[10] = {}
geofs.aircraft.instance.definition.sounds[10].id = "ptuBork"
geofs.aircraft.instance.definition.sounds[10].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/ptu.mp3"
geofs.aircraft.instance.definition.sounds[10].effects = { "start": { "value": "ptu" } };


//GPWS and RadioAlt callout test

let isApprConfig = false;
let trafficAlt = null;
geofs.animation.values.isFlapsWarn = 0;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isTerrainWarn = 0;
geofs.animation.values.isPullupWarn = 0;
geofs.animation.values.isBankWarn = 0;
geofs.animation.values.isTCASClimb = 0;
geofs.animation.values.isTCASDescend = 0;
geofs.animation.values.isTCAS = 0;
geofs.animation.values.isTCASClear = 0;
geofs.animation.values.is100ab = 0;
geofs.animation.values.isWindWarn = 0;
geofs.animation.values.gpws1000 = 0;
geofs.animation.values.gpws500 = 0;
geofs.animation.values.gpws400 = 0;
geofs.animation.values.gpws300 = 0;
geofs.animation.values.gpws200 = 0;
geofs.animation.values.gpws100 = 0;
geofs.animation.values.gpws50 = 0;
geofs.animation.values.gpws40 = 0;
geofs.animation.values.gpws30 = 0;
geofs.animation.values.gpws20 = 0;
geofs.animation.values.gpws10 = 0;
geofs.animation.values.isRetard = 0;
let restingPoint = 12.232906828403847;

//TCAS - NVB9
function getTrafficProximity() {
  Object.values(multiplayer.visibleUsers).forEach(function(e) {
    if (e.distance <= 1000) {
      if (e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters + 100) {
        geofs.animation.values.isTCASDescend = 1;
        if (geofs.animation.values.isTCAS == 0) {
          let tcasInt = setInterval(function(i) {
            if (i <= 2) {
              geofs.animation.values.isTCAS = 1;
            }
            else {
              geofs.animation.values.isTCAS = null;
            }
          }, 1000)
        }
        else {
          geofs.animation.values.isTCASDescend = 0;
        }
        if (e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters - 100) {
          geofs.animation.values.isTCASClimb = 1;
          if (geofs.animation.values.isTCAS == 0) {
            let tcasInt = setInterval(function(i) {
              if (i <= 2) {
                geofs.animation.values.isTCAS = 1;
              }
              else {
                geofs.animation.values.isTCAS = null;
              }
            }, 1000)
          }
        }
        else {
          geofs.animation.values.isTCASClimb = 0;
        }
      }
      else {
        if (geofs.animation.values.isTCASClimb == 1 || geofs.animation.values.isTCASDescend == 1) {
          counterAtClear = counter
          geofs.animation.values.isTCASClimb = 0;
          geofs.animation.values.isTCASDescend = 0;
          geofs.animation.values.isTCAS = 0;

          let counterInterval = setInterval(function(i) {
            if (i <= 3) {
              geofs.animation.values.isTCASClear = 1;
            }
            else {
              geofs.animation.values.isTCASClear = 0;
              clearinterval(counterInterval);
            }
          }, 1000)
        }
      }
    }
  })
}

let counter = 0;
let counterAtClear = 0;
let lastWind = 0;
let interval = setInterval(function() {
  if (counter < 2) {
    counter = counter + 1
  }
  else { counter = 0 }
  if (counter == 1) {
    lastWind = weather.currentWindSpeed;
  }

}, 1000)

//Windshear - NVB9
function getWindShear() {
  if (isApprConfig == 1 && lastWind - weather.currentWindSpeed <= 5) {
    geofs.animation.values.isWindWarn = 1;
  }
  else {
    geofs.animation.values.isWindWarn = 0;
  }
}

//Gear and flaps warning triggers - NVB9
function getGearFlapsWarn() {

  if (geofs.animation.values.haglFeet <= 500 && geofs.animation.values.gearPosition == 1 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
    geofs.animation.values.isGearWarn = 1
  }
  else {
    geofs.animation.values.isGearWarn = 0
  }

  if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.flapsPosition == 0 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
    geofs.animation.values.isFlapsWarn = 1
  }
  else {
    geofs.animation.values.isFlapsWarn = 0
  }
}

//Terrain sensor and controller - NVB9
function testTerrainorAppr() {
if (geofs.animation.values.gearPosition == 0) {
  if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -100 && geofs.animation.values.climbrate >= -5000 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.isFlapsWarn == 0 && isApprConfig == 0) {
    geofs.animation.values.isTerrainWarn = 1;
  }
  else {
    geofs.animation.values.isTerrainWarn = 0;
  }

  if (geofs.animation.values.haglFeet <= 5000 && geofs.animation.values.climbrate <= -2000 || geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -5000) {
    geofs.animation.values.isPullupWarn = 1;
  }
  else {
    geofs.animation.values.isPullupWarn = 0;
  }
}
  else {
    geofs.animation.values.isTerrainWarn = 0;
    return
  }
}

function getFlapChange() {
  if (geofs.animation.values.flapsPosition < geofs.animation.values.flapsTarget || geofs.animation.values.flapsPosition > geofs.animation.values.flapsTarget) {
    console.log("flaps extend")
    geofs.animation.values.flapschange = 1
  }
  else {
    geofs.animation.values.flapschange = 0
  }
}

//Approach and landing sensor trigger unifiers - NVB9
function testForApproach() {
  if (geofs.animation.values.isFlapsWarn == 0 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.climbrate <= -1) {
    isApprConfig = true
  }
  else {
    isApprConfig = false
  }
}

function getRetard() {
  if (geofs.animation.values.gpws20 == 1 || geofs.animation.values.gpws10 == 1) {
    if (geofs.animation.values.throttle >= 0.1) {
      geofs.animation.values.isRetard = 1;
    }
    else {
      geofs.animation.values.isRetard = 0;
    }
  }
  else {
    geofs.animation.values.isRetard = 0;
  }
}

//Radio altimeter - NVB9
function doRadioAltCall() {
  if (isApprConfig) {
    if (geofs.animation.values.haglFeet <= 1000 + restingPoint && geofs.animation.values.haglFeet >= 900 + restingPoint) {
      geofs.animation.values.gpws1000 = 1;
    }
    else {
      geofs.animation.values.gpws1000 = 0;
    }
    if (geofs.animation.values.haglFeet <= 500 + restingPoint && geofs.animation.values.haglFeet >= 400 + restingPoint) {
      geofs.animation.values.gpws500 = 1;
    }
    else {
      geofs.animation.values.gpws500 = 0;
    }
    if (geofs.animation.values.haglFeet <= 400 + restingPoint && geofs.animation.values.haglFeet >= 300 + restingPoint) {
      geofs.animation.values.gpws400 = 1;
    }
    else {
      geofs.animation.values.gpws400 = 0;
    }
    if (geofs.animation.values.haglFeet <= 300 + restingPoint && geofs.animation.values.haglFeet >= 200 + restingPoint) {
      geofs.animation.values.gpws300 = 1;
    }
    else {
      geofs.animation.values.gpws300 = 0;
    }
    if (geofs.animation.values.haglFeet <= 200 + restingPoint && geofs.animation.values.haglFeet >= 100 + restingPoint) {
      geofs.animation.values.gpws200 = 1;
    }
    else {
      geofs.animation.values.gpws200 = 0;
    }
    if (geofs.animation.values.haglFeet <= 100 + restingPoint && geofs.animation.values.haglFeet >= 50 + restingPoint) {
      geofs.animation.values.gpws100 = 1;
    }
    else {
      geofs.animation.values.gpws100 = 0;
    }
    if (geofs.animation.values.haglFeet <= 50 + restingPoint && geofs.animation.values.haglFeet >= 40 + restingPoint) {
      geofs.animation.values.gpws50 = 1;
    }
    else {
      geofs.animation.values.gpws50 = 0;
    }
    if (geofs.animation.values.haglFeet <= 40 + restingPoint && geofs.animation.values.haglFeet >= 30 + restingPoint) {
      geofs.animation.values.gpws40 = 1;
    }
    else {
      geofs.animation.values.gpws40 = 0;
    }
    if (geofs.animation.values.haglFeet <= 30 + restingPoint && geofs.animation.values.haglFeet >= 20 + restingPoint) {
      geofs.animation.values.gpws30 = 1;
    }
    else {
      geofs.animation.values.gpws30 = 0;
    }
    if (geofs.animation.values.haglFeet <= 20 + restingPoint && geofs.animation.values.haglFeet >= 10 + restingPoint) {
      geofs.animation.values.gpws20 = 1;
    }
    else {
      geofs.animation.values.gpws20 = 0;
    }
    if (geofs.animation.values.haglFeet <= 10 + restingPoint && geofs.animation.values.haglFeet >= 5 + restingPoint) {
      geofs.animation.values.gpws10 = 1;
    }
    else {
      geofs.animation.values.gpws10 = 0;
    }
  }
  else {
    geofs.animation.values.gpws1000 = 0;
    geofs.animation.values.gpws500 = 0;
    geofs.animation.values.gpws400 = 0;
    geofs.animation.values.gpws300 = 0;
    geofs.animation.values.gpws200 = 0;
    geofs.animation.values.gpws100 = 0;
    geofs.animation.values.gpws50 = 0;
    geofs.animation.values.gpws40 = 0;
    geofs.animation.values.gpws30 = 0;
    geofs.animation.values.gpws20 = 0;
    geofs.animation.values.gpws10 = 0;
  }
}

//Wingflex reassignment - NVB9
function resetLift2() {
  geofs.animation.values.liftLeftWing = (-geofs.aircraft.instance.parts.wingleft.lift / 200000) + (geofs.animation.values.accZ) / 20;
  geofs.animation.values.liftRightWing = (-geofs.aircraft.instance.parts.wingright.lift / 200000) + (geofs.animation.values.accZ) / 20;
};

setInterval(function() {
  getTrafficProximity();
  getFlapChange();
  getWindShear();
  testForApproach();
  testTerrainorAppr();
  resetLift2();
  getRetard();
  doRadioAltCall()
})
//assign alarms and sound fx

geofs.aircraft.instance.definition.sounds[11] = {};
geofs.aircraft.instance.definition.sounds[11].id = "flapssound"
geofs.aircraft.instance.definition.sounds[11].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777flap.mp3"
geofs.aircraft.instance.definition.sounds[11].effects = { "start": { "value": "flapschange" } }

geofs.aircraft.instance.definition.sounds[12] = {};
geofs.aircraft.instance.definition.sounds[12].id = "landinggearwarn"
geofs.aircraft.instance.definition.sounds[12].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlg.mp3"
geofs.aircraft.instance.definition.sounds[12].effects = { "start": { "value": "isGearWarn" } }

geofs.aircraft.instance.definition.sounds[13] = {};
geofs.aircraft.instance.definition.sounds[13].id = "flapswarn"
geofs.aircraft.instance.definition.sounds[13].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlf.mp3"
geofs.aircraft.instance.definition.sounds[13].effects = { "start": { "value": "isFlapsWarn" } }

geofs.aircraft.instance.definition.sounds[14] = {};
geofs.aircraft.instance.definition.sounds[14].id = "terrainwarn"
geofs.aircraft.instance.definition.sounds[14].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlt.mp3"
geofs.aircraft.instance.definition.sounds[14].effects = { "start": { "value": "isTerrainWarn" } }

geofs.aircraft.instance.definition.sounds[15] = {};
geofs.aircraft.instance.definition.sounds[15].id = "pullwarn"
geofs.aircraft.instance.definition.sounds[15].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/pullup.mp3"
geofs.aircraft.instance.definition.sounds[15].effects = { "start": { "value": "isPullupWarn" } }

geofs.aircraft.instance.definition.sounds[16] = {};
geofs.aircraft.instance.definition.sounds[16].id = "1000"
geofs.aircraft.instance.definition.sounds[16].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/1000ab.mp3"
geofs.aircraft.instance.definition.sounds[16].effects = { "start": { "value": "gpws1000" } }

geofs.aircraft.instance.definition.sounds[17] = {};
geofs.aircraft.instance.definition.sounds[17].id = "500"
geofs.aircraft.instance.definition.sounds[17].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/500ab.mp3"
geofs.aircraft.instance.definition.sounds[17].effects = { "start": { "value": "gpws500" } }

geofs.aircraft.instance.definition.sounds[18] = {};
geofs.aircraft.instance.definition.sounds[18].id = "400"
geofs.aircraft.instance.definition.sounds[18].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/400ab.mp3"
geofs.aircraft.instance.definition.sounds[18].effects = { "start": { "value": "gpws400" } }

geofs.aircraft.instance.definition.sounds[19] = {};
geofs.aircraft.instance.definition.sounds[19].id = "300"
geofs.aircraft.instance.definition.sounds[19].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/300ab.mp3"
geofs.aircraft.instance.definition.sounds[19].effects = { "start": { "value": "gpws300" } }

geofs.aircraft.instance.definition.sounds[20] = {};
geofs.aircraft.instance.definition.sounds[20].id = "200"
geofs.aircraft.instance.definition.sounds[20].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/200ab.mp3"
geofs.aircraft.instance.definition.sounds[20].effects = { "start": { "value": "gpws200" } }

geofs.aircraft.instance.definition.sounds[21] = {};
geofs.aircraft.instance.definition.sounds[21].id = "100"
geofs.aircraft.instance.definition.sounds[21].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/100abtrue.mp3"
geofs.aircraft.instance.definition.sounds[21].effects = { "start": { "value": "gpws100" } }

geofs.aircraft.instance.definition.sounds[22] = {};
geofs.aircraft.instance.definition.sounds[22].id = "50"
geofs.aircraft.instance.definition.sounds[22].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/50ab.mp3"
geofs.aircraft.instance.definition.sounds[22].effects = { "start": { "value": "gpws50" } }

geofs.aircraft.instance.definition.sounds[23] = {};
geofs.aircraft.instance.definition.sounds[23].id = "40"
geofs.aircraft.instance.definition.sounds[23].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/40ab.mp3"
geofs.aircraft.instance.definition.sounds[23].effects = { "start": { "value": "gpws40" } }

geofs.aircraft.instance.definition.sounds[24] = {};
geofs.aircraft.instance.definition.sounds[24].id = "30"
geofs.aircraft.instance.definition.sounds[24].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/30ab.mp3"
geofs.aircraft.instance.definition.sounds[24].effects = { "start": { "value": "gpws30" } }

geofs.aircraft.instance.definition.sounds[25] = {};
geofs.aircraft.instance.definition.sounds[25].id = "20"
geofs.aircraft.instance.definition.sounds[25].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/20ab.mp3"
geofs.aircraft.instance.definition.sounds[25].effects = { "start": { "value": "gpws20" } }

geofs.aircraft.instance.definition.sounds[26] = {};
geofs.aircraft.instance.definition.sounds[26].id = "10"
geofs.aircraft.instance.definition.sounds[26].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/10ab.mp3"
geofs.aircraft.instance.definition.sounds[26].effects = { "start": { "value": "gpws10" } }

geofs.aircraft.instance.definition.sounds[27] = {};
geofs.aircraft.instance.definition.sounds[27].id = "TCAS"
geofs.aircraft.instance.definition.sounds[27].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/traffic.mp3"
geofs.aircraft.instance.definition.sounds[27].effects = { "start": { "value": "isTCAS" } }

geofs.aircraft.instance.definition.sounds[28] = {};
geofs.aircraft.instance.definition.sounds[28].id = "climb"
geofs.aircraft.instance.definition.sounds[28].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/climb.mp3"
geofs.aircraft.instance.definition.sounds[28].effects = { "start": { "value": "isTCASClimb" } }

geofs.aircraft.instance.definition.sounds[29] = {};
geofs.aircraft.instance.definition.sounds[29].id = "descend"
geofs.aircraft.instance.definition.sounds[29].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/descend.mp3"
geofs.aircraft.instance.definition.sounds[29].effects = { "start": { "value": "isTCASDescend" } }

geofs.aircraft.instance.definition.sounds[30] = {};
geofs.aircraft.instance.definition.sounds[30].id = "clear"
geofs.aircraft.instance.definition.sounds[30].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/clear.mp3"
geofs.aircraft.instance.definition.sounds[30].effects = { "start": { "value": "isTCASClear" } }

geofs.aircraft.instance.definition.sounds[31] = {};
geofs.aircraft.instance.definition.sounds[31].id = "retard"
geofs.aircraft.instance.definition.sounds[31].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/retard.mp3"
geofs.aircraft.instance.definition.sounds[31].effects = { "start": { "value": "isRetard" } }

audio.init(geofs.aircraft.instance.definition.sounds);
geofs.aircraft.instance.definition.sounds[0].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[1].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[2].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[7].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[8].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[9].effects.volume.ratio = 100


//PFD toggle code - NVB9
geofs.animation.values.enginesOn = false;

function PFDtoggle(){
if (geofs.animation.values.enginesOn == false){
  geofs.animation.values.enginesOn = true;
}
  else{
    geofs.animation.values.enginesOn = false;
  }
}

//Terrain Radar
let terrainPoints = [];
function getRadar(resolution) {
  if (terrainPoints.length > resolution) {
  terrainPoints = [];
  }
  for (let i = 0; i < 500; i++) {
    let distance = i/8 % 3;
    let directionStart = geofs.animation.values.heading
    let direction = directionStart - i /5
    let x1 = geofs.aircraft.instance.llaLocation[0];
    let y1 = geofs.aircraft.instance.llaLocation[1];
    let x2 = distance*Math.sin(Math.PI*direction/180);
    let y2 = distance*Math.cos(Math.PI*direction/180);
    terrainPoints.push([distance*100, Math.PI*((i/5  - 225)/180), geofs.getGroundAltitude(x1+x2,y1+y2).location[2]]);
  }
  
}

let toggleRadar = 1

function radar(){
if (toggleRadar == 0){
  toggleRadar = 1;
}
  else{
    toggleRadar = 0;
  }
}

//ILS program

function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}


function computeSlopeDeviation(ae, alt, alg, lt, lg, a) {
  let gradient = 0.05;
  let distance = getDistance(alt, alg, lt, lg) * 1000;
  let idealAltAtPos = ae + gradient * distance;
  let deviation = idealAltAtPos - a;
  return deviation;
}

//runway side detection from autoland 1.0

function getRwHeading() {
  let defaultRunway = runway.heading;
  let aircraftHeading = geofs.animation.values.heading360

  if (aircraftHeading >= defaultRunway + 90 || aircraftHeading <= defaultRunway - 90) {
    let sideHeading = runway.heading + 180;
    let sideHeadingFixed = sideHeading % 360;
    return sideHeadingFixed;
  }
  else {
    return defaultRunway;
  }
}

function getRwThreshold() {
  let defaultRunway = runway.heading;
  let aircraftHeading = geofs.animation.values.heading;

  if (aircraftHeading >= defaultRunway + 90 || aircraftHeading <= defaultRunway - 90) {

    let x1 = runway.location[1];
    let y1 = runway.location[0];
    let x2 = runway.lengthInLla[1];
    let y2 = runway.lengthInLla[0];
    let runwayThresholdX = x1 + x2;
    let runwayThresholdY = y1 + y2;
    let runwayThreshold = [runwayThresholdY, runwayThresholdX, 0];
    return runwayThreshold;
  }

  else {
    let runwayThreshold = runway.location
    return runwayThreshold;
  }
}




function radians(n) {
  return n * (Math.PI / 180);
}
function degrees(n) {
  return n * (180 / Math.PI);
}

//yes i know ive defined those functions like 3 times now but whatever lol


//main function to find the direction to the airport. a perfect localizer capture will mean that the runway heading - function output = 0.
function getBearing(a, b, c, d) {
  startLat = radians(c);
  startLong = radians(d);
  endLat = radians(a);
  endLong = radians(b);

  let dLong = endLong - startLong;

  let dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
  if (Math.abs(dLong) > Math.PI) {
    if (dLong > 0.0)
      dLong = -(2.0 * Math.PI - dLong);
    else
      dLong = (2.0 * Math.PI + dLong);
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function computeLocDeviation(alt, alg, lt, lg) {
  return getRwHeading() - getBearing(alt, alg, lt, lg);
}

function getNearestRunway() {
  return Object.values(geofs.runways.nearRunways)[minKey];
}

let runway = ""

function displayDeviations() {
  a = getRwThreshold()
  b = geofs.aircraft.instance.llaLocation
  locdev = clamp(-computeLocDeviation(a[0], a[1], b[0], b[1]) * 20, -250, 250);
  gsdev = clamp(3 * computeSlopeDeviation(Object.values(geofs.api.flatRunwayTerrainProviderInstance.regions)[0].referenceElevation, a[0], a[1], b[0], b[1], (geofs.animation.values.altitudeMeters - 4)), -500, 500);
}
//ils display
let ilshead = 0; // will set this to geofs.animation.values.heading360 later
let locdev = 0;
let gsdev = 0;
let traffic = Object.values(multiplayer.visibleUsers)

class ILSsim {
  constructor(resX, resY, sizeX, sizeY) {
    // IMP VALUES ! NO CHANGE !!
    this.Values = {};
    this.Values.LocDev = 0;
    this.Values.GSDev = 0;
    this.Values.Heading = 0;

    // Everything Else LOL
    this.VisibilityToggleButton;
    this.Display = {};
    this.Display.Element;
    this.Display.Context;
    this.Display.Width = resX;
    this.Display.Height = resY;
    this.Display.SizeWidth = sizeX;
    this.Display.SizeHeight = sizeY;
    this.Events = [];
  }
  // Implement Show/Hide Canvas
  AssignVisibilityToggleButton(element) {
    this.VisibilityToggleButton = element;
    let self = this;
    this.VisibilityToggleButton.onclick = function() {
      if (this.innerText == "show") {
        self.Display.Element.style.visibility = "visible";
        this.innerText = "hide";
      } else {
        self.Display.Element.style.visibility = "hidden";
        this.innerText = "show";
      }
    };
  }
  MakeLine(color, x1, y1, x2, y2) {
    this.Display.Context.beginPath();
    this.Display.Context.strokeStyle = color;
    this.Display.Context.moveTo(x1, y1);
    this.Display.Context.lineTo(x2, y2);
    this.Display.Context.stroke();
  }
  MakeText(text, color, x, y, font) {
    this.Display.Context.beginPath();
    let prevColor = this.Display.Context.fillStyle;
    let prevFont = this.Display.Context.font;
    this.Display.Context.beginPath();
    this.Display.Context.fillStyle = color;
    if (font) {
      this.Display.Context.font = font;
    }
    this.Display.Context.fillText(text, x, y);
    this.Display.Context.fillStyle = prevColor;
    this.Display.Context.font = prevFont;
  }
  // Non-Interactive Rectangle Making.
  MakeRect(fill, color, x, y, width, height) {
    this.Display.Context.beginPath();
    this.Display.Context.strokeStyle = color;
    this.Display.Context.rect(x, y, width, height);
    this.Display.Context.stroke();
    this.Display.Context.fillStyle = fill;
    this.Display.Context.fill();
  }
  // Interactive Rectangle Making.
  MakePolygon(points, fillColor, outlineColor, onclick) {
    if (onclick) {
      this.AddEventToCanvas(points, onclick);
    }
    this.Display.Context.beginPath();
    this.Display.Context.moveTo(points[0][0], points[0][1]);
    points = points.slice(1);
    let a;
    for (a of points) {
      let x = a[0];
      let y = a[1];
      this.Display.Context.lineTo(x, y);
    }
    this.Display.Context.fillStyle = fillColor;
    this.Display.Context.fill();
    this.Display.Context.strokeStyle = outlineColor;
    this.Display.Context.stroke();
  }
  MakeCircle(fillColor, strokeColor, x, y, r, startAngle, endAngle, antiClockwise) {
    this.Display.Context.beginPath();
    if (startAngle) {
      this.Display.Context.arc(x, y, startAngle, endAngle, antiClockwise);
    } else {
      this.Display.Context.arc(x, y, r, 0, 2 * Math.PI);
    }
    this.Display.Context.strokeStyle = strokeColor;
    this.Display.Context.stroke();
    this.Display.Context.fillStyle = fillColor;
    this.Display.Context.fill();
  }
  MakeRoundSlider(x, y, r, value, color1, color2, color3, color4, color5, color6, mouseMoveFunction, mouseUpFunction) {
    let extractedValue = this.Values[value];
    let direction = 360 / 100 * extractedValue;
    direction -= 90;
    this.MakeCircle(color2, color1, x, y, r);
    this.MakeCircle(color4, color3, x, y, r * 0.5);
    this.MakePolygon([
      [x + (Math.cos(A2R(direction + 90)) * -1), y + (Math.sin(A2R(direction + 90)) * -1)],
      [x + (Math.cos(A2R(direction + 90)) * 1), y + (Math.sin(A2R(direction + 90)) * 1)],
      [x + (Math.cos(A2R(direction + 90)) * 1) + (Math.cos(A2R(direction)) * r), y + (Math.sin(A2R(direction + 90)) * 1) + (Math.sin(A2R(direction)) * r)],
      [x + (Math.cos(A2R(direction + 90)) * -1) + (Math.cos(A2R(direction)) * r), y + (Math.sin(A2R(direction + 90)) * -1) + (Math.sin(A2R(direction)) * r)]
    ], color6, color5, function(a) {
      a.path[0].onmouseup = function(b) {
        mouseUpFunction(b);
        b.path[0].onmousemove = undefined;
      };
      a.path[0].onmousemove = function(b) {
        mouseMoveFunction(b);
      };
    });
  }
  AddEventToCanvas(points, func) {
    let newObj = { "points": points, "func": func };
    this.Events[this.Events.length] = newObj;
  }
  RemoveEventFromCanvas(event) {
    let index = this.Events.indexOf(event);
    if (index > -1) {
      this.Events.splice(index, 1);
    }
  }
  ResetEvents() {
    this.Events.length = 0;
  }
  SetupEventHandler() {
    let self = this;
    this.Display.Element.onmousedown = function(event) {
      let rect = event.target.getBoundingClientRect();
      let xRelation = self.Display.Width / self.Display.SizeWidth.slice(0, self.Display.SizeWidth.length - 2);
      let yRelation = self.Display.Height / self.Display.SizeHeight.slice(0, self.Display.SizeHeight.length - 2);
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      x *= xRelation;
      y *= yRelation;
      console.log("X: " + x + "\nY: " + y);
      console.log(event);
      let a;
      for (a of self.Events) {
        let func = a.func;
        let vs = a.points;
        if (inside([x, y], vs)) {
          func(event);
          self.ResetEvents();
        }
      }
      self.rDraw();
    };
  }
  SetupCanvas() {
    this.Display.Element = document.createElement("canvas");
    this.Display.Element.width = this.Display.Width;
    this.Display.Element.height = this.Display.Height;
    this.Display.Element.style.width = this.Display.SizeWidth;
    this.Display.Element.style.height = this.Display.SizeHeight;
    this.Display.Element.style.position = "absolute";
    this.Display.Element.style.left = "25%";
    this.Display.Element.style.top = "25%";
    this.Display.Element.style.transform = "translate(-50%, -50%)";
    this.Display.Element.style.imageRendering = "pixelated";
    document.body.appendChild(this.Display.Element);
    this.Display.Context = this.Display.Element.getContext("2d");
    this.Display.Context.lineWidth = 10;
  }
  rDraw() {
    let w = this.Display.Width;
    let h = this.Display.Height;
    this.Display.Context.clearRect(0, 0, w, h)
    this.Draw();
  }
  Draw() {
    function getDeviation() {
      let b = ilshead
      let a = Math.PI * (b / 180);
      let d = locdev;
      let c1 = Math.sin(Math.PI * (heading / 180)) * 100;
      let c2 = Math.cos(Math.PI * (heading / 180)) * 100;
      let c3 = Math.PI * (b + 90) / 180;
      let origin = [w - w / 1.9, h - h / 2];
      let x1 = origin[0] + d * Math.sin(c3);
      let y1 = origin[1] - d * Math.cos(c3);
      let x2 = origin[0] + c1 + (d * Math.sin(c3));
      let y2 = origin[1] - c2 - (d * Math.cos(c3));
      // console.log([x1, y1, x2, y2, c3]); //For debugging
      return [x1, y1, x2, y2];
    }

    function getTrafficIndicator(direction, distance) {
      let directionRad = Math.PI * (direction / 180);
      let origin = [w - w / 1.9, h - h / 2];
      let x1 = origin[0] + distance * Math.sin(directionRad);
      let y1 = origin[1] + distance * Math.cos(directionRad);
      return [x1, y1];
    }

    let heading = ilshead;
    let w = this.Display.Width;
    let h = this.Display.Height;
    this.MakeRect("black", "black", 0, 0, w, h);
    this.MakeCircle("white", "white", w - w / 1.9, h - h / 2, 300);
    this.MakeCircle("black", "white", w - w / 1.9, h - h / 2, 295);
    //heading lines
    this.MakeLine("#e600ff", w - w / 1.9, h - h / 2, w - w / 1.9 + Math.sin(Math.PI * (heading / 180)) * 300, h - h / 2 - Math.cos(Math.PI * (heading / 180)) * 300);
    this.MakeLine("#e600ff", w - w / 1.9, h - h / 2, w - w / 1.9 - Math.sin(Math.PI * (heading / 180)) * 300, h - h / 2 + Math.cos(Math.PI * (heading / 180)) * 300);
    this.MakeCircle("black", "black", w - w / 1.9, h - h / 2, 100);
    //terrain radar
    if (toggleRadar == 1) {
    terrainPoints.forEach(function(e){
      let elevation = geofs.animation.values.altitudeMeters;
      if (e[2] < elevation - 1000){
      display.MakeCircle("green", "#ffffff00", w - w / 1.9 +e[0]*Math.sin(e[1]), h - h / 2 + e[0]*Math.cos(e[1]), Math.abs(1+e[0]/20));
      }
      if (e[2] > elevation - 1000 && e[2] < elevation){
        display.MakeCircle("yellow", "#ffffff00", w - w / 1.9 +e[0]*Math.sin(e[1]), h - h / 2 + e[0]*Math.cos(e[1]), Math.abs(1+e[0]/20));
      }
      if (e[2] > elevation) {
        display.MakeCircle("red", "#ffffff00", w - w / 1.9 +e[0]*Math.sin(e[1]), h - h / 2 + e[0]*Math.cos(e[1]), Math.abs(1+e[0]/20));
      }
    })
    }
    //traffic
    traffic.forEach(function(e) {
      display.MakeCircle("black", "blue", getTrafficIndicator(geofs.animation.values.heading+getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]), e.distance / 100)[0], getTrafficIndicator(geofs.animation.values.heading+getBearing(e.referencePoint.lla[0], e.referencePoint.lla[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]), e.distance / 100)[1], 5)
    })
    //aircraft indicator
    this.MakeLine("yellow", w - w / 1.9, h - h / 2 + 20, w - w / 1.9 + 60, h - h / 2 + 20);
    this.MakeLine("yellow", w - w / 1.9, h - h / 2 + 20, w - w / 1.9 - 60, h - h / 2 + 20);
    this.MakeLine("yellow", w - w / 1.9, h - h / 2, w - w / 1.9, h - h / 2 + 100);
    this.MakeLine("yellow", w - w / 1.9, h - h / 2, w - w / 1.9, h - h / 2 - 20);
    this.MakeLine("yellow", w - w / 1.9, h - h / 2 + 75, w - w / 1.9 + 25, h - h / 2 + 75);
    this.MakeLine("yellow", w - w / 1.9, h - h / 2 + 75, w - w / 1.9 - 25, h - h / 2 + 75);
    // gs indicator
    this.MakeCircle("black", "#e600ff", w - w / 15, (h - h / 2 + 7) - gsdev, 20);
    //gs deviation markers
    this.MakeRect("yellow", "yellow", w - w / 10, h - h / 2, w / 15, h / 100);
    this.MakeCircle("white", "white", w - w / 15, h - h / 1.5, 15);
    this.MakeCircle("black", "white", w - w / 15, h - h / 1.5, 8);
    this.MakeCircle("white", "white", w - w / 15, h - h / 1.2, 15);
    this.MakeCircle("black", "white", w - w / 15, h - h / 1.2, 8);
    this.MakeCircle("white", "white", w - w / 15, h - h / 3.25, 15);
    this.MakeCircle("black", "white", w - w / 15, h - h / 3.25, 8);
    this.MakeCircle("white", "white", w - w / 15, h - h / 6.5, 15);
    this.MakeCircle("black", "white", w - w / 15, h - h / 6.5, 8);
    //loc deviation markers
    this.MakeCircle("black", "white", w - w / 1.9 - Math.cos(Math.PI * (heading / 180)) * 75, h - h / 2 - Math.sin(Math.PI * (heading / 180)) * 75, 8);
    this.MakeCircle("black", "white", w - w / 1.9 - Math.cos(Math.PI * (heading / 180)) * 200, h - h / 2 - Math.sin(Math.PI * (heading / 180)) * 200, 8);
    this.MakeCircle("black", "white", w - w / 1.9 + Math.cos(Math.PI * (heading / 180)) * 75, h - h / 2 + Math.sin(Math.PI * (heading / 180)) * 75, 8);
    this.MakeCircle("black", "white", w - w / 1.9 + Math.cos(Math.PI * (heading / 180)) * 200, h - h / 2 + Math.sin(Math.PI * (heading / 180)) * 200, 8);
    this.MakeLine("#e600ff", getDeviation()[0], getDeviation()[1], getDeviation()[2], getDeviation()[3]);
    
  };

}
let display
let rwDistances = [];
let minKey = 0;

function ilsIntervalStart() {
ilsInterval = setInterval(function() {
  rwDistances = []
  Object.values(geofs.runways.nearRunways).forEach(function(e){
rwDistances.push(getDistance(e.location[0], e.location[1], geofs.aircraft.instance.llaLocation[0], geofs.aircraft.instance.llaLocation[1]));
})
  rwDistances.forEach(function(e, i){
    if (e == Math.min(...rwDistances)) {
      minKey = i;
    }
  })
      ;
  traffic = Object.values(multiplayer.visibleUsers);
  runway = getNearestRunway();
  ilshead = getRwHeading() - geofs.animation.values.heading360;
  displayDeviations()
  display.rDraw()
}, 200)
}
let terrainInterval = setInterval(function(){
  getRadar(100)
}, 1000)

let hide = false
function togglePanel(){
  if (!hide){
 display = new ILSsim(1000, 1000, "250px", "250px");
display.SetupCanvas();
display.SetupEventHandler();
display.Draw();
    ilsIntervalStart()
  hide = true;
  }
  else {
    destroyDisplays()
    hide = false;
  }
};

let array = []

function destroyDisplays() {
  array = []
  Object.values(document.getElementsByTagName("canvas")).forEach(function(e){if (e.width == 1000) array.push(e)})
  array.forEach(function(e){e.remove()})
}


//temporary menu for user control | Note from NVB9: Gotta say this menu works pretty well tho
// Panel Code
//I organized the panel a bit better and added some more buttons yay - NVB9
let a320panel = document.createElement("div");
a320panel.innerHTML = '<ul class="geofs-list geofs-toggle-panel geofs-autoland-list geofs-preferences" data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}"><style>#MainDIV {position: absolute;left: 0px;top: 0px;background-color: white;border: 5px solid #000000;text-align: center;padding: 0px 10px 10px 10px;}#DIVtitle {color: black;font-family: monospace;font-weight: bold;font-size: 20px;}p {color: black;font-family: monospace;font-weight: bold;}.button {display: inline-block;padding: 3px 24px;font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: black;background-color: #ffc107;border: none;border-radius: 1px;box-shadow: 0 0px #999;}.button2 {display: inline-block}.button:hover {background-color: #536dfe}.button:active {opacity: 0.6;}.button3 {display: inline-block;padding: 3px 24px;font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: #536dfe;border: none;border-radius: 1px;box-shadow: 0 0px #999;}.button4 {display: inline-block;padding: 3px 24px;font-size: 15px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: red;border: none;border-radius: 1px;box-shadow: 0 0px #999;}</style><div id="MainDIV"><p id="DIVtitle">Airbus A321Neo User Interface</p><p>Engines:</p><button onclick="startEngine(`left`)" class="button", id="leftstart">Start Left Engine</button><button onclick="startEngine(`right`)" class = "button" id="rightstart">Start Right Engine</button><button onclick="stopEngineLeft()" class = "button">Stop Left Engine</button><button onclick="stopEngineRight()" class = "button">Stop Right Engine</button><p>ILS:</p><button class = "button" onclick = "togglePanel()">ILS On/Off</button><button class = "button" onclick = "radar()">ILS Terrain Radar On/Off</button><p>PFD:</p><button class = "button" id="PFDtoggle" onclick = "PFDtoggle()">PFD On/Off</button><p>APU:</p><button class = "button" id="apuToggle" onclick = "APUtoggle()">APU On/Off</button></div></ul>'

let sidePanel = document.getElementsByClassName("geofs-ui-left")[0]
document.getElementsByClassName("geofs-ui-left")[0].appendChild(a320panel)

// Toggle Button Code
let buttonDiv = document.createElement("div");
buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-autoland-list" data-tooltip-classname="mdl-tooltip--top" id="landButton" tabindex="0" data-upgraded=",MaterialButton">A321Neo</button>'
document.body.appendChild(buttonDiv);
document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(buttonDiv);
let element = document.getElementById("landButton");
document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, buttonDiv);
let k = 125;
let dc = -1.5;
let m = 0.6;
let vl = 0;
let vr = 0;
let dsl = 0;
let dsr = 0;
let restingpoint = 0;
let dml = 0;
let dmr = 0;
let rrate = 1/240;
let frameD = rrate * 1000;
let autopilotDisconnectSound = new Audio("https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3")

// autopliot disconnect sound
geofs.autopilot._turnOff = geofs.autopilot.turnOff // duplicate the original
geofs.autopilot.turnOff = () => { // override the original function
  geofs.autopilot._turnOff();
  if (audio.on && !geofs.pause) autopilotDisconnectSound.play();
}


//fix bug with reset
geofs.flyTo = function(a, b) {
  clearInterval(soundInt)
  clearInterval(accelInt);
  setTimeout(function(){
    accelInt = setInterval(function(){
      getAccel()
    },10)

    soundInt = setInterval(function(){
      getFinalSoundVolumes();
      //groundEffect();
      getGearFlapsWarn();
      testForApproach();
      testTerrainorAppr();
      doRadioAltCall();
      checkReverse();
      checkCabin();
      doShake();
      getGroundSound();
      getGearThud();
      overspeed();
      getRainVol();
      getTouch();
      getTrimSound();
      getFlapsSound();
      getFlapsClick();
      resetLift();
      applyInertia();
      getPaxCheer();
      getScream();
      getFrontTouch();
      bumpCount()
    })
  }, 2000)
  lastWingPosL = 0;
  lastWingPosR = 0;
  accelerationL = 1;
  accelerationR = 1;
  geofs.animation.values.volumeCabin = null;
  geofs.animation.values.engSoundMultF = null;
  geofs.animation.values.engSoundMultR = null;
  geofs.animation.values.engSoundFar = null;
  geofs.animation.values.reverseThrustVol = null;
  geofs.animation.values.cabinAmb = null;
  geofs.animation.values.groundSound = null;
  geofs.animation.values.gearThud = null;
  geofs.animation.values.overspeed = null;
  geofs.animation.values.rainVol = null;
  geofs.animation.values.tdSoft = null;
  geofs.animation.values.tdHard = null;
  geofs.animation.values.spoilersSound = null;
  geofs.animation.values.shake = null;
  geofs.animation.values.flapsClick = null;
  geofs.animation.values.flapsSound = null;
  geofs.animation.values.trimSound = null;
  geofs.animation.values.liftLeftWing = 1;
  geofs.animation.values.liftRightWing = 1;
  geofs.animation.values.defL = 1;
  geofs.animation.values.defR = 1;
  geofs.animation.values.paxScream = 0;
  geofs.animation.values.paxClap = 0;
  geofs.animation.values.bump = 0;
    if (a) {
        geofs.doPause(1);
        var c = geofs.aircraft.instance;
        a[0] = a[0] || geofs.initialRunways[0][0];
        a[1] = a[1] || geofs.initialRunways[0][1];
        a[2] = a[2] || 0;
        a[3] = a[3] || 0;
        c.absoluteStartAltitude = a[4] ? !0 : !1;
        c.startAltitude = a[2];
        geofs.lastFlightCoordinates = a;
        var d = a[0]
          , e = a[1]
          , g = a[2]
          , f = [0, 0, 0];
        f[0] = a[3];
        var k = 0 == g;
        c.llaLocation = [d, e, g];
        b ? geofs.camera.set(geofs.camera.currentMode) : (geofs.probeTerrain(),
        geofs.camera.reset(),
        controls.reset(),
        weather.reset(),
        weather.refresh());
        geofs.api.waterDetection.reset();
        c.reset(k);
        instruments.reset();
        geofs.objects.update(c.llaLocation);
        geofs.runways.refresh();
        geofs.runwaysLights.updateAll();
        ui.hideCrashNotification();
        geofs.api.getGuarantiedGroundAltitude([d, e, 0]).then(function(m) {
            m = m[0].height || 0;
            geofs.groundElevation = m;
            flight.reset(geofs.groundElevation);
            k ? (c.startAltitude = geofs.groundElevation + c.definition.startAltitude,
            c.absoluteStartAltitude = !1) : c.absoluteStartAltitude || (c.startAltitude += geofs.groundElevation);
            c.llaLocation[2] = c.startAltitude;
            flight.elevationAtPreviousLocation = m;
            k ? (f[1] = c.definition.startTilt || 0,
            c.startOnGround = !0,
            c.groundContact = !0,
            c.place(c.llaLocation, f),
            c.object3d.compute(c.llaLocation),
            c.render()) : (c.startOnGround = !1,
            c.place(c.llaLocation, f),
            c.object3d.compute(c.llaLocation),
            m = c.definition.minimumSpeed / 1.94 * c.definition.mass,
            c.rigidBody.applyCentralImpulse(V3.scale(c.object3d.getWorldFrame()[1], m)));
            geofs.undoPause(1);
            geofs.camera.setToNeutral();
            geofs.camera.update(2);
            flight.recorder.clear();
            $(document).trigger("flyto")
        })
    }
};
//define new variables
geofs.animation.values.volumeCabin = null;
geofs.animation.values.engSoundMultF = null;
geofs.animation.values.engSoundMultR = null;
geofs.animation.values.engSoundFar = null;
geofs.animation.values.reverseThrustVol = null;
geofs.animation.values.cabinAmb = null;
geofs.animation.values.groundSound = null;
geofs.animation.values.gearThud = null;
geofs.animation.values.overspeed = null;
geofs.animation.values.rainVol = null;
geofs.animation.values.tdSoft = null;
geofs.animation.values.tdHard = null;
geofs.animation.values.spoilersSound = null;
geofs.animation.values.shake = null;
geofs.animation.values.flapsClick = null;
geofs.animation.values.flapsSound = null;
geofs.animation.values.trimSound = null;
geofs.animation.values.liftLeftWing = 1;
geofs.animation.values.liftRightWing = 1;
geofs.animation.values.defL = 1;
geofs.animation.values.defR = 1;
geofs.animation.values.paxScream = 0;
geofs.animation.values.paxClap = 0;
geofs.animation.values.tdFront = 0;
geofs.animation.values.bump = 0;
let bumpDist = 10;
let bumpSC = 0;

//get taxiway bumps
function bumpCount() {
  //enable sim continuity when out of cabin
  if (geofs.animation.values.groundContact == 1) {
    var s = geofs.animation.values.kias / 45.0;
    if (s < 0.05) s = 0;
    bumpSC += s;
    if (bumpSC >= bumpDist) {
      bumpSC = 0;
      if (geofs.camera.currentModeName == "cockpit" || geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
        geofs.animation.values.bump = 1;
        setTimeout(function(){geofs.animation.values.bump = 0;},1500);
      }
    }
  }
}
//get clap/scream fx

function getScream() {
  if (geofs.camera.currentModeName == "cockpit" || geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
    if (geofs.animation.values.climbrate <= -6000 && geofs.animation.values.kias > 300) {
      geofs.animation.values.paxScream = 1;
    }
    else {
      geofs.animation.values.paxScream = 0;
    }
  }
  else {
    geofs.animation.values.paxScream = 0;
  }
}

function getPaxCheer() {
  if (weather.definition.turbulences <= 0.8) {
    geofs.animation.values.paxClap = 0;
  }
};

//add g force effect to wingflex 
function resetLift(){
geofs.animation.values.liftLeftWing = (-geofs.aircraft.instance.parts.leftwing.lift / 50000)+((geofs.animation.values.accZ - 9)/50 + geofs.animation.values.shake / 1000) / (geofs.animation.values.kias / 150);
geofs.animation.values.liftRightWing = (-geofs.aircraft.instance.parts.rightwing.lift / 50000)+((geofs.animation.values.accZ - 9)/50 + geofs.animation.values.shake / 1000) / (geofs.animation.values.kias / 150);
};

let lastWingPosL = 0;
let lastWingPosR = 0;
let accelerationL = 1;
let accelerationR = 1;
    
function getAccel() {
  lastWingPosL = geofs.animation.values.liftLeftWing;
  lastWingPosR = geofs.animation.values.liftLeftWing;
  setTimeout(function(){
    accelerationL = 10 *(geofs.animation.values.liftLeftWing - lastWingPosL) / geofs.animation.values.defL + 1;
    accelerationR = 10 *(geofs.animation.values.liftRightWing - lastWingPosR) / geofs.animation.values.defR + 1;
  }, 10)
}

accelInt = setInterval(function(){
  getAccel()
},10)

function applyInertia() {
  geofs.animation.values.defL = ((accelerationL) * lastWingPosL) * -100000;
  geofs.animation.values.defR = ((accelerationR) * lastWingPosR) * -100000;
}

/*
geofs.aircraft.instance.setup.parts[2].animations[0].function = "{return geofs.animation.values.defL}"
geofs.aircraft.instance.setup.parts[3].animations[0].function = "{return geofs.animation.values.defL}"
geofs.aircraft.instance.setup.parts[4].animations[0].function = "{return geofs.animation.values.defL}"

geofs.aircraft.instance.setup.parts[25].animations[0].function = "{return geofs.animation.values.defR}"
geofs.aircraft.instance.setup.parts[26].animations[0].function = "{return geofs.animation.values.defR}"
geofs.aircraft.instance.setup.parts[27].animations[0].function = "{return geofs.animation.values.defR}"
*/


let lastFlapPos = 0;
let lastFlapTarg = 0;

function getFlapsSound() {
  if (geofs.camera.currentModeName == "Left wing" || geofs.camera.currentModeName == "Right wing") {
    if (geofs.animation.values.flapsPosition != lastFlapPos) {
      geofs.animation.values.flapsSound = 1;
    }
    else {
      geofs.animation.values.flapsSound = 0;
    }
  }
  else {
    geofs.animation.values.flapsSound = 0;
  }
  lastFlapPos = geofs.animation.values.flapsPosition;
}


function getFlapsClick() {
  if (geofs.camera.currentModeName == "cockpit") {
    if (lastFlapTarg != geofs.animation.values.flapsTarget) {
      geofs.animation.values.flapsClick = 1;
      setTimeout(function() {
        geofs.animation.values.flapsClick = 0;
      }, 200)
    }
  }
  else {
    geofs.animation.values.flapsClick = 0;
  }
  lastFlapTarg = geofs.animation.values.flapsTarget
}

let lastTrim = 0;

function getTrimSound() {
  if (geofs.camera.currentModeName == "cockpit") {
    if (lastTrim != geofs.animation.values.trim) {
      geofs.animation.values.trimSound = 1;
    }
    else {
      geofs.animation.values.trimSound = 0;      
    }
  }
  else {
    geofs.animation.values.trimSound = 0;
  }
  lastTrim = geofs.animation.values.trim
}

//ground effect sound sensing

function getGroundSound() {
  if (geofs.animation.values.haglFeet < 20) {
        geofs.animation.values.groundSound = (-(geofs.animation.values.haglFeet) + 20) * (geofs.animation.values.kias / 10) / 500;
  }
  else {
    geofs.animation.values.groundSound = 0;
  }
}

function getGearThud() {
  if (geofs.animation.values.gearPosition != 0 && geofs.animation.values.gearPosition != 1) {
    geofs.animation.values.gearThud = 1;
  }
  else {
    geofs.animation.values.gearThud = 0;
  }
}

function getSpoilerSound() {
  if (geofs.animation.values.airbrakesPosition != 0) {
    geofs.animation.values.spoilersSound = geofs.animation.values.airbrakesPosition * (geofs.animation.values.kias / 10)
  }
  else {
    geofs.animation.values.spoilersSound = 0;
  }
}

function getShake() {
  if (geofs.animation.values.tdHard == 1 || geofs.animation.values.tdSoft == 1) {
    geofs.animation.values.shake = Math.random() * (geofs.animation.values.climbrate / 10)
      return;
  }
  if (geofs.animation.values.groundContact == 1) {
    geofs.animation.values.shake = geofs.animation.values.kias * Math.random();
  }
  else {
    geofs.animation.values.shake = geofs.animation.values.aoa * Math.random();
  }

}

function overspeed() {
  if (geofs.camera.currentModeName == "cockpit") {
  if (geofs.animation.values.kias >= 450) {
    geofs.animation.values.overspeed = 1;
  }
  else {
    geofs.animation.values.overspeed = 0;
    }
  }
  else {
    geofs.animation.values.overspeed = 0;
  }
}

let lastGC = 0;
let lastGCF = 0;
let noseDown = 0;

function getTouch() {
  if (lastGC != geofs.animation.values.groundContact && geofs.animation.values.groundContact != 0) {
    if (Math.abs(geofs.animation.values.climbrate) >= 1000) {
      geofs.animation.values.tdSoft = 0;
      geofs.animation.values.tdHard = 1;
      setTimeout(function(){
        geofs.animation.values.tdHard = 0;
      }, 1000)
    }
    else {
      if (geofs.animation.values.climbrate >= -1000) {
        geofs.animation.values.paxClap = 1;
        setTimeout(function(){
          geofs.animation.values.paxClap = 0;
        }, 5000)
      }
      geofs.animation.values.tdSoft = 1;
      geofs.animation.values.tdHard = 0;
      setTimeout(function(){
        geofs.animation.values.tdSoft = 0;
      }, 1000)
    }
  }
  lastGC = geofs.animation.values.groundContact;
};


function getFrontTouch() {
  if (geofs.animation.values.nose_suspensionSuspension > 0) {
    noseDown = 1;
  }
  else {
    noseDown = 0;
  }

  if (lastGCF != noseDown && noseDown != 0 && geofs.camera.currentModeName === "cockpit") {
    geofs.animation.values.tdFront = 1;
    setTimeout(function(){
      geofs.animation.values.tdFront = 0;
    }, 1000)
  }
  lastGCF = noseDown;
};

function doShake() {

  getShake() 
  geofs.camera.translate(0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake,0.0001 * geofs.animation.values.shake)
  setTimeout(function(){
    geofs.camera.translate(-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake,-0.0001 * geofs.animation.values.shake)
  },1)
}

function getRainVol() {
  if (geofs.camera.currentModeName != "cockpit") {
    geofs.animation.values.rainVol = 0;
    return;
  }
  if (weather.definition.precipitationAmount != 0 && weather.definition.precipitationType === "rain") {
    if (geofs.animation.values.altitudeMeters <= weather.definition.ceiling) {
      geofs.animation.values.rainVol = (clamp(weather.definition.precipitationAmount, 0, 10) * geofs.animation.values.kias / 2)/1000
    }
    else {
      geofs.animation.values.rainVol = 0;
    }
  }
  else {
    geofs.animation.values.rainVol = 0;
  }
}

//find direction from camera in degrees. 0 should be directly behind, 90 is to the left of the plane, 180 is in front, and 270 is to the right.
function radians(n) {
  return n * (Math.PI / 180);
};

function degrees(n) {
  return n * (180 / Math.PI);
};

function getCameraDirection() {
  var a = geofs.api.getCameraLla(geofs.camera.cam);
  var b = geofs.aircraft.instance.llaLocation;
  var startLat = radians(a[0]);
  var startLong = radians(a[1]);
  var endLat = radians(b[0]);
  var endLong = radians(b[1]);

  let dLong = endLong - startLong;

  let dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 270.0) % 360.0;
};

//split camera into front and backblast sound cones, front and sides should sound the same, while the back should play a backblast sound.
function checkPos() {
    var a = (getCameraDirection() - geofs.animation.values.heading360) % 360;
    var b = radians(a);
    var c = Math.cos(b);
    var d = Math.sin(b);
    var e = clamp((clamp(d, 0, 1) + Math.abs(c)), 0, 1)
    var f = clamp((clamp(-d, 0, 1) - Math.abs(c)), 0, 1)
    return [e,f]; // e is front sound, f is backblast
  };

//get distance from aircraft
function camDist() {
    var R = 6371 // km
    var lat1 = radians(geofs.api.getCameraLla(geofs.camera.cam)[0])
    var lat2 = radians(geofs.aircraft.instance.llaLocation[0])
    var lon1 = radians(geofs.api.getCameraLla(geofs.camera.cam)[1])
    var lon2 = radians(geofs.aircraft.instance.llaLocation[1])
    var dLat = radians(lat2 - lat1)
    var dLon = radians(lon2 - lon1)


    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d * 1000
};

function findVolumes() {
  var scalar = 100;
  var d = camDist() * 2;
  var v = -0.005 * (((d * 10) - 100) * ((d * 10) - 100)) + 100;
  var v1 = (scalar * -d) + 1000;
  return [clamp(v1/100, 0, 100), clamp(v*10, 0, 10000)];
};

//mix all sound functions
function getFinalSoundVolumes() {
  if (geofs.camera.currentModeName != "cockpit" && geofs.camera.currentModeName != "Left wing" && geofs.camera.currentModeName != "Right wing") {
  var rpm = geofs.animation.values.rpm / 10
  var vClose = findVolumes()[0];
  var vFar = findVolumes()[1];
  var vDf = checkPos()[0];
  var vDb = checkPos()[1];
  var finalVf = vClose * vDf * rpm;
  var finalVb = (vClose * vDb * rpm * 10);
    geofs.animation.values.engSoundMultF = finalVf;
    geofs.animation.values.engSoundMultR = vDb/2 * 7000 * clamp(geofs.animation.values.rpm, 0, 1);
    geofs.animation.values.engSoundFar = vFar;
    geofs.animation.values.volumeCabin = 0;
  }

  else {
    geofs.animation.values.engSoundMultF = 0;
    geofs.animation.values.engSoundMultR = 0;
    geofs.animation.values.engSoundFar = 0;
    geofs.animation.values.volumeCabin = geofs.animation.values.rpm;
  }

}

function checkReverse() {
  if (geofs.animation.values.throttle < 0) {
    geofs.animation.values.reverseThrustVol = Math.abs(geofs.animation.values.throttle) * 10
  }
  else {
    geofs.animation.values.reverseThrustVol = 0;
  }
}

function checkCabin() {
  if (geofs.animation.values.volumeCabin > 0) {
    geofs.animation.values.cabinAmb = 1;
  }
  else {
    geofs.animation.values.cabinAmb = 0;
  }
}

//assign new sounds
function assignSounds() {
geofs.aircraft.instance.definition.sounds[0].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/englowfront.ogg"
geofs.aircraft.instance.definition.sounds[0].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[0].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[1].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/engmidfront.ogg"
geofs.aircraft.instance.definition.sounds[1].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[1].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[2].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighestfront.ogg"
geofs.aircraft.instance.definition.sounds[2].effects.volume.value = "engSoundMultF";
geofs.aircraft.instance.definition.sounds[2].effects.pitch.value = "rpm";
geofs.aircraft.instance.definition.sounds[3].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737rolling.mp3"
  

geofs.aircraft.instance.definition.sounds[7] = {};
    geofs.aircraft.instance.definition.sounds[7].id = "rpmback";
geofs.aircraft.instance.definition.sounds[7].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighback.ogg"
geofs.aircraft.instance.definition.sounds[7].effects = {"volume": {"value": "engSoundMultR", "ramp": [6000, 10000, 20000, 50000]},"pitch": {"value": "rpm", "ramp": [1000, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

geofs.aircraft.instance.definition.sounds[8] = {};
  geofs.aircraft.instance.definition.sounds[8].id = "rpmback1";
geofs.aircraft.instance.definition.sounds[8].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/enghighback.ogg"
geofs.aircraft.instance.definition.sounds[8].effects = {"volume": {"value": "engSoundMultR", "ramp": [100, 500, 2000, 10000]},"pitch": {"value": "rpm", "ramp": [1000, 20000, 20000, 20000], "ratio": 1, "offset": 1}}


  geofs.aircraft.instance.definition.sounds[9] = {};
geofs.aircraft.instance.definition.sounds[9].id = "flapswarn"
  geofs.aircraft.instance.definition.sounds[9].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlf.mp3"
geofs.aircraft.instance.definition.sounds[9].effects = {"start": {"value": "isFlapsWarn"}}

  geofs.aircraft.instance.definition.sounds[10] = {};
geofs.aircraft.instance.definition.sounds[10].id = "terrainwarn"
  geofs.aircraft.instance.definition.sounds[10].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlt.mp3"
geofs.aircraft.instance.definition.sounds[10].effects = {"start": {"value": "isTerrainWarn"}}

  geofs.aircraft.instance.definition.sounds[11] = {};
geofs.aircraft.instance.definition.sounds[11].id = "pullwarn"
  geofs.aircraft.instance.definition.sounds[11].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/pullup.mp3"
geofs.aircraft.instance.definition.sounds[11].effects = {"start": {"value": "isPullupWarn"}}

  geofs.aircraft.instance.definition.sounds[12] = {};
geofs.aircraft.instance.definition.sounds[12].id = "bankangle"
  geofs.aircraft.instance.definition.sounds[12].file = ""
geofs.aircraft.instance.definition.sounds[12].effects = {"start": {"value": "isBankWarn"}}

  geofs.aircraft.instance.definition.sounds[13] = {};
geofs.aircraft.instance.definition.sounds[13].id = "1000"
  geofs.aircraft.instance.definition.sounds[13].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/1000gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[13].effects = {"start": {"value": "gpws1000"}}

  geofs.aircraft.instance.definition.sounds[14] = {};
geofs.aircraft.instance.definition.sounds[14].id = "500"
  geofs.aircraft.instance.definition.sounds[14].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/500correct.mp3"
geofs.aircraft.instance.definition.sounds[14].effects = {"start": {"value": "gpws500"}}

  geofs.aircraft.instance.definition.sounds[15] = {};
geofs.aircraft.instance.definition.sounds[15].id = "400"
  geofs.aircraft.instance.definition.sounds[15].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/400gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[15].effects = {"start": {"value": "gpws400"}}

  geofs.aircraft.instance.definition.sounds[16] = {};
geofs.aircraft.instance.definition.sounds[16].id = "300"
  geofs.aircraft.instance.definition.sounds[16].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/300gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[16].effects = {"start": {"value": "gpws300"}}

  geofs.aircraft.instance.definition.sounds[17] = {};
geofs.aircraft.instance.definition.sounds[17].id = "200"
  geofs.aircraft.instance.definition.sounds[17].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/200gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[17].effects = {"start": {"value": "gpws200"}}

  geofs.aircraft.instance.definition.sounds[18] = {};
geofs.aircraft.instance.definition.sounds[18].id = "100"
  geofs.aircraft.instance.definition.sounds[18].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/100gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[18].effects = {"start": {"value": "gpws100"}}

  geofs.aircraft.instance.definition.sounds[19] = {};
geofs.aircraft.instance.definition.sounds[19].id = "50"
  geofs.aircraft.instance.definition.sounds[19].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/50gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[19].effects = {"start": {"value": "gpws50"}}

  geofs.aircraft.instance.definition.sounds[20] = {};
geofs.aircraft.instance.definition.sounds[20].id = "40"
  geofs.aircraft.instance.definition.sounds[20].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/40gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[20].effects = {"start": {"value": "gpws40"}}

  geofs.aircraft.instance.definition.sounds[21] = {};
geofs.aircraft.instance.definition.sounds[21].id = "30"
  geofs.aircraft.instance.definition.sounds[21].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/30gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[21].effects = {"start": {"value": "gpws30"}}

  geofs.aircraft.instance.definition.sounds[22] = {};
geofs.aircraft.instance.definition.sounds[22].id = "20"
  geofs.aircraft.instance.definition.sounds[22].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/20gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[22].effects = {"start": {"value": "gpws20"}}

  geofs.aircraft.instance.definition.sounds[23] = {};
geofs.aircraft.instance.definition.sounds[23].id = "10"
  geofs.aircraft.instance.definition.sounds[23].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/10gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[23].effects = {"start": {"value": "gpws10"}}

geofs.aircraft.instance.definition.sounds[24] = {};
geofs.aircraft.instance.definition.sounds[24].id = "TCAS";
geofs.aircraft.instance.definition.sounds[24].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/traffic.mp3";
geofs.aircraft.instance.definition.sounds[24].effects = {
	"start": {
		"value": "isTCAS"
	}
};

geofs.aircraft.instance.definition.sounds[25] = {};
geofs.aircraft.instance.definition.sounds[25].id = "climb";
geofs.aircraft.instance.definition.sounds[25].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/climb.mp3";
geofs.aircraft.instance.definition.sounds[25].effects = {
	"start": {
		"value": "isTCASClimb"
	}
};

geofs.aircraft.instance.definition.sounds[26] = {};
geofs.aircraft.instance.definition.sounds[26].id = "descend";
geofs.aircraft.instance.definition.sounds[26].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/descend.mp3";
geofs.aircraft.instance.definition.sounds[26].effects = {
	"start": {
		"value": "isTCASDescend"
	}
};

geofs.aircraft.instance.definition.sounds[27] = {};
geofs.aircraft.instance.definition.sounds[27].id = "clear";
geofs.aircraft.instance.definition.sounds[27].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/clear.mp3";
geofs.aircraft.instance.definition.sounds[27].effects = {
	"start": {
		"value": "isTCASClear"
	}
};

  geofs.aircraft.instance.definition.sounds[28] = {};
geofs.aircraft.instance.definition.sounds[28].id = "rpmin1";
geofs.aircraft.instance.definition.sounds[28].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/lowcab.ogg";
geofs.aircraft.instance.definition.sounds[28].effects = {"volume": {"value": "volumeCabin", "ramp": [800, 950, 2500, 3500]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

  geofs.aircraft.instance.definition.sounds[29] = {};
geofs.aircraft.instance.definition.sounds[29].id = "rpmin2";
geofs.aircraft.instance.definition.sounds[29].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/midcab.ogg";
geofs.aircraft.instance.definition.sounds[29].effects = {"volume": {"value": "volumeCabin", "ramp": [1000, 2500, 10000, 10000]},"pitch": {"value": "rpm", "ramp": [0, 20000, 20000, 20000], "ratio": 1, "offset": 1}}

    geofs.aircraft.instance.definition.sounds[30] = {};
geofs.aircraft.instance.definition.sounds[30].id = "buzzsaw";
geofs.aircraft.instance.definition.sounds[30].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/buzzsawcab.ogg";
geofs.aircraft.instance.definition.sounds[30].effects = {"volume": {"value": "volumeCabin", "ramp": [3000, 10000, 20000, 20000]}};

  geofs.aircraft.instance.definition.sounds[31] = {};
geofs.aircraft.instance.definition.sounds[31].id = "reverse";
geofs.aircraft.instance.definition.sounds[31].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737reverse.mp3";
geofs.aircraft.instance.definition.sounds[31].effects = {"volume": {"value": "reverseThrustVol", "ramp": [0, 100, 1000, 2500]}};

geofs.aircraft.instance.definition.sounds[32] = {};
geofs.aircraft.instance.definition.sounds[32].id = "system";
geofs.aircraft.instance.definition.sounds[32].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737-800_cabin_system.mp3";
geofs.aircraft.instance.definition.sounds[32].effects = {
	"start": {
		"value": "cabinAmb"
	}
};
geofs.aircraft.instance.definition.sounds[33] = {};
geofs.aircraft.instance.definition.sounds[33].id = "pax";
geofs.aircraft.instance.definition.sounds[33].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737-800_cabin_ambience.mp3";
geofs.aircraft.instance.definition.sounds[33].effects = {
	"start": {
		"value": "cabinAmb"
	}
};

geofs.aircraft.instance.definition.sounds[34] = {};
geofs.aircraft.instance.definition.sounds[34].id = "touchH";
geofs.aircraft.instance.definition.sounds[34].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/hardtouch1.mp3";
geofs.aircraft.instance.definition.sounds[34].effects = {
	"start": {
		"value": "tdHard"
	},
  "volume": {
    "ratio": 0.1
  }
};

geofs.aircraft.instance.definition.sounds[35] = {};
geofs.aircraft.instance.definition.sounds[35].id = "touchS";
geofs.aircraft.instance.definition.sounds[35].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/softtouch1.mp3";
geofs.aircraft.instance.definition.sounds[35].effects = {
	"start": {
		"value": "tdSoft"
	},
  "volume": {
    "value": "tdSoft",
    "ratio": 1
  }
};

geofs.aircraft.instance.definition.sounds[36] = {};
geofs.aircraft.instance.definition.sounds[36].id = "overspeed";
geofs.aircraft.instance.definition.sounds[36].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_overspeed.mp3";
geofs.aircraft.instance.definition.sounds[36].effects = {
	"start": {
		"value": "overspeed"
	}
};

geofs.aircraft.instance.definition.sounds[37] = {};
geofs.aircraft.instance.definition.sounds[37].id = "gearThud";
geofs.aircraft.instance.definition.sounds[37].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/wheelthud.mp3";
geofs.aircraft.instance.definition.sounds[37].effects = {
	"start": {
		"value": "gearThud"
	}
};

geofs.aircraft.instance.definition.sounds[38] = {};
geofs.aircraft.instance.definition.sounds[38].id = "rain";
geofs.aircraft.instance.definition.sounds[38].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_rain.mp3";
geofs.aircraft.instance.definition.sounds[38].effects = {
	"volume": {
		"value": "rainVol",
    "ratio": 1
	}
};

geofs.aircraft.instance.definition.sounds[39] = {};
geofs.aircraft.instance.definition.sounds[39].id = "groundwind";
geofs.aircraft.instance.definition.sounds[39].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/groundeffect1.mp3";
geofs.aircraft.instance.definition.sounds[39].effects = {
	"volume": {
		"value": "groundSound",
    "ratio": 1
	}
};

geofs.aircraft.instance.definition.sounds[40] = {};
geofs.aircraft.instance.definition.sounds[40].id = "flapsClick";
geofs.aircraft.instance.definition.sounds[40].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/flapslever.mp3";
geofs.aircraft.instance.definition.sounds[40].effects = {
	"start": {
		"value": "flapsClick"
	}
};

geofs.aircraft.instance.definition.sounds[41] = {};
geofs.aircraft.instance.definition.sounds[41].id = "flapsSound";
geofs.aircraft.instance.definition.sounds[41].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/737flaps.mp3";
geofs.aircraft.instance.definition.sounds[41].effects = {
	"start": {
		"value": "flapsSound"
	}
};

geofs.aircraft.instance.definition.sounds[42] = {};
geofs.aircraft.instance.definition.sounds[42].id = "trim";
geofs.aircraft.instance.definition.sounds[42].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/sounds_trim.mp3";
geofs.aircraft.instance.definition.sounds[42].effects = {
	"start": {
		"value": "trimSound"
	}
};

geofs.aircraft.instance.definition.sounds[43] = {};
geofs.aircraft.instance.definition.sounds[43].id = "clap";
geofs.aircraft.instance.definition.sounds[43].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/paxclap1.mp3";
geofs.aircraft.instance.definition.sounds[43].effects = {
	"start": {
		"value": "paxClap"
	}
};

geofs.aircraft.instance.definition.sounds[44] = {};
geofs.aircraft.instance.definition.sounds[44].id = "scream";
geofs.aircraft.instance.definition.sounds[44].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/paxscream.mp3";
geofs.aircraft.instance.definition.sounds[44].effects = {
	"start": {
		"value": "paxScream"
	}
};

geofs.aircraft.instance.definition.sounds[45] = {};
geofs.aircraft.instance.definition.sounds[45].id = "frontgearthump";
geofs.aircraft.instance.definition.sounds[45].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/nosetouch.ogg";
geofs.aircraft.instance.definition.sounds[45].effects = {
	"start": {
		"value": "tdFront"
	}
};
  geofs.aircraft.instance.definition.sounds[46] = {};
geofs.aircraft.instance.definition.sounds[46].id = "rpfar";
geofs.aircraft.instance.definition.sounds[46].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/engfar.mp3";
geofs.aircraft.instance.definition.sounds[46].effects = {"volume": {"value": "engSoundFar", "ramp": [0, 2000, 10000, 10000]}}
	
    geofs.aircraft.instance.definition.sounds[47] = {};
geofs.aircraft.instance.definition.sounds[47].id = "spool";
geofs.aircraft.instance.definition.sounds[47].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/spoolcab.mp3";
geofs.aircraft.instance.definition.sounds[47].effects = {"volume": {"value": "volumeCabin", "ramp": [1500, 6000, 7000, 8000]}, "pitch": {"value": "rpm", "ramp": [3500, 10000, 20000, 20000], "ratio": 1, "offset": 1}};	

geofs.aircraft.instance.definition.sounds[48] = {};
geofs.aircraft.instance.definition.sounds[48].id = "taxiBump"
geofs.aircraft.instance.definition.sounds[48].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/bump.mp3"
geofs.aircraft.instance.definition.sounds[48].effects = {"start": {"value": "bump"}}
	
audio.init(geofs.aircraft.instance.definition.sounds)
geofs.aircraft.instance.definition.sounds[0].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[0].effects.volume.ramp = [100, 500, 2000, 10000]
geofs.aircraft.instance.definition.sounds[1].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[2].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ramp = [0, 50, 1000, 1000]
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 1
geofs.aircraft.instance.definition.sounds[7].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[8].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[46].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[28].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[29].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[30].effects.volume.ratio = 350
geofs.aircraft.instance.definition.sounds[31].effects.volume.ratio = 750
geofs.aircraft.instance.definition.sounds[34].effects.volume.ratio = 1
geofs.aircraft.instance.definition.sounds[39].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[47].effects.volume.ratio = 90
geofs.aircraft.instance.definition.sounds[48].effects.volume = {};
geofs.aircraft.instance.definition.sounds[48].effects.volume.ratio = 2;
}
assignSounds()


function groundEffect() {
  if (geofs.animation.values.haglFeet <= 100) {
    geofs.aircraft.instance.rigidBody.applyCentralImpulse([0,0,(-(geofs.animation.values.haglFeet) + 100) * geofs.animation.values.kias] / 10)
  }
}

let restingPoint = 5.152139372973117

//detect and execute GPWS callouts
let isApprConfig = false;
 geofs.animation.values.isFlapsWarn = 0;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isTerrainWarn = 0;
 geofs.animation.values.isPullupWarn = 0;
 geofs.animation.values.isBankWarn = 0;
 geofs.animation.values.gpws1000 = 0;
 geofs.animation.values.gpws500 = 0;
 geofs.animation.values.gpws400 = 0;
 geofs.animation.values.gpws300 = 0;
 geofs.animation.values.gpws200 = 0;
 geofs.animation.values.gpws100 = 0;
 geofs.animation.values.gpws50 = 0;
 geofs.animation.values.gpws40 = 0;
 geofs.animation.values.gpws30 = 0;
 geofs.animation.values.gpws20 = 0;
 geofs.animation.values.gpws10 = 0;
geofs.animation.values.isTCASClimb = 0;
geofs.animation.values.isTCASDescend = 0;
geofs.animation.values.isTCAS = 0;
geofs.animation.values.isTCASClear = 0;

function getGearFlapsWarn() {
if (geofs.animation.values.groundContact == 1) {
  geofs.animation.values.isGearWarn = 0;
  geofs.animation.values.isFlapsWarn = 0;
  return;
}
	if (geofs.animation.values.haglFeet <= 500 && geofs.animation.values.gearPosition == 1 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isGearWarn = 1;
	} else {
		geofs.animation.values.isGearWarn = 0;
	}

	if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.flapsPosition == 0 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isFlapsWarn = 1;
	} else {
		geofs.animation.values.isFlapsWarn = 0;
	}
}

function testTerrainorAppr() {
	if (geofs.animation.values.gearPosition == 0) {
		if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -100 && geofs.animation.values.climbrate >= -5000 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.isFlapsWarn == 0 && isApprConfig == 0) {
			geofs.animation.values.isTerrainWarn = 1;
		} else {
			geofs.animation.values.isTerrainWarn = 0;
		}

		if (geofs.animation.values.haglFeet <= 5000 && geofs.animation.values.climbrate <= -2000 || geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -5000) {
			geofs.animation.values.isPullupWarn = 1;
		} else {
			geofs.animation.values.isPullupWarn = 0;
		}
	} else {
		geofs.animation.values.isTerrainWarn = 0;
    geofs.animation.values.isPullupWarn = 0;
		return;
	}
}


function testForApproach(){
  if (geofs.animation.values.isFlapsWarn == 0 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.climbrate <= -1){
    isApprConfig = true
  }
  else{
    isApprConfig = false
  }
}

function doRadioAltCall(){
  if (isApprConfig){
  if (geofs.animation.values.haglFeet <= 1000 + restingPoint && geofs.animation.values.haglFeet >= 900 + restingPoint){
    geofs.animation.values.gpws1000 = 1;
  }
  else{
    geofs.animation.values.gpws1000 = 0;
  }
   if (geofs.animation.values.haglFeet <= 500 + restingPoint && geofs.animation.values.haglFeet >= 400 + restingPoint){
    geofs.animation.values.gpws500 = 1;
  }
  else{
    geofs.animation.values.gpws500 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 400 + restingPoint && geofs.animation.values.haglFeet >= 300 + restingPoint){
    geofs.animation.values.gpws400 = 1;
  }
  else{
    geofs.animation.values.gpws400 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 300 + restingPoint && geofs.animation.values.haglFeet >= 200 + restingPoint){
    geofs.animation.values.gpws300 = 1;
  }
  else{
    geofs.animation.values.gpws300 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 200 + restingPoint && geofs.animation.values.haglFeet >= 100 + restingPoint){
    geofs.animation.values.gpws200 = 1;
  }
  else{
    geofs.animation.values.gpws200 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 100 + restingPoint && geofs.animation.values.haglFeet >= 50 + restingPoint){
    geofs.animation.values.gpws100 = 1;
  }
  else{
    geofs.animation.values.gpws100 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 50 + restingPoint && geofs.animation.values.haglFeet >= 40 + restingPoint){
    geofs.animation.values.gpws50 = 1;
  }
  else{
    geofs.animation.values.gpws50 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 40 + restingPoint && geofs.animation.values.haglFeet >= 30 + restingPoint){
    geofs.animation.values.gpws40 = 1;
  }
  else{
    geofs.animation.values.gpws40 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 30 + restingPoint && geofs.animation.values.haglFeet >= 20 + restingPoint){
    geofs.animation.values.gpws30 = 1;
  }
  else{
    geofs.animation.values.gpws30 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 20 + restingPoint && geofs.animation.values.haglFeet >= 10 + restingPoint){
    geofs.animation.values.gpws20 = 1;
  }
  else{
    geofs.animation.values.gpws20 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 10 + restingPoint && geofs.animation.values.haglFeet >= 5 + restingPoint){
    geofs.animation.values.gpws10 = 1;
  }
  else{
    geofs.animation.values.gpws10 = 0;
  } 
}
  else {
    geofs.animation.values.gpws1000 = 0;
    geofs.animation.values.gpws500 = 0;
    geofs.animation.values.gpws400 = 0;
    geofs.animation.values.gpws300 = 0;
    geofs.animation.values.gpws200 = 0;
    geofs.animation.values.gpws100 = 0;
    geofs.animation.values.gpws50 = 0;
    geofs.animation.values.gpws40 = 0;
    geofs.animation.values.gpws30 = 0;
    geofs.animation.values.gpws20 = 0;
    geofs.animation.values.gpws10 = 0;
  }
}






soundInt = setInterval(function(){
  getFinalSoundVolumes();
  //groundEffect();
  getGearFlapsWarn();
  testForApproach();
  testTerrainorAppr();
  doRadioAltCall();
  checkReverse();
  checkCabin();
  doShake();
  getGroundSound();
  getGearThud();
  overspeed();
  getRainVol();
  getTouch();
  getTrimSound();
  getFlapsSound();
  getFlapsClick();
  resetLift();
  applyInertia();
  getPaxCheer();
  getScream();
  getFrontTouch();
  bumpCount()
}, 10)


let alreadyChecked = false;
function doTrafficCheck() {
  geofs.animation.values.isTCASDescend = 0;
  geofs.animation.values.isTCASClimb = 0;
  Object.values(multiplayer.visibleUsers).forEach(function(e) {
    if (e.distance <= 1000) {
      if (alreadyChecked) {
        return;
      }
      geofs.animation.values.isTCAS = 1;
      setTimeout(function(){
         alreadyChecked = true
        geofs.animation.values.isTCAS = 0;
      }, 1000)
    }
})
  getTrafficProximity()
}

function getTrafficProximity() {
  if (geofs.animation.values.isTCAS == 1) {
    return;
  }
	Object.values(multiplayer.visibleUsers).forEach(function(e) {
		if (e.distance <= 1000) {
			if (e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters + 1000) {
				geofs.animation.values.isTCASDescend = 1;
				} else {
					geofs.animation.values.isTCASDescend = 0;
				}
				if (e.referencePoint.lla[2] <= geofs.animation.values.altitudeMeters && e.referencePoint.lla[2] >= geofs.animation.values.altitudeMeters - 1000) {
					geofs.animation.values.isTCASClimb = 1;

				} else {
					geofs.animation.values.isTCASClimb = 0;
				}
			}
	});
  if (geofs.animation.values.isTCASClimb == 0 && geofs.animation.values.isTCASDescend == 0) {
    alreadyChecked = false
  }
}


tcasIntervalAnnounce = setInterval(function() {
  if (geofs.animation.values.altitudeMeters >= 1000) {
  doTrafficCheck();
  }
}, 200)



geofs.animation.values.flexl = 0;
geofs.animation.values.flexr = 0;

function getds() {
  dsl = geofs.animation.values.flexl + geofs.aircraft.instance.parts['leftwing'].lift + (geofs.animation.values.accZ - 9.8) * 30;
  dsr = geofs.animation.values.flexr + geofs.aircraft.instance.parts['rightwing'].lift + (geofs.animation.values.accZ - 9.8) * 30;
}

function spring() {
  getds();
  var ldsl = dsl;
  var ldsr = dsr;
  var fl = -k * dsl;
  var fr = -k * dsr;
  dml = dc * vl;
  dmr = dc * vr;
  var al = (fl + dml) / m;
  var ar = (fr + dmr) / m;
  vl += al * rrate;
  vr += ar * rrate;
  geofs.animation.values.flexl += vl * rrate;
  geofs.animation.values.flexr += vr * rrate;
}

geofs.aircraft.instance.setup.parts[2].animations[0].function = "{return -geofs.animation.values.flexl}"
geofs.aircraft.instance.setup.parts[3].animations[0].function = "{return -geofs.animation.values.flexl}"
geofs.aircraft.instance.setup.parts[4].animations[0].function = "{return -geofs.animation.values.flexl}"

geofs.aircraft.instance.setup.parts[25].animations[0].function = "{return -geofs.animation.values.flexr}"
geofs.aircraft.instance.setup.parts[26].animations[0].function = "{return -geofs.animation.values.flexr}"
geofs.aircraft.instance.setup.parts[27].animations[0].function = "{return -geofs.animation.values.flexr}"

flexInterval = setInterval(function(){
  spring();
}, frameD)
//yaw damper
geofs.animation.values.rudderDamp = 0;

function yawDamper() {
  if (geofs.animation.values.haglFeet <= 200) {
    geofs.animation.values.rudderDamp = geofs.animation.values.yaw;
  } else {
    var av = geofs.aircraft.instance.rigidBody.v_angularVelocity[2] * 30
    geofs.animation.values.rudderDamp = geofs.animation.values.yaw - (av / (1 / geofs.animation.values.pitch * 40))
  }
}

geofs.aircraft.instance.parts.rudder.animations[0].value = "rudderDamp";
setInterval(function(){yawDamper();},10)
//complicated maths to resolve torque axes
  //𝐹𝑠=|𝐹⃗ |cos(𝜃𝑠,𝐹)
function splitAxes(force) {
  var angle = geofs.animation.values.heading360 * (Math.PI/180)
  if (geofs.animation.values.atilt <= 0) {
  var anglez = geofs.animation.values.atilt - 45
  }
  else {
    var anglez = Math.abs(Math.abs(geofs.animation.values.atilt + 45) - 360)
  }
  
  fx = force * (Math.sin(angle))
  fy = force * (Math.cos(angle))
  fz = force * Math.cos(anglez)
  return [fx, fy, fz];
}

//stall buffeting
function stallForces() {
  if (geofs.animation.values.aoa > 7) {
    geofs.aircraft.instance.rigidBody.applyTorqueImpulse([splitAxes(Math.random()*geofs.animation.values.aoa * 1000)[0],splitAxes(Math.random()*geofs.animation.values.aoa * 1000)[1],0])
  }
}

//ground effect
function groundEffect() {
  if (geofs.animation.values.haglFeet <= 100) {
    geofs.aircraft.instance.rigidBody.applyCentralImpulse([0,0,(-(geofs.animation.values.haglFeet) + 100) * geofs.animation.values.kias])
  }
}

//tiller restriction
geofs.animation.values.tiller = null;
function tiller() {
  if (geofs.animation.values.kias >= 50) {
    geofs.animation.values.tiller = geofs.animation.values.yaw / (geofs.animation.values.kias / 5)
  }
  else {
    geofs.animation.values.tiller = geofs.animation.values.yaw
  }
}

//spoilers/flaps shake
geofs.animation.values.spoilersShake = null;
geofs.animation.values.flapsShake = null;
function getShake() {
  if (geofs.animation.values.airbrakesPosition == 1) {
    geofs.animation.values.spoilersShake = 1 - (Math.random() / 20) * (geofs.animation.values.kias / 200)
  }
  else {
    geofs.animation.values.spoilersShake = geofs.animation.values.airbrakesPosition
  }
  if (geofs.animation.values.flapsPosition == 6) {
    geofs.animation.values.flapsShake = (Math.random() / 20) * (geofs.animation.values.kias / 100);
  }
  else {
    geofs.animation.values.flapsShake = 0;
  }
}
geofs.aircraft.instance.setup.parts[106].animations[1].value = "tiller"
geofs.aircraft.instance.setup.parts[60].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[61].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[62].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[63].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[64].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[65].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[66].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[67].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[68].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[69].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[70].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[71].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[72].animations[0].value = "spoilersShake"
geofs.aircraft.instance.setup.parts[73].animations[0].value = "spoilersShake"

//wingflex re-assignment
function resetLift2(){
geofs.animation.values.liftLeftWing = (-geofs.aircraft.instance.parts.wingleft.lift / 200000)+(geofs.animation.values.accZ)/20;
geofs.animation.values.liftRightWing = (-geofs.aircraft.instance.parts.wingright.lift / 200000)+(geofs.animation.values.accZ)/20;
};
geofs.aircraft.instance.setup.parts[3].animations[1].value = "liftLeftWing"
geofs.aircraft.instance.setup.parts[4].animations[1].value = "liftLeftWing"
geofs.aircraft.instance.setup.parts[5].animations[0].value = "liftLeftWing"
geofs.aircraft.instance.setup.parts[6].animations[0].value = "liftLeftWing"
geofs.aircraft.instance.setup.parts[7].animations[1].value = "liftLeftWing"
geofs.aircraft.instance.setup.parts[8].animations[1].value = "liftRightWing"
geofs.aircraft.instance.setup.parts[9].animations[0].value = "liftRightWing"
geofs.aircraft.instance.setup.parts[10].animations[0].value = "liftRightWing"
//check if flaps are changing position
geofs.animation.values.flapschange = 0
function getFlapChange(){
  if (geofs.animation.values.flapsPosition < geofs.animation.values.flapsTarget || geofs.animation.values.flapsPosition > geofs.animation.values.flapsTarget){
    console.log("flaps extend")
    geofs.animation.values.flapschange = 1
  }
  else{
    geofs.animation.values.flapschange = 0
  }
}

//assign new sounds
geofs.aircraft.instance.definition.sounds[8] = {};
geofs.aircraft.instance.definition.sounds[8].id = "flapssound"
  geofs.aircraft.instance.definition.sounds[8].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777flap.mp3"
geofs.aircraft.instance.definition.sounds[8].effects = {"start": {"value": "flapschange"}}
  //assign alarm sounds
  geofs.aircraft.instance.definition.sounds[9] = {};
geofs.aircraft.instance.definition.sounds[9].id = "landinggearwarn"
  geofs.aircraft.instance.definition.sounds[9].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlg.mp3"
geofs.aircraft.instance.definition.sounds[9].effects = {"start": {"value": "isGearWarn"}}

  geofs.aircraft.instance.definition.sounds[10] = {};
geofs.aircraft.instance.definition.sounds[10].id = "flapswarn"
  geofs.aircraft.instance.definition.sounds[10].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlf.mp3"
geofs.aircraft.instance.definition.sounds[10].effects = {"start": {"value": "isFlapsWarn"}}

  geofs.aircraft.instance.definition.sounds[11] = {};
geofs.aircraft.instance.definition.sounds[11].id = "terrainwarn"
  geofs.aircraft.instance.definition.sounds[11].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/tlt.mp3"
geofs.aircraft.instance.definition.sounds[11].effects = {"start": {"value": "isTerrainWarn"}}

  geofs.aircraft.instance.definition.sounds[12] = {};
geofs.aircraft.instance.definition.sounds[12].id = "pullwarn"
  geofs.aircraft.instance.definition.sounds[12].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/pullup.mp3"
geofs.aircraft.instance.definition.sounds[12].effects = {"start": {"value": "isPullupWarn"}}

  geofs.aircraft.instance.definition.sounds[13] = {};
geofs.aircraft.instance.definition.sounds[13].id = "bankangle"
  geofs.aircraft.instance.definition.sounds[13].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/bankangle.mp3"
geofs.aircraft.instance.definition.sounds[13].effects = {"start": {"value": "isBankWarn"}}

  geofs.aircraft.instance.definition.sounds[14] = {};
geofs.aircraft.instance.definition.sounds[14].id = "1000"
  geofs.aircraft.instance.definition.sounds[14].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/1000gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[14].effects = {"start": {"value": "gpws1000"}}

  geofs.aircraft.instance.definition.sounds[15] = {};
geofs.aircraft.instance.definition.sounds[15].id = "500"
  geofs.aircraft.instance.definition.sounds[15].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/500correct.mp3"
geofs.aircraft.instance.definition.sounds[15].effects = {"start": {"value": "gpws500"}}

  geofs.aircraft.instance.definition.sounds[16] = {};
geofs.aircraft.instance.definition.sounds[16].id = "400"
  geofs.aircraft.instance.definition.sounds[16].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/400gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[16].effects = {"start": {"value": "gpws400"}}

  geofs.aircraft.instance.definition.sounds[17] = {};
geofs.aircraft.instance.definition.sounds[17].id = "300"
  geofs.aircraft.instance.definition.sounds[17].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/300gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[17].effects = {"start": {"value": "gpws300"}}

  geofs.aircraft.instance.definition.sounds[18] = {};
geofs.aircraft.instance.definition.sounds[18].id = "200"
  geofs.aircraft.instance.definition.sounds[18].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/200gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[18].effects = {"start": {"value": "gpws200"}}

  geofs.aircraft.instance.definition.sounds[19] = {};
geofs.aircraft.instance.definition.sounds[19].id = "100"
  geofs.aircraft.instance.definition.sounds[19].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/100gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[19].effects = {"start": {"value": "gpws100"}}

  geofs.aircraft.instance.definition.sounds[20] = {};
geofs.aircraft.instance.definition.sounds[20].id = "50"
  geofs.aircraft.instance.definition.sounds[20].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/50gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[20].effects = {"start": {"value": "gpws50"}}

  geofs.aircraft.instance.definition.sounds[21] = {};
geofs.aircraft.instance.definition.sounds[21].id = "40"
  geofs.aircraft.instance.definition.sounds[21].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/40gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[21].effects = {"start": {"value": "gpws40"}}

  geofs.aircraft.instance.definition.sounds[22] = {};
geofs.aircraft.instance.definition.sounds[22].id = "30"
  geofs.aircraft.instance.definition.sounds[22].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/30gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[22].effects = {"start": {"value": "gpws30"}}

  geofs.aircraft.instance.definition.sounds[23] = {};
geofs.aircraft.instance.definition.sounds[23].id = "20"
  geofs.aircraft.instance.definition.sounds[23].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/20gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[23].effects = {"start": {"value": "gpws20"}}

  geofs.aircraft.instance.definition.sounds[24] = {};
geofs.aircraft.instance.definition.sounds[24].id = "10"
  geofs.aircraft.instance.definition.sounds[24].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/10gpws_merged.mp3"
geofs.aircraft.instance.definition.sounds[24].effects = {"start": {"value": "gpws10"}}

geofs.aircraft.instance.definition.sounds[0].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777enginelow.mp3"
geofs.aircraft.instance.definition.sounds[1].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777enginemid.mp3"
geofs.aircraft.instance.definition.sounds[2].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777enginehigh.mp3"
geofs.aircraft.instance.definition.sounds[3].file = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/777enginehigh.mp3"



audio.init(geofs.aircraft.instance.definition.sounds)
geofs.aircraft.instance.definition.sounds[0].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[0].effects.volume.ramp = [100, 500, 2000, 10000]
geofs.aircraft.instance.definition.sounds[1].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[2].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[3].effects.volume.ratio = 100
geofs.aircraft.instance.definition.sounds[4].effects.volume.ratio = 100

// get running average to dampen control inputs
let pitchInputs = [0, 0, 0, 0, 0, 0, 0];
let rollInputs = [0, 0, 0, 0, 0, 0, 0];
let yawInputs = [0, 0, 0, 0, 0, 0, 0];
geofs.animation.values.averagePitch = null;
geofs.animation.values.averageRoll = null;
geofs.animation.values.averageYaw = null;
geofs.animation.values.outerAveragePitch = null;
geofs.animation.values.outerAverageRoll = null;
geofs.animation.values.outerAverageYaw = null;
function pushInputs(){
  pitchInputs.push(geofs.animation.values.computedPitch);
  rollInputs.push(geofs.animation.values.roll);
  yawInputs.push(geofs.animation.values.computedYaw);
}

function computeOutputs(){
  if (geofs.aircraft.instance.setup.autopilot) {
    geofs.animation.values.outerAveragePitch = geofs.animation.values.pitch
geofs.animation.values.outerAverageRoll = geofs.animation.values.roll
geofs.animation.values.outerAverageYaw = geofs.animation.values.yaw
    return;
  }
  else {
var pitchcheck = movingAvg(pitchInputs, 6, 6);
var rollcheck = movingAvg(rollInputs, 6, 6);
 var yawcheck = movingAvg(yawInputs, 6, 6);
  geofs.animation.values.averagePitch = pitchcheck[pitchcheck.length - 3]
geofs.animation.values.averageRoll = rollcheck[rollcheck.length - 3];
geofs.animation.values.averageYaw = yawcheck[yawcheck.length - 3];
  geofs.animation.values.outerAveragePitch = clamp(geofs.animation.values.averagePitch / (geofs.animation.values.kias / 200), -1, 1);
geofs.animation.values.outerAverageRoll = clamp(geofs.animation.values.averageRoll / (geofs.animation.values.kias / 100), -1, 1);
geofs.animation.values.outerAverageYaw = clamp(geofs.animation.values.averageYaw / (geofs.animation.values.kias / 100), -1, 1);
  }
}

function movingAvg(array, countBefore, countAfter) {
  if (countAfter == undefined) countAfter = 0;
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
    result.push(avg);
  }
  return result;
}
geofs.aircraft.instance.parts.aileronleft.animations[0].value = "outerAverageRoll"
geofs.aircraft.instance.parts.aileronright.animations[0].value = "outerAverageRoll"
geofs.aircraft.instance.parts.flaperonleft.animations[0].value = "averageRoll"
geofs.aircraft.instance.parts.flaperonright.animations[0].value = "averageRoll"
geofs.aircraft.instance.parts.elevleft.animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.parts.elevright.animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.parts.rudder.animations[0].value = "averageYaw"

geofs.animation.values.computedPitch = 0
geofs.animation.values.computedYaw = 0
geofs.animation.values.computedRoll = 0
let lastPitchValue = 0
let gLimitedPitch =  0
let increment = 0
let deadZone = 0.01
let tiltToHold = 0
let pitchStage1 = 0
function computePitch(){
//implement tilt hold
  if (geofs.animation.values.pitch <= deadZone && geofs.animation.values.pitch >= -deadZone){
    
  pitchStage1 = -(tiltToHold - geofs.animation.values.atilt) / 10
    
}
  else{
    tiltToHold = geofs.animation.values.atilt
    pitchStage1 = geofs.animation.values.pitch
  }
  geofs.animation.values.computedPitch = clamp(pitchStage1, -1, 1)
}

function computeYaw(){
      if (geofs.animation.values.atilt >= -70 && geofs.animation.values.atilt <= 70){
  if (geofs.animation.values.gearPosition == 1){
    if (geofs.animation.values.aroll >= -75 && geofs.animation.values.aroll <= 75){
  geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
    if (geofs.animation.values.aroll <= -75 && geofs.animation.values.aroll >= -90){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
        if (geofs.animation.values.aroll <= -90 && geofs.animation.values.aroll >= -105){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
    if (geofs.animation.values.aroll <= 75 && geofs.animation.values.aroll >= 90){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
        if (geofs.animation.values.aroll <= 90 && geofs.animation.values.aroll >= 105){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
        if (geofs.animation.values.aroll <= -75 && geofs.animation.values.aroll >= 75){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1)
    }
  }
  else{
    if (geofs.animation.values.aroll >= -75 && geofs.animation.values.aroll <= 75){
  geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
    if (geofs.animation.values.aroll <= -75 && geofs.animation.values.aroll >= -90){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
        if (geofs.animation.values.aroll <= -90 && geofs.animation.values.aroll >= -105){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
    if (geofs.animation.values.aroll <= 75 && geofs.animation.values.aroll >= 90){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw - ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
        if (geofs.animation.values.aroll <= 90 && geofs.animation.values.aroll >= 105){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
        if (geofs.animation.values.aroll >= 75 && geofs.animation.values.aroll <= -75){
        geofs.animation.values.computedYaw = clamp(geofs.animation.values.yaw + ( geofs.aircraft.instance.htrAngularSpeed[0]*50), -1, 1) / 2
    }
  }
                }
  else{
    geofs.animation.values.computedYaw = geofs.animation.values.yaw
  }
}


//implement smooth gear tilting
let restingPoint = 16.152139372973117
geofs.animation.values.gearTilt = null;

function tiltGear(){
  if (geofs.animation.values.haglFeet <= 18){
    geofs.animation.values.gearTilt = clamp((restingPoint * geofs.animation.values.haglFeet)/15, 18.5, 20)
  }
}

geofs.aircraft.instance.parts.bogeyright.animations[0].value = "gearTilt"
geofs.aircraft.instance.parts.bogeyleft.animations[0].value = "gearTilt"
geofs.aircraft.instance.parts.bogeyright.animations[0].offset = -27
geofs.aircraft.instance.parts.bogeyleft.animations[0].offset = -27
 delete geofs.aircraft.instance.parts.bogeyright.animations[0].lt
delete geofs.aircraft.instance.parts.bogeyleft.animations[0].lt




//detect and execute GPWS callouts
let isApprConfig = false;
 geofs.animation.values.isFlapsWarn = 0;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isTerrainWarn = 0;
 geofs.animation.values.isPullupWarn = 0;
 geofs.animation.values.isBankWarn = 0;
 geofs.animation.values.gpws1000 = 0;
 geofs.animation.values.gpws500 = 0;
 geofs.animation.values.gpws400 = 0;
 geofs.animation.values.gpws300 = 0;
 geofs.animation.values.gpws200 = 0;
 geofs.animation.values.gpws100 = 0;
 geofs.animation.values.gpws50 = 0;
 geofs.animation.values.gpws40 = 0;
 geofs.animation.values.gpws30 = 0;
 geofs.animation.values.gpws20 = 0;
 geofs.animation.values.gpws10 = 0;

function getGearFlapsWarn() {
if (geofs.animation.values.groundContact == 1) {
  geofs.animation.values.isGearWarn = 0;
  geofs.animation.values.isFlapsWarn = 0;
  return;
}
	if (geofs.animation.values.haglFeet <= 500 && geofs.animation.values.gearPosition == 1 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isGearWarn = 1;
	} else {
		geofs.animation.values.isGearWarn = 0;
	}

	if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.flapsPosition == 0 && geofs.animation.values.climbrate < 0 && geofs.animation.values.isPullupWarn == 0) {
		geofs.animation.values.isFlapsWarn = 1;
	} else {
		geofs.animation.values.isFlapsWarn = 0;
	}
}

function testTerrainorAppr() {
	if (geofs.animation.values.gearPosition == 0) {
		if (geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -100 && geofs.animation.values.climbrate >= -5000 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.isFlapsWarn == 0 && isApprConfig == 0) {
			geofs.animation.values.isTerrainWarn = 1;
		} else {
			geofs.animation.values.isTerrainWarn = 0;
		}

		if (geofs.animation.values.haglFeet <= 5000 && geofs.animation.values.climbrate <= -2000 || geofs.animation.values.haglFeet <= 1000 && geofs.animation.values.climbrate <= -5000) {
			geofs.animation.values.isPullupWarn = 1;
		} else {
			geofs.animation.values.isPullupWarn = 0;
		}
	} else {
		geofs.animation.values.isTerrainWarn = 0;
    geofs.animation.values.isPullupWarn = 0;
		return;
	}
}


function testForApproach(){
  if (geofs.animation.values.isFlapsWarn == 0 && geofs.animation.values.isGearWarn == 0 && geofs.animation.values.climbrate <= -1){
    isApprConfig = true
  }
  else{
    isApprConfig = false
  }
}

function doRadioAltCall(){
  if (isApprConfig){
  if (geofs.animation.values.haglFeet <= 1000 + restingPoint && geofs.animation.values.haglFeet >= 900 + restingPoint){
    geofs.animation.values.gpws1000 = 1;
  }
  else{
    geofs.animation.values.gpws1000 = 0;
  }
   if (geofs.animation.values.haglFeet <= 500 + restingPoint && geofs.animation.values.haglFeet >= 400 + restingPoint){
    geofs.animation.values.gpws500 = 1;
  }
  else{
    geofs.animation.values.gpws500 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 400 + restingPoint && geofs.animation.values.haglFeet >= 300 + restingPoint){
    geofs.animation.values.gpws400 = 1;
  }
  else{
    geofs.animation.values.gpws400 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 300 + restingPoint && geofs.animation.values.haglFeet >= 200 + restingPoint){
    geofs.animation.values.gpws300 = 1;
  }
  else{
    geofs.animation.values.gpws300 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 200 + restingPoint && geofs.animation.values.haglFeet >= 100 + restingPoint){
    geofs.animation.values.gpws200 = 1;
  }
  else{
    geofs.animation.values.gpws200 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 100 + restingPoint && geofs.animation.values.haglFeet >= 50 + restingPoint){
    geofs.animation.values.gpws100 = 1;
  }
  else{
    geofs.animation.values.gpws100 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 50 + restingPoint && geofs.animation.values.haglFeet >= 40 + restingPoint){
    geofs.animation.values.gpws50 = 1;
  }
  else{
    geofs.animation.values.gpws50 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 40 + restingPoint && geofs.animation.values.haglFeet >= 30 + restingPoint){
    geofs.animation.values.gpws40 = 1;
  }
  else{
    geofs.animation.values.gpws40 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 30 + restingPoint && geofs.animation.values.haglFeet >= 20 + restingPoint){
    geofs.animation.values.gpws30 = 1;
  }
  else{
    geofs.animation.values.gpws30 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 20 + restingPoint && geofs.animation.values.haglFeet >= 10 + restingPoint){
    geofs.animation.values.gpws20 = 1;
  }
  else{
    geofs.animation.values.gpws20 = 0;
  } 
   if (geofs.animation.values.haglFeet <= 10 + restingPoint && geofs.animation.values.haglFeet >= 5 + restingPoint){
    geofs.animation.values.gpws10 = 1;
  }
  else{
    geofs.animation.values.gpws10 = 0;
  } 
}
  else {
    geofs.animation.values.gpws1000 = 0;
    geofs.animation.values.gpws500 = 0;
    geofs.animation.values.gpws400 = 0;
    geofs.animation.values.gpws300 = 0;
    geofs.animation.values.gpws200 = 0;
    geofs.animation.values.gpws100 = 0;
    geofs.animation.values.gpws50 = 0;
    geofs.animation.values.gpws40 = 0;
    geofs.animation.values.gpws30 = 0;
    geofs.animation.values.gpws20 = 0;
    geofs.animation.values.gpws10 = 0;
  }
}

  
setInterval(function(){
  groundEffect()
  getShake()
  computeYaw()
  tiltGear();
  computePitch();
  pushInputs();
  computeOutputs();
  resetLift2();
  getFlapChange();
  getGearFlapsWarn()
  testTerrainorAppr()
  testForApproach()
  doRadioAltCall()
  tiller()
  stallForces()
}, 20)
geofs = geofs || {};

geofs["atmosphereCommon.glsl"] = "" + "precision highp float;\n\nuniform float planetRadius;\n#ifdef VOLUMETRIC_CLOUDS\nconst float windSpeedRatio = 0.0002;\nuniform float cloudCover;\nuniform float cloudBase;\nuniform float cloudTop;\nuniform vec3 windVector;\n#ifdef REALTIME_CLOUDS\nuniform sampler2D coverageTexture;\n#endif\n#endif\n\n/*\n* Configuration\n*/\n#ifdef QUALITY_7\n\n#define PRIMARY_STEPS 16\n#define LIGHT_STEPS 4\n\n// This is only accessible from advanced settings\n#define CLOUDS_MAX_LOD 3\n#define MAXIMUM_CLOUDS_STEPS 100\n#define DISTANCE_QUALITY_RATIO 0.00003\n#define LIT_CLOUD\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_6\n\n#define PRIMARY_STEPS 16\n#define LIGHT_STEPS 4\n\n#define CLOUDS_MAX_LOD 3\n#define MAXIMUM_CLOUDS_STEPS 100\n#define DISTANCE_QUALITY_RATIO 0.00004\n#define LIT_CLOUD\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_5\n\n//#define PRIMARY_STEPS 12\n//#define LIGHT_STEPS 4\n#define PRIMARY_STEPS 9\n#define LIGHT_STEPS 3\n\n#define CLOUDS_MAX_LOD 3\n#define MAXIMUM_CLOUDS_STEPS 70\n#define DISTANCE_QUALITY_RATIO 0.00005\n#define LIT_CLOUD\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_4\n\n#define PRIMARY_STEPS 9\n#define LIGHT_STEPS 3\n\n#define CLOUDS_MAX_LOD 3\n#define MAXIMUM_CLOUDS_STEPS 50\n#define DISTANCE_QUALITY_RATIO 0.00007\n#define LIT_CLOUD\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_3\n\n#define PRIMARY_STEPS 6\n#define LIGHT_STEPS 2\n\n#define CLOUDS_MAX_LOD 2\n#define MAXIMUM_CLOUDS_STEPS 40\n#define DISTANCE_QUALITY_RATIO 0.0001\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_2\n\n#define PRIMARY_STEPS 4\n#define LIGHT_STEPS 1\n\n#define CLOUDS_MAX_LOD 2\n#define MAXIMUM_CLOUDS_STEPS 30\n#define DISTANCE_QUALITY_RATIO 0.0002\n#define CLOUD_SHADOWS\n\n#elif defined QUALITY_1\n\n#define PRIMARY_STEPS 3\n#define LIGHT_STEPS 1\n\n#define CLOUDS_MAX_LOD 2\n#define MAXIMUM_CLOUDS_STEPS 20\n#define DISTANCE_QUALITY_RATIO 0.0004\n\n#elif defined QUALITY_0\n\n#define PRIMARY_STEPS 0\n#define LIGHT_STEPS 0\n\n#define CLOUDS_MAX_LOD 0\n#define MAXIMUM_CLOUDS_STEPS 0\n#define DISTANCE_QUALITY_RATIO 0\n\n#else //DEFAULT\n\n#define PRIMARY_STEPS 9\n#define LIGHT_STEPS 2\n\n#define CLOUDS_MAX_LOD 2\n#define MAXIMUM_CLOUDS_STEPS 40\n#define DISTANCE_QUALITY_RATIO 0.0002\n#define CLOUD_SHADOWS\n\n#endif\n\n#define CLOUDS_DENS_MARCH_STEP 100.0\n#define CLOUDS_MAX_VIEWING_DISTANCE 250000.0\n\n/*\n* Utilities\n*/\n\n\n\n\n\nvec2 raySphereIntersect(vec3 r0, vec3 rd, float sr) {\nfloat a = dot(rd, rd);\nfloat b = 2.0 * dot(rd, r0);\nfloat c = dot(r0, r0) - (sr * sr);\nfloat d = (b * b) - 4.0 * a * c;\n\n// stop early if there is no intersect\nif (d < 0.0) return vec2(-1.0, -1.0);\n\n// calculate the ray length\nfloat squaredD = sqrt(d);\nreturn vec2(\n(-b - squaredD) / (2.0 * a),\n(-b + squaredD) / (2.0 * a)\n);\n}\n\n/*\n* Atmosphere scattering\n*/\n// Atmosphere by Dimas Leenman, Shared under the MIT license\n//https://github.com/Dimev/Realistic-Atmosphere-Godot-and-UE4/blob/master/godot/shader/atmosphere.shader\nvec3 light_intensity = vec3(100.0);//vec3(100.0); // how bright the light is, affects the brightness of the atmosphere\n//float planetRadius = 6361e3; // the radius of the planet\n//float atmo_radius = 6471e3; // the radius of the atmosphere\nfloat atmo_radius = planetRadius + 111e3;\nfloat realPlanetRadius = planetRadius + 10000.0;\nfloat atmo_radius_squared = atmo_radius * atmo_radius; // the radius of the atmosphere\nvec3 beta_ray = vec3(5.5e-6, 13.0e-6, 22.4e-6);//vec3(5.5e-6, 13.0e-6, 22.4e-6); // the amount rayleigh scattering scatters the colors (for earth: causes the blue atmosphere)\nvec3 beta_mie = vec3(21e-6); // vec3(21e-6);// the amount mie scattering scatters colors\nvec3 beta_ambient = vec3(0.0); // the amount of scattering that always occurs, can help make the back side of the atmosphere a bit brighter\nfloat g = 0.9; // the direction mie scatters the light in (like a cone). closer to -1 means more towards a single direction\nfloat height_ray = 10e3; // how high do you have to go before there is no rayleigh scattering?\nfloat height_mie = 3.2e3; // the same, but for mie\nfloat density_multiplier = 1.0; // how much extra the atmosphere blocks light\n\n#ifdef ADVANCED_ATMOSPHERE\nvec4 calculate_scattering(\nvec3 start, \t\t\t// the start of the ray (the camera position)\nvec3 dir, \t\t\t\t// the direction of the ray (the camera vector)\nfloat maxDistance, \t\t// the maximum distance the ray can travel (because something is in the way, like an object)\nvec3 light_dir\n) {\n\n// calculate the start and end position of the ray, as a distance along the ray\n// we do this with a ray sphere intersect\nfloat a = dot(dir, dir);\nfloat b = 2.0 * dot(dir, start);\nfloat c = dot(start, start) - atmo_radius_squared;\nfloat d = (b * b) - 4.0 * a * c;\n\n// stop early if there is no intersect\nif (d < 0.0) return vec4(0.0);\n\n// calculate the ray length\nfloat squaredD = sqrt(d);\nvec2 ray_length = vec2(\nmax((-b - squaredD) / (2.0 * a), 0.0),\nmin((-b + squaredD) / (2.0 * a), maxDistance)\n);\n\n// if the ray did not hit the atmosphere, return a black color\nif (ray_length.x > ray_length.y) return vec4(0.0);\n\n// prevent the mie glow from appearing if there's an object in front of the camera\nbool allow_mie = maxDistance > ray_length.y;\n// make sure the ray is no longer than allowed\n//ray_length.y = min(ray_length.y, maxDistance);\n//ray_length.x = max(ray_length.x, 0.0);\n\n// get the step size of the ray\nfloat step_size_i = (ray_length.y - ray_length.x) / float(PRIMARY_STEPS);\n\n// next, set how far we are along the ray, so we can calculate the position of the sample\n// if the camera is outside the atmosphere, the ray should start at the edge of the atmosphere\n// if it's inside, it should start at the position of the camera\n// the min statement makes sure of that\nfloat ray_pos_i = ray_length.x;\n\n// these are the values we use to gather all the scattered light\nvec3 total_ray = vec3(0.0); // for rayleigh\nvec3 total_mie = vec3(0.0); // for mie\n\n// initialize the optical depth. This is used to calculate how much air was in the ray\nvec2 opt_i = vec2(0.0);\n\n// also init the scale height, avoids some vec2's later on\nvec2 scale_height = vec2(height_ray, height_mie);\n\n// Calculate the Rayleigh and Mie phases.\n// This is the color that will be scattered for this ray\n// mu, mumu and gg are used quite a lot in the calculation, so to speed it up, precalculate them\nfloat mu = dot(dir, light_dir);\nfloat mumu = mu * mu;\nfloat gg = g * g;\nfloat phase_ray = 3.0 / (50.2654824574 ) * (1.0 + mumu);\n//float phase_mie = allow_mie ? 3.0 / (25.1327412287 ) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg)) : 0.0;\n// allow some mie glow in front of horizon\n// this can be wierd looking through some mountains\nfloat phase_mie = (allow_mie ? 3.0 : 0.5 ) / (25.1327412287 ) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));\n\n// now we need to sample the 'primary' ray. this ray gathers the light that gets scattered onto it\nfor (int i = 0; i < PRIMARY_STEPS; ++i) {\n\n// calculate where we are along this ray\nvec3 pos_i = start + dir * (ray_pos_i + step_size_i);\n\n// and how high we are above the surface\nfloat height_i = length(pos_i) - planetRadius;\n\n// now calculate the density of the particles (both for rayleigh and mie)\nvec2 density = exp(-height_i / scale_height) * step_size_i;\n\n// Add these densities to the optical depth, so that we know how many particles are on this ray.\nopt_i += density;\n\n// Calculate the step size of the light ray.\n// again with a ray sphere intersect\n// a, b, c and d are already defined\na = dot(light_dir, light_dir);\nb = 2.0 * dot(light_dir, pos_i);\nc = dot(pos_i, pos_i) - atmo_radius_squared;\nd = (b * b) - 4.0 * a * c;\n\nif (d <= 0.0) d = 1.0; // not supposed to be required but this avoids the black singularity line at dusk and dawn\n\n// no early stopping, this one should always be inside the atmosphere\n// calculate the ray length\nfloat step_size_l = (-b + sqrt(d)) / (2.0 * a * float(LIGHT_STEPS));\n\n// and the position along this ray\n// this time we are sure the ray is in the atmosphere, so set it to 0\nfloat ray_pos_l = 0.0;\n\n// and the optical depth of this ray\nvec2 opt_l = vec2(0.0);\n\n// now sample the light ray\n// this is similar to what we did before\nfor (int l = 0; l < LIGHT_STEPS; ++l) {\n\n// calculate where we are along this ray\nvec3 pos_l = pos_i + light_dir * (ray_pos_l + step_size_l * 0.5);\n\n// the heigth of the position\nfloat height_l = length(pos_l) - planetRadius;\n\n// calculate the particle density, and add it\nopt_l += exp(-height_l / scale_height) * step_size_l;\n\n// and increment where we are along the light ray.\nray_pos_l += step_size_l;\n}\n\n// Now we need to calculate the attenuation\n// this is essentially how much light reaches the current sample point due to scattering\nvec3 attn = exp(-((beta_mie * (opt_i.y + opt_l.y)) + (beta_ray * (opt_i.x + opt_l.x))));\n\n// accumulate the scattered light (how much will be scattered towards the camera)\ntotal_ray += density.x * attn;\ntotal_mie += density.y * attn;\n\n// and increment the position on this ray\nray_pos_i += step_size_i;\n}\n\n// calculate how much light can pass through the atmosphere\nfloat opacity = length(exp(-((beta_mie * opt_i.y) + (beta_ray * opt_i.x)) * density_multiplier));\n\nreturn vec4((\nphase_ray * beta_ray * total_ray // rayleigh color\n+ phase_mie * beta_mie * total_mie // mie\n+ opt_i.x * beta_ambient // and ambient\n) * light_intensity, 1.0 - opacity);\n}\n#endif\n\n/*\n* Clouds rendering\n*/\n#ifdef VOLUMETRIC_CLOUDS\nfloat cloudBase_radius = (realPlanetRadius + cloudBase);\nfloat cloudBase_radius2 = (realPlanetRadius + cloudBase) + 5.0;\n\nfloat cloudThickness = (cloudTop - cloudBase);\nfloat cloudTop_radius = (cloudBase_radius + cloudThickness);\nfloat cloudTop_radius2 = (cloudBase_radius + cloudThickness) + 5.0;\n\nfloat layerPosition = 0.3; // set the layer base to 10% of the cloud height\nfloat baseThickness = cloudThickness * layerPosition;\n\nfloat layer = cloudBase + baseThickness;\n\n\nfloat twoPi = 6.2831853071795864769252;\n\nfloat hash(float p)\n{\n    p = fract(p * .1031);\n    p *= p + 33.33;\n    p *= p + p;\n    return fract(p);\n}\n\nfloat noise(in vec3 x) {\nvec3 p = floor(x);\nvec3 f = fract(x);\nf = f*f*(3.0 - 2.0*f);\n\nfloat n = p.x + p.y*157.0 + 113.0*p.z;\nreturn mix(mix(mix( hash(n+ 0.0), hash(n+ 1.0),f.x),\nmix( hash(n+157.0), hash(n+158.0),f.x),f.y),\nmix(mix( hash(n+113.0), hash(n+114.0),f.x),\nmix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);\n}\n\n//no real reason to these values, just arbitrary numbers to add texture to clouds\nfloat noise2(in vec3 x) {\nvec3 p = floor(x);\nvec3 f = fract(x);\nf = f*f*(3.0 - 2.0*f);\n\nfloat n = p.x + p.y*157.0 + 113.0*p.z;\nreturn mix(mix(mix( hash(n+ 0.0), hash(n+ 1.0),f.x),\nmix( hash(n+147.0), hash(n+114.0),f.x),f.y),\nmix(mix( hash(n+123.0), hash(n+133.0),f.x),\nmix( hash(n+252.0), hash(n+212.0),f.x),f.y),f.z);\n}\n\nfloat fbm(\n\tvec3 pos,\n\tfloat lacunarity\n){\n\tvec3 p = pos;\n\tfloat\n\tt  = 0.51749673 * noise(p); p *= lacunarity;\n\tt += 0.25584929 * noise(p); p *= lacunarity;\n\tt += 0.12527603 * noise(p); p *= lacunarity;\n\tt += 0.06255931 * noise(p);\n\t\n\treturn t;\n}\n\n\nint lastFlooredPosition;\nfloat lastLiveCoverageValue = 0.0;\n\nfloat cloudDensity(vec3 p, vec3 offset, int lod) {\nfloat finalCoverage = cloudCover / 1.25;\n#ifdef REALTIME_CLOUDS\n\n//            //int flooredPosition = int(floor(dot(p, vec3(1.0)) / 10000.0));\n//            float factor = 50000.0;\n//            int flooredPosition = int(floor(p.x / factor)) + int(floor(p.y / factor)) + int(floor(p.z / factor));\n//            if (flooredPosition != lastFlooredPosition) {\n//                lastFlooredPosition = flooredPosition;\nvec3 sphericalNormal = normalize(p);\nvec2 positionSurfaceC = czm_ellipsoidWgs84TextureCoordinates(sphericalNormal);\nfloat sampledValue = texture2D(coverageTexture, positionSurfaceC).r;\nlastLiveCoverageValue = clamp((sampledValue - 0.3) * 10.0, 0.8, 1.0);\n//            }\n\n//float colpos = float(lastLiveCoverageValue);\n//loudBright = vec3(colpos, 0.0, 0.0);\n//cloudBright = vec3(noise(vec3(colpos)), noise(vec3(colpos * 0.1)), noise(vec3(colpos * 0.01)));\n\nfinalCoverage *= lastLiveCoverageValue;\n#endif\n\nif (finalCoverage <= 0.1) return 0.0;\n\nfloat height = length(p) - realPlanetRadius;\nfloat heightRatio;\nfloat positionResolution = 0.002;\np = p * positionResolution + offset;\n\nfloat shape = clamp(finalCoverage, 0.0, 10.0) + clamp(finalCoverage, 0.0, 10.0) * noise(p * 0.3);\n\nif (height > layer) {\nheightRatio = (height - layer) / (cloudThickness * (1.0 - layerPosition));\n}\nelse {\nheightRatio = (layer - height) / (cloudThickness * layerPosition);\n}\n\n//heightRatio *= noise(p * 0.1);\n\n// brownian noise\nfloat bn = fbm(p, 3.0);\nbn = mix(-1.5, bn, shape * shape) + 0.1;\n  \nif (height > 10000.0 && height < 10100.0) {\n  float dens = (bn / clamp(finalCoverage, 0.0, 10.0)) - (clamp(heightRatio,0.0, 1.0) * 0.01 * clamp(finalCoverage, 0.0, 10.0));\n  return sin(clamp((dens + bn), 0.0, 0.15) / finalCoverage);\n}\n\nfloat dens = (bn / finalCoverage) - (heightRatio * 4.2 * finalCoverage); // steepness of cloud border\n\n  \nreturn clamp(0.5 * (dens + bn), 0.0, 1.0);\n}\n#endif\n";

geofs['atmosphereOnlyFS.glsl'] = "" + 'precision highp float;\n\nuniform sampler2D colorTexture;\nuniform sampler2D depthTexture;\n#ifdef VOLUMETRIC_CLOUDS\nuniform sampler2D volumetricCloudsTexture;\n#endif\nuniform float backgroundFogDensity;\nuniform vec4 backgroundFogColor;\nuniform float volumetricFogDensity;\nuniform float volumetricFogBottom;\nuniform float volumetricFogTop;\nvarying vec2 v_textureCoordinates;\n\n//const float sunAngularDiameterCos = 0.99995;\n\nvoid main() {\n\nvec4 color = texture2D(colorTexture, v_textureCoordinates);\nvec4 rawDepthColor = texture2D(depthTexture, v_textureCoordinates);\n\n// lousy mobile GPU detection\n//#if !defined(GL_EXT_frag_depth)\nfloat depth = rawDepthColor.r;// depth packing algo appears to be buggy on mobile so only use the most significant element for now\n//#else\n//    float depth = czm_unpackDepth(rawDepthColor);\n//#endif\n\nvec4 positionEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);\nvec4 worldCoordinate = czm_inverseView * positionEC;\nvec3 vWorldPosition = worldCoordinate.xyz / worldCoordinate.w;\n\nvec3 posToEye = vWorldPosition - czm_viewerPositionWC;\nvec3 direction = normalize(posToEye);\nvec3 lightDirection = normalize(czm_sunPositionWC);\nfloat distance = length(posToEye);\n\nfloat elevation;\n//float sundisk = 0.0;\n\n#ifdef RETRO\n\n// preserve retro sun\nif (depth >= 0.9) {\n\ngl_FragColor = color;\nreturn;\n}\n#endif\n\nif (depth >= 1.0) {\n\n// out of earth surface\n/*\nfloat cosTheta = dot(direction, normalize(czm_sunPositionWC));\nsundisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.02, cosTheta) * 500000.0;\ncolor += vec4(clamp(vec3(sundisk) * czm_lightColor, 0.0, 1.0), sundisk);\n*/\nelevation = length(czm_viewerPositionWC) - (realPlanetRadius);\n\n//distance = max(distance, 10000000.0); // max out the distance when looking at the sky to avoid clamp/arc artefact\n\n// try to simulate bilboard clouds depth mask based on color intensity\ndistance = 10000000.0 * (1.0 - min(0.5, length(color.rgb)));\n\n//color = clamp(color - vec4(czm_lightColor.z), 0.0, 1.0); // darken night sky proportionaly to sun intensity\n}\nelse {\nelevation = length(vWorldPosition) - (realPlanetRadius);\n}\n\n// Volumetric Fog\nfloat fragFogDensity;\nfragFogDensity = clamp((volumetricFogTop - elevation) / (volumetricFogTop - volumetricFogBottom), 0.0, 1.0) * volumetricFogDensity * depth; // volumetric\ncolor = mix(color, vec4(czm_lightColor, 1.0), clamp(fragFogDensity, 0.0, 1.0));\n\n#if defined(VOLUMETRIC_CLOUDS)\n\n\n\n#if defined(CLOUD_SHADOWS)\nfloat dens;\n  float dens2;\n// if this is ground and sun is up and ground is below cloud base\nif (depth < 1.0 && czm_lightColor.z > 0.15 && length(vWorldPosition) < cloudBase_radius + baseThickness) {\nvec3 wind = windVector * czm_frameNumber * windSpeedRatio;\nfloat mask = 1.0;\nvec2 toClouds = raySphereIntersect(vWorldPosition, -lightDirection, cloudBase_radius + baseThickness);\nvec3 position = vWorldPosition + (-lightDirection * toClouds.x);\n\n dens = cloudDensity(position, wind, 1);\n  dens2 = cloudDensity(czm_viewerPositionWC, wind, 1);\nmask = clamp(1.0 - dens, 0.4, 1.0);\ncolor *= mask;\n}\n\n// this whole section is not needed\n  /*\nfloat depthMaskDistance = 0.5 / clamp(dens2 * 2.25, 1.0, 1000.0);\nif (length(czm_viewerPositionWC) < cloudBase_radius) {\ndepthMaskDistance = 0.9 / clamp(dens2 * 2.2, 1.0, 1000.0); // try to include distant trees and object in the mask\n\n}\n  */\n#endif\n#endif\n\n#ifdef ADVANCED_ATMOSPHERE\n\n// atmosphere scattering\nvec4 atmosphereColor = calculate_scattering(\nczm_viewerPositionWC,\ndirection,\ndistance,\nlightDirection\n);\n/*\nif (color.r < 0.5 && color.g > 0.5 && color.b < 0.5) {\ncolor = (atmosphereColor * (1.0 - color.g)) + color;\n}\nelse {\n*/\n\ncolor = atmosphereColor + color * (1.0 - atmosphereColor.a);\n\n// tone mapping\nfloat exposure = 1.0;\ncolor = vec4(1.0 - exp(-exposure * color));\nfloat gamma = 0.8;\ncolor = pow(color, vec4(1.0 / gamma));\n\n#endif\n\n#ifdef VOLUMETRIC_CLOUDS\n// mix in scene+atmosphere and clouds\nvec4 clouds = texture2D(volumetricCloudsTexture, v_textureCoordinates);\n//color = mix(color, clouds, clouds.a * clouds.a * clamp((depth - depthMaskDistance) * 100.0, 0.0, 1.0));\n  color = mix(color, clouds, clouds.a);\n#endif\n\n// background fog (used for precipitation)\nfloat backFogDensity;\nbackFogDensity += backgroundFogDensity * depth;\ncolor = mix(color, vec4(backgroundFogColor.rgb, 1.0), clamp(backFogDensity, 0.0, 1.0));\n\ngl_FragColor = color;\n}\n';

geofs['volumetricCloudsFS.glsl'] = "" + "precision highp float;\n\nuniform sampler2D colorTexture;\nuniform sampler2D depthTexture;\nuniform sampler2D noiseTexture;\nvarying vec2 v_textureCoordinates;\n\n/*\n* Volumetric clouds\n* inspired by works from\n* https://www.iquilezles.org/www/articles/derivative/derivative.htm\n* https://www.shadertoy.com/view/XtBXDw\n* https://blog.uhawkvr.com/rendering/rendering-volumetric-clouds-using-signed-distance-fields/\n* https://shaderbits.com/blog/creating-volumetric-ray-marcher\n*/\nvec3 cloudDark = vec3(0.4,0.6,0.8); //vec3(0.25,0.3,0.35)\nvec3 cloudBright = vec3(0.9, 0.95, 1.0); //vec3(1.0,0.95,0.8)\nfloat distanceQualityR = 0.00005; // LOD/quality ratio\nfloat minDistance = 10.0; // avoid cloud in cockpit\n/*\nvec4 white = vec4(1.0, 1.0, 1.0, 1.0);\nvec4 red = vec4(1.0, 0.0, 0.0, 1.0);\nvec4 green = vec4(0.0, 1.0, 0.0, 1.0);\nvec4 blue = vec4(0.0, 0.0, 1.0, 1.0);\n*/\nvec4 calculate_clouds(\nvec3 start,\nvec3 dir,\nfloat maxDistance,\nvec3 light_dir,\nfloat depth,\nvec3 wind,\nvec4 atmosphereAtDistance\n) {\n\nvec4 cloud = vec4(0.0, 0.0, 0.0, 1.0);\n\nvec2 toTop = raySphereIntersect(start, dir, cloudTop_radius);\nvec2 toCloudBase = raySphereIntersect(start, dir, cloudBase_radius);\n\nfloat startHeight = length(start) - realPlanetRadius;\n\n// limit viewing distance based on height from cloud top\nfloat absoluteMaxDistance = CLOUDS_MAX_VIEWING_DISTANCE;\n\nif (startHeight > layer) {\nabsoluteMaxDistance = clamp(5000.0 + pow(startHeight - layer, 1.5), 5000.0, CLOUDS_MAX_VIEWING_DISTANCE);\n}\nelse {\nabsoluteMaxDistance = clamp(5000.0 + pow(layer - startHeight, 1.9), 5000.0, CLOUDS_MAX_VIEWING_DISTANCE);\n//absoluteMaxDistance = CLOUDS_MAX_VIEWING_DISTANCE;\n}\n\nfloat tmin = minDistance;\nfloat tmax = maxDistance;\n\nif (startHeight > cloudTop) {\n// above clouds\n//cloudBright = vec3(1.0, 0.0, 0.0);\n//if (toTop.x < 0.0) return vec4(0.0); // no intersection with cloud layer\n// there is a result error in depth/distance calculation at high POV\n// which makes tmax to be lower than expected\n//tmin = toTop.x;\n\n\n}\nelse if (startHeight < cloudBase) {\n// below clouds\n//cloudBright = vec3(0.0, 0.0, 1.0);\ntmin = toCloudBase.y;\ntmax = min(toTop.y, maxDistance);\n\n//absoluteMaxDistance = CLOUDS_MAX_VIEWING_DISTANCE;\n}\nelse {\n// inside clouds\n//cloudBright = vec3(0.0, 1.0, 0.0);\nif (toCloudBase.x > 0.0) {\ntmax = min(toCloudBase.x, maxDistance);\n}\nelse {\ntmax = min(toTop.y, maxDistance);\n}\n}\n\ntmin = 0.0;\ntmax = min(tmax, absoluteMaxDistance);\n\nif (tmax < tmin) return vec4(0.0); // object obstruction\n\nfloat rayLength = tmax - tmin;\n\nfloat minMarchStep = rayLength / float(MAXIMUM_CLOUDS_STEPS);\nminMarchStep = max(minMarchStep, CLOUDS_DENS_MARCH_STEP);\n\nfloat ditherAmount = texture2D(noiseTexture, mod(gl_FragCoord.xy / 512.0, 1.0)).r;\nfloat ditherDistance = ditherAmount * minMarchStep;\n\nfloat distance = tmin + ditherDistance;\nfloat dens = 0.0;\nfloat marchStep;\n\nfor (int i = 0; i < MAXIMUM_CLOUDS_STEPS; i++) {\nvec3 position = start + dir * distance;\nint qualityRatio = int(distance * distanceQualityR);\nint lod = CLOUDS_MAX_LOD - qualityRatio;\n\ndens = cloudDensity(position, wind, lod);\n/*\nif (lod <= 1) {\ncloudBright = vec3(1.0, 0.0, 0.0);\n}\nif (lod == 2) {\ncloudBright = vec3(0.0, 1.0, 0.0);\n}\nif (lod == 3) {\ncloudBright = vec3(0.0, 0.0, 1.0);\n}\nif (lod == 4) {\ncloudBright = vec3(0.0, 0.5, 1.0);\n}\n*/\n\nmarchStep = minMarchStep;\n\nif(dens > 0.0) {\n\nmarchStep = CLOUDS_DENS_MARCH_STEP;\n\n#ifdef LIT_CLOUD\n// lit\nfloat dist = 100.0;\nfloat lightColor = clamp((dens - (cloudDensity(position + dist * light_dir, wind, lod))) / dist, 0.0, 1.0) * 250.0 + 0.7;\nvec4 densColor = vec4(mix(cloudDark, cloudBright, 0.1), dens);\ndensColor.xyz *= lightColor;\n#else\n/*\n// An attempt at continuous surface normal integration\nfloat lighting = 0.8 - clamp((dens - lastDensity) * 10.0, 0.0, 1.0) * dot(dir, light_dir);\n//vec4 densColor = vec4(lighting, 0.0, 0.0, 1.0);\nvec4 densColor = vec4(mix(cloudDark, cloudBright, lighting), dens);\nlastDensity = dens;\n*/\n\n// unlit\nvec4 densColor = vec4(mix(cloudDark + czm_lightColor, cloudBright, dens), dens);\n#endif\n\n  //self shadowing\n float shadowMp;\nfloat SHADOW_STEP_SIZE = 20.0;\nconst int SHADOW_STEPS = 2;\nfloat shadowDist = 150.0; // offset so clouds don't detect themselves\n  for (int S = 0; S < SHADOW_STEPS; ++S) {\n    vec3 sp = position + shadowDist * light_dir;\n    if (cloudDensity(sp, wind, lod) > 0.0) {\n      shadowMp = 1.0;\n      break;\n    }\n    else {\n      shadowMp = 0.1;\n    }\n    shadowDist += SHADOW_STEP_SIZE;\n  }\n  float opacityMp;\n  if (position.z - realPlanetRadius > 1000.0) {\n    opacityMp = 0.1;\n  }\n  else {\n    opacityMp = 1.0;\n  }\ndensColor.rgb *= densColor.a;\ncloud.rgb += (densColor.rgb * cloud.a) / shadowMp;\ncloud.a *= 1.05 - densColor.a;\n\n//rough AO approximation\nfloat ao = 1.0 - float(i) / (float(distance) - 1.0);\ncloud.rgb *= ao * 0.99;\ncloud.a *= ao;\ncloud.rgb *= opacityMp;\ncloud.a *= opacityMp;\n\n/*\n//Phys based integration\n//float dist = 100.0;\nfloat deltaNorm = clamp((dens - (cloudDensity(position + dist * light_dir, wind, lod))) / dist, 0.0, 1.0) * 1000.0;\nlightColor = mix(cloudDark, cloudBright, deltaNorm);\n\ndens *= 0.01;\nvec3 light = czm_lightColor * lightColor * 1.0;\ncloud.a *= exp(-dens * marchStep);\ndensColor = dens * light * cloud.a * marchStep;\ndensColor = mix(densColor, atmosphereAtDistance.rgb, distance / 250000.0);\ncloud.rgb += densColor;\n*/\n// stop marching when fully opaque\nif (cloud.a < 0.1) {\ncloud.a = 0.0;\nbreak;\n}\n}\n\ndistance += marchStep;\n\n  if (distance > tmax) {\n    break;\n  }\n}\n\ncloud.a = (1.0 - cloud.a);\nreturn cloud;\n}\n\nvoid main() {\n\nvec4 color = vec4(0.0);\n\nif (cloudCover < 0.1) {\ngl_FragColor = color;\nreturn;\n}\n\n//vec4 rawDepthColor = texture2D(depthTexture, v_textureCoordinates);\nvec4 rawDepthColor = texture2D(depthTexture, v_textureCoordinates);\n\n// lousy mobile GPU detection\n\n#if !defined(GL_EXT_frag_depth)\nfloat depth = rawDepthColor.r; // depth packing algo appears to be buggy on mobile so only use the most significant element for now\n#else\nfloat depth = czm_unpackDepth(rawDepthColor);\n#endif\n/* not needed, using integrated depth tex\n// czm_globeDepthTexture is 0 above horizon\nif (depth == 0.0) {\ndepth = 1.0;\n}\n*/\n\n#ifdef VOLUMETRIC_CLOUDS\n\nvec4 positionEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);\nvec4 worldCoordinate = czm_inverseView * positionEC;\nvec3 vWorldPosition = worldCoordinate.xyz / worldCoordinate.w;\n\nvec3 posToEye = vWorldPosition - czm_viewerPositionWC;\nvec3 direction = normalize(posToEye);\nvec3 lightDirection = normalize(czm_sunPositionWC);\nfloat distance = length(posToEye);\n/*\n// fix rounding errors in distance calculation above horizon\nif (depth == 1.0) {\ndistance = CLOUDS_MAX_VIEWING_DISTANCE;\n}\n*/\nvec3 wind = windVector * czm_frameNumber * windSpeedRatio;\n\n// compute a generic atmosphere color to blend in along distance\nvec4 atmosphereAtDistance = calculate_scattering(\nczm_viewerPositionWC, // the position of the camera\ndirection, // the camera vector (ray direction of this pixel)\n250000.0, // > 250000 creates a singularity at vertical down view\nlightDirection\n);\n\n// render clouds\nvec4 cloudColor = calculate_clouds(\nczm_viewerPositionWC, // the position of the camera\ndirection, // the camera vector (ray direction of this pixel)\ndistance, // max dist, essentially the scene depth\nlightDirection, // light direction\ndepth,\nwind,\natmosphereAtDistance\n);\n\nfloat toneMappingFix = 3.0; // compensate for tone mapping\n\ncolor = vec4(sqrt(cloudColor.rgb) * toneMappingFix * czm_lightColor, cloudColor.a);\n//color.rgb += atmosphereAtDistance.rgb * (1.0 - color.a);\ncolor.rgb = mix(atmosphereAtDistance.rgb, color.rgb, cloudColor.a);\n\n// tone mapping (mecessary for atmosphere correction\nfloat exposure = 1.0;\ncolor.rgb = vec3(1.0 - exp(-exposure * color.rgb));\nfloat gamma = 0.8;\ncolor.rgb = pow(color.rgb, vec3(1.0 / gamma));\n\n#endif\ngl_FragColor = color;\n}\n";

geofs["denoise.glsl"] = "" + 'uniform sampler2D colorTexture;\nvarying vec2 v_textureCoordinates;\n#define SAMPLES 80  // HIGHER = NICER = SLOWER\n#define DISTRIBUTION_BIAS 0.6 // between 0. and 1.\n#define PIXEL_MULTIPLIER  1.5 // between 1. and 3. (keep low)\n#define INVERSE_HUE_TOLERANCE 20.0 // (2. - 30.)\n\n#define GOLDEN_ANGLE 2.3999632 //3PI-sqrt(5)PI\n\n#define pow(a,b) pow(max(a,0.),b) // @morimea\n\nmat2 sample2D = mat2(cos(GOLDEN_ANGLE),sin(GOLDEN_ANGLE),-sin(GOLDEN_ANGLE),cos(GOLDEN_ANGLE));\n\nvec3 sirBirdDenoise(sampler2D imageTexture, in vec2 uv, in vec2 imageResolution) {\n    \n    vec3 denoisedColor           = vec3(0.0);\n    \n    const float sampleRadius     = sqrt(float(SAMPLES));\n    const float sampleTrueRadius = 0.5/(sampleRadius*sampleRadius);\n    vec2        samplePixel      = vec2(1.0/imageResolution.x,1.0/imageResolution.y); \n    vec3        sampleCenter     = texture2D(imageTexture, uv).rgb;\n    vec3        sampleCenterNorm = normalize(sampleCenter);\n    float       sampleCenterSat  = length(sampleCenter);\n    \n    float  influenceSum = 0.0;\n    float brightnessSum = 0.0;\n    \n    vec2 pixelRotated = vec2(0.,1.);\n    \n    for (float x = 0.0; x <= float(SAMPLES); x++) {\n        \n        pixelRotated *= sample2D;\n        \n        vec2  pixelOffset    = PIXEL_MULTIPLIER*pixelRotated*sqrt(x)*0.5;\n        float pixelInfluence = 1.0-sampleTrueRadius*pow(dot(pixelOffset,pixelOffset),DISTRIBUTION_BIAS);\n        pixelOffset *= samplePixel;\n            \n        vec3 thisDenoisedColor = \n            texture2D(imageTexture, uv + pixelOffset).rgb;\n\n        pixelInfluence      *= pixelInfluence*pixelInfluence;\n        /*\n            HUE + SATURATION FILTER\n        */\n        pixelInfluence      *=   \n            pow(0.5+0.5*dot(sampleCenterNorm,normalize(thisDenoisedColor)),INVERSE_HUE_TOLERANCE)\n            * pow(1.0 - abs(length(thisDenoisedColor)-length(sampleCenterSat)),8.);\n            \n        influenceSum += pixelInfluence;\n        denoisedColor += thisDenoisedColor*pixelInfluence;\n    }\n    \n    return denoisedColor/influenceSum;\n    \n}\n\nvoid main() {\n  gl_FragColor = vec4(sirBirdDenoise(colorTexture, v_textureCoordinates, vec2(czm_viewport.z, czm_viewport.w)), 1.0);\n}';

geofs.fx.atmosphere.destroy();
geofs.fx.atmosphere.create();
let debug = !1,
	version = "Release 2.0c";
async function multiliveries() {
	console.log("loading...");
	let e, i, t = {
			window: void 0,
			opened: !1
		},
		o = !1,
		a = 0,
		n = !1;
	await fetch("https://raw.githubusercontent.com/Spice9/Geofs-Multiliveries/main/dependencies/liveries.json").then((e => e.json())).then((i => e = i));
	void 0 === window.localStorage.mlFavorites && (window.localStorage.mlFavorites = []);
	let s = window.localStorage.mlFavorites.split(","),
		r = document.createElement("div"),
		l = document.createElement("i");

	function c(i, t) {
		var o = i + 1e3;
		if (debug && console.log("Livery Change Request as '" + i + "'"), t) n = !0,
			function(e, i) {
				let t = new geofs.api.Canvas({
						width: 500
					}),
					o = t.context,
					a = new Image;
				a.src = i, a.crossOrigin = "anonymous", a.onload = function() {
					t.canvas.width = a.width, t.canvas.height = a.height, o.drawImage(a, 0, 0);
					let n = new Image;
					n.src = "https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/overlay__1_.png", n.crossOrigin = "anonymous", n.onload = function() {
						o.globalAlpha = .25;
						let a = .25 * n.width,
							s = .25 * n.height;
						for (let i = -Math.abs(e); i < t.canvas.height; i += s)
							for (let r = -Math.abs(e); r < t.canvas.width; r += a) o.drawImage(n, r, i, a, s);
						let r = t.canvas.toDataURL("image/png");
						if (debug && console.log(r), 4140 != geofs.aircraft.instance.id) geofs.api.setModelTextureFromCanvas(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, t, 0);
						else {
							if (i.toString().includes("|")) {
								var l = i.split("|"),
									c = l[1],
									d = l[2];
								geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, c, 2), geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, d, 0), i = l[0]
							}
							geofs.api.setModelTextureFromCanvas(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, t, 1)
						}
					}
				}
			}(a, i), debug && console.log("livery changed to " + i);
		else if (i = e.aircraft[i].livery, n = !1, i.toString().includes("https://")) {
			if (4140 == geofs.aircraft.instance.id) {
				if (i.toString().includes("|")) {
					var s = i.split("|"),
						r = s[1],
						l = s[2];
					geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, r, 2), geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, l, 0), i = s[0]
				}
				return void geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, i, 1)
			}
			geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, i, 0), debug && console.log("livery changed to " + i)
		} else geofs.aircraft.instance.loadLivery(i), debug && console.log("livery changed to " + i);
		geofs.aircraft.instance.liveryId = o
	}
	r.id = "mlButton", r.className = "mdl-button mdl-js-button", r.innerText = "Multiliveries ", l.className = "material-icons geofs-ui-bottom-icon", l.innerText = "flight_land", r.appendChild(l), r.addEventListener("click", (function() {
		if ("object" == typeof t.window && t.window.closed && (t.opened = !1), t.opened) return ui.notification.show("Panel is open in another window"), void(debug && console.log("Duplicate open attempt"));
		t.window = window.open("https://ariakim-taiyo.github.io/MLUI/", "_blank", "height=1000,width=1500"), setTimeout((function() {
			t.window.postMessage({
				type: "favorites",
				favorites: s
			}, "*")
		}), 2e3), t.opened = !0, t.window && !t.window.closed && void 0 !== t.window.closed || (ui.notification.show("Please allow popups on GeoFS"), debug && console.log("No Popup Permission"), t.opened = !1)
	})), 0 == document.getElementsByClassName("fmc-btn").length ? document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(r) : document.getElementsByClassName("fmc-prog-info")[0].appendChild(r), document.querySelectorAll("[data-aircraft]").forEach((function(i) {
		e.ids.forEach((function(e) {
			i.dataset.aircraft.includes(e) && (i.style.background = "linear-gradient(90deg, rgba(0,212,255,1) 0%, rgba(255,255,255,1) 15%, rgba(255,255,255,1) 100%)", i.innerHTML.includes("Multiliveries") || (i.innerHTML = i.innerHTML + " [Multiliveries Frame]"))
		}))
	})), window.addEventListener("message", (e => {
		if (e = e.data, debug && console.log(e), "livery" === e.type && (e.custom ? c(e.livery, !0) : c(e.livery, !1)), "vehicle" === e.type && geofs.aircraft.instance.change(e.definition, null), "invalid" === e.type) return console.log("Invalid client, please use the original code."), void ui.notification.show("Invalid client, please use the original code.");
		"test" === e.type && t.window.postMessage({
			type: "answer",
			payload: multiliveries.toString()
		}, "*"), "offset" === e.type && (a = e.offset, n && c(e.livery, !0)), "favorites" === e.type && (s = e.favorites, window.localStorage.mlFavorites = s.join())
	})), geofs.aircraft.Aircraft.prototype.change = function(e, i, o, a) {
		var n = this;
		if (e = e || this.aircraftRecord.id, o = this.load(e, this.getCurrentCoordinates(), o, a), isNaN(parseInt(e)) ? n.loadLivery(i) : o.then((function() {
				n.loadLivery(i)
			})), void 0 !== t) return isNaN(parseInt(e)) ? (geofs.api.analytics.event("aircraft", "EXTERNAL AIRCRAFT"), o) : (geofs.api.analytics.event("aircraft", geofs.aircraftList[e].name), o)
	}, geofs.aircraft.Aircraft.prototype.load = function(i, t, a, n) {
		if (!isNaN(parseInt(i)) || void 0 === e) {
			o = !1;
			r = this;
			var s = geofs.aircraftList[i] && geofs.aircraftList[i].local ? geofs.aircraftList[i].path + "aircraft.json" : "/models/aircraft/load.php";
			if (void 0 === o) return;
			return new Promise((function(e, o) {
				r.id != i || a ? (geofs.doPause(1), r.unloadAircraft(), $.ajax(s, {
					data: {
						id: i,
						kc: geofs.killCache
					},
					dataType: "text",
					success: function(o, s, l) {
						if ("error" != s) {
							geofs.aircraftList[i] && geofs.aircraftList[i].local && (o = JSON.stringify({
								id: i,
								name: geofs.aircraftList[i].name,
								fullPath: geofs.aircraftList[i].path,
								isPremium: !1,
								isCommunity: !1,
								definition: btoa(o)
							}));
							var c = r.parseRecord(o)
						}
						c ? (geofs.aircraftList[i] && !geofs.aircraftList[i].local && (r.fullPath = r.aircraftRecord.fullPath), r.id = i, r.init(c, t, a, n)) : r.loadDefault("Could not load aircraft file"), e()
					},
					error: function(e, t, a) {
						i != geofs.aircraft.default && r.loadDefault("Could not load aircraft file" + a), o()
					}
				})) : e()
			}))
		}
		var r;
		o = !0, (r = this).unloadAircraft();
		var l = r.parseRecord(JSON.stringify({
			id: 42069,
			name: "EXTERNAL AIRCRAFT",
			fullPath: "EXTERNAL AIRCRAFT",
			isPremium: 1,
			isCommunity: !1,
			definition: i
		}));
		setTimeout((function() {
			r.init(l, t, a, n)
		}), 1e3)
	}, geofs.aircraft.Aircraft.prototype.addParts = function(e, i, t, n) {
		for (geofs.aircraft.instance.parts = {}, t = t || 1, n = 0; n < e.length; n++) {
			var s = e[n];
			if (s.include) {
				var r = geofs.includes[s.include];
				$.extend(!0, s, r[0]);
				for (var l = 1; l < r.length; l++) {
					var c = Object.assign({}, r[l], {
						parent: s.name
					});
					c.name = s.name + c.name, e.push(c)
				}
			}
			if (s.indices && 0 < s.indices) {
				for (l = 2; l <= s.indices; l++)(c = Object.assign({}, s, {
					indices: null
				})).name = s.name + l, c.node += l, e.push(c);
				s.name += "1", s.node += "1"
			}
		}
		if (void 0 !== a) {
			for (n = 0; n < e.length; n++) {
				for ((s = e[n]).points = s.points || {}, s.type = s.type || !1, s.brakesController = s.brakesController || !1, s.animations = s.animations || [], geofs.aircraft.instance.parts[s.name] = s, geofs.aircraft.instance.addOffsets(s, t), s.forceDirection && (s.forceDirection = AXIS_TO_INDEX[s.forceDirection]), s.rotation && (s.rotation = V3.toRadians(s.rotation)), s.modelOnlyRotation && (s.modelOnlyRotation = V3.toRadians(s.modelOnlyRotation)), s.scale = s.scale || [1, 1, 1], s.scale = V3.scale(s.scale, t), s.originalScale = s.scale, 4 > geofs.version && (s.gltf2model = null), (s.model || s.gltf2model) && (r = s.gltf2model ? s.gltf2model.url : s.model.url || s.model, i && "/" != r[0] && !s.include && (r = i + r), o && (r = s.model), l = {
						shadows: s.shadows ? window[s.shadows] : SHADOWS_ALL,
						incrementallyLoadTextures: !1
					}, s.gltf2model && s.gltf2model.shader && (l.customShader = geofs.api.generateShader(s.model.shader, i)), s["3dmodel"] = new geofs.api.Model(r, l), this.models.push(s["3dmodel"]._model), s.renderer && (s.rendererInstance = new instruments.Renderer(s.renderer))), s.light && (s.lightBillboard = new geofs.fx.light(null, s.light, {
						scale: .2
					}), geofs.aircraft.instance.lights.push(s)), s.object3d = new Object3D(s), s.suspension && (s.suspension.length ? (s.suspension.origin = [s.collisionPoints[0][0], s.collisionPoints[0][1], s.collisionPoints[0][2] + s.suspension.length], r = s.suspension.length) : (s.suspension.origin = [s.collisionPoints[0][0], s.collisionPoints[0][1], 0], r = -s.collisionPoints[0][2]), s.suspension.restLength = r, "rotation" == s.suspension.motion ? (r = V3.length(s.collisionPoints[0]), r = Math.atan2(s.collisionPoints[0][0] / r, s.collisionPoints[0][2] / r), r = {
						type: "rotate",
						axis: s.suspension.axis || "Y",
						value: s.name + "Suspension",
						ratio: (0 > r ? r + HALF_PI : r - HALF_PI) * RAD_TO_DEGREES * (s.suspension.ratio || 1)
					}) : r = {
						type: "translate",
						axis: s.suspension.axis || "Z",
						value: s.name + "Suspension",
						ratio: s.suspension.ratio || 1
					}, s.animations.push(r), s.suspension.hardPoint = s.suspension.hardPoint || .5, s.points.suspensionOrigin = V3.dup(s.suspension.origin), geofs.aircraft.instance.suspensions.push(s)), l = 0; l < s.animations.length; l++)(r = s.animations[l]).ratio = r.ratio || 1, r.offset = r.offset || 0, r.currentValue = null, r.delay && (r.ratio /= 1 - Math.abs(r.delay)), "rotate" == r.type && (c = r.method || "rotate", "parent" == r.frame && (c = "rotateParentFrame"), r.rotationMethod = s.object3d[c + r.axis]), "translate" == r.type && (geofs.isArray(r.axis) || (r.axis = AXIS_TO_VECTOR[r.axis]));
				if ("wheel" == s.type && (s.radius = s.radius || 1, s.arcDegree = s.radius * TWO_PI / 360, s.angularVelocity = 0, geofs.aircraft.instance.wheels.push(s)), "airfoil" == s.type && (s.lift = 0, geofs.aircraft.instance.airfoils.push(s), s.stalls = s.stalls || !1, s.stallIncidence = s.stallIncidence || 12, s.zeroLiftIncidence = s.zeroLiftIncidence || 16, s.aspectRatio = s.aspectRatio || DEFAULT_AIRFOIL_ASPECT_RATIO, s.aspectRatioCoefficient = s.aspectRatio / s.aspectRatio + 2), "engine" == s.type && (s.rpm = 0, geofs.aircraft.instance.definition.originalInertia = geofs.aircraft.instance.definition.engineInertia, geofs.aircraft.instance.engines.push(s), s.contrail && (s.contrailEmitter = new geofs.fx.ParticleEmitter({
						off: !0,
						anchor: s.points.contrailAnchor,
						duration: 1e10,
						rate: .05,
						life: 4e4,
						easing: "easeOutQuart",
						startScale: .01,
						endScale: .01,
						randomizeStartScale: .02,
						randomizeEndScale: .15,
						startOpacity: .1,
						endOpacity: 1e-5,
						startRotation: "random",
						texture: "whitesmoke"
					}))), "balloon" == s.type && (s.temperature = s.initialTemperature || 0, s.coolingSpeed = s.coolingSpeed || 0, geofs.aircraft.instance.balloons.push(s)), s.collisionPoints) {
					for (r = s.collisionPoints, l = geofs.aircraft.instance.definition.contactProperties[s.contactType || s.type], c = 0; c < r.length; c++) r[c].part = s, r[c].contactProperties = l, geofs.aircraft.instance.collisionPoints.push(r[c]);
					s.volume || s.buoyancy || (s.volume = "airfoil" == s.type ? this.definition.mass / (400 * r.length) : .1, s.area = s.area || 0), s.dragVector = s.dragVector || [1, 1, 1], s.dragVector = V3.scale(s.dragVector, 1 / r.length)
				}
				s.volume && (s.buoyancy = WATER_DENSITY * GRAVITY * s.volume), s.controller && (geofs.aircraft.instance.controllers[s.controller.name] = s.controller)
			}
			for (n = 0; n < e.length; n++) "root" != (s = e[n]).name && (s.parent || (s.parent = "root"), geofs.aircraft.instance.parts[s.parent].object3d.addChild(s.object3d)), s.node && (s.object3d.setModel(s.object3d.findModelInAncestry()), s.manipulator && ("string" == typeof(i = s.manipulator) && (i = geofs.aircraft.instance.aircraftRecord.isCommunity ? null : geofs.utils.getFunctionFromString(i)), i && (geofs.aircraft.instance.manipulators[s.node] = i, controls.addNodeClickHandler(s.node, (function(e) {
				controls.manipulator = geofs.aircraft.instance.manipulators[e], controls.mouse.down = 4
			})))))
		}
	};
	setInterval((function() {
		Object.values(multiplayer.visibleUsers).forEach((function(i) {
			if (i.lastUpdate.st.lv > 1e3) {
				var t = e.aircraft[i.lastUpdate.st.lv - 1e3].mptx;
				4140 == i.aircraft ? geofs.api.changeModelTexture(i.model._model, t, 1) : geofs.api.changeModelTexture(i.model._model, t, 0)
			}
		}))
	}), 1e3);
	console.log("Loaded!"), console.log("Version: " + version), await fetch("https://raw.githubusercontent.com/Spice9/Geofs-Multiliveries/main/dependencies/contributors.txt").then((e => e.json())).then((e => i = e));
	var d = "";
	setTimeout((function() {
		console.log("Code by Spice9 and AriakimTaiyo, livery contributions by:"), i.forEach((function(e) {
			"" === d ? d += e : d = i[i.length - 1] === e ? d + ", and " + e : d + ", " + e
		})), console.log(d)
	}), 1e3)
}
multiliveries();
let itv = setInterval(
    function(){
        try{
            if(window.ui && window.flight){
                spawnHTML();
                clearInterval(itv);}

        }catch(err){}
    }
    ,500);

const options = {
    method:"POST"
}
var listOfData;
var challengeName
const parkour = []
var x = false
var init = false
var userName = ""

const R = 6.378
var EPSILON = 1.1102230246251565e-16
var ERRBOUND3 = (3.0 + 16.0 * EPSILON) * EPSILON

async function checkIf(testx, testy, i) {
    var vertx = parkour[1][i].lat
    var verty = parkour[1][i].lon
    var polygon = []
    var arrayLength = vertx.length;
    for (var i2 = 0; i2 < arrayLength; i2++) {
        polygon.push([convertX(vertx[i2], verty[i2]), convertY(vertx[i2], verty[i2])])
    }
    var test = []
    test.push(convertX(testx, testy), convertY(testx, testy))
    var res = classifyPoint(polygon, test)
    if (res === -1) {
        if (i === parkour[0].waypoints) {
            end()
            await sleep(100)
            x = false
            var waypointNUM = `Waypoint ${i + 1} out of ${parkour[0].waypoints + 1}`
            var waypointnum = document.getElementById("waypointNumber")
            waypointnum.innerHTML = waypointNUM;
        }
        else if (i === 0) {
            console.log("Next waypoint, timer started")
            averageLoops()
            start()
            return true

        }
        else {
            console.log("next waypoint")
            return true
        }

    }
}
function convertX(x, y) {
    //return  x*Math.cos(y)
    return R * Math.cos(x) * Math.cos(y)
}
function convertY(x, y) {
    return R * Math.cos(x) * Math.sin(y)
}


async function spawnModel(i) {
    var yPosition = (parkour[1][i].lon[3] + parkour[1][i].lon[0] + parkour[1][i].lon[2] + parkour[1][i].lon[1]) / 4
    var xPosition = (parkour[1][i].lat[3] + parkour[1][i].lat[0] + parkour[1][i].lat[2] + parkour[1][i].lat[1]) / 4
    var altPosition = geofs.getGroundAltitude(xPosition, yPosition).location[2] + 200
    var La = yPosition
    var θa = xPosition
    var Lb = geofs.aircraft.instance.llaLocation[1]
    var θb = geofs.aircraft.instance.llaLocation[0]
    var coordX = (Math.cos(toRadians(θb))) * (Math.sin(toRadians(diff(Lb, La))))
    var coordY = (Math.cos(toRadians(θa))) * (Math.sin(toRadians(θb))) - (Math.sin(toRadians(θa))) * (Math.cos(toRadians(θb))) * (Math.cos(toRadians(diff(Lb, La))))
    var β = Math.atan2(coordX, coordY)
    var brng = (β * 180 / Math.PI + 360) % 360
    geofs.objects.objectList = [{
        "location": [xPosition, yPosition, altPosition],
        "url": "https://raw.githubusercontent.com/TotallyRealElonMusk/Geo-FS-Speed-Challenges/main/3d-models/arrow.glb",
        "htr": [brng, 0, 0],
        "scale": 2,
        "options": { "shadows": 0 }, "type": 100
    }]
    geofs.objects.loadModels();
}
async function deleteModels() {
    geofs.objects.unloadModels();
}
async function theLoop() {
    var i = 0
    x = true
    var brng = 0
    spawnModel(i)
    while (x === true) {
        var X = geofs.aircraft.instance.llaLocation[0];
        var Y = geofs.aircraft.instance.llaLocation[1];
        var res = await checkIf(X, Y, i)
        if (res === true) {
            geofs.lastFlightCoordinates = {0:geofs.aircraft.instance.llaLocation[0], 1:geofs.aircraft.instance.llaLocation[1], 2: geofs.aircraft.instance.llaLocation[2], 3: geofs.aircraft.instance.htr[0], 4: true}
            console.log("i has been added")
            i += 1
            deleteModels()
            spawnModel(i)
            var waypointNUM = `Waypoint ${i} out of ${parkour[0].waypoints + 1}`
            var waypointnum = document.getElementById("waypointNumber")
            waypointnum.innerHTML = waypointNUM;
        }

        var La = Y
        var θa = X
        var Lb = (parkour[1][i].lon[3] + parkour[1][i].lon[0] + parkour[1][i].lon[2] + parkour[1][i].lon[1]) / 4
        var θb = (parkour[1][i].lat[3] + parkour[1][i].lat[0] + parkour[1][i].lat[2] + parkour[1][i].lat[1]) / 4
        var coordX = (Math.cos(toRadians(θb))) * (Math.sin(toRadians(diff(Lb, La))))
        var coordY = (Math.cos(toRadians(θa))) * (Math.sin(toRadians(θb))) - (Math.sin(toRadians(θa))) * (Math.cos(toRadians(θb))) * (Math.cos(toRadians(diff(Lb, La))))
        var β = Math.atan2(coordX, coordY)
        brng = (β * 180 / Math.PI + 360) % 360



        geofs.animation.values.navHDG = brng


        if (i !== 0) {
            setTime()
        }
        await sleep(5);
    }
}
function setTime() {
    if (timeExist === true) {
        var currentTime = performance.now();

        var timeDifference = currentTime - time[0]; //in ms

        //timeDifference /= 1000;
        var actualTime = Math.round(timeDifference * 100) / 100
        var seconds = (timeDifference / 1000) % 60;
        seconds = Math.round(seconds * 100) / 100
        var minutes = (timeDifference-30000)/1000 / 60
        minutes = Math.round(minutes)
        var timeHtml = `Time: ${minutes}:${seconds}`
        //console.log(timeHtml)
        var timeValueDOM = document.getElementById("timeValuechallenge")
        timeValueDOM.innerHTML = timeHtml;
    }
}
function initialise() {
    console.log("initialised")
    theLoop()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const altitudeList = []
const speedList = []
async function averageLoops() {
    while (x === true) {
        var alt = geofs.relativeAltitude;
        var speed = geofs.animation.values.kias
        altitudeList.push(alt)
        speedList.push(speed)
        var averageAlt = "Your average altitude is: " + Math.round(getAltMedian())
        var averageSpd = "Your average speed is: " + Math.round(getSpdMedian())
        var speedValueDOM = document.getElementById("speedValue")
        speedValueDOM.innerHTML = averageSpd;
        var altValueDOM = document.getElementById("altValuechallenge")
        altValueDOM.innerHTML = averageAlt;
        await sleep(100);
    }
}

function getAltMedian() {
    var average = altitudeList.reduce((a, b) => a + b, 0) / altitudeList.length;
    return average
}
function getSpdMedian() {
    var average = speedList.reduce((a, b) => a + b, 0) / speedList.length;
    return average
}


var endTime
const time = []
var timeExist = false
async function start() {
    time.length=0
    var startTime = performance.now()
    //console.log(startTime)
    time.push(startTime)
    timeExist = true

}

async function end() {
    endTime = performance.now();

    var timeDiff = endTime - time[0]; //in ms

    // strip the ms
    timeDiff /= 1000;

    var averageAlt = await getAltMedian()
    //console.log(`Average alt is ${averageAlt}`)
    var averageSpd = await getSpdMedian()
    //console.log(`Average speed is ${averageSpd}`)
    var score = 10000 * ((averageAlt / 2) ** -1) * ((timeDiff/3) ** -1) * averageSpd
    // get seconds
    //console.log("Parkour finished, you took " + Math.round(timeDiff* 100) / 100 + " seconds");
    var fScore = Math.round(score)
    var finalScore = `Your score is: ${fScore}`
    var scoreHTML = document.getElementById("score")
    scoreHTML.innerHTML = finalScore;
    validateScore(fScore,timeDiff)
    //var score =
}
//let startInput = "q";
//document.addEventListener("keypress", function onEvent(event) {
//
//    if (event.key === startInput) {
//        if (x === false) { initialise() }
//        else { console.log("already started") }
//    }
//})
async function validateScore(fScore,timeDiff){
    await fetch(`https://api.geofsbuildings.com/challenges/inputscore?name=${challengeName}&user=${userName}&plane=${geofs.aircraft.instance.aircraftRecord.name}&time=${timeDiff}&score=${fScore}`)
        .then(res => res.json())
        .then(data => listOfData = data)
}
async function reload() {
    x = false
    console.log("reloaded")
    altitudeList.length = 0
    speedList.length = 0
    endTime = 0
    time.length = 0
    timeExist = false
    parkour.length = 0
}

//let reloadInput = "l";
//document.addEventListener("keypress", function onEvent(event) {
//
//    if (event.key === reloadInput) { reload() }
//})
function diff(num1, num2) {
    //  if (num1 > num2) {
    return num1 - num2
    // } else {
    //       return num2 - num1
    // }
}
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// testing here...
async function spawnHTML() {
    geofs.animation.values.navHDG = 0
    var dataHTML = await createList()
    let customBuildings = document.createElement("div");
    customBuildings.innerHTML = '<ul class="geofs-list geofs-toggle-panel geofs-challenges-list geofs-preferences" data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}"><style>#MainDIV{position:absolute;left:0;top:0;background-color:#fff;text-align:left;padding:0 0 0 10px;margin-top:2px;margin-bottom:2px}table,td,th{border:1px solid #000}#DIVtitle{color:#000;font-family:Helvetica,Arial,sans-serif;font-size:20px}</style><div id="MainDIV"><p id="DIVtitle">Geo-FS challenges page</p></p>' + dataHTML + '</p><button class="mdl-button" mdl-js-button mdl-button—raised mdl-button—colored onclick="initialiseFunction()" data-upgraded=",MaterialButton">Load JSON</button><p id="jsonStatus" style="display:inline-block"></p><p id="description"></p><button class="mdl-button" mdl-js-button mdl-button—raised mdl-button—colored onclick="secondInitialise()" data-upgraded=",MaterialButton">Start challenge</button><button class="mdl-button" mdl-js-button mdl-button—raised mdl-button—colored onclick="reloadChallenge()" data-upgraded=",MaterialButton">Reload Challenge</button><p id="startValue" style="display:inline-block"></p></ul>';
    let sidePanel = document.getElementsByClassName("geofs-ui-left")[0];
    document.getElementsByClassName("geofs-ui-left")[0].appendChild(customBuildings);
    if (geofs.userRecord.role === 0){
        userName = "foo"}
    else{
        userName = geofs.userRecord.callsign}

    //document.getElementsByClassName("geofs-challenges-list")[0].appendChild('<div>Test</div>');


    // Toggle Button Code
    let buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-challenges-list" data-tooltip-classname="mdl-tooltip--top" id="landButton" tabindex="0" data-upgraded=",MaterialButton">Geo-FS Challenges</button>';
    document.body.appendChild(buttonDiv);
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(buttonDiv);
    let element = document.getElementById("landButton");
    document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, buttonDiv);
}

window.initialiseFunction = async () => {
    parkour.length = 0
    challengeName = document.getElementById("parkourSelect").value
    console.log(challengeName)
    if (challengeName === '') {
        var status = "Please select a challenge!"
        var parkourStatus = document.getElementById("jsonStatus")
        parkourStatus.innerHTML = status;
    }
    else { approveJSON(challengeName)
          createLeaderBoard(challengeName)}
}
window.secondInitialise = () => {
    if (parkour.length === 0) {
        var status = "Please insert a JSON!"
        var startStatus = document.getElementById("startValue")
        startStatus.innerHTML = status;
    }
    else {
        var status = ""
        var startStatus = document.getElementById("startValue")
        startStatus.innerHTML = status;
        geofs.flyTo(parkour[0].spawn)
        initialise()
        createMapParkour()
        createOverlay()
        ui.panel.toggle(".geofs-map-list");
        geofs.preferences.crashDetection = true

    }

}

window.reloadChallenge = async () => {
    reload()
    var status = "Challenge reloaded"
    var startStatus = document.getElementById("startValue")
    startStatus.innerHTML = status;
    await sleep(3000)
    var status = ""
    var startStatus = document.getElementById("startValue")
    startStatus.innerHTML = status;
    var timeValue = document.getElementById("timeValuechallenge")
    timeValue.innerHTML = status;
    var waypointStatus = document.getElementById("waypointNumber")
    waypointStatus.innerHTML = status;
    var speedStatus = document.getElementById("speedValue")
    speedStatus.innerHTML = status;
    var altStatus = document.getElementById("altValuechallenge")
    altStatus.innerHTML = status;
    var scoreStatus = document.getElementById("score")
    scoreStatus.innerHTML = status;
    var descStatus = document.getElementById("description")
    descStatus.innerHTML = status;

}

async function createLeaderBoard(challengeName){
    var leaderBoard = await createLB(challengeName)
    try{var id = document.getElementById("scoreTable")
    id.remove()}
    catch(err){console.log(err)}
    var lbHTML = '</p></p><table style="width:100%" id="scoreTable"><tr><th>Position</th><th>Name</th><th>Score</th><th>Plane</th></tr>'
    for (let i = 0; i < 9; i++) {
        lbHTML+= `<tr><td>${i+1}</td><td>${leaderBoard[i].name}</td><td>${leaderBoard[i].score}</td><td>${leaderBoard[i].plane}</td></tr>`
    }
    lbHTML+=`<tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>`
    lbHTML+=`<tr><td>${leaderBoard[10].position}</td><td>${userName}</td><td>${leaderBoard[10].score}</td><td>${leaderBoard[10].plane}</td></tr></table>`
    var addLB = document.getElementById("startValue")
    addLB.insertAdjacentHTML('afterend', lbHTML)
}
async function createLB(challengeName){
    var leaderBoard;
    console.log(challengeName)
    await fetch("https://api.geofsbuildings.com/challenges/leaderboard?name="+challengeName+"&user="+userName)
        .then(res => res.json())
        .then(data => leaderBoard = data)
    console.log(leaderBoard)
    return leaderBoard
}
async function createOverlay() {
    var overlayHTML = document.getElementsByClassName("cesium-credit-lightbox-overlay")
    overlayHTML[0].insertAdjacentHTML('afterend', '<div class="cesium-performanceDisplay-defaultContainer"><div class="cesium-performanceDisplay"><div class="cesium-performanceDisplay-ms" id="timeValuechallenge"></div><div class="cesium-performanceDisplay-fps" id="waypointNumber"></div><div class="cesium-performanceDisplay-fps" id="speedValue"></div><div class="cesium-performanceDisplay-fps" id="altValuechallenge"></div><div class="cesium-performanceDisplay-fps" id="score"></div></div></div>');

}

async function createMapParkour() {
    var mapPark = []
    parkour[1].forEach(function (item, index) {
        mapPark.push([parkour[1][index].lat.reduce((a, b) => a + b, 0) / parkour[1][index].lat.length, parkour[1][index].lon.reduce((a, b) => a + b, 0) / parkour[1][index].lon.length]);
    });
    geofs.api.map.setPathPoints(mapPark)
    geofs.api.map.stopCreatePath()
}

async function editJSONHTML() {
    var status = "JSON validated!"
    var parkourStatus = document.getElementById("jsonStatus")
    parkourStatus.innerHTML = status;
    console.log(parkour)
    await sleep(3000)
    var status = ""
    var parkourStatus = document.getElementById("jsonStatus")
    parkourStatus.innerHTML = status;
}

async function createList() {
    var listData = []
    listData = await getList()
    console.log(listData)
    var listHTML = '<label for="parkourSelect">Choose your challenge from the list:</label><select name="parkourSelect" id="parkourSelect">'
    var arrayLength = listData.length;
    for (var i = 0; i < arrayLength; i++) {
        listHTML += `<option value=${await encodeURIComponent(await listData[i].trim())}>${listData[i]}</option>`
    }

    listHTML += '  </select>'
    return listHTML
}

async function getList() {
    await fetch("https://api.geofsbuildings.com/challenges/name")
        .then(res => res.json())
        .then(data => listOfData = data)
    return listOfData
}

async function approveJSON(challengeName) {
    inputJson = await getParkour(challengeName)
    inputJson.forEach(function (item, index) {
        parkour.push(inputJson[index]);
        editJSONHTML()
    });
    var desc = parkour[0].description
    var parkourStatus = document.getElementById("description")
    parkourStatus.innerHTML = desc;
}
async function getParkour(challengeName) {
    await fetch("https://api.geofsbuildings.com/challenges/routes?name="+challengeName)
        .then(res => res.json())
        .then(data => Routes = data)
    return Routes
}


//external function

function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if (l > 0) {
        if (r <= 0) {
            return det
        } else {
            s = l + r
        }
    } else if (l < 0) {
        if (r >= 0) {
            return det
        } else {
            s = -(l + r)
        }
    } else {
        return det
    }
    var tol = ERRBOUND3 * s
    if (det >= tol || det <= -tol) {
        return det
    }
}
function classifyPoint(vs, point) {
    var x = point[0]
    var y = point[1]
    var n = vs.length
    var inside = 1
    var lim = n
    for (var i = 0, j = n - 1; i < lim; j = i++) {
        var a = vs[i]
        var b = vs[j]
        var yi = a[1]
        var yj = b[1]
        if (yj < yi) {
            if (yj < y && y < yi) {
                var s = orientation3(a, b, point)
                if (s === 0) {
                    return 0
                } else {
                    inside ^= (0 < s) | 0
                }
            } else if (y === yi) {
                var c = vs[(i + 1) % n]
                var yk = c[1]
                if (yi < yk) {
                    var s = orientation3(a, b, point)
                    if (s === 0) {
                        return 0
                    } else {
                        inside ^= (0 < s) | 0
                    }
                }
            }
        } else if (yi < yj) {
            if (yi < y && y < yj) {
                var s = orientation3(a, b, point)
                if (s === 0) {
                    return 0
                } else {
                    inside ^= (s < 0) | 0
                }
            } else if (y === yi) {
                var c = vs[(i + 1) % n]
                var yk = c[1]
                if (yk < yi) {
                    var s = orientation3(a, b, point)
                    if (s === 0) {
                        return 0
                    } else {
                        inside ^= (s < 0) | 0
                    }
                }
            }
        } else if (y === yi) {
            var x0 = Math.min(a[0], b[0])
            var x1 = Math.max(a[0], b[0])
            if (i === 0) {
                while (j > 0) {
                    var k = (j + n - 1) % n
                    var p = vs[k]
                    if (p[1] !== y) {
                        break
                    }
                    var px = p[0]
                    x0 = Math.min(x0, px)
                    x1 = Math.max(x1, px)
                    j = k
                }
                if (j === 0) {
                    if (x0 <= x && x <= x1) {
                        return 0
                    }
                    return 1
                }
                lim = j + 1
            }
            var y0 = vs[(j + n - 1) % n][1]
            while (i + 1 < lim) {
                var p = vs[i + 1]
                if (p[1] !== y) {
                    break
                }
                var px = p[0]
                x0 = Math.min(x0, px)
                x1 = Math.max(x1, px)
                i += 1
            }
            if (x0 <= x && x <= x1) {
                return 0
            }
            var y1 = vs[(i + 1) % n][1]
            if (x < x0 && (y0 < y !== y1 < y)) {
                inside ^= 1
            }
        }
    }
    return 2 * inside - 1
}
// ==UserScript==
// @name         Geo-FS Extra Maritime Structures
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds extra maritime structures to GeoFS
// @author       Elon
// @match http://*/geofs.php*
// @match https://*/geofs.php*
// @run-at document-end
// @grant        none
// ==/UserScript==

const _0x4ddc51 = _0x3bca;
(function(_0x6684e, _0x3bb870) {
    const _0x2ba9b9 = _0x3bca,
        _0x312b31 = _0x6684e();
    while (!![]) {
        try {
            const _0x228e30 = -parseInt(_0x2ba9b9(0x120)) / 0x1 + -parseInt(_0x2ba9b9(0x17a)) / 0x2 + parseInt(_0x2ba9b9(0x15f)) / 0x3 * (parseInt(_0x2ba9b9(0x104)) / 0x4) + -parseInt(_0x2ba9b9(0x11b)) / 0x5 + parseInt(_0x2ba9b9(0x189)) / 0x6 + -parseInt(_0x2ba9b9(0x1a0)) / 0x7 + -parseInt(_0x2ba9b9(0x11c)) / 0x8 * (-parseInt(_0x2ba9b9(0x111)) / 0x9);
            if (_0x228e30 === _0x3bb870) break;
            else _0x312b31['push'](_0x312b31['shift']());
        } catch (_0x3e1e2f) {
            _0x312b31['push'](_0x312b31['shift']());
        }
    }
}(_0x80ea, 0x980f5));
let addonHandler, addonHandlerLink = _0x4ddc51(0x18e);
await fetch(addonHandlerLink)[_0x4ddc51(0x19a)](_0x311460 => _0x311460['text']())[_0x4ddc51(0x19a)](_0x537985 => addonHandler = _0x537985), eval(addonHandler), await new Promise(_0x8fa9c5 => setTimeout(_0x8fa9c5, 0x64));
window[_0x4ddc51(0x13c)] ? addons[_0x4ddc51(0x18b)] = !![] : alert(_0x4ddc51(0x12c));
let listData, listDataLink = _0x4ddc51(0xfb);
await fetch(listDataLink)[_0x4ddc51(0x19a)](_0x56732e => _0x56732e[_0x4ddc51(0x126)]())[_0x4ddc51(0x19a)](_0x1f4dd4 => listData = _0x1f4dd4);
let buildings, buildingsLink = _0x4ddc51(0x175);
await fetch(buildingsLink)[_0x4ddc51(0x19a)](_0x30fe2d => _0x30fe2d[_0x4ddc51(0x126)]())['then'](_0x331105 => buildings = _0x331105);
let collData, collDataLink = _0x4ddc51(0xf5);
await fetch(collDataLink)[_0x4ddc51(0x19a)](_0x3e2bcb => _0x3e2bcb[_0x4ddc51(0x126)]())['then'](_0x14e217 => collData = _0x14e217);
let colors = [_0x4ddc51(0x197), _0x4ddc51(0x17b), _0x4ddc51(0x141), _0x4ddc51(0xfa)];
window[_0x4ddc51(0x102)] = [];
let lightData, lightDataLink = _0x4ddc51(0x160);
await fetch(lightDataLink)[_0x4ddc51(0x19a)](_0x546714 => _0x546714['json']())[_0x4ddc51(0x19a)](_0xa2d580 => lightData = _0xa2d580);
let catapultData, catapultDataLink = 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/json%20files/catapults.json';
await fetch(catapultDataLink)['then'](_0x1b4b58 => _0x1b4b58['json']())[_0x4ddc51(0x19a)](_0x3bddaf => catapultData = _0x3bddaf), window[_0x4ddc51(0xf6)] = {}, collState[_0x4ddc51(0x11a)] = !![], collState[_0x4ddc51(0x15e)] = {}, collState[_0x4ddc51(0x15d)] = {};
const R = 6.378;
var EPSILON = 1.1102230246251565e-16,
    ERRBOUND3 = (0x3 + 0x10 * EPSILON) * EPSILON;
let prevObj = [{
        'name': _0x4ddc51(0x13b)
    }],
    lightSettings = {
        'altitudeMode': 'ALTITUDE_RELATIVE',
        'sizeInMeters': ![],
        'scaleByDistance': {
            'near': 0x1,
            'nearValue': 0.1,
            'far': 0x1f4,
            'farValue': 0.06
        }
    };

function main() {
    let _0x3b3a44 = setInterval(function() {
        updateBuildings(), checkCarrier(), catapultMain();
    }, 0x3e8);
}

function secondMain() {
    let _0x52d917 = setInterval(function() {
        editCoords();
    }, 0x1388);
}
async function updateBuildings(_0x470cc3) {
    const _0x2b641c = _0x4ddc51;
    let _0x5ce5c0 = [],
        _0x2ba4de = addBuildings();
    for (let _0x4890db = 0x0; _0x4890db < geofs[_0x2b641c(0x146)][_0x2b641c(0x16c)][_0x2b641c(0x12a)]; _0x4890db++) {
        _0x5ce5c0[_0x4890db] = geofs[_0x2b641c(0x146)]['objectList'][_0x4890db];
    }
    _0x5ce5c0 = await getOld(_0x5ce5c0);
    let _0x238d9f = checkIfSame(_0x5ce5c0, _0x2ba4de);
    if (_0x238d9f == ![] && !_0x470cc3) {
        let _0x119ac3 = await removeOld(geofs['objects']['objectList']);
        geofs[_0x2b641c(0x146)][_0x2b641c(0x16c)] = _0x119ac3;
        let _0x5a2d5c = [];
        for (let _0xf88133 = 0x0; _0xf88133 < _0x2ba4de[_0x2b641c(0x12a)]; _0xf88133++) {
            _0x5a2d5c[_0xf88133] = _0x2ba4de[_0xf88133];
        }
        geofs['objects'][_0x2b641c(0x19f)]();
        for (let _0x1e5af6 = 0x0; _0x1e5af6 < _0x5a2d5c[_0x2b641c(0x12a)]; _0x1e5af6++) {
            geofs['objects']['objectList']['push'](_0x5a2d5c[_0x1e5af6]);
        }
        geofs[_0x2b641c(0x146)][_0x2b641c(0x17c)](), geofs[_0x2b641c(0x146)][_0x2b641c(0x154)](), geofs[_0x2b641c(0x146)][_0x2b641c(0x191)]();
    } else {
        if (_0x470cc3) {
            let _0x3038a4 = await removeOld(geofs[_0x2b641c(0x146)][_0x2b641c(0x16c)]);
            geofs[_0x2b641c(0x146)][_0x2b641c(0x16c)] = _0x3038a4;
            let _0x5956bf = [];
            for (let _0x16dee9 = 0x0; _0x16dee9 < _0x2ba4de[_0x2b641c(0x12a)]; _0x16dee9++) {
                _0x5956bf[_0x16dee9] = _0x2ba4de[_0x16dee9];
            }
            geofs[_0x2b641c(0x146)]['unloadModels']();
            for (let _0x4e2c9e = 0x0; _0x4e2c9e < _0x5956bf[_0x2b641c(0x12a)]; _0x4e2c9e++) {
                geofs['objects'][_0x2b641c(0x16c)][_0x2b641c(0x121)](_0x5956bf[_0x4e2c9e]);
            }
            geofs['objects'][_0x2b641c(0x17c)](), geofs[_0x2b641c(0x146)][_0x2b641c(0x154)](), geofs[_0x2b641c(0x146)][_0x2b641c(0x191)]();
        }
    }
}
async function spawnHTML() {
    const _0x2d42f7 = _0x4ddc51;
    var _0x437dfb = await createList();
    let _0x4779e8 = document[_0x2d42f7(0x196)](_0x2d42f7(0x187));
    _0x4779e8[_0x2d42f7(0x137)] = _0x2d42f7(0x148) + _0x437dfb + _0x2d42f7(0xf8);
    let _0x539c27 = document['getElementsByClassName'](_0x2d42f7(0x193))[0x0];
    document[_0x2d42f7(0x10c)]('geofs-ui-left')[0x0]['appendChild'](_0x4779e8);
    let _0x5a899e = document['createElement'](_0x2d42f7(0x187));
    _0x5a899e['innerHTML'] = _0x2d42f7(0x109), document['body']['appendChild'](_0x5a899e), document[_0x2d42f7(0x10c)](_0x2d42f7(0x173))[0x0]['appendChild'](_0x5a899e);
    let _0x22b9f0 = document[_0x2d42f7(0x1a8)](_0x2d42f7(0x14c));
    document[_0x2d42f7(0x10c)](_0x2d42f7(0x173))[0x0][_0x2d42f7(0x185)](_0x22b9f0, _0x5a899e);
}
async function createList() {
    const _0x44793c = _0x4ddc51;
    let _0x5f52be = _0x44793c(0xff);
    for (let _0x4d65c1 = 0x0; _0x4d65c1 < listData['length']; _0x4d65c1++) {
        _0x5f52be += '<option\x20value=' + _0x4d65c1 + '>' + listData[_0x4d65c1]['name'] + '</option>';
    }
    return _0x5f52be += '\x20\x20</select>', _0x5f52be;
}
window[_0x4ddc51(0x18f)] = () => {
    const _0x579081 = _0x4ddc51;
    let _0x2bdf9e = document['getElementById'](_0x579081(0xfd))[_0x579081(0x156)];
    if (_0x2bdf9e != 0x0 && _0x2bdf9e != 0x7 && _0x2bdf9e != 0xa) {
        let _0x2d9f04 = [],
            _0x242196 = geofs[_0x579081(0x15a)][_0x579081(0xef)][_0x579081(0x115)];
        _0x2d9f04[_0x579081(0x121)]([_0x242196[0x0], _0x242196[0x1]]), _0x2d9f04[_0x579081(0x121)]([listData[_0x2bdf9e]['location'][0x0], listData[_0x2bdf9e]['location'][0x1]]), geofs['api'][_0x579081(0x149)]['setPathPoints'](_0x2d9f04), geofs[_0x579081(0x132)][_0x579081(0x149)][_0x579081(0x10a)]();
    }
}, window[_0x4ddc51(0x118)] = () => {
    const _0x438cd5 = _0x4ddc51;
    let _0x2f24b1 = document[_0x438cd5(0x1a8)]('structureSelect')['value'];
    _0x2f24b1 != 0x0 && _0x2f24b1 != 0x7 && _0x2f24b1 != 0xa && (geofs[_0x438cd5(0x106)](listData[_0x2f24b1][_0x438cd5(0x151)]), updateBuildings('placeholder'), geofs['objects'][_0x438cd5(0x19f)](), nodeState = {});
}, window[_0x4ddc51(0x1a5)] = () => {
    const _0x21c6b8 = _0x4ddc51;
    let _0x1013db = document[_0x21c6b8(0x1a8)]('structureSelect')[_0x21c6b8(0x156)];
    _0x1013db != 0x0 && _0x1013db != 0x7 && _0x1013db != 0xa && (geofs['flyTo'](listData[_0x1013db]['flyLocation']), updateBuildings('placeholder'), geofs[_0x21c6b8(0x146)]['unloadModels'](), nodeState = {});
};

function addBuildings() {
    const _0x14cd18 = _0x4ddc51;
    let _0x1d7f92 = {
            'latitude': geofs[_0x14cd18(0x15a)][_0x14cd18(0xef)]['llaLocation'][0x0],
            'longitude': geofs[_0x14cd18(0x15a)][_0x14cd18(0xef)][_0x14cd18(0x115)][0x1]
        },
        _0x570dee, _0x134156 = [];
    for (let _0x4e8f31 = 0x0; _0x4e8f31 < buildings[_0x14cd18(0x12a)]; _0x4e8f31++) {
        _0x570dee = {
            'latitude': buildings[_0x4e8f31][_0x14cd18(0x151)][0x0],
            'longitude': buildings[_0x4e8f31]['location'][0x1]
        };
        let _0x4e708d = calculateDistance(_0x1d7f92, _0x570dee);
        _0x4e708d < 0xc350 && _0x134156[_0x14cd18(0x121)](JSON[_0x14cd18(0x100)](JSON['stringify'](buildings[_0x4e8f31])));
    }
    return _0x134156;
}

function getOld(_0x1b6b66) {
    const _0x584011 = _0x4ddc51;
    let _0x5ef679 = [],
        _0x2fb08a = [];
    if (_0x1b6b66[_0x584011(0x12a)] != 0x0) {
        for (let _0x2b7be3 = 0x0; _0x2b7be3 < _0x1b6b66[_0x584011(0x12a)]; _0x2b7be3++) {
            for (let _0x256bb6 = 0x0; _0x256bb6 < buildings[_0x584011(0x12a)]; _0x256bb6++) {
                try {
                    _0x1b6b66[_0x2b7be3][_0x584011(0x11f)] == buildings[_0x256bb6][_0x584011(0x11f)] && _0x5ef679['push'](_0x2b7be3);
                } catch (_0x427e35) {}
            }
        }
        _0x2fb08a = [];
        for (let _0x2695d5 = 0x0; _0x2695d5 < _0x5ef679[_0x584011(0x12a)]; _0x2695d5++) {
            _0x2fb08a[_0x2695d5] = _0x1b6b66[_0x5ef679[_0x2695d5]];
        }
    }
    return _0x2fb08a;
}

function removeOld(_0x4e646a) {
    const _0x57f7e0 = _0x4ddc51;
    let _0x2abe65 = [];
    if (_0x4e646a['length'] != 0x0) {
        for (let _0x3aadb0 = 0x0; _0x3aadb0 < _0x4e646a[_0x57f7e0(0x12a)]; _0x3aadb0++) {
            for (let _0x5525b6 = 0x0; _0x5525b6 < buildings[_0x57f7e0(0x12a)]; _0x5525b6++) {
                try {
                    _0x4e646a[_0x3aadb0][_0x57f7e0(0x11f)] == buildings[_0x5525b6][_0x57f7e0(0x11f)] && _0x2abe65['push'](_0x3aadb0);
                } catch (_0xe3179b) {}
            }
        }
        _0x2abe65[_0x57f7e0(0x12f)]();
        for (let _0x23cc6a = 0x0; _0x23cc6a < _0x2abe65[_0x57f7e0(0x12a)]; _0x23cc6a++) {
            _0x4e646a[_0x57f7e0(0x1a6)](_0x2abe65[_0x23cc6a], 0x1);
        }
        return _0x4e646a;
    } else return _0x4e646a;
}

function calculateDistance(_0x3a48ee, _0x4a9d5a) {
    const _0x461468 = _0x4ddc51;
    let _0x26c1d6 = _0x3a48ee[_0x461468(0x176)] * (Math['PI'] / 0xb4),
        _0x53ea24 = _0x4a9d5a[_0x461468(0x176)] * (Math['PI'] / 0xb4),
        _0x2b3fd8 = _0x3a48ee[_0x461468(0x142)] * (Math['PI'] / 0xb4),
        _0x17eb2b = _0x4a9d5a[_0x461468(0x142)] * (Math['PI'] / 0xb4),
        _0x17bea6 = _0x53ea24 - _0x26c1d6,
        _0x2c94d9 = _0x17eb2b - _0x2b3fd8,
        _0x44ef68 = Math['sin'](_0x17bea6 / 0x2) * Math[_0x461468(0x14a)](_0x17bea6 / 0x2) + Math[_0x461468(0x108)](_0x26c1d6) * Math['cos'](_0x53ea24) * Math['sin'](_0x2c94d9 / 0x2) * Math[_0x461468(0x14a)](_0x2c94d9 / 0x2),
        _0xcdb81 = 0x2 * Math[_0x461468(0x180)](Math[_0x461468(0x17e)](_0x44ef68), Math[_0x461468(0x17e)](0x1 - _0x44ef68)),
        _0x2c8f57 = 0x6136b8;
    return _0x2c8f57 * _0xcdb81;
}

function editCoords() {
    const _0x2a28a8 = _0x4ddc51;
    if (typeof geofs[_0x2a28a8(0x146)][_0x2a28a8(0x16c)][0x0] !== _0x2a28a8(0x12d)) {
        if (typeof geofs[_0x2a28a8(0x146)][_0x2a28a8(0x16c)][0x0][_0x2a28a8(0x11f)] !== 'undefined') {
            if (geofs[_0x2a28a8(0x146)]['objectList'][0x0][_0x2a28a8(0x11f)] == _0x2a28a8(0x11a)) {
                if (collState[_0x2a28a8(0x11a)] == !![]) {
                    if (geofs[_0x2a28a8(0x15a)][_0x2a28a8(0xef)][_0x2a28a8(0x115)][0x2] < 0x14) {
                        let _0x4bd9d5 = checkIfPointIsInSquare(geofs[_0x2a28a8(0x146)][_0x2a28a8(0x16c)][0x0][_0x2a28a8(0x151)], geofs[_0x2a28a8(0x15a)][_0x2a28a8(0xef)][_0x2a28a8(0x115)], collData[_0x2a28a8(0x11a)][_0x2a28a8(0x145)]);
                        _0x4bd9d5 == !![] && lowerCollCG57();
                    }
                } else {
                    let _0x4b3a94 = checkIfPointIsInSquare(geofs['objects'][_0x2a28a8(0x16c)][0x0][_0x2a28a8(0x151)], geofs[_0x2a28a8(0x15a)]['instance'][_0x2a28a8(0x115)], collData[_0x2a28a8(0x11a)][_0x2a28a8(0x145)]);
                    _0x4b3a94 == ![] ? normalizeCollCG57() : geofs[_0x2a28a8(0x15a)][_0x2a28a8(0xef)][_0x2a28a8(0x115)][0x2] > 0x14 && normalizeCollCG57();
                }
            }
        }
    }
}

function lowerCollCG57() {
    const _0x3328d3 = _0x4ddc51;
    for (let _0x3a77cd = 0x0; _0x3a77cd < collData[_0x3328d3(0x11a)]['positions'][_0x3328d3(0x12a)]; _0x3a77cd++) {
        for (let _0x2bd056 = 0x0; _0x2bd056 < 0x3; _0x2bd056++) {
            geofs[_0x3328d3(0x146)][_0x3328d3(0x16c)][0x0][_0x3328d3(0x105)][collData[_0x3328d3(0x11a)]['positions'][_0x3a77cd]][_0x2bd056][0x2] = 11.292;
        }
    }
    geofs[_0x3328d3(0x146)][_0x3328d3(0x154)]();
}

function normalizeCollCG57() {
    const _0x54c5a0 = _0x4ddc51;
    for (let _0x1535f5 = 0x0; _0x1535f5 < collData[_0x54c5a0(0x11a)][_0x54c5a0(0x13d)]['length']; _0x1535f5++) {
        for (let _0x2c484a = 0x0; _0x2c484a < 0x3; _0x2c484a++) {
            geofs[_0x54c5a0(0x146)][_0x54c5a0(0x16c)][0x0]['collisionTriangles'][collData[_0x54c5a0(0x11a)]['positions'][_0x1535f5]][_0x2c484a][0x2] = 22.199;
        }
    }
    geofs[_0x54c5a0(0x146)][_0x54c5a0(0x154)]();
}

function checkIfSame(_0x1d27f6, _0x1b1a66) {
    const _0x3fcbc2 = _0x4ddc51;
    if (_0x1d27f6['length'] != _0x1b1a66['length']) return ![];
    else {
        if (_0x1d27f6[_0x3fcbc2(0x12a)] == 0x0) return !![];
        else return _0x1d27f6[0x0][_0x3fcbc2(0x11f)] == _0x1b1a66[0x0][_0x3fcbc2(0x11f)] ? !![] : ![];
    }
}

function _0x3bca(_0x141198, _0x4f1ec3) {
    const _0x80eae7 = _0x80ea();
    return _0x3bca = function(_0x3bca6f, _0x3c5aa1) {
        _0x3bca6f = _0x3bca6f - 0xed;
        let _0x2dcf9 = _0x80eae7[_0x3bca6f];
        return _0x2dcf9;
    }, _0x3bca(_0x141198, _0x4f1ec3);
}

function latLonToMercator(_0x553576, _0x447b39) {
    const _0x3fc20f = _0x4ddc51;
    let _0x5a4079 = _0x447b39 * 20037508.34 / 0xb4,
        _0x15bb7b = Math['log'](Math[_0x3fc20f(0x18a)]((0x5a + _0x553576) * Math['PI'] / 0x168)) / (Math['PI'] / 0xb4);
    return _0x15bb7b = _0x15bb7b * 20037508.34 / 0xb4, [_0x5a4079, _0x15bb7b];
}

function isPointInSquare(_0x2bd0ca, _0x2b7541, _0x4ef418, _0x231c8b, _0x655f71, _0x4ab914) {
    if (_0x4ef418 <= _0x2bd0ca && _0x2bd0ca <= _0x655f71) {
        if (_0x231c8b <= _0x2b7541 && _0x2b7541 <= _0x4ab914) return !![];
    }
    return ![];
}

function checkIfPointIsInSquare(_0x9734df, _0x28f388, _0x139843) {
    let _0x37e046 = latLonToMercator(_0x9734df[0x0], _0x9734df[0x1]),
        _0x3ed0ad = latLonToMercator(_0x28f388[0x0], _0x28f388[0x1]),
        _0x11fc93 = _0x3ed0ad[0x0] - _0x37e046[0x0],
        _0x1f09eb = _0x3ed0ad[0x1] - _0x37e046[0x1],
        _0x31ecf5 = isPointInSquare(-_0x11fc93, _0x1f09eb, _0x139843[0x0], _0x139843[0x1], _0x139843[0x2], _0x139843[0x3]);
    return _0x31ecf5;
}
window[_0x4ddc51(0x19b)] = function(_0x254e63) {
    clickedNodeHandler(_0x254e63);
};

function resetNodeState() {
    const _0xc780c2 = _0x4ddc51;
    for (const [_0x59e2d5, _0x40b825] of Object[_0xc780c2(0x164)](nodeState)) {
        resetNodes(_0x59e2d5);
    }
}

function resetNodes(_0x4662c6) {
    const _0x8aace9 = _0x4ddc51;
    nodeState[_0x4662c6][_0x8aace9(0x15b)] = 'up', nodeState[_0x4662c6]['moving'] = ![];
}
window['nodeState'] = {};

function clickedNodeHandler(_0x2a9840) {
    const _0x136071 = _0x4ddc51;
    if (geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x136071(0x12a)] != 0x0) {
        let _0x2663c0 = [];
        for (let _0x2b4a00 = 0x0; _0x2b4a00 < geofs['objects'][_0x136071(0x16c)][_0x136071(0x12a)]; _0x2b4a00++) {
            _0x2663c0[_0x136071(0x121)](geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x2b4a00]['name'] || _0x136071(0x13b));
        }
        let _0x575849, _0x25f7e2 = ![];
        for (let _0x3d54f1 = 0x0; _0x3d54f1 < collData['carriers']['length']; _0x3d54f1++) {
            _0x2663c0[_0x136071(0x182)](collData[_0x136071(0x10b)][_0x3d54f1]) > -0x1 && (_0x575849 = _0x2663c0[_0x136071(0x182)](collData[_0x136071(0x10b)][_0x3d54f1]), _0x25f7e2 = !![]);
        }
        if (_0x25f7e2 == !![]) {
            let _0x51d3f2 = geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x575849][_0x136071(0x11f)];
            for (let _0x37bf44 = 0x0; _0x37bf44 < collData[_0x51d3f2]['touchNodes'][_0x136071(0x12a)]; _0x37bf44++) {
                if (_0x2a9840 == collData[_0x51d3f2][_0x136071(0x127)][_0x37bf44]) {
                    !nodeState[_0x51d3f2] && (nodeState[_0x51d3f2] = {});
                    !nodeState[_0x51d3f2][_0x2a9840] && (nodeState[_0x51d3f2][_0x2a9840] = {}, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x135)] = geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x575849], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x11f)] = collData[_0x51d3f2][_0x136071(0x17f)][_0x37bf44], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] = 'up', nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] = ![], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x15b)] = 0x0, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x140)] = 0xf, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x13e)] = !![], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x10e)] = [0x0, 0x0, 0x0], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x158)] = collData[_0x51d3f2][_0x136071(0x158)], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x151)] = collData[_0x51d3f2][_0x136071(0x151)], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x16f)] = _0x575849, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x16d)] = collData[_0x51d3f2]['collAlt'], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x131)] = 0x1, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x1a4)] = !![], nodeState[_0x51d3f2][_0x2a9840]['animatable'] = !![]);
                    if (nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] == 'up' && nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] == ![]) console[_0x136071(0x113)](nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x15b)]), nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x139)] = 0x1, setPartAnimationDelta(nodeState[_0x51d3f2][_0x2a9840]), nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] = _0x136071(0xf9), nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] = !![];
                    else nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] == _0x136071(0xf9) && nodeState[_0x51d3f2][_0x2a9840]['moving'] == ![] && (nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x139)] = 0x0, setPartAnimationDelta(nodeState[_0x51d3f2][_0x2a9840]), nodeState[_0x51d3f2][_0x2a9840]['positionReadable'] = 'up', nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] = !![]);
                }
            }
            for (let _0x325489 = 0x0; _0x325489 < collData[_0x51d3f2][_0x136071(0x10f)][_0x136071(0x12a)]; _0x325489++) {
                if (_0x2a9840 == collData[_0x51d3f2][_0x136071(0x10f)][_0x325489]) {
                    !nodeState[_0x51d3f2] && (nodeState[_0x51d3f2] = {});
                    if (!nodeState[_0x51d3f2][_0x2a9840]) {
                        nodeState[_0x51d3f2][_0x2a9840] = {}, nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x135)] = geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x575849], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x11f)] = collData[_0x51d3f2][_0x136071(0x10f)][_0x325489], nodeState[_0x51d3f2][_0x2a9840]['positionReadable'] = 'up', nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] = ![], nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x15b)] = 0x0;
                        for (let _0x166fb6 = 0x0; _0x166fb6 < collData[_0x51d3f2][_0x136071(0x188)][_0x325489]['length']; _0x166fb6++) {
                            nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]] = {}, nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x135)] = geofs[_0x136071(0x146)][_0x136071(0x16c)][_0x575849], nodeState[_0x51d3f2][collData[_0x51d3f2]['JBD'][_0x325489][_0x166fb6]][_0x136071(0x11f)] = collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6], nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x177)] = 'up', nodeState[_0x51d3f2][collData[_0x51d3f2]['JBD'][_0x325489][_0x166fb6]][_0x136071(0x170)] = ![], nodeState[_0x51d3f2][collData[_0x51d3f2]['JBD'][_0x325489][_0x166fb6]][_0x136071(0x15b)] = 0x0, nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x140)] = 0x7, nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x158)] = 0x0, nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]]['location'] = [0x0, 0x0, 0x0], nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]]['rotation'] = collData[_0x51d3f2][_0x136071(0x19c)][_0x166fb6], nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x130)] = collData[_0x51d3f2], nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x131)] = 0x0, nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x166fb6]][_0x136071(0x13a)] = !![];
                        }
                    }
                    if (nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] == 'up' && nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] == ![]) {
                        for (let _0x399f3a = 0x0; _0x399f3a < collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x136071(0x12a)]; _0x399f3a++) {
                            nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x399f3a]][_0x136071(0x139)] = 0x1, setPartAnimationDelta(nodeState[_0x51d3f2][collData[_0x51d3f2]['JBD'][_0x325489][_0x399f3a]]);
                        }
                        nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] = _0x136071(0xf9), nodeState[_0x51d3f2][_0x2a9840]['moving'] = !![];
                    } else {
                        if (nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] == _0x136071(0xf9) && nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x170)] == ![]) {
                            for (let _0x42f4dc = 0x0; _0x42f4dc < collData[_0x51d3f2]['JBD'][_0x325489][_0x136071(0x12a)]; _0x42f4dc++) {
                                nodeState[_0x51d3f2][collData[_0x51d3f2][_0x136071(0x188)][_0x325489][_0x42f4dc]][_0x136071(0x139)] = 0x0, setPartAnimationDelta(nodeState[_0x51d3f2][collData[_0x51d3f2]['JBD'][_0x325489][_0x42f4dc]]);
                            }
                            nodeState[_0x51d3f2][_0x2a9840][_0x136071(0x177)] = 'up', nodeState[_0x51d3f2][_0x2a9840]['moving'] = !![];
                        }
                    }
                }
            }
        }
    }
}
collState[_0x4ddc51(0x162)] = async function(_0x5bd04f, _0xfad880, _0xeb528b, _0x3cf89e, _0xe91c06, _0xfbd9e2) {
    const _0x3744f6 = _0x4ddc51;
    console[_0x3744f6(0x113)](_0xfbd9e2);
    if (geofs[_0x3744f6(0x15a)][_0x3744f6(0xef)][_0x3744f6(0x115)][0x2] > collData[_0xfad880][_0x3744f6(0xf4)]) {
        let _0x23ab3c = [];
        for (let _0x3a1437 = 0x0; _0x3a1437 < collData[_0xfad880][_0x3744f6(0x167)]['length']; _0x3a1437++) {
            _0x23ab3c[_0x3744f6(0x121)](classifyPointMain(_0xfad880, _0x3a1437));
        }
        let _0x52beac;
        for (let _0x2a19e3 = 0x0; _0x2a19e3 < _0x23ab3c[_0x3744f6(0x12a)]; _0x2a19e3++) {
            _0x23ab3c[_0x2a19e3] == -0x1 && _0x5bd04f == _0x3cf89e[_0x2a19e3] && (_0x52beac = !![]);
        }
        if (_0x52beac == !![]) {
            let _0x53872e = collData[_0xfad880][_0x3744f6(0x158)] / 0x3e8 * _0xfbd9e2,
                _0x288835 = _0xe91c06 / 0x3e8;
            for (let _0x24f298 = 0x0; _0x24f298 < 0x3e8; _0x24f298++) {
                for (let _0x341025 = 0x0; _0x341025 < geofs['objects'][_0x3744f6(0x16c)][_0xeb528b][_0x3744f6(0x105)][_0x3744f6(0x12a)]; _0x341025++) {
                    for (let _0x21b33c = 0x0; _0x21b33c < 0x3; _0x21b33c++) {
                        geofs[_0x3744f6(0x146)][_0x3744f6(0x16c)][_0xeb528b][_0x3744f6(0x105)][_0x341025][_0x21b33c][0x2] += _0x53872e, geofs[_0x3744f6(0x146)][_0x3744f6(0x154)]();
                    }
                }
                await sleep(_0x288835);
            }
            for (let _0x40eef5 = _0xeb528b - 0x4; _0x40eef5 < _0xeb528b; _0x40eef5++) {
                geofs[_0x3744f6(0x146)][_0x3744f6(0x16c)][_0x40eef5][_0x3744f6(0x105)][0x0][0x0][0x2] = -0x14, geofs[_0x3744f6(0x146)][_0x3744f6(0x16c)][_0x40eef5][_0x3744f6(0x105)][0x0][0x1][0x2] = -0x14, geofs[_0x3744f6(0x146)][_0x3744f6(0x16c)][_0x40eef5][_0x3744f6(0x105)][0x0][0x2][0x2] = -0x14, geofs[_0x3744f6(0x146)][_0x3744f6(0x16c)][_0x40eef5][_0x3744f6(0x105)][0x1][0x0][0x2] = -0x14, geofs['objects']['objectList'][_0x40eef5]['collisionTriangles'][0x1][0x1][0x2] = -0x14, geofs['objects']['objectList'][_0x40eef5][_0x3744f6(0x105)][0x1][0x2][0x2] = -0x14;
            }
            geofs[_0x3744f6(0x146)][_0x3744f6(0x154)]();
        }
    }
};

function resetWireCollisions(_0x4029df) {
    const _0x560302 = _0x4ddc51;
    let _0x4c7d00, _0x1807ed = _0x4029df[_0x560302(0x16f)];
    _0x4029df[_0x560302(0x15b)] == 0x1 ? _0x4c7d00 = -0x14 : _0x4c7d00 = 0x0, console['log'](_0x560302(0x10d) + _0x4c7d00);
    for (let _0x17e82b = _0x1807ed - 0x4; _0x17e82b < _0x1807ed; _0x17e82b++) {
        geofs['objects'][_0x560302(0x16c)][_0x17e82b][_0x560302(0x105)][0x0][0x0][0x2] = _0x4c7d00, geofs['objects']['objectList'][_0x17e82b]['collisionTriangles'][0x0][0x1][0x2] = _0x4c7d00, geofs[_0x560302(0x146)][_0x560302(0x16c)][_0x17e82b]['collisionTriangles'][0x0][0x2][0x2] = _0x4c7d00, geofs[_0x560302(0x146)][_0x560302(0x16c)][_0x17e82b][_0x560302(0x105)][0x1][0x0][0x2] = _0x4c7d00, geofs[_0x560302(0x146)][_0x560302(0x16c)][_0x17e82b][_0x560302(0x105)][0x1][0x1][0x2] = _0x4c7d00, geofs[_0x560302(0x146)][_0x560302(0x16c)][_0x17e82b][_0x560302(0x105)][0x1][0x2][0x2] = _0x4c7d00;
    }
    geofs['objects']['updateCollidables']();
}
window[_0x4ddc51(0x150)] = {};
let intervalCount = 0x0;
window[_0x4ddc51(0xfe)] = {};

function setPartAnimationDelta(_0x46f624) {
    const _0x4f6d54 = _0x4ddc51;
    _0x46f624['delta'] = _0x46f624[_0x4f6d54(0x139)] - _0x46f624[_0x4f6d54(0x15b)];
};

function animatePart(_0x1feba2, _0x1d9686) {
    const _0x5d9ec5 = _0x4ddc51;
    var _0x49d380 = _0x1feba2[_0x5d9ec5(0x139)];
    if (_0x1feba2['position'] != _0x49d380 && _0x1feba2[_0x5d9ec5(0x140)]) {
        _0x1feba2[_0x5d9ec5(0x15b)] += _0x1feba2['delta'] / (_0x1feba2[_0x5d9ec5(0x140)] / _0x1d9686);
        if (0x0 > _0x1feba2[_0x5d9ec5(0x159)] && _0x1feba2[_0x5d9ec5(0x15b)] <= _0x49d380) _0x1feba2[_0x5d9ec5(0x15b)] = _0x49d380, _0x1feba2[_0x5d9ec5(0x159)] = null, _0x1feba2[_0x5d9ec5(0x170)] = ![], _0x1feba2['movingCollision'] ? (_0x1feba2[_0x5d9ec5(0x190)] = ![], _0x1feba2[_0x5d9ec5(0x1a4)] ? resetWireCollisions(_0x1feba2) : null) : null;
        else 0x0 < _0x1feba2[_0x5d9ec5(0x159)] && _0x1feba2[_0x5d9ec5(0x15b)] >= _0x49d380 && (_0x1feba2['position'] = _0x49d380, _0x1feba2['delta'] = null, _0x1feba2[_0x5d9ec5(0x170)] = ![], _0x1feba2['movingCollision'] ? (_0x1feba2[_0x5d9ec5(0x190)] = ![], _0x1feba2[_0x5d9ec5(0x1a4)] ? resetWireCollisions(_0x1feba2) : null) : null);
    }
}

function animationHandler(_0x140de4, _0x5ef7eb) {
    const _0x42bfb7 = _0x4ddc51;
    let _0x3328e8 = nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x135)][_0x42bfb7(0x135)][_0x42bfb7(0x11d)](nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x11f)]),
        _0x4ab0ec = [nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x151)][0x0] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)], nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x151)][0x1] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)], nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x151)][0x2] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)]],
        _0x4a0c47 = [nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x10e)][0x0] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)], nodeState[_0x140de4][_0x5ef7eb]['rotation'][0x1] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)], nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x10e)][0x2] * nodeState[_0x140de4][_0x5ef7eb][_0x42bfb7(0x15b)]];
    geofs[_0x42bfb7(0x132)]['setNodeRotationTranslationScale'](_0x3328e8, M33['setFromEuler'](V3[_0x42bfb7(0xf0)](_0x4a0c47)), _0x4ab0ec, [0x1, 0x1, 0x1]);
}

function _0x80ea() {
    const _0x4654af = ['preProcessObjects', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=780,height=300,top=', 'sqrt', 'actualNodes', 'atan2', 'atan', 'indexOf', 'animation', '\x27)\x22>', 'insertBefore', '_lla', 'div', 'JBD', '2767956DGLzGd', 'tan', 'maritime', 'close', '</p>', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Addon-Handler/main/main.js', 'loadOnMap', 'movingCollision', 'loadModels', 'forEach', 'geofs-ui-left', '_billboard', 'applyCentralImpulse', 'createElement', 'blue', 'barKey', 'key', 'then', 'internalNodeHandlerMaritime', 'JBDAnglesPos', 'launchKey', 'includes', 'unloadModels', '8559698pCKFzG', '\x27)\x22>Toggle\x20Lights</button></p>', 'reset', 'inCarrierPlane', 'resetCollisions', 'apporachSpawn', 'splice', '<button\x20class=\x22center\x22\x20type=\x22button\x22\x20onclick=\x22turnLightOn(\x27', 'getElementById', 'winButtons', 'values', 'keypress', 'instance', 'toRadians', 'setup', 'max', '<style>\x0a\x20\x20\x20\x20\x20\x20\x20\x20.mdl-button{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20background:\x200\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20border:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20border-radius:\x202px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color:\x20#000;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20position:\x20relative;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height:\x2036px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20margin:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20min-width:\x2064px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20padding:\x200\x2016px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20display:\x20inline-block;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20\x22Roboto\x22,\x22Helvetica\x22,\x22Arial\x22,sans-serif;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2014px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20font-weight:\x20500;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text-transform:\x20uppercase;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20letter-spacing:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20overflow:\x20hidden;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20will-change:\x20box-shadow;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transition:\x20box-shadow\x20.2s\x20cubic-bezier(.4,0,1,1),background-color\x20.2s\x20cubic-bezier(.4,0,.2,1),color\x20.2s\x20cubic-bezier(.4,0,.2,1);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20outline:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20cursor:\x20pointer;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text-decoration:\x20none;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20line-height:\x2036px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vertical-align:\x20middle;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20.center\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20verdana;\x0a\x20\x20\x20\x20\x20\x20\x20\x20display:\x20center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20</style>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20', 'refAlt', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/json%20files/collisionSettings.json', 'collState', '3460', '</p>\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22mdl-button\x22\x20mdl-js-button\x20mdl-button—raised\x20mdl-button—colored\x20onclick=\x22loadOnMap()\x22\x20data-upgraded=\x22,MaterialButton\x22>Get\x20direction\x20to\x20structure</button>\x0a\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22mdl-button\x22\x20mdl-js-button\x20mdl-button—raised\x20mdl-button—colored\x20onclick=\x22runwaySpawn()\x22\x20data-upgraded=\x22,MaterialButton\x22>Spawn\x20on\x20location</button>\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22mdl-button\x22\x20mdl-js-button\x20mdl-button—raised\x20mdl-button—colored\x20onclick=\x22apporachSpawn()\x22\x20data-upgraded=\x22,MaterialButton\x22>Spawn\x20on\x20approach</button>\x0a\x20\x20\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22mdl-button\x22\x20mdl-js-button\x20mdl-button—raised\x20mdl-button—colored\x20onclick=\x22openWindow()\x22\x20data-upgraded=\x22,MaterialButton\x22>Open\x20Object\x20Settings</button>\x0a\x20\x20</ul>', 'down', 'whitepapi', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/json%20files/buildingsLoc.json', 'planeID', 'structureSelect', 'modelLocs', '<label\x20for=\x22parkourSelect\x22>Choose\x20a\x20structure:</label><select\x20name=\x22structureSelect\x22\x20id=\x22structureSelect\x22>', 'parse', 'random', 'lights', 'bottom', '38096kNbTeG', 'collisionTriangles', 'flyTo', 'v_angularVelocity', 'cos', '<button\x20class=\x22mdl-button\x20mdl-js-button\x20geofs-f-standard-ui\x20geofs-mediumScreenOnly\x22\x20data-toggle-panel=\x22.geofs-carriers-list\x22\x20data-tooltip-classname=\x22mdl-tooltip--top\x22\x20id=\x22landButton\x22\x20tabindex=\x220\x22\x20data-upgraded=\x22,MaterialButton\x22>Geo-FS\x20Maritime\x20Structures</button>', 'stopCreatePath', 'carriers', 'getElementsByClassName', 'ressetting\x20wires\x20', 'rotation', 'JBDTouch', 'launchBarDown', '61209LCPDeV', 'rigidBody', 'log', 'aircraftRecord', 'llaLocation', 'barDown', 'turnLightOn', 'runwaySpawn', 'barLocked', 'cg57', '2032075MJBKXx', '3960tMonev', 'getNode', 'lockKey', 'name', '1102381ODSJzG', 'push', 'actualCatPos', 'jbd', 'mass', 'min', 'json', 'touchNodes', 'add', 'lightsPosition', 'length', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/images/launch%20bar%20down.png', 'Failed\x20to\x20load\x20handling\x20script,\x20please\x20try\x20again\x20or\x20reload.\x20If\x20this\x20problem\x20persists,\x20contact\x20Elon.', 'undefined', 'width', 'reverse', 'mainData', 'locationIndex', 'api', 'setLocation', 'light', 'model', 'setAngularVelocity', 'innerHTML', '<button\x20class=\x22center\x22\x20type=\x22button\x22\x20onclick=\x22elevator(', 'positionTarget', 'animatable', 'null', 'addons', 'positions', 'collision', 'readyToLaunch', 'time', 'orange', 'longitude', 'definitions', 'openWindow', 'square', 'objects', 'instruments', '<ul\x20class=\x22geofs-list\x20geofs-toggle-panel\x20geofs-carriers-list\x20geofs-preferences\x22\x20data-noblur=\x22true\x22\x20data-onshow=\x22{geofs.initializePreferencesPanel()}\x22\x20data-onhide=\x22{geofs.savePreferencesPanel()}\x22>\x0a\x20\x20\x20\x20<style>\x0a\x20\x20\x20\x20\x20\x20#MainDIV\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20\x20\x20\x20\x20left:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20top:\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20background-color:\x20#fff;\x0a\x20\x20\x20\x20\x20\x20\x20\x20text-align:\x20left;\x0a\x20\x20\x20\x20\x20\x20\x20\x20padding:\x200\x200\x200\x2010px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-top:\x202px;\x0a\x20\x20\x20\x20\x20\x20\x20\x20margin-bottom:\x202px\x0a\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20table,\x0a\x20\x20\x20\x20\x20\x20td,\x0a\x20\x20\x20\x20\x20\x20th\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20border:\x201px\x20solid\x20#000\x0a\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20#DIVtitle\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20color:\x20#000;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-family:\x20Helvetica,\x20Arial,\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20\x20\x20font-size:\x2020px\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20</style>\x0a\x20\x20\x20\x20<div\x20id=\x22MainDIV\x22>\x0a\x20\x20\x20\x20\x20\x20<p\x20id=\x22DIVtitle\x22>Geo-FS\x20Extra\x20Maritime\x20structures</p>\x0a\x20\x20\x20\x20\x20\x20</p>', 'map', 'sin', 'setVisibility', 'landButton', 'lockInt', 'init', 'catLlas', 'intervals', 'location', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/images/ready%20to%20launch.png', 'JBDName', 'updateCollidables', 'show', 'value', 'gear', 'alt', 'delta', 'aircraft', 'position', ',left=', 'vinson', 'truman', '48QpXZqF', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/lights/lights.json', '2581', 'collisionsMove', 'destroy', 'entries', 'heading360', 'setLinearVelocity', 'elevatorSquares', 'carrierPlaneIds', 'easeOutQuart', 'camera', 'document', 'objectList', 'collAlt', 'height', 'carrierIndex', 'moving', 'buttonPressed', 'whitesmoke', 'geofs-ui-bottom', '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Extra-Maritime-Structures/main/json%20files/buildings.json', 'latitude', 'positionReadable', 'angle', 'animateMain', '1251516VQvfLS', 'redpapi'];
    _0x80ea = function() {
        return _0x4654af;
    };
    return _0x80ea();
}

function collisionHandler(_0x298951, _0x38b79a) {
    const _0x11e828 = _0x4ddc51;
    let _0x36a66e = nodeState[_0x298951][_0x38b79a][_0x11e828(0x16f)];
    if (geofs['aircraft'][_0x11e828(0xef)][_0x11e828(0x115)][0x2] > collData[_0x298951]['refAlt'] && nodeState[_0x298951][_0x38b79a][_0x11e828(0x177)] == _0x11e828(0xf9) || geofs[_0x11e828(0x15a)][_0x11e828(0xef)]['llaLocation'][0x2] < collData[_0x298951][_0x11e828(0xf4)] && nodeState[_0x298951][_0x38b79a][_0x11e828(0x177)] == 'up' || nodeState[_0x298951][_0x38b79a][_0x11e828(0x190)] == !![]) {
        let _0x1fda12 = [];
        for (let _0x4f0d75 = 0x0; _0x4f0d75 < collData[_0x298951][_0x11e828(0x167)][_0x11e828(0x12a)]; _0x4f0d75++) {
            _0x1fda12['push'](classifyPointMain(_0x298951, _0x4f0d75));
        }
        let _0x383817, _0xd8361f = collData[_0x298951][_0x11e828(0x127)][_0x11e828(0x182)](_0x38b79a);
        if (_0x1fda12[_0xd8361f] == -0x1 || nodeState[_0x298951][_0x38b79a][_0x11e828(0x190)] == !![]) {
            nodeState[_0x298951][_0x38b79a]['movingCollision'] = !![];
            for (let _0x4a08b2 = 0x0; _0x4a08b2 < geofs[_0x11e828(0x146)][_0x11e828(0x16c)][_0x36a66e]['collisionTriangles'][_0x11e828(0x12a)]; _0x4a08b2++) {
                for (let _0x40de01 = 0x0; _0x40de01 < 0x3; _0x40de01++) {
                    geofs['objects']['objectList'][_0x36a66e][_0x11e828(0x105)][_0x4a08b2][_0x40de01][0x2] = nodeState[_0x298951][_0x38b79a][_0x11e828(0x16d)] + nodeState[_0x298951][_0x38b79a]['position'] * nodeState[_0x298951][_0x38b79a][_0x11e828(0x158)], geofs[_0x11e828(0x146)][_0x11e828(0x154)]();
                }
            }
        }
    }
}
window[_0x4ddc51(0x179)] = function(_0x25d541) {
    Object['entries'](nodeState)['forEach'](([_0x4de47a, _0x44d47b]) => {
        const _0x2e2d3a = _0x3bca;
        Object[_0x2e2d3a(0x164)](nodeState[_0x4de47a])['forEach'](([_0xa10e21, _0x2ed91d]) => {
            const _0xfa73b0 = _0x2e2d3a;
            _0x2ed91d[_0xfa73b0(0x13a)] ? (animatePart(_0x2ed91d, _0x25d541), animationHandler(_0x4de47a, _0xa10e21), _0x2ed91d[_0xfa73b0(0x13e)] ? collisionHandler(_0x4de47a, _0xa10e21) : null) : null;
        });
    });
};
let constTime = 0.05;

function changeWires(_0x19a3a3, _0x635fc9) {
    const _0x33efd4 = _0x4ddc51;
    for (let _0x20e568 = _0x635fc9 - 0x4; _0x20e568 < _0x635fc9; _0x20e568++) {
        geofs[_0x33efd4(0x146)][_0x33efd4(0x16c)][_0x20e568][_0x33efd4(0x105)][0x0][0x0][0x2] += 0x32 * _0x19a3a3, geofs[_0x33efd4(0x146)][_0x33efd4(0x16c)][_0x20e568]['collisionTriangles'][0x0][0x1][0x2] += 0x32 * _0x19a3a3, geofs[_0x33efd4(0x146)][_0x33efd4(0x16c)][_0x20e568]['collisionTriangles'][0x0][0x2][0x2] += 0x32 * _0x19a3a3, geofs['objects']['objectList'][_0x20e568][_0x33efd4(0x105)][0x1][0x0][0x2] += 0x32 * _0x19a3a3, geofs[_0x33efd4(0x146)][_0x33efd4(0x16c)][_0x20e568][_0x33efd4(0x105)][0x1][0x1][0x2] += 0x32 * _0x19a3a3, geofs['objects'][_0x33efd4(0x16c)][_0x20e568][_0x33efd4(0x105)][0x1][0x2][0x2] += 0x32 * _0x19a3a3;
    }
    geofs[_0x33efd4(0x146)][_0x33efd4(0x154)]();
}

function sleep(_0x306de3) {
    return new Promise(_0x463446 => setTimeout(_0x463446, _0x306de3));
}

function classifyPointMain(_0x4f1c05, _0xdac25d) {
    const _0x12571c = _0x4ddc51;
    let _0x1ac08e = geofs[_0x12571c(0x146)]['objectList'][0x4][_0x12571c(0x151)],
        _0x3baf02 = geofs[_0x12571c(0x15a)][_0x12571c(0xef)][_0x12571c(0x115)],
        _0x329215 = latLonToMercator(_0x1ac08e[0x0], _0x1ac08e[0x1]),
        _0xcbf270 = latLonToMercator(_0x3baf02[0x0], _0x3baf02[0x1]),
        _0x357396 = _0xcbf270[0x0] - _0x329215[0x0],
        _0x2b8d35 = _0xcbf270[0x1] - _0x329215[0x1];
    return classifyPoint(collData[_0x4f1c05]['elevatorSquares'][_0xdac25d], [-_0x357396, _0x2b8d35]);
}

function classifyPoint(_0x50d148, _0x5974ed) {
    const _0x2a09bc = _0x4ddc51;
    var _0x9f626e = _0x5974ed[0x0],
        _0x244e63 = _0x5974ed[0x1],
        _0x24889f = _0x50d148[_0x2a09bc(0x12a)],
        _0x575ee3 = 0x1,
        _0x5ad482 = _0x24889f;
    for (var _0x47a35b = 0x0, _0x456c41 = _0x24889f - 0x1; _0x47a35b < _0x5ad482; _0x456c41 = _0x47a35b++) {
        var _0x49b7c0 = _0x50d148[_0x47a35b],
            _0x4c9231 = _0x50d148[_0x456c41],
            _0x1de2c9 = _0x49b7c0[0x1],
            _0x1a549c = _0x4c9231[0x1];
        if (_0x1a549c < _0x1de2c9) {
            if (_0x1a549c < _0x244e63 && _0x244e63 < _0x1de2c9) {
                var _0x44519f = orientation3(_0x49b7c0, _0x4c9231, _0x5974ed);
                if (_0x44519f === 0x0) return 0x0;
                else _0x575ee3 ^= 0x0 < _0x44519f | 0x0;
            } else {
                if (_0x244e63 === _0x1de2c9) {
                    var _0x110925 = _0x50d148[(_0x47a35b + 0x1) % _0x24889f],
                        _0x5af152 = _0x110925[0x1];
                    if (_0x1de2c9 < _0x5af152) {
                        var _0x44519f = orientation3(_0x49b7c0, _0x4c9231, _0x5974ed);
                        if (_0x44519f === 0x0) return 0x0;
                        else _0x575ee3 ^= 0x0 < _0x44519f | 0x0;
                    }
                }
            }
        } else {
            if (_0x1de2c9 < _0x1a549c) {
                if (_0x1de2c9 < _0x244e63 && _0x244e63 < _0x1a549c) {
                    var _0x44519f = orientation3(_0x49b7c0, _0x4c9231, _0x5974ed);
                    if (_0x44519f === 0x0) return 0x0;
                    else _0x575ee3 ^= _0x44519f < 0x0 | 0x0;
                } else {
                    if (_0x244e63 === _0x1de2c9) {
                        var _0x110925 = _0x50d148[(_0x47a35b + 0x1) % _0x24889f],
                            _0x5af152 = _0x110925[0x1];
                        if (_0x5af152 < _0x1de2c9) {
                            var _0x44519f = orientation3(_0x49b7c0, _0x4c9231, _0x5974ed);
                            if (_0x44519f === 0x0) return 0x0;
                            else _0x575ee3 ^= _0x44519f < 0x0 | 0x0;
                        }
                    }
                }
            } else {
                if (_0x244e63 === _0x1de2c9) {
                    var _0x40b0c1 = Math[_0x2a09bc(0x125)](_0x49b7c0[0x0], _0x4c9231[0x0]),
                        _0xae5f26 = Math[_0x2a09bc(0xf2)](_0x49b7c0[0x0], _0x4c9231[0x0]);
                    if (_0x47a35b === 0x0) {
                        while (_0x456c41 > 0x0) {
                            var _0x616a39 = (_0x456c41 + _0x24889f - 0x1) % _0x24889f,
                                _0x339e9f = _0x50d148[_0x616a39];
                            if (_0x339e9f[0x1] !== _0x244e63) break;
                            var _0x431afc = _0x339e9f[0x0];
                            _0x40b0c1 = Math[_0x2a09bc(0x125)](_0x40b0c1, _0x431afc), _0xae5f26 = Math[_0x2a09bc(0xf2)](_0xae5f26, _0x431afc), _0x456c41 = _0x616a39;
                        }
                        if (_0x456c41 === 0x0) {
                            if (_0x40b0c1 <= _0x9f626e && _0x9f626e <= _0xae5f26) return 0x0;
                            return 0x1;
                        }
                        _0x5ad482 = _0x456c41 + 0x1;
                    }
                    var _0xcf42c9 = _0x50d148[(_0x456c41 + _0x24889f - 0x1) % _0x24889f][0x1];
                    while (_0x47a35b + 0x1 < _0x5ad482) {
                        var _0x339e9f = _0x50d148[_0x47a35b + 0x1];
                        if (_0x339e9f[0x1] !== _0x244e63) break;
                        var _0x431afc = _0x339e9f[0x0];
                        _0x40b0c1 = Math[_0x2a09bc(0x125)](_0x40b0c1, _0x431afc), _0xae5f26 = Math['max'](_0xae5f26, _0x431afc), _0x47a35b += 0x1;
                    }
                    if (_0x40b0c1 <= _0x9f626e && _0x9f626e <= _0xae5f26) return 0x0;
                    var _0xcd95ee = _0x50d148[(_0x47a35b + 0x1) % _0x24889f][0x1];
                    _0x9f626e < _0x40b0c1 && _0xcf42c9 < _0x244e63 !== _0xcd95ee < _0x244e63 && (_0x575ee3 ^= 0x1);
                }
            }
        }
    }
    return 0x2 * _0x575ee3 - 0x1;
}

function orientation3(_0xa9891b, _0x2487c9, _0xc8c74c) {
    var _0x4f8049 = (_0xa9891b[0x1] - _0xc8c74c[0x1]) * (_0x2487c9[0x0] - _0xc8c74c[0x0]),
        _0x1f52cd = (_0xa9891b[0x0] - _0xc8c74c[0x0]) * (_0x2487c9[0x1] - _0xc8c74c[0x1]),
        _0x52e6d3 = _0x4f8049 - _0x1f52cd,
        _0x484213;
    if (_0x4f8049 > 0x0) {
        if (_0x1f52cd <= 0x0) return _0x52e6d3;
        else _0x484213 = _0x4f8049 + _0x1f52cd;
    } else {
        if (_0x4f8049 < 0x0) {
            if (_0x1f52cd >= 0x0) return _0x52e6d3;
            else _0x484213 = -(_0x4f8049 + _0x1f52cd);
        } else return _0x52e6d3;
    }
    var _0x3329df = ERRBOUND3 * _0x484213;
    if (_0x52e6d3 >= _0x3329df || _0x52e6d3 <= -_0x3329df) return _0x52e6d3;
}

function initInstruments() {
    const _0x8d8d33 = _0x4ddc51;
    instruments[_0x8d8d33(0x143)][_0x8d8d33(0x110)] = {
        'overlay': {
            'url': _0x8d8d33(0x12b),
            'alignment': {
                'x': 'right',
                'y': 'bottom'
            },
            'size': {
                'x': 0x64,
                'y': 0x15
            },
            'position': {
                'x': 0x64,
                'y': 0xff
            },
            'anchor': {
                'x': 0x64,
                'y': 0x0
            },
            'rescale': !0x0,
            'rescalePosition': !0x0,
            'animations': [{
                'type': _0x8d8d33(0x155),
                'value': _0x8d8d33(0x110)
            }]
        }
    }, instruments['definitions']['readyToLaunch'] = {
        'overlay': {
            'url': _0x8d8d33(0x152),
            'alignment': {
                'x': 'right',
                'y': _0x8d8d33(0x103)
            },
            'size': {
                'x': 0x64,
                'y': 0x15
            },
            'position': {
                'x': 0x64,
                'y': 0xeb
            },
            'anchor': {
                'x': 0x64,
                'y': 0x0
            },
            'rescale': !0x0,
            'rescalePosition': !0x0,
            'animations': [{
                'type': _0x8d8d33(0x155),
                'value': _0x8d8d33(0x13f)
            }]
        }
    };
    var _0x5ad14d = instruments['init'];
    instruments['init'] = function(_0x54e35f) {
        const _0x5dc739 = _0x8d8d33;
        let _0x390975 = ['7', _0x5dc739(0x161), _0x5dc739(0xf7)];
        void 0x0 !== _0x54e35f['gear'] || _0x390975[_0x5dc739(0x19e)](geofs[_0x5dc739(0x15a)][_0x5dc739(0xef)][_0x5dc739(0x114)]['id']) ? (enabled = !0x0, _0x54e35f[_0x5dc739(0x110)] = _0x54e35f[_0x5dc739(0x157)]) : enabled = void 0x0, _0x5ad14d(_0x54e35f), _0x390975 = ['7', _0x5dc739(0x161), _0x5dc739(0xf7)], (void 0x0 !== _0x54e35f[_0x5dc739(0x157)] || _0x390975[_0x5dc739(0x19e)](geofs[_0x5dc739(0x15a)]['instance'][_0x5dc739(0x114)]['id']) ? (enabled = !0x0, _0x54e35f[_0x5dc739(0x13f)] = _0x54e35f[_0x5dc739(0x157)]) : enabled = void 0x0, _0x5ad14d(_0x54e35f));
    }, instruments[_0x8d8d33(0x14e)](geofs['aircraft'][_0x8d8d33(0xef)]['setup'][_0x8d8d33(0x147)]);
}
let catapult = {};
catapult[_0x4ddc51(0x14f)] = catapultData[_0x4ddc51(0x14f)], catapult['angle'] = catapultData['angle'], catapult[_0x4ddc51(0x122)] = catapult[_0x4ddc51(0x14f)], catapult[_0x4ddc51(0x168)] = ['7', _0x4ddc51(0x161), '3460'], catapult['barDown'] = ![], catapult['barLocked'] = ![], catapult[_0x4ddc51(0x198)] = 'q', catapult[_0x4ddc51(0x19d)] = 'l', catapult[_0x4ddc51(0x11e)] = '/', catapult[_0x4ddc51(0x14d)], catapult[_0x4ddc51(0x1a3)] = ![], catapult[_0x4ddc51(0xfc)];

function gearBarPosLock() {
    const _0x3a65b7 = _0x4ddc51;
    catapult[_0x3a65b7(0x119)] && (geofs['aircraft'][_0x3a65b7(0xef)][_0x3a65b7(0x112)][_0x3a65b7(0x166)]([0x0, 0x0, 0x0]), geofs[_0x3a65b7(0x15a)][_0x3a65b7(0xef)]['rigidBody'][_0x3a65b7(0x136)]([0x0, 0x0, 0x0]));
}

function resolveForceVector(_0x2a6d58, _0x5a399b) {
    const _0x4698c2 = _0x4ddc51;
    let _0x520825 = _0x2a6d58 * Math[_0x4698c2(0x108)](_0x5a399b * (Math['PI'] / 0xb4)),
        _0x17a5e9 = _0x2a6d58 * Math['sin'](_0x5a399b * (Math['PI'] / 0xb4));
    return [_0x520825, _0x17a5e9, 0x0];
}

function distance(_0x375762, _0x1d4eb3) {
    const _0x410adf = _0x4ddc51;
    var _0x4dbd93 = _0x1d4eb3[0x0] - _0x375762[0x0],
        _0x354846 = _0x1d4eb3[0x1] - _0x375762[0x1];
    return Math[_0x410adf(0x17e)](_0x4dbd93 * _0x4dbd93 + _0x354846 * _0x354846) * 0x186a0;
}

function checkCarrier() {
    const _0x1e3b68 = _0x4ddc51;
    catapult[_0x1e3b68(0x168)][_0x1e3b68(0x19e)](geofs[_0x1e3b68(0x15a)][_0x1e3b68(0xef)]['id']) ? (catapult[_0x1e3b68(0x1a3)] = !![], catapult[_0x1e3b68(0xfc)] = geofs[_0x1e3b68(0x15a)][_0x1e3b68(0xef)]['id']) : catapult['inCarrierPlane'] = ![];
}
window[_0x4ddc51(0x171)] = ![];
async function buttonHasBeenPressed() {
    buttonPressed = !![], await sleep(0xfa), buttonPressed = ![];
}

function catapultMain() {
    const _0x35e1b0 = _0x4ddc51;
    document['addEventListener'](_0x35e1b0(0xee), async function _0x4e18d7(_0x5c675b) {
        const _0x2606be = _0x35e1b0;
        if (catapult[_0x2606be(0x1a3)] == !![] && buttonPressed == ![]) {
            buttonHasBeenPressed();
            _0x5c675b[_0x2606be(0x199)] === catapult['barKey'] && (catapult[_0x2606be(0x116)] ? (catapult['barDown'] = ![], geofs[_0x2606be(0x183)][_0x2606be(0xed)][_0x2606be(0x110)] = 0x0) : geofs[_0x2606be(0x183)][_0x2606be(0xed)]['groundContact'] == 0x1 && (catapult[_0x2606be(0x116)] = !![], geofs[_0x2606be(0x183)][_0x2606be(0xed)]['launchBarDown'] = 0x1), await sleep(0xfa));
            if (_0x5c675b[_0x2606be(0x199)] === catapult[_0x2606be(0x11e)]) {
                if (catapult['barLocked']) catapult[_0x2606be(0x119)] = ![], geofs[_0x2606be(0x183)][_0x2606be(0xed)]['readyToLaunch'] = 0x0, clearInterval(catapult[_0x2606be(0x14d)]);
                else {
                    let _0x33953c;
                    catapult[_0x2606be(0x14f)][catapult[_0x2606be(0xfc)]][_0x2606be(0x192)](async function(_0x4d3c84, _0x54b413) {
                        const _0x1a0842 = _0x2606be;
                        distance(geofs[_0x1a0842(0x15a)][_0x1a0842(0xef)][_0x1a0842(0x115)], _0x4d3c84) < 0x3 && geofs[_0x1a0842(0x183)]['values']['heading360'] < catapult['angle'][_0x54b413] + 0x5 && geofs['animation']['values'][_0x1a0842(0x165)] > catapult[_0x1a0842(0x178)][_0x54b413] - 0x5 && catapult[_0x1a0842(0x116)] == !![] && (geofs[_0x1a0842(0x106)]([catapult[_0x1a0842(0x14f)][catapult[_0x1a0842(0xfc)]][_0x54b413][0x0], catapult['catLlas'][catapult[_0x1a0842(0xfc)]][_0x54b413][0x1], 0x0, catapult[_0x1a0842(0x178)][_0x54b413]]), await sleep(0xfa), geofs[_0x1a0842(0x16a)][_0x1a0842(0x1a2)](), catapult[_0x1a0842(0x119)] = !![], geofs['animation']['values'][_0x1a0842(0x13f)] = 0x1, catapult[_0x1a0842(0x14d)] = setInterval(function() {
                            gearBarPosLock();
                        }));
                    });
                }
            }
            if (_0x5c675b[_0x2606be(0x199)] === catapult['launchKey']) {
                if (catapult[_0x2606be(0x119)] && geofs[_0x2606be(0x183)]['values']['throttle'] == 0x1) {
                    clearInterval(catapult['lockInt']), catapult['barLocked'] = ![], catapult[_0x2606be(0x116)] = ![], geofs[_0x2606be(0x183)][_0x2606be(0xed)][_0x2606be(0x110)] = 0x0, geofs['animation'][_0x2606be(0xed)]['readyToLaunch'] = 0x0, geofs['aircraft'][_0x2606be(0xef)][_0x2606be(0x112)]['reset']();
                    var _0x4403ec = geofs[_0x2606be(0x15a)]['instance'][_0x2606be(0x112)][_0x2606be(0x124)] * 0xa;
                    let _0x1a8f97 = new geofs['fx']['ParticleEmitter']({
                            'anchor': {
                                'worldPosition': [0x0, 0x0, -0x1]
                            },
                            'duration': 0x186a0,
                            'rate': 0.05,
                            'life': 0x9c40,
                            'easing': _0x2606be(0x169),
                            'startScale': 0.0005,
                            'endScale': 0.0005,
                            'randomizeStartScale': 0.05,
                            'randomizeEndScale': 0.15,
                            'startOpacity': 0.9,
                            'endOpacity': 0.00001,
                            'startRotation': _0x2606be(0x101),
                            'texture': _0x2606be(0x172)
                        }),
                        _0x483cf6 = setInterval(function() {
                            const _0xfef7cb = _0x2606be;
                            geofs[_0xfef7cb(0x183)][_0xfef7cb(0xed)]['groundContact'] == 0x1 ? geofs[_0xfef7cb(0x15a)]['instance'][_0xfef7cb(0x112)][_0xfef7cb(0x195)]([resolveForceVector(_0x4403ec, geofs[_0xfef7cb(0x183)]['values'][_0xfef7cb(0x165)])[0x1], resolveForceVector(_0x4403ec, geofs['animation'][_0xfef7cb(0xed)][_0xfef7cb(0x165)])[0x0], resolveForceVector(_0x4403ec, geofs[_0xfef7cb(0x183)][_0xfef7cb(0xed)][_0xfef7cb(0x165)])[0x2]]) : (clearInterval(_0x483cf6), _0x1a8f97[_0xfef7cb(0x163)]());
                        }, 0xc8);
                }
            }
        }
    });
}

function remainGroundContact() {
    const _0xcd3919 = _0x4ddc51;
    while (geofs['animation']['values']['groundContact'] == 0x1) {
        geofs[_0xcd3919(0x15a)][_0xcd3919(0xef)]['rigidBody'][_0xcd3919(0x107)][0x1] = -0x1;
    }
}

function inverseMercator(_0x569297, _0x26726a) {
    const _0x1e0f0a = _0x4ddc51;
    let _0x4b6745 = _0x569297 / 20037508.34 * 0xb4,
        _0xcc23bf = _0x26726a / 20037508.34 * 0xb4;
    return _0xcc23bf = 0xb4 / Math['PI'] * (0x2 * Math[_0x1e0f0a(0x181)](Math['exp'](_0xcc23bf * Math['PI'] / 0xb4)) - Math['PI'] / 0x2), {
        'lat': _0xcc23bf,
        'lon': _0x4b6745
    };
}

function getGeoCoords(_0x1e25aa, _0x301e45, _0x4f5324, _0x5ea169) {
    let _0x1d1cff = _0x301e45 * 20037508.34 / 0xb4,
        _0x1dd5b6 = Math['log'](Math['tan']((0x5a + _0x1e25aa) * Math['PI'] / 0x168)) / (Math['PI'] / 0xb4);
    _0x1dd5b6 = _0x1dd5b6 * 20037508.34 / 0xb4;
    let _0x5be6dc = _0x4f5324 - _0x1d1cff,
        _0x30a00a = _0x5ea169 - _0x1dd5b6,
        {
            lat: _0xf6cd79,
            lon: _0x6a1ea1
        } = inverseMercator(_0x5be6dc, _0x30a00a);
    return {
        'lat': _0xf6cd79,
        'lon': _0x6a1ea1
    };
}

function startLights() {}
let lightName;
window['lightAlt'];

function checkForLights() {
    const _0x10811 = _0x4ddc51;
    for (let _0x4c5248 = 0x0; _0x4c5248 < geofs[_0x10811(0x146)][_0x10811(0x16c)][_0x10811(0x12a)]; _0x4c5248++) {
        geofs[_0x10811(0x146)][_0x10811(0x16c)][_0x4c5248][_0x10811(0x11f)] && spawnLights(geofs[_0x10811(0x146)][_0x10811(0x16c)][_0x4c5248][_0x10811(0x11f)]);
    }
}

function spawnLights(_0x1c6ce8) {
    const _0x564988 = _0x4ddc51;
    if (_0x1c6ce8 in lightData) {
        if (_0x1c6ce8 !== lightName) {
            despawnLights();
            for (let _0x22afee = 0x0; _0x22afee < colors['length']; _0x22afee++) {
                for (let _0x1e15b5 = 0x0; _0x1e15b5 < lightData[_0x1c6ce8][colors[_0x22afee]][_0x564988(0x12a)]; _0x1e15b5++) {
                    let _0x55b3d4 = [];
                    _0x55b3d4 = rotatePoint(0x0, 0x0, lightData[_0x1c6ce8][colors[_0x22afee]][_0x1e15b5][0x0], lightData[_0x1c6ce8][colors[_0x22afee]][_0x1e15b5][0x1], lightData[_0x1c6ce8][_0x564988(0x178)]), _0x55b3d4[0x2] = lightData[_0x1c6ce8][colors[_0x22afee]][_0x1e15b5][0x2];
                    let _0x39bc83 = getBuildingPosition(_0x1c6ce8),
                        _0x156e0a = buildings[_0x39bc83][_0x564988(0x151)];
                    var _0x1ba0ec = V3['add'](_0x156e0a, xyz2lla(_0x55b3d4, _0x156e0a));
                    lights[_0x564988(0x121)](new geofs['fx'][(_0x564988(0x134))](_0x1ba0ec, colors[_0x22afee], lightSettings)), lightAlt = lightData[_0x1c6ce8][colors[_0x22afee]][_0x1e15b5][0x2];
                }
            }
            lightName = _0x1c6ce8, hideLights(), adjustLightAlt();
        }
    }
}

function adjustLightAlt() {
    const _0x20e613 = _0x4ddc51;
    for (let _0x42d346 = 0x0; _0x42d346 < lights[_0x20e613(0x12a)]; _0x42d346++) {
        lights[_0x42d346][_0x20e613(0x133)]([lights[_0x42d346][_0x20e613(0x194)][_0x20e613(0x186)][0x0], lights[_0x42d346][_0x20e613(0x194)]['_lla'][0x1], lightAlt]);
    }
}

function despawnLights() {
    const _0x2f39ff = _0x4ddc51;
    for (let _0x117803 = 0x0; _0x117803 < lights[_0x2f39ff(0x12a)]; _0x117803++) {
        lights[_0x117803][_0x2f39ff(0x163)]();
    }
    lights = [];
}

function hideLights() {
    const _0x15b3c8 = _0x4ddc51;
    for (let _0x2bc293 = 0x0; _0x2bc293 < lights[_0x15b3c8(0x12a)]; _0x2bc293++) {
        lights[_0x2bc293][_0x15b3c8(0x14b)](![]);
    }
}

function showLights() {
    const _0x302e31 = _0x4ddc51;
    for (let _0x2c6c8e = 0x0; _0x2c6c8e < lights[_0x302e31(0x12a)]; _0x2c6c8e++) {
        lights[_0x2c6c8e][_0x302e31(0x14b)](!![]);
    }
}

function checkIfNight() {
    geofs['isNight'] == !![] ? showLights() : hideLights();
}

function getBuildingPosition(_0x404c82) {
    const _0x16147f = _0x4ddc51;
    for (let _0x360786 = 0x0; _0x360786 < buildings[_0x16147f(0x12a)]; _0x360786++) {
        if (buildings[_0x360786]['name'] === _0x404c82) return _0x360786;
    }
}

function rotatePoint(_0x214597, _0x57840a, _0x4f341e, _0x4e60dd, _0x1190d4) {
    const _0xa60ab9 = _0x4ddc51;
    let _0x16b1b2 = (_0x4f341e - _0x214597) * Math[_0xa60ab9(0x108)](toRadians(_0x1190d4)) - (_0x4e60dd - _0x57840a) * Math['sin'](toRadians(_0x1190d4)) + _0x214597,
        _0x284569 = (_0x4f341e - _0x214597) * Math[_0xa60ab9(0x14a)](toRadians(_0x1190d4)) + (_0x4e60dd - _0x57840a) * Math[_0xa60ab9(0x108)](toRadians(_0x1190d4)) + _0x57840a;
    return [_0x16b1b2, _0x284569];
}

function toRadians(_0x5bceeb) {
    return _0x5bceeb * Math['PI'] / 0xb4;
}
let itv = setInterval(function() {
        try {
            window['ui'] && window['flight'] && (main(), spawnHTML(), secondMain(), startLights(), clearInterval(itv));
        } catch (_0x2349ed) {}
    }, 0x1f4),
    itv5 = setInterval(function() {
        const _0x31c762 = _0x4ddc51;
        try {
            geofs[_0x31c762(0x15a)][_0x31c762(0xef)][_0x31c762(0xf1)]['instruments'] && (initInstruments(), clearInterval(itv5));
        } catch (_0x38bbd2) {}
    }, 0x1f4);
window[_0x4ddc51(0x1a9)] = {};

function getHTMLForWindow() {
    const _0x44cf86 = _0x4ddc51;
    let _0x2d9178 = document[_0x44cf86(0x1a8)](_0x44cf86(0xfd))['value'];
    if (_0x2d9178 != 0x0 && _0x2d9178 != 0x7 && _0x2d9178 != 0xa) {
        _0x2d9178 = listData[_0x2d9178][_0x44cf86(0x11f)];
        let _0x48a38a = '';
        _0x2d9178 in lightData ? _0x48a38a += _0x44cf86(0x1a7) + _0x2d9178 + _0x44cf86(0x1a1) : _0x48a38a += '';
        if (collData['carriers']['includes'](_0x2d9178)) {
            for (let _0x256458 = 0x0; _0x256458 < collData[_0x2d9178]['actualNodes'][_0x44cf86(0x12a)]; _0x256458++) {
                _0x48a38a += _0x44cf86(0x138) + _0x256458 + ',\x27' + _0x2d9178 + _0x44cf86(0x184) + collData[_0x2d9178][_0x44cf86(0x15b)][_0x256458] + '</button>';
            }
            _0x48a38a += _0x44cf86(0x18d);
            for (let _0x21df80 = 0x0; _0x21df80 < collData[_0x2d9178][_0x44cf86(0x10f)][_0x44cf86(0x12a)]; _0x21df80++) {
                _0x48a38a += '<button\x20class=\x22center\x22\x20type=\x22button\x22\x20onclick=\x22jbd(' + _0x21df80 + ',\x20\x27' + _0x2d9178 + _0x44cf86(0x184) + collData[_0x2d9178][_0x44cf86(0x153)][_0x21df80] + '</button>';
            }
        }
        return _0x48a38a;
    }
}
let winObject;
window[_0x4ddc51(0x144)] = function() {
    const _0x349381 = _0x4ddc51;
    console[_0x349381(0x113)]('window');
    winObject != void 0x0 && winObject[_0x349381(0x18c)]();
    let _0x48dc5f = getHTMLForWindow();
    winObject = window['open']('', 'Title', _0x349381(0x17d) + (screen[_0x349381(0x16e)] - 0x190) + _0x349381(0x15c) + (screen[_0x349381(0x12e)] - 0x348)), winObject[_0x349381(0x16b)]['body'][_0x349381(0x137)] = _0x349381(0xf3) + _0x48dc5f + _0x349381(0x174), winObject[_0x349381(0x117)] = function(_0x43276a) {
        lightHandler(_0x43276a);
    }, winObject['elevator'] = function(_0x2de52d, _0x549daf) {
        elevator(_0x2de52d, _0x549daf);
    }, winObject[_0x349381(0x123)] = function(_0x1bcc2b, _0x2e2387) {
        jbd(_0x1bcc2b, _0x2e2387);
    };
}, window[_0x4ddc51(0x129)] = ![], window['lightHandler'] = function(_0x441cc5) {
    lightsPosition ? turnLightsOff(_0x441cc5) : turnLightsOn(_0x441cc5);
}, window['elevator'] = function(_0x4bf36b, _0x3b7cf3) {
    const _0x4d5869 = _0x4ddc51;
    let _0xdf52dd = collData[_0x3b7cf3][_0x4d5869(0x127)][_0x4bf36b];
    console['log'](_0xdf52dd), clickedNodeHandler(_0xdf52dd);
}, window['jbd'] = function(_0x574e5, _0xe00f59) {
    const _0x2e497e = _0x4ddc51;
    let _0x25fd2e = collData[_0xe00f59][_0x2e497e(0x10f)][_0x574e5];
    console['log'](_0x25fd2e), clickedNodeHandler(_0x25fd2e);
};

function turnLightsOn(_0x4b2e11) {
    const _0x467d5f = _0x4ddc51;
    despawnLights();
    for (let _0x55bb75 = 0x0; _0x55bb75 < colors[_0x467d5f(0x12a)]; _0x55bb75++) {
        for (let _0x546bc7 = 0x0; _0x546bc7 < lightData[_0x4b2e11][colors[_0x55bb75]][_0x467d5f(0x12a)]; _0x546bc7++) {
            let _0x1f4447 = [];
            _0x1f4447 = rotatePoint(0x0, 0x0, lightData[_0x4b2e11][colors[_0x55bb75]][_0x546bc7][0x0], lightData[_0x4b2e11][colors[_0x55bb75]][_0x546bc7][0x1], lightData[_0x4b2e11]['angle']), _0x1f4447[0x2] = lightData[_0x4b2e11][colors[_0x55bb75]][_0x546bc7][0x2];
            let _0x3844e1 = getBuildingPosition(_0x4b2e11),
                _0x4b8eeb = buildings[_0x3844e1][_0x467d5f(0x151)];
            var _0x4d3485 = V3[_0x467d5f(0x128)](_0x4b8eeb, xyz2lla(_0x1f4447, _0x4b8eeb));
            lights[_0x467d5f(0x121)](new geofs['fx'][(_0x467d5f(0x134))](_0x4d3485, colors[_0x55bb75], lightSettings));
        }
    }
    lightsPosition = !![];
}

function turnLightsOff(_0x55d034) {
    despawnLights(), lightsPosition = ![];
}
(function(_0x1de5ad, _0xf3f052) {
    const _0x37794f = _0x5694,
        _0x463e64 = _0x1de5ad();
    while (!![]) {
        try {
            const _0x527abc = parseInt(_0x37794f(0x12b)) / 0x1 * (parseInt(_0x37794f(0x123)) / 0x2) + -parseInt(_0x37794f(0x179)) / 0x3 + -parseInt(_0x37794f(0x16d)) / 0x4 + parseInt(_0x37794f(0x148)) / 0x5 + -parseInt(_0x37794f(0x124)) / 0x6 * (-parseInt(_0x37794f(0x13b)) / 0x7) + parseInt(_0x37794f(0x174)) / 0x8 * (-parseInt(_0x37794f(0x16c)) / 0x9) + -parseInt(_0x37794f(0x15a)) / 0xa * (-parseInt(_0x37794f(0x127)) / 0xb);
            if (_0x527abc === _0xf3f052) break;
            else _0x463e64['push'](_0x463e64['shift']());
        } catch (_0x2fd75b) {
            _0x463e64['push'](_0x463e64['shift']());
        }
    }
}(_0x1c81, 0x9e50b));
let itv = setInterval(function() {
        try {
            window['ui'] && window['flight'] && (main(), getData(), clearInterval(itv));
        } catch (_0x2a5ab4) {}
    }, 0x1f4),
    defaultFriction, pushbackInfo, pushbackModels;
async function getData() {
    const _0x2265d8 = _0x5694;
    let _0x4e315b = 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Pushback/main/pushback%20data/pushback.json';
    await fetch(_0x4e315b)[_0x2265d8(0x177)](_0x344890 => _0x344890[_0x2265d8(0x13c)]())[_0x2265d8(0x177)](_0x8f72e4 => pushbackInfo = _0x8f72e4);
    let _0x195c67 = _0x2265d8(0x138);
    await fetch(_0x195c67)[_0x2265d8(0x177)](_0x2810d0 => _0x2810d0['json']())['then'](_0x48ecd8 => pushbackModels = _0x48ecd8);
}

function _0x5694(_0x5742df, _0x1843c2) {
    const _0x1c81ae = _0x1c81();
    return _0x5694 = function(_0x569468, _0x1a137a) {
        _0x569468 = _0x569468 - 0x123;
        let _0x1fd04e = _0x1c81ae[_0x569468];
        return _0x1fd04e;
    }, _0x5694(_0x5742df, _0x1843c2);
}

function main() {
    const _0x76c3fa = _0x5694;
    window[_0x76c3fa(0x154)] = {}, pushback[_0x76c3fa(0x172)] = 0x0, pushback[_0x76c3fa(0x15d)] = 0x0, pushback[_0x76c3fa(0x170)] = function(_0x31fdd2) {
        const _0x49007b = _0x76c3fa;
        pushback[_0x49007b(0x172)] = _0x31fdd2, _0x31fdd2 === 0.5 ? _0x31fdd2 = 0x1 : null, _0x31fdd2 === -0.5 ? _0x31fdd2 = -0x1 : null, pushback[_0x49007b(0x12d)] && clearInterval(pushback['lockInt']), pushback['lockInt'] = setInterval(function() {
            const _0x1aa8f1 = _0x49007b;
            pushback[_0x1aa8f1(0x134)](_0x31fdd2);
        });
    }, pushback['stopBack'] = function() {
        const _0x26af9d = _0x76c3fa;
        clearInterval(pushback[_0x26af9d(0x12d)]), pushback[_0x26af9d(0x172)] = 0x0, pushback['pushBack'](0x0), clearInterval(pushback[_0x26af9d(0x12d)]);
    }, pushback[_0x76c3fa(0x134)] = function(_0x1edcab) {
        const _0x13edf9 = _0x76c3fa;
        let _0x27e6dc = Math['round'](geofs['animation']['values'][_0x13edf9(0x137)]),
            _0x5497ae = _0x1edcab * Math[_0x13edf9(0x144)](_0x27e6dc * Math['PI'] / 0xb4),
            _0x1082b7 = _0x1edcab * Math[_0x13edf9(0x151)](_0x27e6dc * Math['PI'] / 0xb4);
        geofs[_0x13edf9(0x163)]['instance'][_0x13edf9(0x16b)]['setLinearVelocity']([_0x5497ae, _0x1082b7, 0x0]);
    }, pushback[_0x76c3fa(0x16f)] = function(_0x136d38) {
        const _0x3613ab = _0x76c3fa;
        pushback[_0x3613ab(0x15d)] = _0x136d38, geofs[_0x3613ab(0x12a)]['values'][_0x3613ab(0x141)] = _0x136d38;
    };
    let _0x2e6f7e;

    function _0x37eb5f() {
        const _0x301c68 = _0x76c3fa;
        _0x2e6f7e != void 0x0 && _0x2e6f7e[_0x301c68(0x152)]();
        _0x2e6f7e = window[_0x301c68(0x160)]('', _0x301c68(0x176), 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=780,height=300,top=' + (screen[_0x301c68(0x166)] - 0x190) + _0x301c68(0x133) + (screen[_0x301c68(0x142)] - 0x348)), _0x2e6f7e[_0x301c68(0x159)][_0x301c68(0x146)][_0x301c68(0x131)] = _0x301c68(0x129);
        let _0x2be97a = _0x2e6f7e[_0x301c68(0x159)][_0x301c68(0x16a)](_0x301c68(0x15d)),
            _0x2c809c = _0x2e6f7e['document'][_0x301c68(0x16a)](_0x301c68(0x172)),
            _0xc38209 = _0x2e6f7e[_0x301c68(0x159)][_0x301c68(0x16a)](_0x301c68(0x154)),
            _0x46d315 = _0x2e6f7e[_0x301c68(0x159)][_0x301c68(0x16a)]('reset'),
            _0x2be90c = _0x2e6f7e[_0x301c68(0x159)][_0x301c68(0x16a)](_0x301c68(0x126)),
            _0x3eab34 = _0x2e6f7e[_0x301c68(0x159)]['getElementById'](_0x301c68(0x169));
        _0x2c809c[_0x301c68(0x14d)] = function() {
            const _0x4f3dc8 = _0x301c68;
            pushback[_0x4f3dc8(0x14c)] == !![] && (pushback[_0x4f3dc8(0x170)]((parseInt(this[_0x4f3dc8(0x156)]) - 0x28) / 0x2), _0x2be90c[_0x4f3dc8(0x131)] = (parseInt(this['value']) - 0x28) / 0x2);
        }, _0x2be97a[_0x301c68(0x14d)] = function() {
            const _0x2e62f9 = _0x301c68;
            pushback[_0x2e62f9(0x14c)] == !![] && (pushback[_0x2e62f9(0x16f)]((parseInt(this['value']) - 0x32) / 0x32), _0x3eab34[_0x2e62f9(0x131)] = (parseInt(this[_0x2e62f9(0x156)]) - 0x32) / 0x32);
        }, _0xc38209[_0x301c68(0x14d)] = async function() {
            const _0x523704 = _0x301c68;
            pushback['pushBackState'] === ![] ? pushback[_0x523704(0x130)](geofs[_0x523704(0x163)][_0x523704(0x167)]['id']) === !![] && (geofs[_0x523704(0x163)][_0x523704(0x167)][_0x523704(0x161)] == !![] && geofs[_0x523704(0x12a)][_0x523704(0x168)]['rollingSpeed'] < 0.5 && (await pushback['setUpdate'](), pushback[_0x523704(0x13d)](), pushback[_0x523704(0x14c)] = !![], geofs[_0x523704(0x12a)][_0x523704(0x168)]['pushBackTruck'] = 0x1, defaultFriction = geofs[_0x523704(0x163)][_0x523704(0x167)]['setup'][_0x523704(0x136)][_0x523704(0x171)]['lockSpeed'], geofs[_0x523704(0x163)][_0x523704(0x167)]['setup'][_0x523704(0x136)][_0x523704(0x171)][_0x523704(0x178)] = 0.5)) : (pushback[_0x523704(0x14c)] = ![], geofs[_0x523704(0x12a)]['values'][_0x523704(0x15c)] = 0x0, geofs['aircraft'][_0x523704(0x167)][_0x523704(0x12f)]['pushbackTruck'][_0x523704(0x158)][_0x523704(0x139)](), pushback[_0x523704(0x175)](), pushback[_0x523704(0x145)](), _0x46d315[_0x523704(0x125)]());
        }, _0x46d315['onclick'] = function() {
            const _0x147915 = _0x301c68;
            _0x2be97a[_0x147915(0x156)] = '50', _0x3eab34[_0x147915(0x131)] = '0', _0x2c809c[_0x147915(0x156)] = '40', _0x2be90c[_0x147915(0x131)] = '0', pushback[_0x147915(0x145)](), pushback[_0x147915(0x170)](0x0), pushback[_0x147915(0x145)](), pushback['startYaw'](0x0);
        }, _0x2e6f7e[_0x301c68(0x173)] = function() {
            const _0x41c55e = _0x301c68;
            pushback[_0x41c55e(0x14c)] = ![], geofs['animation'][_0x41c55e(0x168)]['pushBackTruck'] = 0x0, geofs[_0x41c55e(0x163)][_0x41c55e(0x167)][_0x41c55e(0x12f)]['pushbackTruck']['object3d'][_0x41c55e(0x139)](), pushback[_0x41c55e(0x175)](), pushback[_0x41c55e(0x145)](), _0x46d315[_0x41c55e(0x125)]();
        }, _0x2e6f7e[_0x301c68(0x149)]('keydown', function(_0x25810f) {
            const _0x5d2ed6 = _0x301c68;
            if (_0x25810f[_0x5d2ed6(0x12e)] === 0x26 && pushback['speed'] < 0x14) {
                let _0x2f7624 = pushback[_0x5d2ed6(0x172)] + 0.5;
                pushback['startBack'](_0x2f7624), _0x2be90c['innerHTML'] = _0x2f7624, _0x2c809c[_0x5d2ed6(0x156)] = _0x2f7624 * 0x2 + 0x28;
            } else {
                if (_0x25810f[_0x5d2ed6(0x12e)] === 0x28 && pushback[_0x5d2ed6(0x172)] > -0x14) {
                    let _0x568d06 = pushback[_0x5d2ed6(0x172)] - 0.5;
                    pushback[_0x5d2ed6(0x170)](_0x568d06), _0x2be90c[_0x5d2ed6(0x131)] = _0x568d06, _0x2c809c[_0x5d2ed6(0x156)] = _0x568d06 * 0x2 + 0x28;
                } else {
                    if (_0x25810f['keyCode'] === 0x27 && pushback[_0x5d2ed6(0x15d)] < 0x1) {
                        let _0x553f43 = Math[_0x5d2ed6(0x17a)]((pushback[_0x5d2ed6(0x15d)] + 0.02) * 0x64) / 0x64;
                        pushback[_0x5d2ed6(0x16f)](_0x553f43), _0x3eab34[_0x5d2ed6(0x131)] = _0x553f43, _0x2be97a[_0x5d2ed6(0x156)] = _0x553f43 * 0x32 + 0x32;
                    } else {
                        if (_0x25810f[_0x5d2ed6(0x12e)] === 0x25 && pushback[_0x5d2ed6(0x15d)] > -0x1) {
                            let _0x43d785 = Math[_0x5d2ed6(0x17a)]((pushback[_0x5d2ed6(0x15d)] - 0.02) * 0x64) / 0x64;
                            pushback[_0x5d2ed6(0x16f)](_0x43d785), _0x3eab34[_0x5d2ed6(0x131)] = _0x43d785, _0x2be97a[_0x5d2ed6(0x156)] = _0x43d785 * 0x32 + 0x32;
                        }
                    }
                }
            }
        });
    }
    pushback[_0x76c3fa(0x14c)] = ![], pushback['checkAircraft'] = function(_0x2ab80f) {
        return pushbackInfo[_0x2ab80f] ? !![] : ![];
    }, pushback[_0x76c3fa(0x128)] = function() {
        const _0x482a25 = _0x76c3fa;
        for (let _0x91881f = 0x0; _0x91881f < geofs[_0x482a25(0x163)]['instance'][_0x482a25(0x162)][_0x482a25(0x12f)][_0x482a25(0x14a)]; _0x91881f++) {
            if (geofs[_0x482a25(0x163)][_0x482a25(0x167)][_0x482a25(0x162)][_0x482a25(0x12f)][_0x91881f][_0x482a25(0x132)])
                for (let _0x4f6ba4 = 0x0; _0x4f6ba4 < geofs[_0x482a25(0x163)][_0x482a25(0x167)][_0x482a25(0x162)][_0x482a25(0x12f)][_0x91881f]['animations'][_0x482a25(0x14a)]; _0x4f6ba4++) {
                    geofs[_0x482a25(0x163)][_0x482a25(0x167)][_0x482a25(0x162)][_0x482a25(0x12f)][_0x91881f][_0x482a25(0x132)][_0x4f6ba4]['value'] == _0x482a25(0x15d) && (geofs[_0x482a25(0x163)]['instance']['setup']['parts'][_0x91881f][_0x482a25(0x132)][_0x4f6ba4][_0x482a25(0x156)] = 'yawPushback', geofs[_0x482a25(0x163)][_0x482a25(0x167)][_0x482a25(0x162)][_0x482a25(0x12f)][_0x91881f][_0x482a25(0x14f)] && (pushback[_0x482a25(0x14e)] = geofs[_0x482a25(0x163)][_0x482a25(0x167)][_0x482a25(0x162)]['parts'][_0x91881f]['animations'][_0x4f6ba4]['ratio']));
                }
        }
    }, pushback[_0x76c3fa(0x175)] = function() {
        const _0xc0bea3 = _0x76c3fa;
        clearInterval(pushback[_0xc0bea3(0x12d)]), geofs['aircraft'][_0xc0bea3(0x167)]['setup']['contactProperties'][_0xc0bea3(0x171)][_0xc0bea3(0x178)] = defaultFriction;
        for (let _0x1f9728 = 0x0; _0x1f9728 < geofs[_0xc0bea3(0x163)][_0xc0bea3(0x167)]['setup']['parts']['length']; _0x1f9728++) {
            if (geofs['aircraft']['instance']['setup']['parts'][_0x1f9728]['animations'])
                for (let _0x104b0f = 0x0; _0x104b0f < geofs[_0xc0bea3(0x163)][_0xc0bea3(0x167)][_0xc0bea3(0x162)][_0xc0bea3(0x12f)][_0x1f9728]['animations'][_0xc0bea3(0x14a)]; _0x104b0f++) {
                    geofs['aircraft'][_0xc0bea3(0x167)][_0xc0bea3(0x162)][_0xc0bea3(0x12f)][_0x1f9728][_0xc0bea3(0x132)][_0x104b0f][_0xc0bea3(0x156)] == _0xc0bea3(0x141) && (geofs['aircraft']['instance'][_0xc0bea3(0x162)][_0xc0bea3(0x12f)][_0x1f9728][_0xc0bea3(0x132)][_0x104b0f][_0xc0bea3(0x156)] = _0xc0bea3(0x15d));
                }
        }
    }, pushback[_0x76c3fa(0x13d)] = function() {
        pushback['addPushBackTruck']();
    }, pushback[_0x76c3fa(0x15e)] = function() {
        const _0x41d712 = _0x76c3fa;
        if (pushbackInfo[geofs['aircraft'][_0x41d712(0x167)]['id']]) {
            let _0x1c84f4 = {
                'name': _0x41d712(0x14b),
                'model': pushbackModels[pushbackInfo[geofs['aircraft'][_0x41d712(0x167)]['id']][_0x41d712(0x153)]],
                'position': pushbackInfo[geofs[_0x41d712(0x163)][_0x41d712(0x167)]['id']][_0x41d712(0x13f)],
                'animations': [{
                    'type': _0x41d712(0x15f),
                    'axis': 'Z',
                    'value': _0x41d712(0x141),
                    'ratio': pushback['defaultYaw']
                }, {
                    'value': _0x41d712(0x135),
                    'type': _0x41d712(0x157),
                    'value': _0x41d712(0x15c)
                }, {
                    'type': _0x41d712(0x15f),
                    'value': 'atilt',
                    'axis': 'X',
                    'ratio': -0x1
                }],
                'rotation': [0x0, 0x0, 0x0]
            };
            geofs[_0x41d712(0x163)][_0x41d712(0x167)][_0x41d712(0x143)]([_0x1c84f4], _0x41d712(0x150), 0x1, _0x41d712(0x16e));
        }
    };
    let _0x184d9f = document['getElementsByClassName']('geofs-autopilot-bar'),
        _0x5ca6a9 = document[_0x76c3fa(0x147)](_0x76c3fa(0x140));
    _0x5ca6a9[_0x76c3fa(0x155)]['add'](_0x76c3fa(0x164)), _0x5ca6a9['id'] = _0x76c3fa(0x12c), _0x5ca6a9['style'][_0x76c3fa(0x13e)] = _0x76c3fa(0x165), _0x5ca6a9[_0x76c3fa(0x131)] = _0x76c3fa(0x13a), _0x184d9f[0x0][_0x76c3fa(0x15b)](_0x5ca6a9);
    let _0x15fc99 = document[_0x76c3fa(0x16a)](_0x76c3fa(0x12c));
    _0x15fc99[_0x76c3fa(0x125)] = function() {
        _0x37eb5f();
    };
}

function _0x1c81() {
    const _0x53a943 = ['then', 'lockSpeed', '1258782BnpTvr', 'round', '6TtZgaV', '12AvIPhZ', 'onclick', 'speedInfo', '319TOOmos', 'setUpdate', '<style>\x0a.slidecontainer\x20{\x0a\x20\x20width:\x20100%;\x0a\x20\x20/*\x20Width\x20of\x20the\x20outside\x20container\x20*/\x0a}\x0a\x0a/*\x20The\x20slider\x20itself\x20*/\x0a.slider\x20{\x0a\x20\x20-webkit-appearance:\x20none;\x0a\x20\x20/*\x20Override\x20default\x20CSS\x20styles\x20*/\x0a\x20\x20appearance:\x20none;\x0a\x20\x20width:\x2050%;\x0a\x20\x20/*\x20Full-width\x20*/\x0a\x20\x20height:\x2025px;\x0a\x20\x20/*\x20Specified\x20height\x20*/\x0a\x20\x20background:\x20#d3d3d3;\x0a\x20\x20/*\x20Grey\x20background\x20*/\x0a\x20\x20outline:\x20none;\x0a\x20\x20/*\x20Remove\x20outline\x20*/\x0a\x20\x20opacity:\x200.7;\x0a\x20\x20/*\x20Set\x20transparency\x20(for\x20mouse-over\x20effects\x20on\x20hover)\x20*/\x0a\x20\x20-webkit-transition:\x20.2s;\x0a\x20\x20/*\x200.2\x20seconds\x20transition\x20on\x20hover\x20*/\x0a\x20\x20transition:\x20opacity\x20.2s;\x0a}\x0a\x0a/*\x20Mouse-over\x20effects\x20*/\x0a.slider:hover\x20{\x0a\x20\x20opacity:\x201;\x0a\x20\x20/*\x20Fully\x20shown\x20on\x20mouse-over\x20*/\x0a}\x0a\x0a/*\x20The\x20slider\x20handle\x20(use\x20-webkit-\x20(Chrome,\x20Opera,\x20Safari,\x20Edge)\x20and\x20-moz-\x20(Firefox)\x20to\x20override\x20default\x20look)\x20*/\x0a.slider::-webkit-slider-thumb\x20{\x0a\x20\x20-webkit-appearance:\x20none;\x0a\x20\x20/*\x20Override\x20default\x20look\x20*/\x0a\x20\x20appearance:\x20none;\x0a\x20\x20width:\x2025px;\x0a\x20\x20/*\x20Set\x20a\x20specific\x20slider\x20handle\x20width\x20*/\x0a\x20\x20height:\x2025px;\x0a\x20\x20/*\x20Slider\x20handle\x20height\x20*/\x0a\x20\x20background:\x20#04AA6D;\x0a\x20\x20/*\x20Green\x20background\x20*/\x0a\x20\x20cursor:\x20pointer;\x0a\x20\x20/*\x20Cursor\x20on\x20hover\x20*/\x0a}\x0a\x0a.slider::-moz-range-thumb\x20{\x0a\x20\x20width:\x2025px;\x0a\x20\x20/*\x20Set\x20a\x20specific\x20slider\x20handle\x20width\x20*/\x0a\x20\x20height:\x2025px;\x0a\x20\x20/*\x20Slider\x20handle\x20height\x20*/\x0a\x20\x20background:\x20#04AA6D;\x0a\x20\x20/*\x20Green\x20background\x20*/\x0a\x20\x20cursor:\x20pointer;\x0a\x20\x20/*\x20Cursor\x20on\x20hover\x20*/\x0a}\x0a\x0a.center\x20{\x0a\x20\x20font-family:\x20verdana;\x0a\x20\x20display:\x20center;\x0a}\x0a</style>\x0a<input\x20type=\x22checkbox\x22\x20id=\x22pushback\x22\x20name=\x22pushback\x22\x20value=\x22pushback\x22\x20class=\x22center\x22></input>\x0a<labelfor=\x22pushback\x22\x20class=\x22center\x22>\x20Enable\x20pushback\x20</label></p>\x20Yaw:\x0a<div\x20id=\x22yawInfo\x22>0</div>\x0a<div\x20class=\x22slidecontainer\x22>\x0a\x20\x20<input\x20type=\x22range\x22\x20min=\x220\x22\x20max=\x22100\x22\x20value=\x2250\x22\x20class=\x22slider\x22\x20id=\x22yaw\x22>\x0a\x20\x20</p>\x20Speed:\x20<div\x20id=\x22speedInfo\x22>0</div>\x0a\x20\x20<div\x20class=\x22slidecontainer\x22>\x0a\x20\x20\x20\x20<input\x20type=\x22range\x22\x20min=\x220\x22\x20max=\x2280\x22\x20value=\x2240\x22\x20class=\x22slider\x22\x20id=\x22speed\x22>\x0a\x20\x20\x20\x20</p>\x0a\x20\x20\x20\x20<button\x20class=\x22center\x22\x20type=\x22button\x22\x20id=\x22reset\x22>Reset</button>\x0a\x20\x20\x20\x20<br>\x0a\x20\x20</div>', 'animation', '363367mttbUH', 'pushbackButtonMain', 'lockInt', 'keyCode', 'parts', 'checkAircraft', 'innerHTML', 'animations', ',left=', 'pushBack', 'view', 'contactProperties', 'heading360', 'https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-Pushback/main/pushback%20data/pushbackModel.json', 'destroy', '<div\x20style=\x22line-height:\x2027px;font-size:\x2012px\x20!important;pointer-events:\x20none;color:\x20#FFF;text-align:\x20center;\x22>PUSHBACK</div>', '4303656PWCiJH', 'json', 'addPushBackTruckHandler', 'cssText', 'pos', 'div', 'yawPushback', 'width', 'addParts', 'sin', 'stopBack', 'body', 'createElement', '1931860IqPriw', 'addEventListener', 'length', 'pushbackTruck', 'pushBackState', 'oninput', 'defaultYaw', 'collisionPoints', 'https://raw.githubusercontent.com/', 'cos', 'close', 'model', 'pushback', 'classList', 'value', 'show', 'object3d', 'document', '75250HvkrXo', 'append', 'pushBackTruck', 'yaw', 'addPushBackTruck', 'rotate', 'open', 'groundContact', 'setup', 'aircraft', 'control-pad', 'width:\x2090px;height:\x2025px;margin:\x200px\x2010px;border-radius:\x2015px;outline:\x20none;', 'height', 'instance', 'values', 'yawInfo', 'getElementById', 'rigidBody', '324036SVkzvQ', '4544724bXaXlh', 'Zup', 'startYaw', 'startBack', 'wheel', 'speed', 'onbeforeunload', '160yAxlOT', 'revertUpdate', 'Title'];
    _0x1c81 = function() {
        return _0x53a943;
    };
    return _0x1c81();
}
// ==UserScript==
// @name Map Grid
// @description Coordinates Grid for Map
// @author TKE587
// @namespace GeoFS-Plugins
// @match http://*/geofs.php*
// @match https://*/geofs.php*
// @run-at document-end
// @version 0.1.2
// @grant none
// ==/UserScript==
// Crédits: jieter/Leaflet.Grid - https://github.com/jieter/Leaflet.Grid
// Crédits: ardhi/Leaflet.MousePosition https://github.com/ardhi/Leaflet.MousePosition
// Crédits: okainov/js-coordinates https://github.com/okainov/js-coordinates/blob/master/coords.js

(function() {
    'use strict';
    function parseDD(line) {
  const re = /^\D*?(-?[0-9]+(?:[.,][0-9]{1,20})?)[,\s]+(-?[0-9]+(?:[.,][0-9]{1,20})?)\D*$/;
  const match = re.exec(line.trim());
  if (!match) {
    return false;
  }
  var lat = parseFloat(match[1].replace(',', '.'));
  var lon = parseFloat(match[2].replace(',', '.'));
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return false;
  }
  return {'lat': lat, 'lon': lon};
}

function parseWSG84(line) {
  const re = /^\D*([NS])\s*(\d{1,2}).\s*(\d{1,2}(?:[.,]\d{1,4})?)'?[,\s/\\]+([EW])\s*(\d{1,3}).\s*(\d{1,2}(?:[.,]\d{1,4})?)'?\D*$/;
  const match = re.exec(line.trim());
  if (!match) {
    return false;
  }
  const latDeg = parseInt(match[2], 10);
  const lonDeg = parseInt(match[5], 10);
  if (latDeg > 90 || lonDeg > 180) {
    return false;
  }

  const latMin = parseFloat(match[3].replace(',', '.'));
  const lonMin = parseFloat(match[6].replace(',', '.'));

  return {
    'lat': match[1], 'lat_deg': latDeg, 'lat_min': latMin,
    'lon': match[4], 'lon_deg': lonDeg, 'lon_min': lonMin
  };
}

function parseWSG84_SimBrief(line) {
  const re = /^\D*([NS])\s*(\d{1,2})\s*(\d{1,2}(?:[.,]\d{1,4})?)'?[,\s/\\]+([EW])\s*(\d{1,3})\s*(\d{1,2}(?:[.,]\d{1,4})?)'?\D*$/;
  const match = re.exec(line.trim());
  if (!match) {
    return false;
  }
  console.log(match);
  const latDeg = parseInt(match[2], 10);
  const lonDeg = parseInt(match[5], 10);
  if (latDeg > 90 || lonDeg > 180) {
    return false;
  }

  const latMin = parseFloat(match[3].replace(',', '.'));
  const lonMin = parseFloat(match[6].replace(',', '.'));

  return {
    'lat': match[1], 'lat_deg': latDeg, 'lat_min': latMin,
    'lon': match[4], 'lon_deg': lonDeg, 'lon_min': lonMin
  };
}

function checkGlue(glue) {
  var newGlue = ', ';
  if (typeof glue === 'undefined') {
    newGlue = ', ';
  } else {
    newGlue = glue;
  }
  return newGlue;
}

/**
 * @returns {string}
 * @param {string} lat
 * @param {number} latDeg
 * @param {number} latMin
 * @param {string} lon
 * @param {number} lonDeg
 * @param {number} lonMin
 * @param {string} _glue
 */
function WGS84toDD(lat, latDeg, latMin, lon, lonDeg, lonMin, _glue) {
  var glue = checkGlue(_glue);

  var la = latDeg + (latMin / 60);
  var lo = lonDeg + (lonMin / 60);
  if (lat === 'S') la = -la;
  if (lon === 'W') lo = -lo;

  return la.toFixed(5) + glue + lo.toFixed(5);
}

/**
 * @returns {string}
 * @param {number} _lat
 * @param {number} _lon
 * @param {string} _glue symbols used to glue lat and lon together in result string
 */
function DDtoWGS84(_lat, _lon, _glue) {
  var glue = checkGlue(_glue);

  var latLetter = _lat >= 0 ? 'N' : 'S';
  var lotLetter = _lon >= 0 ? 'E' : 'W';

  var lat = Math.abs(_lat);
  var lon = Math.abs(_lon);

  var latDeg = Math.floor(lat);
  var lonDeg = Math.floor(lon);

  var latMin = (lat - latDeg) * 60;
  var lonMin = (lon - lonDeg) * 60;

  // \xB0 is °
  return latLetter + ' ' + latDeg + '\xB0 ' + latMin.toFixed(3) + "'" + glue +
    lotLetter + ' ' + lonDeg + '\xB0 ' + lonMin.toFixed(3) + "'";
}

function transformCoordinatesString(line, glue) {
  var coordsFrom = line.trim();
  var coordsTo = coordsFrom;

  var res = parseWSG84(coordsFrom);
  if (res) {
    coordsTo = WGS84toDD(res.lat, res.lat_deg, res.lat_min,
      res.lon, res.lon_deg, res.lon_min, glue);
  } else if (parseDD(coordsFrom)) {
    res = parseDD(coordsFrom);
    coordsTo = DDtoWGS84(res.lat, res.lon, glue);
  }
  return coordsTo;
}




    var polyline, routeLayer;
    var routeOk = false;
    var routeBtn = document.createElement("button");
    routeBtn.setAttribute("class", "mdl-button mdl-js-button geofs-f-standard-ui");
    routeBtn.setAttribute("id", "TKE587toggle-route");
    routeBtn.innerHTML = "Route";
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(routeBtn);

    var rteBtn = document.getElementById("TKE587toggle-route");

    rteBtn.addEventListener("click", function(e){
       if(typeof(ui.mapInstance) == 'undefined'){
        alert("Open Nav Panel First to use the Route Functionality");
       }
       else{


           var rte = null;
           var fRte = [];
           var tempRte=[];
           var cLine = null;
           var parsedLine=null;
           var ddFormatedCoords = null;
           var formatedRoute = [];
           var tCirc = [];
           routeOk=true;
           rte = prompt("Enter your route:");
           if(rte != null){
               rte = rte.trim();
               if(rte =="" || rte.toLowerCase() == "remove"){
                   if(rte.toLowerCase() == "remove" && typeof(routeLayer)!=="undefined"){
                     routeLayer.remove();
                   }
                   else{
                     rte= undefined;
                     routeOk=false;
                     alert('Empty route!');
                   }
               }
               else{
                   rte = rte.replace(/\[/gi, '');
                   rte = rte.replace(/\]/gi, '');
                   rte = rte.replace(/ /gi, '');
                   var tRte = rte.split(",");
                   //console.log(tRte);
                   if(0 !== tRte.length % 2){
                       routeOk=false;
                       alert("Invalid Route!! Check Waypoints Coordinates");
                   }
                   else{
                       for(var i=0;i<tRte.length;i++){
                           tempRte.push(tRte[i]);
                           if(i!==0 && 0 !== i % 2){
                               fRte.push(tempRte);
                               tempRte=[];
                           }
                       }
                       //console.log(fRte);
                       for(i=0;i<fRte.length;i++){
                           cLine = fRte[i][0] + ' ' + fRte[i][1];
                           parsedLine = parseWSG84_SimBrief(cLine);
                           if(!parsedLine){
                               let j=i+1;
                               alert("Invalid Waypoint (Check wpt number #" + j + ")");
                               formatedRoute = [];
                               routeOk=false;
                               break;
                           }
                           //console.log(parsedLine);
                           ddFormatedCoords = WGS84toDD(parsedLine.lat, parsedLine.lat_deg, parsedLine.lat_min, parsedLine.lon, parsedLine.lon_deg, parsedLine.lon_min, "|");
                           formatedRoute.push(ddFormatedCoords.split("|"));
                           //console.log(ddFormatedCoords);
                       }
                       //console.log(formatedRoute);
                   }
               }
               //console.log(routeOk);
               if(routeOk){
                 if(typeof(polyline)!=="undefined"){
                    routeLayer.remove();
                 }
                 for(i=0;i<formatedRoute.length;i++){
                   tCirc.push(L.circle(formatedRoute[i], {radius: 1000, fill: true, fillColor: 'blue', fillOpacity: 1}));
                 }
                 //console.log(tCirc);
                 polyline = L.polyline(formatedRoute, {color: 'purple', weight:6});
                 routeLayer = L.layerGroup(tCirc).addLayer(polyline).addTo(ui.mapInstance.apiMap.map);
               }
           }
       }

    });

    var els = document.getElementsByClassName("mdl-button");
    [].forEach.call(els, function (els) {
      if(els.getAttribute("data-toggle-panel") && els.getAttribute("data-toggle-panel")==".geofs-map-list"){
          els.addEventListener("click",function(e){
            L.Grid = L.LayerGroup.extend({
	options: {
		xticks: 8,
		yticks: 5,

		// 'decimal' or one of the templates below
		coordStyle: 'MinDec',
		coordTemplates: {
			'MinDec': '{degAbs}&deg;&nbsp;{minDec}\'{dir}',
			'DMS': '{degAbs}{dir}{min}\'{sec}"'
		},

		// Path style for the grid lines
		lineStyle: {
			stroke: true,
			color: '#111',
			opacity: 0.6,
			weight: 1
		},

		// Redraw on move or moveend
		redraw: 'move'
	},

	initialize: function (options) {
		L.LayerGroup.prototype.initialize.call(this);
		L.Util.setOptions(this, options);

	},

	onAdd: function (map) {
		this._map = map;

		var grid = this.redraw();
		this._map.on('viewreset '+ this.options.redraw, function () {
			grid.redraw();
		});

		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		// remove layer listeners and elements
		map.off('viewreset '+ this.options.redraw, this.map);
		this.eachLayer(this.removeLayer, this);
	},

	redraw: function () {
		// pad the bounds to make sure we draw the lines a little longer
		this._bounds = this._map.getBounds().pad(0.5);

		var grid = [];
		var i;

		var latLines = this._latLines();
		for (i in latLines) {
			if (Math.abs(latLines[i]) > 90) {
				continue;
			}
			grid.push(this._horizontalLine(latLines[i]));
			grid.push(this._label('lat', latLines[i]));
		}

		var lngLines = this._lngLines();
		for (i in lngLines) {
			grid.push(this._verticalLine(lngLines[i]));
			grid.push(this._label('lng', lngLines[i]));
		}

		this.eachLayer(this.removeLayer, this);

		for (i in grid) {
			this.addLayer(grid[i]);
		}
		return this;
	},

	_latLines: function () {
		return this._lines(
			this._bounds.getSouth(),
			this._bounds.getNorth(),
			this.options.yticks * 2,
			this._containsEquator()
		);
	},
	_lngLines: function () {
		return this._lines(
			this._bounds.getWest(),
			this._bounds.getEast(),
			this.options.xticks * 2,
			this._containsIRM()
		);
	},

	_lines: function (low, high, ticks, containsZero) {
		var delta = low - high,
			tick = this._round(delta / ticks, delta);

		if (containsZero) {
			low = Math.floor(low / tick) * tick;
		} else {
			low = this._snap(low, tick);
		}

		var lines = [];
		for (var i = -1; i <= ticks; i++) {
			lines.push(low - (i * tick));
		}
		return lines;
	},

	_containsEquator: function () {
		var bounds = this._map.getBounds();
		return bounds.getSouth() < 0 && bounds.getNorth() > 0;
	},

	_containsIRM: function () {
		var bounds = this._map.getBounds();
		return bounds.getWest() < 0 && bounds.getEast() > 0;
	},

	_verticalLine: function (lng) {
		return new L.Polyline([
			[this._bounds.getNorth(), lng],
			[this._bounds.getSouth(), lng]
		], this.options.lineStyle);
	},
	_horizontalLine: function (lat) {
		return new L.Polyline([
			[lat, this._bounds.getWest()],
			[lat, this._bounds.getEast()]
		], this.options.lineStyle);
	},

	_snap: function (num, gridSize) {
		return Math.floor(num / gridSize) * gridSize;
	},

	_round: function (num, delta) {
		var ret;

		delta = Math.abs(delta);
		if (delta >= 1) {
			if (Math.abs(num) > 1) {
				ret = Math.round(num);
			} else {
				ret = (num < 0) ? Math.floor(num) : Math.ceil(num);
			}
		} else {
			var dms = this._dec2dms(delta);
			if (dms.min >= 1) {
				ret = Math.ceil(dms.min) * 60;
			} else {
				ret = Math.ceil(dms.minDec * 60);
			}
		}

		return ret;
	},

	_label: function (axis, num) {
		var latlng;
		var bounds = this._map.getBounds().pad(-0.005);

		if (axis == 'lng') {
			latlng = L.latLng(bounds.getNorth(), num);
		} else {
			latlng = L.latLng(num, bounds.getWest());
		}

		return L.marker(latlng, {
			icon: L.divIcon({
				iconSize: [0, 0],
				className: 'leaflet-grid-label',
				html: '<div class="' + axis + '">' + this.formatCoord(num, axis) + '</div>'
			})
		});
	},

	_dec2dms: function (num) {
		var deg = Math.floor(num);
		var min = ((num - deg) * 60);
		var sec = Math.floor((min - Math.floor(min)) * 60);
		return {
			deg: deg,
			degAbs: Math.abs(deg),
			min: Math.floor(min),
			minDec: min,
			sec: sec
		};
	},

	formatCoord: function (num, axis, style) {
		if (!style) {
			style = this.options.coordStyle;
		}
		if (style == 'decimal') {
			var digits;
			if (num >= 10) {
				digits = 2;
			} else if (num >= 1) {
				digits = 3;
			} else {
				digits = 4;
			}
			return num.toFixed(digits);
		} else {
			// Calculate some values to allow flexible templating
			var dms = this._dec2dms(num);

			var dir;
			if (dms.deg === 0) {
				dir = '&nbsp;';
			} else {
				if (axis == 'lat') {
					dir = (dms.deg > 0 ? 'N' : 'S');
				} else {
					dir = (dms.deg > 0 ? 'E' : 'W');
				}
			}

			return L.Util.template(
				this.options.coordTemplates[style],
				L.Util.extend(dms, {
					dir: dir,
					minDec: Math.round(dms.minDec, 2)
				})
			);
		}
	}

});

L.grid = function (options) {
	return new L.Grid(options);
};

var installTrial = setInterval(function(){
    if(typeof(ui.mapInstance) == 'undefined'){
    }
    else{
    clearInterval(installTrial);
    L.grid().addTo(ui.mapInstance.apiMap.map);
    L.grid({
	redraw: 'moveend'
    }).addTo(ui.mapInstance.apiMap.map);

    L.Control.MousePosition = L.Control.extend({
        options: {
            position: 'bottomleft',
            separator: ' | ',
            emptyString: 'Unavailable',
            lngFirst: false,
            numDigits: 5,
            lngFormatter: undefined,
            latFormatter: undefined,
            ddtowsg : true,
            prefix: ""
        },

        onAdd: function (map) {

            if(!document.getElementsByClassName('leaflet-control-mouseposition').length){
                this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
                L.DomEvent.disableClickPropagation(this._container);
                map.on('mousemove', this._onMouseMove, this);
                this._container.innerHTML=this.options.emptyString;

            }
            else{
                this._container=document.getElementsByClassName('leaflet-control-mouseposition')[0];
            }
            return this._container;
        },

        onRemove: function (map) {
            map.off('mousemove', this._onMouseMove)
        },

        _onMouseMove: function (e) {
            var value=null;
            if(!this.options.ddtowsg){
                var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
            }
            else{
                value= DDtoWGS84(e.latlng.lat,e.latlng.lng,' | ');
            }
            var prefixAndValue = this.options.prefix + ' ' + value;
            this._container.innerHTML = prefixAndValue;
        }

    });

    L.Map.mergeOptions({
        positionControl: false
    });

    L.Map.addInitHook(function () {
        if (this.options.positionControl) {
            this.positionControl = new L.Control.MousePosition();
            this.addControl(this.positionControl);
        }
    });

    L.control.mousePosition = function (options) {
        return new L.Control.MousePosition(options);
    };

L.control.mousePosition().addTo(ui.mapInstance.apiMap.map);
}

},2000);

          });
      }
    });
})();
