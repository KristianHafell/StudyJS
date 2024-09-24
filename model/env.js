export default class Env {
    constructor(IMGList, place, data) {
        this.place = place; // name of place
        this.width = 128*data.size;
        this.height = 128*data.size;
        this.worpBox = [[]];
        this.borderBox = [[]];
        this.color = [255, 244, 79];
        this.shadow = 0.5;
        this.colorLog = {day: [255, 244,  79], night: [ 53, 141, 171], dayPoison: [169, 223, 105], nightPoison: [  5, 141, 101]};
        this.infoMessage = "";
        this.IMGList = IMGList;
    }
    update(env, ctx, player, data, textHandler, mixer, devMode) {
        
        player.update(env, ctx, textHandler, data, mixer, player);
        this.checkBox(this.place, data);
        this.draw(env, ctx, player, data, textHandler, devMode);
    }
    restart(ctx, player, data, ending = "") {
        data.endings[ending] = true;
        player.x = 60;
        player.y = 68;
        player.dir[0] = 0;
        this.place = "hjem";
        data.ballPos = [78, 0, 19, 0];
        data.ballScore = [0,0];
        data.day = true;
        data.dayCounter = 1;
        data.chairPos =  59;
        data.food = 2;
        data.drink = 1;
        data.sleep = 3;
        data.SecretOpening = false;
        data.poison = 4;
        data.flower = false;
        for (let ad in data.activeDeath){
            data.activeDeath[ad] = 0;
        }
        data.chapter = 0;
    }
    newDay(ctx, data) {
        if (data.dayCounter != data.dayCounterMax) {
            data.day = !data.day;
            data.sleep-=1;
            if (data.day) {
                data.dayCounter+=1;
                data.food-=1;
                data.drink-=1;
                if (data.food == 0) {
                    this.infoMessage = "deathText";
                    data.activeDeath.Food = 1;
                }
                if (data.drink == 0) {
                    this.infoMessage = "deathText";
                    data.activeDeath.Drink = 1;
                }
            } else if (data.food == 0) {
                this.place = "death";
                data.activeDeath.Food = 2;
            } else if (data.drink == 0) {
                this.place = "death";
                data.activeDeath.Drink = 2;
            } else {
                data.ballPos[1] = 0;
                data.ballPos[3] = 0;
            }
            if (data.sleep == 0) {
                this.place = "death";
                data.activeDeath.Sleep = 2;
            } else if (data.sleep == 1) {
                this.infoMessage = "deathText";
                data.activeDeath.Sleep = 1;
            }
            if (data.flower) {data.poison--;}
            if (data.poison == 0) {
                this.place = "death";
                data.activeDeath.Sick = 2;
            } else if (data.poison == 1) {
                this.infoMessage = "deathText";
                data.activeDeath.Sick = 1;
            }
            if (this.place == "death") {
                for (let ad in data.activeDeath) {
                    if (data.activeDeath[ad] == 1) {data.activeDeath[ad] = 0; this.infoMessage = "";}
                }
            }
            //console.log("Sleep:", data.sleep, "\nFood:", data.food, "\nDrink:", data.drink, "\nPoison:", data.poison)
            
            data.dayAnimationCounter = 0;
        }
    }
    checkBox (name, data) { // set worp boxes and border boxes for the place
        switch (name){
            case "hjem":
                this.worpBox = [[52,94,16,4,0,"ute",32,94]];
                this.borderBox = [[0,0,28,120],[28,0,95,41],[53,41,14,8],[67,41,25,5],[92,41,31,79],[28,66,11,11],[28,75,16,16],[28,89,24,31],[52,98,16,22],[68,89,24,31],[84,60,8,29], [data.chairPos-4,54,8,4]];
                break;
            case "ute":
                this.worpBox = [[30,86,4,4,2,"hjem",60,90], [50,113,20,7,-1,"end", 64,-5]];
                if (data.day) {this.worpBox.push([78,86,4,4,2,"store",44,90]);}
                this.borderBox = [[0,0,8,120],[8,0,115,9],[104,9,19,111],[8,25,40,32],[68,66,36,22],[100,88,4,25],[20,74,24,14],[8,81,12,32],[8,113,42,7],[70,113,34,7]];
                if (!data.SecretOpening) {this.borderBox.push([8,9,40,16]);}
                if (data.dayCounter != data.dayCounterMax) {this.borderBox.push([50,113,20,7]);}
                if (!data.day && data.activeDeath.True == 0) {this.borderBox.push([91,29,8,4]);}
                break;
            case "store":
                this.worpBox = [[36,94,16,4,0,"ute",80,94]];
                this.borderBox = [[0,0,20,120],[20,0,103,57],[20,65,15,15],[65,65,35,15],[100,57,23,32],[20,89,16,31],[52,89,71,31],[36,98,16,22]];
                break;
            default: 
                this.worpBox = [[]];
                this.borderBox = [[]];

        }
    }
    draw(env, ctx, player, data, textHandler, devMode) { // draw all
        if (this.place == "death"){
            data.day = true;
            this.drawBox(ctx,[-4,-7,128,128], data.size, "rgba(0, 0, 0, 1)");
        } else if (this.place == "end") {
            this.drawBox(ctx,[-4,-7,128,128], data.size, "rgba(0, 0, 0, 1)");
            textHandler.tText = "end";
        } else {
            this.drawSpri(ctx, this.place, 0, 0,data.size); // draw background
            this.drawBehindPlayer(ctx, env, this.place, data, player, textHandler);
            this.drawSpri(ctx, `${player.dir[0]+1}${player.dir[1]}`, player.x, player.y,data.size); // draw player
            this.drawInFrontOfPlayer(ctx, this.place, data, player);
        }
        textHandler.update(env, ctx, this.place, player, data);
        
        if (this.place != "death") {this.changeCAnimation(ctx, data);} // change color of screen
        else {this.changeCAnimation(ctx, data, false);}
        if (devMode) { // show devMode
            for (let i = 0; i < this.borderBox.length; i++) {this.drawBox(ctx,env.borderBox[i], data.size, "rgba(0, 128, 0, 0.9)");}
            for (let i = 0; i < this.worpBox.length; i++) {this.drawBox(ctx,env.worpBox[i], data.size, "rgba(128, 0, 0, 0.9)");}
            for (let i = 0; i < textHandler.tTextLog.length; i++) {this.drawBox(ctx,textHandler.tTextLog[i], data.size, "rgba( 0, 0, 255, 0.9)");}
        }
    }
    drawBehindPlayer (ctx, env, name, data, player, textHandler) {
        switch (name){
            case "hjem":
                this.drawSpri(ctx, "chair", data.chairPos, 56, data.size);
                textHandler.drawChar(ctx, env, data.dayCounter, 35, 41, data.size, true);
                if (data.gt%(player.anTime*4)<player.anTime*2) {this.drawSpri(ctx, "TV1", 83, 48, data.size);}
                let v = 0;
                for (let e in data.endings) {
                    if (data.endings[e]) {this.drawSpri(ctx, "endCard", 89, 67+v*2, data.size);}
                    v++;
                }
                break;
            case "ute":
                if (data.gt%(player.anTime*4)<player.anTime*2) {
                    this.drawSpri(ctx, "bush", 99, 18, data.size);
                    this.drawSpri(ctx, "bush", 60, 33, data.size);
                    this.drawSpri(ctx, "bush", 94, 57, data.size);
                    this.drawSpri(ctx, "bush", 49, 58, data.size);
                    this.drawSpri(ctx, "bush", 74, 60, data.size);
                    this.drawSpri(ctx, "bush", 22, 65, data.size);
                    this.drawSpri(ctx, "bush", 44, 69, data.size);
                }
                if (!data.flower) {this.drawSpri(ctx, "flower", 17, 18, data.size);}
                if (!data.day) {
                    if (data.ballScore[0] != 3) {
                        this.drawSpri(ctx, "gregerS", 95, 32, data.size);
                    } else if (data.activeDeath.True == 0) {
                        this.drawSpri(ctx, "note", 95, 32, data.size);
                    } 
                }
                this.drawSpri(ctx, "ball", data.ballPos[0]+data.ballPos[1], 27, data.size);
                if (Math.abs(data.ballPos[1]) < data.ballPos[2]) {data.ballPos[1]+=data.ballPos[3]}
                break;
            case "store":
                this.drawBox(ctx, [69+(player.x>70 && player.y < 70),45,1,1], data.size);
                if (data.food < data.foodMax) {this.drawSpri(ctx, "noodles", 71, 74, data.size);}
                if (data.drink < data.drinkMax) {this.drawSpri(ctx, "drinks", 27, 74, data.size);}
                if (data.activeDeath.True == 0) {this.drawSpri(ctx, "gregerS", 41, 48, data.size)};
                break;
        }
    }
    drawInFrontOfPlayer (ctx, name, data, player) {
        switch (name){
            case "hjem":
                if (player.y < 56){ this.drawSpri(ctx, "chair", data.chairPos, 56, data.size);}
                //this.drawSpri(ctx, "radio", 34, 69, data.size);
                if (data.radioB >= 8) {this.drawSpri(ctx, "radiob", 34, 69, data.size);}
                else             {this.drawSpri(ctx, "radio", 34, 69, data.size);}
                break;
            case "ute":
                this.drawSpri(ctx, "trees", 0,0, data.size);
                if (!data.SecretOpening) {this.drawSpri(ctx, "tree",8,8, data.size);}
                this.drawSpri(ctx, "roof1", 24, 75, data.size);
                this.drawSpri(ctx, "roof2", 72, 67, data.size);
                if (!data.day && player.y < 30) {if (data.ballScore[0] != 3) {this.drawSpri(ctx, "gregerS", 95, 32, data.size);}}
                break;
            case "store":
                break;
        }
    }
    changeC(ctx,color = [255, 244, 79],box = [0,0,canvas.width, canvas.height], collorStay = [0,0,0]){ // changes the color of every non-black pixel in the dessognated box to a set color
        if (box[2] && box[3]) {
            const imageData = ctx.getImageData(box[0],box[1],box[2],box[3]);
            const pixels = imageData.data;
        
            for (let i = 0; i < pixels.length; i += 4) { // Loop through each pixel and check if it's not black
                //console.log("("+pixels[i]+", "+pixels[i+1]+", "+pixels[i+2]+") ("+collorStay+") \n ("+color+")")
                if (pixels[i] != collorStay[0] && pixels[i+1] != collorStay[1] && pixels[i+2] != collorStay[2]) {
                    pixels[i] = color[0];
                    pixels[i + 1] = color[1];
                    pixels[i + 2] = color[2];
                }
            }
            ctx.putImageData(imageData,box[0],box[1]);
        }
    }
    changeCAnimation(ctx, data, animate = true){ // changes the color of every non-black pixel in the dessognated box to a set color
        if (animate) {
            if (data.dayAnimationCounter < this.width/data.size) {
                data.dayAnimationCounter+=4;
            } 
            let color = {}
            if (data.flower) {color = {day: this.colorLog.dayPoison, night: this.colorLog.nightPoison}}
            else             {color = {day: this.colorLog.day      , night: this.colorLog.night      }}
            
            if (data.day) {
                this.changeC(ctx,color.night,[Math.floor(data.dayAnimationCounter*data.size), 0, this.width-Math.floor(data.dayAnimationCounter*data.size), this.height]);
                this.changeC(ctx,color.day  ,[                                             0, 0,            Math.floor(data.dayAnimationCounter*data.size), this.height]);
            } else {
                this.changeC(ctx,color.day  ,[Math.floor(data.dayAnimationCounter*data.size), 0, this.width-Math.floor(data.dayAnimationCounter*data.size), this.height]);
                this.changeC(ctx,color.night,[                                             0, 0,            Math.floor(data.dayAnimationCounter*data.size), this.height]);
            }
        } else {
            if (data.dayCounter == 1){
                this.changeC(ctx);
            } else {
                this.changeC(ctx, [255,0,0]);
            }
        }
    }
    RecerseC(ctx,box = [0,0,canvas.width, canvas.height], color1 = [0,0,0], color2 = [255,255,255]){ // changes the color of every non-black pixel in the dessognated box to a set color
        if (box[2] && box[3]) {
            const imageData = ctx.getImageData(box[0],box[1],box[2],box[3]);
            const pixels = imageData.data;
        
            for (let i = 0; i < pixels.length; i += 4) { // Loop through each pixel and check if it's not black
                //console.log("("+pixels[i]+", "+pixels[i+1]+", "+pixels[i+2]+") ("+collorStay+") \n ("+color+")")
                if (pixels[i] == color1[0] && pixels[i+1] == color1[1] && pixels[i+2] == color1[2]) {
                    pixels[i] = color2[0];
                    pixels[i + 1] = color2[1];
                    pixels[i + 2] = color2[2];
                } else if (pixels[i] == color2[0] && pixels[i+1] == color2[1] && pixels[i+2] == color2[2]) {
                    pixels[i] = color1[0];
                    pixels[i + 1] = color1[1];
                    pixels[i + 2] = color1[2];
                }
            }
            ctx.putImageData(imageData,box[0],box[1]);
        }
    }
    drawSpri(ctx, name, x, y, size) {
        try {
            const image = this.IMGList[name];
            if (ctx === -1) {return [x*size, y*size, image.width*size, image.height*size];}
            else {ctx.drawImage(image, x*size, y*size, image.width*size, image.height*size);}
        } catch {
            console.log("TypeError: Cannot read properties of", name, "\n at Env.drawSpri")
        }
    }
    drawBox(ctx,v, size, color = "rgba(255, 255, 255, 1)"){
        ctx.fillStyle = color;
        ctx.fillRect((v[0]+4)*size,(v[1]+7)*size,v[2]*size,v[3]*size); // Draw box x+4,y+7 (sprite feet pos)
    }
    endCredits(ctx, data, textHandler, mixer) {
        
        let timer = [500,400]
        let endLen = textHandler.wrappedText(data, "endCredits", 20).length;
        this.drawBox(ctx, [-4,-7, this.width, this.height], 1, "rgba(0, 0, 0, 1)")
        let scroll = Math.max(0,data.gt-data.endCreditsCount-timer[0]);
        //console.log(endLen, scroll);
        this.drawSpri(ctx, "endCredits", 0, -scroll, data.size)
        this.drawSpri(ctx, "endFlowers", 6+(data.gt%64 > 32), 38-scroll, data.size)
        this.drawSpri(ctx, "endChar"+((data.gt%64 > 32)? 1 : 0), 0, -scroll, data.size)
        if (data.endFood) {this.drawSpri(ctx, "endFood", 34, 106-scroll, data.size)}

        //console.log(endLen);
        textHandler.drawMText(this, ctx, data, "endCredits", 128+4*endLen-scroll, 0, false)
        //textHandler.drawMText(this, ctx, data.size, "A game made by  ¤ ¤ Kristian (krisskloss) ¤ ¤  ¤ ¤ ", 400-scroll, false)
        
        if (scroll > 160+7.5*endLen+timer[1]) {
            mixer.changeBackground('0');
            this.drawBox(ctx, [-4,-7, this.width, this.height], 1, "rgba(0, 0, 0, 1)")
            data.endings.True = 3;
        } else if (scroll > 160+7.5*endLen) {
            let antime = (scroll-(160+7.5*endLen))
            let shake = 0
            if (110 < antime && antime < 140) {shake = 1*Math.sin((antime-110)/1.2)}
            textHandler.drawMText(this, ctx, data, "theEnd", 0+Math.max(0, antime-150) + shake, shake/4, false)
            let player = [192-antime, 60]
            if (antime > 140) {player[0] = Math.min(128-46+16, 64*5.3-antime)}
            else if (antime > 110 ) {player[0] = 128-46+16*Math.sin(Math.min(Math.PI*0.5,(antime-110)/48*Math.PI)); player[1] = 60-Math.max(0, 8*Math.sin((antime-110)/24*Math.PI))}
            let dir = "2"
            if (antime > 190 && antime < 230) {dir = "1"}
            if (antime > 140 && antime < 170) {dir = "4"}
            this.drawSpri(ctx, dir+((data.gt%32 > 16)? 2 : 1), player[0], player[1], data.size)
        }

        //console.log(data.gt-data.endCreditsCount + ">" + 1000, data.dayCounter);
        this.changeCAnimation(ctx, data, false);

        
    }
}
