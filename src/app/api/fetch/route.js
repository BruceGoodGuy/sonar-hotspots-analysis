import { NextRequest, NextResponse } from "next/server";
import { genAuthHeader } from "../util";
import { Percent } from "lucide-react";

const fetchHotspots = async (projectKey, page) => {
  const header = genAuthHeader();
  const pagesize = 100;

  try {
    const response = await fetch(
      `${process.env.SONAR_URL}api/hotspots/search?projectKey=${projectKey}&p=${page}&ps=${pagesize}`,
      {
        headers: { Authorization: header },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(
        errorMessage?.errors[0]?.msg || "Failed to fetch hotspots"
      );
    }
    const data = await response.json();
    console.log(data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error?.message ?? "Can't fetch resources",
    };
  }
};

const fetchAllHotspots = async (projectKey, send) => {
  let isStop = false;
  let page = 1;
  let pageData;
  let hotspots = [];
  while (!isStop) {
    const data = await fetchHotspots(projectKey, page);
    if (!pageData) {
      pageData = data.data.paging;
    }
    if (!data.success) {
      send({
        step: "fetch",
        payload: {
          percent:
            hotspots.length > 0
              ? Math.round((hotspots.length / (pageData?.total ?? 1)) * 100)
              : 0,
          status: "failed",
          total: pageData?.total ?? 0,
          hotspots: hotspots.length,
          detail: "Can't fetch hotspots",
        },
      });
      return { success: false, hotspots, pageData };
    }
    if (data.data.hotspots.length === 0) {
      send({
        step: "fetch",
        payload: {
          percent: Math.round((hotspots.length / (pageData?.total ?? 1)) * 100),
          status: "done",
          detail: "Fetched all hotspots",
          total: pageData?.total ?? 0,
          hotspots: hotspots.length,
        },
      });
      isStop = true;
    } else {
      send({
        step: "fetch",
        payload: {
          percent: Math.round((hotspots.length / (pageData?.total ?? 1)) * 100),
          status: "processing",
          detail: "Fetched hotspots",
          total: pageData?.total ?? 0,
          hotspots: hotspots.length,
        },
      });
      hotspots = hotspots.concat(data.data.hotspots);
      page++;
    }
  }
  return { success: true, hotspots, pageData };
};

function summarizeHotspots(hotspots) {
  const summary = {
    total: hotspots.length,
    byAuthor: {},
    byRule: {},
    byProject: {},
    byStatus: {},
    byVulnerabilityProbability: {},
  };

  for (const h of hotspots) {
    // By Author
    summary.byAuthor[h.author] = (summary.byAuthor[h.author] || 0) + 1;

    // By Rule
    summary.byRule[h.ruleKey] = (summary.byRule[h.ruleKey] || 0) + 1;

    // By Project
    summary.byProject[h.project] = (summary.byProject[h.project] || 0) + 1;

    // By Status
    summary.byStatus[h.status] = (summary.byStatus[h.status] || 0) + 1;

    summary.byVulnerabilityProbability[h.vulnerabilityProbability] =
      (summary.byVulnerabilityProbability[h.vulnerabilityProbability] || 0) + 1;
  }

  return summary;
}

export async function POST(request) {
  try {
    const { projectKey } = await request.json();

    const enc = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj) =>
          controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));

        try {
          const { success, hotspots } = await fetchAllHotspots(
            projectKey,
            send
          );
          if (!success) {
            controller.close();
            return;
          }
          const summary = summarizeHotspots(hotspots);
          console.log(summary);
          send({
            step: "store",
            payload: {
              status: "processing",
              detail: "Connected to SonarQube server",
            },
          });

          send({
            step: "store",
            payload: {
              status: "done",
              detail: "Connected to SonarQube server",
            },
          });
          controller.close();
        } catch (err) {
          send({
            step: "error",
            payload: {
              detail: String(err?.message || err),
            },
          });
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "content-type": "application/x-ndjson",
        "cache-control": "no-cache",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Can't fetch data.",
      },
      { status: 500 }
    );
  }
}
