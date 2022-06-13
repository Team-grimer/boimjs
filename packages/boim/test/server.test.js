import app from "../server/loader";

const request = require("supertest");

const server = app();
let appServer;

beforeEach(() => {
  appServer = server.listen(3006, () => {
    console.log("Server is listening on port 3006 in test");
  });
});

afterEach(() => {
  appServer.close();
});

describe("Server test", () => {
  test("Should respond html file.", async () => {
    const res = await request(appServer).get("/");
    expect(res.headers["content-type"]).toMatch(/html/);
  });

  test("Should respond with a status 500, if the resource does not exist.", async () => {
    const res = await request(appServer).get("/");
    expect(res.status).toBe(500);
  });
});
