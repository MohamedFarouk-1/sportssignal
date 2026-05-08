import type { NbaResearchData } from "@/types/research";

type MockProfile = Omit<NbaResearchData, "query" | "generatedAt"> & {
  aliases: string[];
};

const sourceNotes = [
  "Local mock data shaped like a future NBA stats provider response.",
  "Built for demo workflows; replace this layer with official NBA, Sportradar, or Basketball-Reference style integrations later.",
  "No live data, betting advice, or injury reporting is included in this MVP response.",
];

const mockProfiles: MockProfile[] = [
  {
    aliases: ["boston celtics", "celtics", "bos"],
    displayName: "Boston Celtics",
    subjectType: "team",
    matchedProfile: true,
    creatorAngle:
      "The Celtics are winning the math game without needing a perfect shooting night.",
    narrative:
      "Boston's best content lane is the tension between boring dominance and how hard it is to solve five-out spacing over a seven-game series.",
    risk: "The story gets flatter if the opponent keeps them out of transition and turns late possessions into isolation bailouts.",
    hook: "The Celtics do not need to shoot lights out to break your defense anymore.",
    recentSignals: [
      "The offense is creating earlier corner decisions, forcing defenses to choose between tagging the roll and staying glued to shooters.",
      "Their double-big and small-ball looks are both producing clean second-side threes, which makes the rotation harder to scout.",
      "Late-game possessions are less frantic when the first action bends the floor before the star isolation arrives.",
    ],
    performanceSnapshot: {
      recordOrTrend:
        "Top-tier recent profile with strong half-court efficiency and low turnover pressure",
      netRating: "+9.4 in the mock recent sample",
      pace: "Controlled pace, with selective early offense after stops",
      clutchNote:
        "Clutch creation is strong, but the content risk is that bad misses can still look like passive three-point hunting.",
    },
    notableStats: [
      "Mock corner-three quality is up 6.1 percentage points from the prior sample.",
      "Opponent rim attempts drop when Boston keeps two plus defenders on the back line.",
      "The weakest visual trend is offensive stagnation after two empty pull-up possessions.",
    ],
    sourceNotes,
  },
  {
    aliases: ["los angeles lakers", "lakers", "la lakers", "lal"],
    displayName: "Los Angeles Lakers",
    subjectType: "team",
    matchedProfile: true,
    creatorAngle:
      "The Lakers are still a star-power story, but the better creator angle is whether their role players can keep the floor spaced enough for the stars to close.",
    narrative:
      "Every Lakers segment becomes a referendum on urgency: can they survive the non-star minutes and turn size into playoff-style pressure?",
    risk: "If the shooting slips, the whole story becomes crowded paint, late-clock jumpers, and transition defense stress.",
    hook: "The Lakers' season keeps coming down to the same uncomfortable question.",
    recentSignals: [
      "The best stretches come when the stars start possessions downhill instead of surveying against a loaded paint.",
      "Weak-side spacing is deciding whether their post touches become advantages or traffic jams.",
      "Their most shareable clips are defensive stands that turn into early offense before the defense gets matched.",
    ],
    performanceSnapshot: {
      recordOrTrend:
        "Mock 5-3 stretch with a clear split between star-led lineups and bench-heavy minutes",
      netRating: "+4.1 overall, +8.7 with the primary stars in the sample",
      pace: "Middle pace, but dangerous when live-ball turnovers become runouts",
      clutchNote:
        "The closing group can generate pressure, but possessions get thin when the first drive is walled off.",
    },
    notableStats: [
      "Mock rim-pressure possessions are producing a strong free-throw rate.",
      "Catch-and-shoot volume from role players is the swing stat for every credible Lakers take.",
      "Transition defense remains the cleanest criticism when lineups get older and bigger.",
    ],
    sourceNotes,
  },
  {
    aliases: ["anthony edwards", "ant edwards", "edwards", "ant"],
    displayName: "Anthony Edwards",
    subjectType: "player",
    matchedProfile: true,
    creatorAngle:
      "Anthony Edwards is becoming a superstar content engine because the highlights now come with real defensive and playmaking growth.",
    narrative:
      "The strongest angle is not just that Ant can explode; it is that he is learning when to bend the defense before hunting the poster.",
    risk: "The counterpoint is shot selection: if the pull-up jumper arrives too early, the offense can lose its advantage before the second action.",
    hook: "Anthony Edwards is turning the highlight package into a complete superstar case.",
    recentSignals: [
      "More possessions are starting with Ant rejecting the screen, forcing the low man into impossible help choices.",
      "His passing reads are sharper when teams load the nail early.",
      "The defensive clips are louder now because he is turning pressure into offense instead of only chasing blocks.",
    ],
    performanceSnapshot: {
      recordOrTrend:
        "Mock 29.1 points, 6.0 rebounds, and 5.4 assists over the recent sample",
      netRating: "+7.2 in high-usage minutes",
      pace: "Fastest impact comes after defensive rebounds and live-ball steals",
      clutchNote:
        "Late-game shot-making is elite-content friendly, but the smarter read is whether he creates the first rotation before rising up.",
    },
    notableStats: [
      "Mock potential assists are up while usage stays near star level.",
      "Rim attempts are creating more weak-side corner threes than the box score makes obvious.",
      "Pull-up three frequency is the risk stat when defenses bait him into early-clock jumpers.",
    ],
    sourceNotes,
  },
  {
    aliases: ["nikola jokic", "jokic", "joker"],
    displayName: "Nikola Jokic",
    subjectType: "player",
    matchedProfile: true,
    creatorAngle:
      "Nikola Jokic content works best when it explains how he removes defensive choices before the pass even happens.",
    narrative:
      "The story is control: Jokic turns normal coverage into a menu, then makes the easiest-looking read feel inevitable.",
    risk: "The only clean critique is defensive workload and whether opponents can force enough space decisions at the other end.",
    hook: "Jokic is not reacting to the defense. He is editing it in real time.",
    recentSignals: [
      "His touch-pass windows are arriving before help defenders fully commit.",
      "Denver's cutters are getting cleaner lanes because defenders are stuck guarding both the pass and the fake.",
      "The two-man game still creates the most reliable late-clock offense in this mock sample.",
    ],
    performanceSnapshot: {
      recordOrTrend:
        "Mock near triple-double profile with elite half-court efficiency",
      netRating: "+10.8 with the primary starters in the recent sample",
      pace: "Deliberate, but never slow once the defense overhelps",
      clutchNote:
        "The clutch edge is that Denver can get a good shot without needing a difficult first option.",
    },
    notableStats: [
      "Mock assist quality is highest on possessions where Jokic touches the ball above the break.",
      "Cut frequency rises when opponents send an early dig from the strong side.",
      "Defensive transition matchups are the pressure point if Denver misses at the rim.",
    ],
    sourceNotes,
  },
  {
    aliases: ["oklahoma city thunder", "okc thunder", "thunder", "okc"],
    displayName: "Oklahoma City Thunder",
    subjectType: "team",
    matchedProfile: true,
    creatorAngle:
      "OKC is the perfect creator team because the youth angle is obvious, but the real story is how mature their spacing and defensive pressure already look.",
    narrative:
      "The Thunder are not just ahead of schedule; they play like a team trying to make opponents defend every inch of the floor.",
    risk: "The playoff question is still physicality: can their drive-and-kick rhythm survive when whistles tighten and possessions slow down?",
    hook: "The Thunder are young, but their offense is not immature.",
    recentSignals: [
      "Drive-and-kick possessions are producing early paint touches without sacrificing spacing.",
      "Defensive pressure is turning average ball-handlers into rushed decision-makers.",
      "The second side is where OKC's offense looks older than its roster age.",
    ],
    performanceSnapshot: {
      recordOrTrend:
        "Mock 6-2 recent stretch with strong point differential against varied styles",
      netRating: "+11.3 in the recent sample",
      pace: "Fast decision pace, not just fast running pace",
      clutchNote:
        "The late-game offense is cleaner when the first drive collapses the shell instead of settling for a mismatch jumper.",
    },
    notableStats: [
      "Mock paint-touch-to-corner-three sequences are up 7.4 percentage points.",
      "Forced turnover rate is the best visual stat for short-form edits.",
      "Defensive rebounding is the obvious counterargument for a balanced creator take.",
    ],
    sourceNotes,
  },
];

