import {GameResult, newRank} from './elo'

class Player {
    public rank = 2000;
    public won = 0;
    public lost = 0;
    public draw = 0;
    
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


class SinglePlayerGame { 
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

let game = new SinglePlayerGame();

console.log("Init...");
for(let i = 10; i > 0; --i) {
    let skill = i * 4
    game.addPlayer(new Player("Player[" + i + "]", skill))
}
console.log("Start...");
for(let i = 100; i > 0; --i) {
    game.playForAll();
}

game.print();
