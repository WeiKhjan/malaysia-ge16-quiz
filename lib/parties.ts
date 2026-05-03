export type PartyId = "ph" | "bn" | "pn";

export const PARTIES: Record<PartyId, {
  id: PartyId;
  shortName: string;
  fullKey: string;
  leaderKey: string;
  color: string;
  accent: string;
  emoji: string;
}> = {
  ph: {
    id: "ph",
    shortName: "PH",
    fullKey: "party.ph.full",
    leaderKey: "party.ph.leader",
    color: "#E2231A",
    accent: "#FFE066",
    emoji: "🚀",
  },
  bn: {
    id: "bn",
    shortName: "BN",
    fullKey: "party.bn.full",
    leaderKey: "party.bn.leader",
    color: "#0a2472",
    accent: "#FFD700",
    emoji: "⚖️",
  },
  pn: {
    id: "pn",
    shortName: "PN",
    fullKey: "party.pn.full",
    leaderKey: "party.pn.leader",
    color: "#1A4D2E",
    accent: "#5BE9E9",
    emoji: "🌙",
  },
};

export const PARTY_IDS: PartyId[] = ["ph", "bn", "pn"];