const genericTeamAliases = [
  "hawks",
  "nets",
  "hornets",
  "bulls",
  "cavaliers",
  "mavericks",
  "nuggets",
  "pistons",
  "warriors",
  "rockets",
  "pacers",
  "clippers",
  "grizzlies",
  "heat",
  "bucks",
  "timberwolves",
  "pelicans",
  "knicks",
  "magic",
  "76ers",
  "sixers",
  "suns",
  "blazers",
  "kings",
  "spurs",
  "raptors",
  "jazz",
  "wizards",
];

export async function getMockNbaData(query: string): Promise<NbaResearchData> {
  const normalizedQuery = query.trim();
  const lowerQuery = normalizedQuery.toLowerCase();
  const profile = mockProfiles.find((item) =>
    item.aliases.some((alias) => lowerQuery.includes(alias)),
  );

  if (profile) {
    return {
      displayName: profile.displayName,
      subjectType: profile.subjectType,
      matchedProfile: profile.matchedProfile,
      creatorAngle: profile.creatorAngle,
      narrative: profile.narrative,
      risk: profile.risk,
      hook: profile.hook,
      recentSignals: profile.recentSignals,
      performanceSnapshot: profile.performanceSnapshot,
      notableStats: profile.notableStats,
      sourceNotes: profile.sourceNotes,
      query: normalizedQuery,
      generatedAt: new Date().toISOString(),
    };
  }

  const subjectType = genericTeamAliases.some((team) => lowerQuery.includes(team))
    ? "team"
    : "player";

  return createGenericReport(normalizedQuery, subjectType);
}

