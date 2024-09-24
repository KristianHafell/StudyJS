export default class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.speed = 0.142;
        this.width = width;
        this.height = height;
        this.dir = [0,0];
        this.anTime = 26;

        this.keyIsPressed = { w: 0, a: 0, s: 0, d: 0, Enter: 0 };
        this.keyMapping = [["w", "W", "ArrowUp", "o"],  ["a", "A", "ArrowLeft"],  ["s", "S", "ArrowDown"],  ["d", "D", "ArrowRight"], ["Enter", " "]];
        this.handleKeyPress = this.handleKeyPress.bind(this);
        window.addEventListener("keydown", this.handleKeyPress);
        window.addEventListener("keyup", this.handleKeyPress);
    }
    update(env, ctx, textHandler, data, mixer, player) {
        if (textHandler.textLog == "") { // if main text is empty (you can't move when the main text is on screen)
            if (this.keyIsPressed.Enter == 1) {
                textHandler.textLog = textHandler.tText;
                this.playStartSound(textHandler, data, mixer)
            }
            if (textHandler.tText != "Trash") {data.trashIndex = 0;}
            if (textHandler.tText != "Radio") {if (data.radioB < 8) {data.radioB = 0;}}
            this.move(env,this.keyIsPressed["d"]-this.keyIsPressed["a"], this.keyIsPressed["s"]-this.keyIsPressed["w"], env.borderBox, env.worpBox, data, mixer); //move
        } else if (this.keyIsPressed.Enter == 1) {
            textHandler.textLog = "";
            if (env.infoMessage == "") {this.interact(textHandler, player, ctx, env, data, mixer, textHandler.getTextname(textHandler.tText, data));}
            else {env.infoMessage = "";}
            if (env.infoMessage != "") {textHandler.textLog = env.infoMessage;}
        }
        //must be after Enterpress
        if (this.keyIsPressed.Enter === 1) {
            this.keyIsPressed.Enter = 2;
        }
    }
    handleKeyPress(event) {
        for (let i = 0; i < 5; i++) {
            let keys = this.keyMapping[i];
            if (keys.includes(event.key)) {
                if (this.keyIsPressed[keys[0]] !== 2) {
                    this.keyIsPressed[keys[0]] = 1;
                }
                if (event.type === "keyup") {
                    this.keyIsPressed[keys[0]] = 0;
                }
            }
        }
    }    
    move(env,x,y,bB,wB, data, mixer) {
        // move in the right direction
        if (!this.isHit(bB, this.x+x*this.speed*8, this.y               )){ this.x+=x*this.speed*8;}
        if (!this.isHit(bB, this.x               , this.y+y*this.speed*8)){ this.y+=y*this.speed*8;}

        // set the right direction
        if (x < 0) {this.dir[0] = 1}
        if (x > 0) {this.dir[0] = 3}
        if (y < 0) {this.dir[0] = 2}
        if (y > 0) {this.dir[0] = 0}

        // set rigt animation frame
        if (x != 0 || y != 0) {
            if (data.gt%this.anTime<this.anTime/2) {this.dir[1] = 1}
            else {this.dir[1] = 2}
        } else {this.dir[1] = 0}

        // warp
        for (let i = 0; i < wB.length; i++) {
            if (this.isInside(wB[i])) {
                this.x = wB[i][6];
                this.y = wB[i][7];
                env.place = wB[i][5];
                //if (env.place == "ute") {data.endCreditsCount = data.gt;data.endings.True = true;}
                if (env.place != "end") { mixer.play("door");
                } else {                  mixer.play("gate");
                    if (data.activeDeath.True == 2) { data.grade =   "true";   if (data.food == data.foodMax) {data.endFood = true;}
                    } else if (data.poison    == 1) { data.grade = "flower";
                    } else if (data.chapter   == 6 && data.sleep == data.sleepMax-1) { data.grade =    "A++";
                    } else if (data.sleep     == 1) { data.grade =      "F";
                    } else                          { data.grade =      "C";
                    }
                }
            }
        }
        
        // move chairw
        let preChair = data.chairPos;
        if (data.chairPos >= 60 && this.isInside([data.chairPos-6,54,2,4,3])) {data.chairPos = Math.min(81,data.chairPos+1);}
        if (data.chairPos >= 60 && this.isInside([data.chairPos+4,54,2,4,1])) {data.chairPos = Math.max(60,data.chairPos-1);}
        if (preChair != data.chairPos) {mixer.play("move");}
    }
    playStartSound(textHandler, data, mixer) {
        switch (textHandler.getTextname(textHandler.tText, data)){
            case    "GregerFB": mixer.play("greger"); break;
            case       "Trash": mixer.play( "trash"); break;
            case   "End_Table": mixer.play( "study"); break;
            case         "end": mixer.play(  "dead"); break;
            case       "Store": mixer.play(   "not"); break;
            case         "Out": mixer.play(   "not"); break;
            case     "Odd_Bin": mixer.play(   "bin"); break;
            case "DeskNoChair": mixer.play(   "not"); break;
            case  "DeskNoFood": mixer.play(   "not"); break;
            case "DeskNoDrink": mixer.play(   "not"); break;
            case   "TVNoChair": mixer.play(   "not"); break;
            case       "Radio": mixer.play( "radio"); break;
            default: mixer.play("click"); break;
        }
    }   
    interact(textHandler, player, ctx, env, data, mixer, name) {
        data.activeDeath.TV = (name == "TV")*2;
        if (env.place == "death") {
            if (name == "TVEnd") {env.restart(ctx, player, data, "TV");} 
            else {env.restart(ctx, player, data, textHandler.getDeath(data.activeDeath));}
        } else {
            switch (name){
                case "Chair":
                    data.chairPos = 60;
                    break;
                
                case "Desk":
                    env.newDay(ctx, data);
                    data.chapter++; 
                    mixer.play("study");
                    break;
                
                case "TV":
                    env.newDay(ctx, data);
                    mixer.play("TV");
                    break;
                
                case "Bed":
                    data.activeDeath.Sleep = 0;
                    data.sleep = data.sleepMax;
                    env.newDay(ctx, data);
                    mixer.play("sleep");
                    break;
                
                case "Radio":
                    data.radioB += 1;
                    if (data.radioB < 8) {
                        mixer.changeBackground();
                    }
                    else {mixer.changeBackground('0')}
                    break;
                
                case "Odd_Bin":
                    data.oddBinIndex = data.gt%9;
                    break;
                
                case "Energy_Drink":
                    data.drink = data.drinkMax;
                    data.activeDeath.Drink = 0;
                    mixer.play("drink");
                    break;
                
                case "Noodles":
                    data.food = data.foodMax;
                    data.activeDeath.Food = false;
                    mixer.play("noodle");
                    break;
                
                case "Greger":
                    mixer.play("greger");
                    textHandler.textLogCount.greger = 1;
                    break;
                
                case "Greger1":
                    mixer.play("greger");
                    if (textHandler.allDeath(data.endings)) {
                        textHandler.textLogCount.greger = 3;
                    } else {
                        textHandler.textLogCount.greger = 2;
                    }
                    break;
                
                case "Greger2":
                    mixer.play("greger");
                    break;
                
                case "GregerFB":
                    if (data.food == data.foodMax && data.drink == data.drinkMax){
                        data.ballPos[3] = 1;
                    } else {
                        data.ballPos[3] = -1;
                    }
                    env.newDay(ctx, data);
                    
                    mixer.play("ball");
                    break;
                
                case "GregerFBE":
                    if (data.food == data.foodMax && data.drink == data.drinkMax){
                        data.ballPos[3] = 1;
                        data.ballScore[0] += 1;
                    } else {
                        data.ballPos[3] = -1;
                        data.ballScore[1] += 1;
                    }
                    env.newDay(ctx, data);
                    
                    mixer.play("ball");
                    break;
                
                case "Note":
                    data.activeDeath.True = 2;
                    break;
                
                case "Trash":
                    if (!data.SecretOpening) {
                        data.trashIndex += 1;
                        if (data.trashIndex == 18) {
                            data.SecretOpening = true;
                            data.trashIndex = 0;
                            mixer.play("secret");
                        }
                    }
                    break;
                
                case "Flower":
                    data.flower = true;
                    
                    mixer.play("flower");
                    break;
                
                case "end":
                    if (data.grade == "true") {
                        env.restart(ctx, player, data, "True");
                        data.endCreditsCount = data.gt;
                        mixer.changeBackground("goodEnd")
                    } else if (data.grade == "flower") {
                        env.restart(ctx, player, data, "Flower");
                    } else if (data.grade == "F" || data.grade == "A++") {
                        env.restart(ctx, player, data, "Exam "+data.grade);
                    } else {
                        env.restart(ctx, player, data, "Exam");
                    }
                    break;
            }
        }
    }
    isHit(boxList,x,y) {// chek if player hits the border
        for (let box of boxList) {
            if (x+3 > box[0] && x-3 < box[0]+box[2] && y+1 > box[1] && y-3 < box[1]+box[3]) {
                return 1;
            }
        }
        return 0;
    }
    isInside(box) {
        if (this.x+3 > box[0] && this.x-3 < box[0]+box[2] && this.y+1 > box[1] && this.y-3 < box[1]+box[3] && (box[4] == -1 || this.dir[0] == box[4])) {
            return true;
        } else {
            return 0;
        }
    }
}