export default class Text {
    trash =["my trash can. ¤ ¤ it is probably nothing of interest here ¤ ¤ just a regular old trash can...",
            "why would i check it again?? ¤ ¤ it is just my regular trash can.",
            "i know what i put in here. ¤ ¤ i can only afford energy drinks and noodles, so there are only energy drink cans and noodle boxes inside here.",
            "why am i still searching for something in this trash can? ¤ ¤ there is no point in searching. ¤ ¤ i know what is in here.",
            "well, well... ¤ ¤ since I have already checked out this trash can so many times, i might as well look inside.",
            "augh... ¤ ¤ it's disgusting. ¤ ¤ this trash can is filled to the brim with energy drink cans and noodle boxes. And whatever i couldn't eat or drink that day...",
            "and the smell! ¤ ¤ even from a distance, it smells disgusting. ¤ ¤ i don't know how i can study with this smell next to my house.",
            "i have tried to ignore it since i moved in here, but after taking a proper look inside this trash can, i don't think i can handle it anymore.",
            "i don't even know if this trash can has been emptied before either. ¤ ¤ i certainly haven't done it. ¤ ¤ years of old noodles and energy drinks are just rotting here.",
            "why would i stick my hand in here? ¤ ¤ it smells like someone ran over a raccoon and waited a week before burning it.",
            "i think the energy drinks have evaporated. ¤ ¤ and not in a good way. ¤ ¤ just the water part, so there is just semi-hard gooey sugar and whatever probably unhealthy additives that are left here.",
            "i think i'll have to get to the hospital and replace my arm... ¤ ¤ if there even is a hospital nearby...",
            "i reach further inside the trash can. ¤ ¤ i can feel something here. ¤ ¤ there is something between the weird gooey sugar and the noodle boxes",
            "it feels like a harder metal part. ¤ ¤ although it is hard to even feel anything anymore with this hand.",
            "it feels like a button is hidden inside the trash. ¤ what happens if i press it? ¤ ¤ **click**",
            "i pull my hand out of the trash can. ¤ ¤ that was disgusting. ",
            "there is something written on my arm... ¤ ¤ how?!? ¤ ¤ maybe the trash has been there for so long that it has gained its own consciousness",
            "''i have opened the passage'' ¤ ¤ ''eat the flower on the night of the 3rd to get your freedom'' ¤ ¤ what could that mean?"];
    odd_bin =  ["''why drink?''"                          ,
                "''why eat?''"                            ,
                "''why sleep?''"                          ,
                "''fall asleep while watching TV''"       ,
                "''check the trash can behind the house''",
                "''take the exam''"                       ,
                "''sleep through the exam.''"             ,
                "''get the top grade on the exam''"       ,
                "''follow the instruction''"              ]
    textLog =  {Start: "Welcome to my little game. ¤ ¤ Use 'WASD' or the arrow keys to move ¤ ¤ the action buttons are space and enter.",
        
                DeskNoChair: "i can't study without the chair.",
                DeskNoDrink: "i don't have energy for another chapter",
                DeskNoFood: "i can't study on an empty stomach",
                TV: "i finally have time to watch my favorite TV show",
                TVLast: "can't watch TV. I have to take the exam",
                TVNoChair: "i can't watch TV without the chair.",
                Radio: "this is the Radio",
                Radiob: "the radio is broken...",
                Chair: "there is a small rock blocking the chair. Yeet!",
                Bed: "why not just lay here for a minute... ¤ ¤ zzz...",
                BedLast: "i can't sleep. i have to take the exam.",
                Calender: "the exam is on the 5th of this month.",
                CalenderLast: "the exam is today. i have to go!",
                Odd_BinLast: "i guess the odd bin can't help me now.",

                Flower: "is this the flower the trash can talked about?",
                Out: "maybe if i study hard enough i can leave someday...",
                Store: "closed.",
                GregerFB: "Hi, Greger! ¤ ¤ would you like to play a little ball? ",
                Note: "'meet me outside tomorrow...' ¤ -Greger",
                Ball: "Greger is working. we can't play now.",
                BallNight: "Greger wants to play ball with me.",
                BallTrue: "where is Greger?",
                Tree: "I like trees.",
                TreeNight: "trees frighten me.",

                Greger: "this is Greger",
                Greger1: "I like Greger",
                Greger2: "Greger and i want to play a football tournament, but i have too much too do :(",
                Greger3: "Greger! would you like to play a football tournament? first to 3?",
                Stuff: "the shelf is filled to the brim with everything else the store sells. ¤ ¤ too bad i can't afford anything here though.",
                Energy_Drink: "the shelf is filled to the brim with energy drinks. ¤ ¤ i should probably get one.",
                Noodles: "the shelf is filled to the brim with noodles. ¤ ¤ i should probably get one.",
                Empty_Shelf: "Just an Empty shelf. ¤ ¤ it will probably be refilled tomorrow.",

                Food: "you are dead. ¤ ¤ you should probably eat something...",
                Sleep: "sleep is for the weak! ¤ ¤ seriously, you need sleep",
                Drink: "you are dead. ¤ ¤ you should probably drink something...",
                TVEnd: "you are dead. ¤ ¤ you shouldn't sleep in front  of the TV...",
                Sick: "you are dead. ¤ ¤ the poisonous  flower killed you...",

                end: "you got sick and the teacher sent you to the hospital.",
                endCredits: "A game made by  ¤ ¤ Kristian (krisskloss) ¤ ¤  ¤ ¤  ¤ ¤  ¤ ¤ Story:  ¤ ¤ Kristian (krisskloss) ¤ ¤  ¤ ¤ Programmer: ¤ ¤ Kristian (krisskloss) ¤ ¤  ¤ ¤ Art: ¤ ¤ Kristian (krisskloss)  ¤ ¤ Joel Setterberg (NangiDev) ¤ ¤  ¤ ¤ Music: ¤ ¤ Stine ¤ ¤ Kristian (krisskloss) ¤ ¤  ¤ ¤ Play tester: ¤ ¤ Stine ¤ ¤ Ruben ¤ ¤ Julie ¤ ¤ irene ¤ ¤  ¤ ¤ Thanks again to: ¤ ¤ Stine ¤ ¤ Ruben ¤ ¤ Julie ¤ ¤ irene",
                theEnd: "The end :)"
                }
    updateMidText(data, textHandler) {
        this.textLog.Trash = this.trash[data.trashIndex];
        this.textLog.Desk = `ok, then. i will read a chapter... ¤ ¤ i am on chapter ¤ ${data.chapter+1} of 6.`;
        this.textLog.DeskLast = `i can't read anymore. i have to take the exam. ¤ ¤ i have read ${data.chapter} of 6 chapters.`;
        this.textLog.Odd_Bin = this.odd_bin[data.oddBinIndex];
        this.textLog.End_Table = "Endings:";
        let v = 0;
        for (let en in data.endings) {
            if (data.endings[en] == true) {
                this.textLog.End_Table += " ¤ " + en;
            } else if (en != "True" || textHandler.allDeath(data.endings)) {
                this.textLog.End_Table += " ¤ ???";
            }
            v++;
        }
        this.textLog.GregerFBE = `Hi, Greger! ¤ ¤ would you like to play a little ball? ¤ ¤ the score is ${data.ballScore[0]}-${data.ballScore[1]}`;
        if (data.grade == "flower") {
            this.textLog.end  = "on your way to the exam you passed out on the street and a poor old lady called 911. ¤ ¤ You didn't make it...";
        } else if (data.grade == "true") {
            this.textLog.end  = `Ending: ¤ ¤ True`;
        } else {
            this.textLog.end  = `Exam test results ¤ _____ ¤ `;
            if (data.grade == "A++") {this.textLog.end += `|${data.grade}| \n`;}
            else                     {this.textLog.end += `| ${data.grade} | \n`;}
            this.textLog.end += ` ¤ ^^^^^ ¤ ¤ `;

            switch(data.grade) {
                case "A++": this.textLog.end += "nice"; break;
                case "C": this.textLog.end += "you need to be more prepared"; break;
                case "F": this.textLog.end += "you slept through the entire exam, so the teacher had to flunk you."; break;
            }
        }
        this.textLog.deathText = "i feel... ¤ ";
        if (data.drink == 0) {this.textLog.deathText += " ¤ Thirsty...";}
        if (data.food  == 0) {this.textLog.deathText += " ¤ Hungry...";}
        if (data.sleep == 1) {this.textLog.deathText += " ¤ Tired...";}
        if (data.poison == 1) {this.textLog.deathText += " ¤ Sick...";}
    }
}