function createGenericReport(
  query: string,
  subjectType: NbaResearchData["subjectType"],
): NbaResearchData {
  const isTeam = subjectType === "team";

  return {
    query,
    displayName: query,
    subjectType,
    matchedProfile: false,
    generatedAt: new Date().toISOString(),
    creatorAngle: isTeam
      ? "Frame the team around one clear swing factor: whether the recent process is sustainable against better opponents."
      : "Frame the player around the gap between box-score production and the decisions that create repeatable advantages.",
    narrative: isTeam
      ? "The useful creator lane is process over record: shot quality, matchup pressure, and the one weakness opponents will target."
      : "The useful creator lane is evolution: what has changed in the player's reads, shot diet, or defensive role.",
    risk: isTeam
      ? "The take gets weaker if the sample is driven by opponent shooting variance instead of repeatable creation."
      : "The take gets weaker if usage is rising without better shot quality or playmaking pressure.",
    hook: isTeam
      ? `${query} has a trend worth watching, but it is not the one fans are arguing about.`
      : `${query} has a box-score story and a film story. The film story is more interesting.`,
    recentSignals: isTeam
      ? [
          "Half-court possessions are the best place to judge whether the recent trend is real.",
          "Lineup context matters more than the final score when building a creator segment.",
          "The strongest angle pairs one optimistic stat with one obvious playoff-style concern.",
        ]
      : [
          "Shot selection, assist chances, and defensive responsibility are the cleanest signals to track.",
          "The creator angle improves when production is tied to a repeatable decision rather than a hot shooting stretch.",
          "The counterargument should be visible on film, not just buried in advanced metrics.",
        ],
    performanceSnapshot: {
      recordOrTrend: isTeam
        ? "Generic mock trend: positive recent efficiency with matchup-dependent questions"
        : "Generic mock trend: elevated usage with a need to separate creation from shot-making variance",
      netRating: "Neutral-to-positive in the mock recent sample",
      pace: isTeam
        ? "Most effective when early offense creates cross-matches"
        : "Most dangerous when attacking before the defense loads up",
      clutchNote: isTeam
        ? "Late-game execution is the key watch point because it reveals whether the offense has a reliable first option."
        : "Late-game value depends on whether the player creates an advantage before settling into a tough shot.",
    },
    notableStats: isTeam
      ? [
          "Track corner-three quality, paint touches, and defensive rebounding in the next sample.",
          "Compare starter-heavy minutes against bench-heavy minutes before making a broad claim.",
          "Opponent transition chances are the cleanest warning stat for a balanced take.",
        ]
      : [
          "Track potential assists, rim pressure, and pull-up shot frequency in the next sample.",
          "Separate usage growth from advantage creation before calling it a leap.",
          "Defensive activity stats can support the take if the film shows real role expansion.",
        ],
    sourceNotes,
  };
}
