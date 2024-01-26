"use strict";
require("dotenv").config();
const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");

const app = express();

app.get("/generatePoll", (req, res) => {
  const prompt = `Given the following poll title and description:

  Title: "${req.body.poll_title}"
  Description: "${req.body.poll_description}"
  
  Please provide a well-formatted JSON object containing 10 questions related to the poll topic. For each question, include up to four possible answers, and ensure that your choices are relevant to the given poll context. Try to understand the user's preferences and stick to the provided topic. Also, provide an extra key like "other" with a boolean value, indicating whether the question has an "other" option or not.

  Example JSON format:
  {
    "questions": [
      {
        "question": "What is your preferred method of transportation?",
        "answers": ["Car", "Public transportation", "Bicycle", "Walking"],
        "other": false
      },
      // ... (repeat for 9 more questions)
    ]
  }
`;

  createNonStreamingMultipartContent();
  /**
   * TODO(developer): Update these variables before running the sample.
   */
  async function createNonStreamingMultipartContent(
    projectId = "rellenobot",
    location = "us-central1",
    model = "gemini-pro-vision"
    // image = "gs://generativeai-downloads/images/scones.jpg",
    // mimeType = "image/jpeg"
  ) {
    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });

    // Instantiate the model
    const generativeVisionModel = vertexAI.preview.getGenerativeModel({
      model: model,
    });

    // // For images, the SDK supports both Google Cloud Storage URI and base64 strings
    // const filePart = {
    //   fileData: {
    //     fileUri: image,
    //     mimeType: mimeType,
    //   },
    // };

    const textPart = {
      text: prompt,
    };

    const request = {
      contents: [{ role: "user", parts: [textPart] }],
    };

    console.log("Prompt Text:");
    console.log(request.contents[0].parts[0].text);

    console.log("Non-Streaming Response Text:");
    // Create the response stream
    const responseStream = await generativeVisionModel.generateContentStream(
      request
    );

    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;

    // Select the text from the response
    const fullTextResponse =
      aggregatedResponse.candidates[0].content.parts[0].text;

    console.log(fullTextResponse);
    if (fullTextResponse.length > 0) {
      res.json({
        ok: true,
        generated: JSON.parse(fullTextResponse),
      });
    } else {
      res.json({
        ok: false,
        msg: "Error with vertex answer",
      });
    }
  }
});

module.exports = app;
