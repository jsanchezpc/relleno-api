"use strict";
require("dotenv").config();
const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");

const app = express();

app.get("/generatePoll", (req, res) => {
  const prompt = `I'll give you a poll title and description, and I want you to give me 10 questions following the poll topic, with up to four answers for each question (use your critearia based on each question). Try to understand what the user really want and stick to the topic. This is the title: "${req.body.poll_title}", and this is the poll description: ${req.body.poll_description}`;

  createNonStreamingMultipartContent()
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
  }
});

module.exports = app;
