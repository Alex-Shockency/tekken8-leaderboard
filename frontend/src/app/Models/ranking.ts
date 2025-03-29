export interface Ranking {
    id: number,
    date: string,
    power: number,
    qualified: boolean,
    rank: number,
    rating: number,
    recent_battles: [];
    battle_count: number;
}