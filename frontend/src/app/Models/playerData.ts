import { Ranking } from "./ranking";

export interface PlayerData {
    name: string,
    tekken_id: string,
    max_rating: number,
    max_chara: number,
    max_rank: number,
    max_qual_rating: number,
    max_qual_chara: number,
    max_qual_rank: number,
    last_seen: string,
    last_qual_seen: string,
    rankings: Ranking[],
    qual_rankings: Ranking[]
}