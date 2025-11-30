import request from "supertest";
import jwt from "jsonwebtoken";
import { web } from "../src/application/web.js";

// Secret JWT sama seperti di server
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

describe("POST /authenticate", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: 3, username: "miceldoang", roleId: 1 }, // tambahkan roleId
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("TEST TOKEN:", token);
  });

  it("should return user data with valid token", async () => {
    const res = await request(web)
      .post("/authenticate")
      .set("Cookie", `auth_token=${token}`) // kirim cookie
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe("miceldoang");
  });

  it("should fail without token", async () => {
    const res = await request(web).post("/authenticate").expect(401); // middleware biasanya return 401

    expect(res.body.message).toBeDefined();
  });

  it("should fail with invalid token", async () => {
    const res = await request(web)
      .post("/authenticate")
      .set("Cookie", `auth_token=ablakakalakal`) // kirim cookie
      .expect(401);

    expect(res.body.message).toBeDefined();
  });
});
