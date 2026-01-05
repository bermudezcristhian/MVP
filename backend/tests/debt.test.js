const request = require("supertest");
const app = require("../src/app");

let token;

beforeAll(async () => {
  const user = {
    email: "testdebt@test.com",
    password: "123456",
  };

  await request(app).post("/api/auth/register").send(user);

  const res = await request(app)
    .post("/api/auth/login")
    .send(user);

  token = res.body.token;
});

describe("DEBTS API", () => {
  test("Debe crear una deuda", async () => {
    const res = await request(app)
      .post("/api/debts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 5000,
        description: "test cena",
      });

    expect(res.statusCode).toBe(201);
  });

  test("Debe listar las deudas del usuario", async () => {
    const res = await request(app)
      .get("/api/debts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
