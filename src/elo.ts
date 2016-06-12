
export enum GameResult {
    Won,
    Draw,
    Lost
}

export function transformRank(rank: number) {
    return Math.pow(10, rank / 400);
}

export function expectedScore(player: number, opponent: number) {
    let p = transformRank(player);
    let o = transformRank(opponent);
    return p / (p + o);
}

export function score(result: GameResult) {
    switch(result) {
        case GameResult.Won: return 1;
        case GameResult.Draw: return 0.5;
        case GameResult.Lost: return 0;
    }
}

export function newRank(player: number, opponent: number, result: GameResult): number {
    return Math.round(player + 32 * (score(result) - expectedScore(player, opponent)));
}