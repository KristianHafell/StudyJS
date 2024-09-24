import Text from './text.js';
const text = new Text();

export default class TextHandler {
    constructor (charList, tText = "", textLog = "") {
        this.tText = tText;
        this.textLog = textLog;
        this.tTextLog = [[50,50,50,50,1,"hjem"]];
        this.textLogCount = {greger: 0};
        this.charList = charList;
    }
    update(env, ctx, place, player, data) {
        text.updateMidText(data, this);
        if (env.infoMessage == "") {
            // draw tText
            if (this.tText != "") { this.drawTText(env, ctx, data.size, this.tText);}
            this.tText = "";
            // draw textLog
            if (this.getTextname(this.textLog, data,env) in text.textLog) { this.drawMText (env, ctx, data, this.textLog);} 
            else {this.textLog = "";}

            this.setTextLogs(place, data);
            
            //check if player inside tTextLog box
            for (let i = 0; i < this.tTextLog.length; i++) {
                if (player.isInside(this.tTextLog[i])) {
                    this.tText = this.tTextLog[i][5];
                }
            }
            if (this.tText == "") {this.textLogCount.greger = 0;}
        } else {
            this.setTextLogs(place, data);
            this.drawMText (env, ctx, data, env.infoMessage);
        }
    }
    drawTText(env, ctx, size, string) {
        try {
            let w = 11+string.length*4
            this.drawBorder(env, ctx, size, [118-w,1,w  ,17])
            for (let i = 0; i < string.length; i++){
                if (string[i] != "_") {
                    this.drawChar(ctx, env, string[i].toLowerCase(), (117-string.length*2)-(string.length*size/2)+i*size,14,size)
                }
            }
        } catch {
            console.log("Error: couldn't load", string)
        }
    }
    drawMText (env, ctx, data, string, posy = 0, posx = 0, drawBorder = true) {
        // wrap to lines of 20 char
        let textWrapped = this.wrappedText(data, string, 20);
        if (drawBorder) {
            //draw main border
            this.drawBorder(env, ctx, data.size, [14, 50-textWrapped.length*3.5, 90, 14+textWrapped.length*7]);
            // draw action border
            this.drawBorder(env, ctx, data.size, [70, 57+textWrapped.length*3.5, 31, 13]);
            // draw action text
            for (let i = 0; i < 6; i++) { this.drawChar(ctx, env, [..."action"][i], 78+4*i, 68+textWrapped.length*3.5 ,data.size)}
        }
        // draw text in main box
        for (let l = 0; l < textWrapped.length; l++){
            for (let i = 0; i < textWrapped[l].length; i++) {
                let char = this.cahr2name(textWrapped[l].split('')[i]).toLowerCase();                
                this.drawChar(ctx, env, char, 64+posx-(textWrapped[l].length*data.size/2)+i*data.size,posy+64-7*textWrapped.length/2+7*l,data.size);                
            }
        }
    }
    setTextLogs(place, data) {
        switch (place){
            case "ute":
                this.tTextLog = [[12,80,8,2,0,"Trash"],
                                 [data.ballPos[0]+data.ballPos[1]-4,21,4,4,-1,"Ball"],
                                 [102,61,4,4,3,"Tree"]];
                if (!data.flower) {this.tTextLog.push([13,11,3,7,-1,"Flower"])}
                if (!data.day)    {this.tTextLog.push([78,86,4,4, 2,"Store"])}
                if (!data.day) {
                    if        (data.ballScore[0] != 3) { this.tTextLog.push([90,27,8,7,-1,"Greger"]);
                    } else if (data.activeDeath.True == 0) { this.tTextLog.push([90,27,8,7,-1,"Note"]);}
                }
                if (data.dayCounter != data.dayCounterMax) {this.tTextLog.push([54,112,12,2,0,"Out"])}
                break;
            case "hjem":
                this.tTextLog = [[28,41,8,2,2,"Calender"],
                                 [53,48,14,2,2,"Desk"],
                                 [77,46,15,2,2,"TV"],
                                 [28,64,11,2,0,"Radio"],
                                 [38,66,2,8,1,"Radio"],
                                 [43,78,2,11,1,"Bed"],
                                 [83,60,2,21,3,"End_Table"],
                                 [84,58,8,2,0,"End_Table"],
                                 [83,85,2,4,3,"Odd_Bin"]];
                if (data.chairPos == 59) {this.tTextLog.push([53,54,2,4,3,"Chair"]);}
                break;
            case "store":
                this.tTextLog = [[68,56,30,2,2,"Stuff"],
                                 [20,80,15,2,2,"Energy_Drink"],
                                 [65,80,32,2,2,"Noodles"]];
                if (data.food  < data.foodMax ) {this.tTextLog.push([65,80,32,2,2,"Noodles"])}
                else                            {this.tTextLog.push([65,80,32,2,2,"Empty_Shelf"])}
                if (data.drink < data.drinkMax) {this.tTextLog.push([20,80,15,2,2,"Energy_Drink"])}
                else                            {this.tTextLog.push([20,80,15,2,2,"Empty_Shelf"])}
                if (data.activeDeath.True == 0) {this.tTextLog.push([39,56,4,2,2,"Greger"])}
                break;
            case "death":
                this.tTextLog = [[-100,-100,300,300,-1,this.getDeath(data.activeDeath)]];
                break;
            case "end":
                this.tTextLog = [[-100,-100,300,300,-1,"end"]];
                break;
        }
    } 
    getTextname(string, data) {
        if (string+"Last" in text.textLog && data.dayCounter == data.dayCounterMax) {return string+"Last";}
        switch (string){
            case "Desk"  :  if (data.dayCounter != 5) {
                                if (data.chairPos > 65) {return "DeskNoChair";};
                                if (data.drink != data.drinkMax) {return "DeskNoDrink";}
                                if (data.food != data.foodMax) {return "DeskNoFood";}
                            }
                            break;
            case "TV"    :  if (data.dayCounter != 5) {
                                if (data.chairPos < 77) {return   "TVNoChair";}
                                if (data.sleep == 0) {return   "TVEnd";}
                            }
                            break;
            case "Greger":  if (!data.day) {
                                if (this.allDeath(data.endings)) {return "GregerFBE";}
                                else                             {return "GregerFB" ;}
                            }
                            if (this.textLogCount.greger != 0) {return "Greger"+this.textLogCount.greger;}
                            break;
            case "Radio" :  if (data.radioB >= 8) {return "Radiob";}
                            break;
            case "Ball"  :  if (data.ballScore[0] == 3) {return "BallTrue";}
        }
        if (string+"Night" in text.textLog && !data.day) {return string+"Night";}

        return string;
    }
    cahr2name (char){
        // change char to the name of the dessognated sprites (a file cannot be named ').png' so here it is 'bp.png')
        switch (char) {
            case ")": return "bp" ;
            case ":": return "co" ;
            case ".": return "do" ;
            case "=": return "eq" ;
            case "!": return "ex" ;
            case "(": return "fp" ;
            case "/": return "fs" ;
            case "#": return "ht" ;
            case ",": return "ko" ;
            case "|": return "li" ;
            case "-": return "mi" ;
            case "+": return "pl" ;
            case "?": return "qu" ;
            case ";": return "sc" ;
            case " ": return "sp" ;
            case "'": return "sq" ;
            case "*": return "st" ;
            case "_": return "ul" ;
            case "^": return "upl";
            default:  return char;
        }
      }
    wrappedText(data, string, lineLen) {
        string = text.textLog[this.getTextname(string, data)]
        let ret = [];
        for (let i=0, cL=''; i<string.split(' ').length; i++) {
            let word = string.split(' ')[i];
            if (word == "¤"){
                ret.push(cL);
                cL = "";
            } else if ((cL + ' ' + word).trim().length <= lineLen) {
                cL = (cL + ' ' + word).trim();
            } else {
                ret.push(cL);
                cL = word;
            }
            if (i == string.split(' ').length-1) {
                ret.push(cL);
            }
        }
        return ret;
    }
    drawChar(ctx, env, name, x, y, size, reversed = false) {
        try {
            const image = this.charList[name];
            if (ctx === -1) {return [x*size, y*size, image.width*size, image.height*size];}
            else {
                ctx.drawImage(image, x*size, y*size, image.width*size, image.height*size);
                if (reversed) {env.RecerseC(ctx, [x*size, y*size, image.width*size, image.height*size]);}
            }
        } catch {
            console.log("TypeError: Cannot read properties of", name, "\n at Env.drawChar")
        }
    }
    drawBorder(env, ctx, size, b) {
        env.drawBox(ctx,[b[0]  ,b[1]  ,b[2]  ,b[3]  ],size, "rgba(0,0,0,1)");
        env.drawBox(ctx,[b[0]+1,b[1]+1,b[2]-2,b[3]-2],size);
        env.drawBox(ctx,[b[0]+2,b[1]+2,b[2]-4,b[3]-4],size, "rgba(0, 0, 0, 1)");
    }
    getDeath(activeDeath) {
        for (let ad in activeDeath) {
            if (activeDeath[ad] == 2) {return ad}
        }
    }
    allDeath(activeDeath) {
        for (let ad in activeDeath) {
            if (activeDeath[ad] == 0 && ad != "True") {return false}
        }
        return true
    }
}