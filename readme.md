elo
---

A simple test for the elo ranking system. Run with

    node bin/singleplayergame.js

It creates 10 players (with different skills `skill = 3 * i`) and plays 100 games for each player (aganst a random opponent).
The game is very simple. Both players roll a dice. The player who rolls the higher number wins.
The skill of a player manifests in the dice roll:

    class Player {
        
        ...

        public rollDice(): number {
            return Math.floor(Math.random() * 40 - 20 + this.skill);
        }

        ...
    }