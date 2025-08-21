import { NextRequest, NextResponse } from "next/server";
import { genAuthHeader } from "../util";

export async function GET() {
  const header = genAuthHeader();

  try {
    // We can't have more than 100 projects :).
    const response = await fetch(
      `${process.env.SONAR_URL}api/projects/search`,
      {
        headers: { Authorization: header },
      }
    );
    if (!response.ok) {
      throw Error("Cannot fetch project!");
    }
    const data = await response.json();
    // Only show public project.
    const projects = data.components
      .filter((d) => d.visibility === "public")
      .map((d) => {
        return { id: d.key, value: d.name };
      });
    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { projects },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      statusCode: error.statusCode,
      message: "Can't fetch projects!",
    }, 500);
  }
}
