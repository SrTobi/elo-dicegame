import {GameResult, newRank} from './elo'

class Player {
    public rank = 2000;
    public won = 0;
    public lost = 0;
    public draw = 0;
    public group = -1;
    
    constructor(public name: string,
                private skill: number) {
        
    }
    
    public rollDice(): number {
        return Math.floor(Math.random() * 40 - 20 + this.skill);
    }
    
    public addGame(opponent: number, result: GameResult) {
        switch(result) {
            case GameResult.Won: this.won++;
            case GameResult.Draw: this.draw++;
            case GameResult.Lost: this.lost++;
        }
        
        this.rank = newRank(this.rank, opponent, result);
    }
    
    public print() {
        console.log(this.name + ": " + this.rank);
    }
}


class SinglePlayerELOGame { 
    private players: Player[] = [];
    
    public addPlayer(ply: Player) {
        this.players.push(ply);
    }
    
    public playRandomGame() {
        let p1 = 0;
        let p2 = 0;
        while (p1 == p2) {
            p1 = Math.floor(Math.random()*this.players.length);
            p2 = Math.floor(Math.random()*this.players.length);
        }
        
        this.playGame(this.players[p1], this.players[p2]);
    }
    
    public playForAll() {
        this.players.forEach(p => this.playRandomGameWith(p));
    }
    
    public playRandomGameWith(p1: Player) {
        
        let p2: Player = null;
        do {
            p2 = this.players[Math.floor(Math.random()*this.players.length)];
        } while(p1 == p2);
        
        this.playGame(p1, p2);
    }
    
    public playGame(p1: Player, p2: Player) {
        let d1 = p1.rollDice();
        let d2 = p2.rollDice();
        
        if(d1 == d2) {
            p1.addGame(p2.rank, GameResult.Draw);
            p2.addGame(p1.rank, GameResult.Draw);
        } else if(d1 < d2) {
            p1.addGame(p2.rank, GameResult.Lost);
            p2.addGame(p1.rank, GameResult.Won);
        } else {
            p1.addGame(p2.rank, GameResult.Won);
            p2.addGame(p1.rank, GameResult.Lost);
        }
    }
    
    public print() {
        this.players
            .concat()
            .sort((a, b) => b.rank - a.rank )
            .forEach(p => p.print());
    }
}



class SinglePlayerGroupPhaseGame { 
    private players: Player[] = [];
    
    public addPlayer(ply: Player) {
        ply.rank = 0;
        ply.group = this.players.length % 2;
        this.players.push(ply);
    }

    public shuffleGroups() {
        for(let i = 0; i < 300; ++i) {
            let p1 = Math.floor(Math.random()*this.players.length);
            let p2 = Math.floor(Math.random()*this.players.length);
            
            let tmp = this.players[p1].group;
            this.players[p1].group = this.players[p2].group;
            this.players[p2].group = tmp;
        }
    }
    
    /*public playRandomGame() {
        let p1 = 0;
        let p2 = 0;
        while (p1 == p2) {
            p1 = Math.floor(Math.random()*this.players.length);
            p2 = Math.floor(Math.random()*this.players.length);
        }
        
        this.playGame(this.players[p1], this.players[p2]);
    }*/
    
    public playForAll() {
        this.players.forEach(p => this.playRandomGameWith(p));
    }
    
    public playRandomGameWith(p1: Player) {
        
        let p2: Player = null;
        do {
            p2 = this.players[Math.floor(Math.random()*this.players.length)];
        } while(p1 == p2 || p1.group != p2.group);
        
        this.playGame(p1, p2);
    }
    
    public playGame(p1: Player, p2: Player) {
        let d1 = p1.rollDice();
        let d2 = p2.rollDice();
        
        if(d1 == d2) {
            p1.rank += 1;
            p2.rank += 1;
        } else if(d1 < d2) {
            p2.rank += 2;
        } else {
            p1.rank += 2;
        }
    }

    public finalizeGame() {
        let g0 = this.getGroup(0);
        let g1 = this.getGroup(1);

        for(let i = 0; i < g0.length; ++i) {
            let p0 = g0[i];
            let p1 = g1[i];


            do {
                var d0 = p0.rollDice();
                var d1 = p1.rollDice();
            } while (d0 == d1);

            if (d0 < d1) {
                p0.rank = i * 2 + 1;
                p1.rank = i * 2;
            } else {
                p0.rank = i * 2;
                p1.rank = i * 2 + 1;
            }
        }
    }

    private getGroup(g: number) {
        return this.players
            .concat()
            .filter(p => p.group == g)
            .sort((a, b) => b.rank - a.rank);
    }

    public printGroup(g: number) {
        this.getGroup(g).forEach(p => p.print());
    }
    
    public print() {
        this.players
            .concat()
            .sort((a, b) => b.rank - a.rank )
            .forEach(p => p.print());
    }
}

let elogame = new SinglePlayerELOGame();
let phasegame = new SinglePlayerGroupPhaseGame();

console.log("Init...");
for(let i = 12; i > 0; --i) {
    let skill = i * 4
    elogame.addPlayer(new Player("Player[" + i + "]", skill));
    phasegame.addPlayer(new Player("Player[" + i + "]", skill));
}

phasegame.shuffleGroups();

console.log("Group 0");
phasegame.printGroup(0);

console.log("Group 1");
phasegame.printGroup(1);


let rounds = 3;

console.log(`Start ${rounds} rounds...`);

for(let i = 20; i > 0; --i) {
    elogame.playForAll();
    phasegame.playForAll();
}

elogame.print();

console.log("\n Phasegame:");

phasegame.finalizeGame();
phasegame.print();
