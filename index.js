import Env from './model/env.js';
import Player from './model/player.js';
import TextHandler from './text/textHandler.js';
import Mixer from './sound/mixer.js';

const ctx = document.getElementById("canvas").getContext("2d", { willReadFrequently: true });
ctx.imageSmoothingEnabled = false;
const devMode = 0;
var data = {};
var env = 0;
var textHandler = 0;
var player = 0;
var mixer = 0;
function startup() {
    data = {size: Math.floor(Math.min(canvas.width, canvas.height)/128),
            gt: 0, 
            day: true, 
            dayCounter: 1, 
            dayCounterMax: 5, 
            dayAnimationCounter: 0, 
            chairPos: 59, 
            radioB: 0,
            oddBinIndex: 0,
            trashIndex: 0,
            ballPos: [78, 0, 19, 0],
            ballScore: [0,0],
            food: 2, 
            foodMax: 4, 
            drink: 1, 
            drinkMax: 2, 
            sleep: 3, 
            sleepMax: 6, 
            chapter: 0, 
            SecretOpening: false, 
            poison: 4, 
            flower: false, 
            song: 4,
            grade: 0,
            activeDeath: {Drink: 0, Food: 0, Sick: 0, TV: 0, Sleep: 0, True: 0}, 
            endings: {Drink: false, Food: false, Sleep: false, TV: false, Sick: false, Exam: false, 'Exam F': false, 'Exam A++': false, Flower: false, True: false},
            endCreditsCount: 0,
            endFood: false};
    //for (let en in data.endings) {data.endings[en] = true;}data.endings["True"] = false;
    
    env = new Env(IMGList, "hjem", data);
    textHandler = new TextHandler(charList, "", "Start");
    player = new Player(60, 68, 8, 8);
    mixer = new Mixer(soundLog);
    mixer.changeBackground();
}
var lastFrameTime = 0;
var frameInterval = 1000 / 60; // Target frame rate: 60 frames per second

function animate() { //main loop
    var currentFrameTime = performance.now();
    var elapsed = currentFrameTime - lastFrameTime;
    if (elapsed > frameInterval) {
        if (data.endings.True) {
            env.endCredits(ctx, data, textHandler, mixer);
        } else {
            if (mixer.backgroundSong == "goodEnd") {mixer.changeBackground(1);}
            env.update(env, ctx, player, data, textHandler, mixer, devMode);
        }
        //console.log("Sleep:", data.sleep, "\nFood:", data.food, "\nDrink:", data.drink)
        data.gt++; 
        lastFrameTime = currentFrameTime - (elapsed % frameInterval);
    }
    if (data.endings.True != 3) {
        window.requestAnimationFrame(animate);
    }

}
const spriteList = ["10", "11", "12", "20", "21", "22", "30", "31", "32", "40", "41", "42", "ball", "bush", "chair", "drinks", "endCard", "endCredits", "endChar0", "endChar1", "endFlowers", "endFood", "flower", "gregerS", "gregerFB", "hjem", "noodles", "note", "radio", "radiob", "roof1", "roof2", "store", "tree", "trees", "TV1", "ute"];
const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "bp", "c", "co", "d", "do", "e", "eq", "ex", "f", "fp", "fs", "g", "h", "ht", "i", "j", "k", "ko", "l", "li", "m", "mi", "n", "o", "p", "pl", "q", "qu", "r", "s", "sc", "sp", "sq", "st", "t", "u", "ul", "upl", "v", "w", "x", "y", "z"];
const sounds = ["1", "2", "3", "4", "ball", "bin", "click", "dead", "door", "drink", "Exam", "ExamA", "ExamF", "flower", "gate", "goodEnd", "greger", "move", "noodle", "not", "radio", "secret", "sleep", "study", "trash", "TV"];


var resourcesToLoad = chars.length + sounds.length + spriteList.length;
var loadedResources = 0;
let image = 0;
function loadingScreen() {
    if (loadedResources === resourcesToLoad+1) {
        startup()
        animate()
    } else if (loadedResources < resourcesToLoad) {
        loadedResources++;
        // console.log(loadedResources+"/"+resourcesToLoad)
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(100,200,300, 50);
        let v = 0;
        for (let letter of ["l", "o", "a", "d", "i", "n", "g", "do", "do", "do"]) {
            ctx.drawImage(charList[letter], 130+v*3*7,210,3*6,5*6);
            v++;
        }
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(100+loadedResources/resourcesToLoad*300,200,300-loadedResources/resourcesToLoad*300, 50);
        ctx.fillRect(400,0,100, 500);
        ctx.fillStyle = "rgba(0,0,0, 1)";
        ctx.fillRect(400,194,6,56);
        switch (Math.floor(loadedResources%10 / 5)) {
            case 0: image = IMGList["41"]; break;
            case 1: image = IMGList["42"]; break;
        }
        ctx.drawImage(image, 70+loadedResources/resourcesToLoad*300, 200, image.width*6, image.height*6);
        ctx.fillStyle = "rgba(255,255,255, 1)";
        ctx.fillRect(0,0,500, 200);
        ctx.fillRect(0,250,500, 300);
        ctx.fillRect(0,0,100, 500);
        ctx.fillStyle = "rgba(0,0,0, 1)";
        ctx.fillRect(94,194,6, 56);
        ctx.fillRect(94,194,312, 6);
        ctx.fillRect(94,250,312, 6);
        changeCo(ctx)
        if (loadedResources === resourcesToLoad) {
            startup()
            animate()
        }
    }
}
var IMGList = {};
for (let sprite of spriteList) {
    const IMG = new Image();
    IMG.src = `sprites/${sprite}.png`;
    IMGList[sprite] = IMG;
    IMG.onload = loadingScreen;
}
var charList = {};
for (let char of chars) {
    const IMG = new Image();
    IMG.src = `char/${char}.png`;
    charList[char] = IMG;
    IMG.onload = loadingScreen;
}
var soundLog = {};
for (let sound of sounds) {
    const audio = new Audio(`./sound/${sound}.mp3`);
    soundLog[sound] = audio;
    audio.oncanplaythrough = loadingScreen;
}
function changeCo(ctx,c = [255, 244, 79],b = [0,0,canvas.width, canvas.height]){ // changes the color of every non-black pixel in the dessognated box to a set color
    if (b[2]) {
        const imageData = ctx.getImageData(b[0],b[1],b[2],b[3]);
        const pixels = imageData.data;
    
        for (let i = 0; i < pixels.length; i += 4) { // Loop through each pixel and check if it's not black
            if (pixels[i] !== 0 && pixels[i+1] !== 0 && pixels[i+2] !== 0) {
                pixels[i] = c[0];
                pixels[i + 1] = c[1];
                pixels[i + 2] = c[2];
            }
        }
        ctx.putImageData(imageData,b[0],b[1]);
    }
}

/*
ting som trengs å gjøre:
* oppgradere text
* spilltestere
* faktisk eksamen??

*/