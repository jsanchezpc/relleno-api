"use strict";
require("dotenv").config();
const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");

const app = express();

app.post("/generatePoll", async (req, res) => {
  try {
    const prompt = `Please provide a well-formatted JSON object with ${req.body.pollMaxCount} questions related to the poll topic. Each question should have a unique ID, a question text, up to four relevant answer options, and an option for users to specify another response only if needed.
    
    Poll Title: "${req.body.poll_title}"
    Poll Description: "${req.body.poll_description}"
    
    Example JSON format:
    {
      "questions": [
        {
          "id": "1",
          "question": "Question 1",
          "answers": [
            {"id": "1", "text": "Option 1"},
            {"id": "2", "text": "Option 2"},
            {"id": "3", "text": "Option 3"},
            {"id": "4", "text": "Other (please specify)", "allow_other": true}
          ]
        },
        // Add more questions here...
      ]
    }`;

    await createNonStreamingMultipartContent();

    async function createNonStreamingMultipartContent(
      projectId = "rellenobot",
      location = "us-central1",
      model = "gemini-pro-vision"
    ) {
      const vertexAI = new VertexAI({
        project: projectId,
        location: location,
        credentials: {
          apiKey: process.env.GOOGLE_API_KEY
        }
      });

      const generativeVisionModel = vertexAI.preview.getGenerativeModel({
        model: model,
      });

      const textPart = {
        text: prompt,
      };

      const request = {
        contents: [{ role: "user", parts: [textPart] }],
      };

      // console.log("Prompt Text:");
      // console.log(request.contents[0].parts[0].text);

      // console.log("Non-Streaming Response Text:");
      const responseStream = await generativeVisionModel.generateContentStream(
        request
      );

      const aggregatedResponse = await responseStream.response;

      const fullTextResponse =
        aggregatedResponse.candidates[0].content.parts[0].text;

      let cleanedResponse = fullTextResponse;

      // Eliminar contenido antes del primer '{'
      const startIndex = fullTextResponse.indexOf("{");
      if (startIndex !== -1) {
        cleanedResponse = fullTextResponse.slice(startIndex);
      }

      // Eliminar contenido después del último '}'
      const endIndex = fullTextResponse.lastIndexOf("}");
      if (endIndex !== -1) {
        cleanedResponse = cleanedResponse.slice(0, endIndex + 1);
      }

      // console.log(cleanedResponse);

      // Check for and remove triple backticks at the beginning
      let toCleanString = cleanedResponse.replace(/^```+/, "");

      // Check for and remove triple backticks at the end
      let stringCleaned = toCleanString.replace(/```+$/, "");

      // console.log(stringCleaned);

      if (stringCleaned.length > 0) {
        res.json({
          ok: true,
          generated: JSON.parse(stringCleaned),
        });
      } else {
        res.json({
          ok: false,
          msg: "Error with vertex answer",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      ok: false,
      msg: "Internal server error",
    });
  }
});

module.exports = app;
