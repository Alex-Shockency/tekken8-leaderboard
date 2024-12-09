export interface Replay {
    _id: string;
    battle_at: number;
    battle_at_date: string;
    battle_type: number;
    game_version:number;
    p1_area_id:number;
    p1_chara_id: number,
    p1_lang: string,
    p1_name: string,
    p1_polaris_id: string,
    p1_power: number,
    p1_rank: number,
    p1_rating_before: number,
    p1_rating_change: number,
    p1_region_id: number,
    p1_rounds: number,
    p1_user_id: number,
    p2_area_id:number;
    p2_chara_id: number,
    p2_lang: string,
    p2_name: string,
    p2_polaris_id: string,
    p2_power: number,
    p2_rank: number,
    p2_rating_before: number,
    p2_rating_change: number,
    p2_region_id: number,
    p2_rounds: number,
    p2_user_id: number,
    stage_id: number,
    winner: number
  }
  