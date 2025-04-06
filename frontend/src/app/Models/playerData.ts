import { Ranking } from "./ranking";

export interface PlayerData {
    name: string,
    tekken_id: string,
    rankings: Ranking[],
    qual_rankings: Ranking[]
    max_qual_chara: Ranking
}