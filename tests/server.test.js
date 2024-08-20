const request = require("supertest");
const app = require("../index.js");
const axios = require("axios");

jest.mock("axios");

describe("Metadata Fetching Test", () => {
  it("should return metadata for provided URLs", async () => {
    const mockResponse = {
      data: `
        <html>
          <head>
            <meta property="og:title" content="Example Title">
            <meta property="og:description" content="Example Description">
            <meta property="og:image" content="example-image.png">
          </head>
          <body></body>
        </html>
      `,
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    const urls = {
      url1: "https://example.com",
    };

    const response = await request(app)
      .post("/urls/fetch-metadata")
      .send({ urls })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual([
      {
        url: "https://example.com",
        title: "Example Title",
        description: "Example Description",
        image: "example-image.png",
      },
    ]);
  }, 40000);
});
