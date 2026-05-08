import { createAiAnalysis } from "@/lib/ai-analysis";
import { getMockNbaData } from "@/lib/nba-data";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown };
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return Response.json(
        { error: "Enter an NBA team or player to research." },
        { status: 400 },
      );
    }

    const data = await getMockNbaData(query);
    const { analysis, analysisMode, warning } = await createAiAnalysis(data);

    return Response.json({
      query,
      data,
      analysis,
      analysisMode,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    console.error("Research route failed", error);

    return Response.json(
      { error: "Unable to generate research right now." },
      { status: 500 },
    );
  }
}
