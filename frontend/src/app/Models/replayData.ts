import { Replay } from "./replay";

export interface ReplayData {
  metadata: { count: number },
  replays: Replay[]
}
