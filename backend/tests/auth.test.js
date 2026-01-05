const request = require("supertest");
const app = require("../src/app");

describe("AUTH API", () => {
  it("Debe registrar un usuario", async () => {
    const user = {
      email: `test_${Date.now()}@test.com`,
      password: "123456",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(user.email);
  });
});
