import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  /* Send POST request using Axios */
  const { model, message, parentModel } = await req.json();

  const response = await axios.post(
    "https://kravixstudio.com/api/v1/chat",
    {
      message: message, // Messages to AI
      aiModel: model, // Selected AI model
      outputType: "text", // 'text' or 'json'
    },
    {
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
        Authorization: `Bearer ${process.env.KRAVIXSTUDIO_API_KEY}`,
      },
    }
  );

  return NextResponse.json({ ...response.data, model: parentModel });
}
