const request = require("supertest");
const app = require("../../app");
const { appName } = require("../config");

describe("Test root and undefined paths", () => {
    test(`Should return the root path text: ${appName} is Online!`, async () => {
        const response = await request(app).get("/");
        expect(response.text).toBe(`${appName} is Online!`);
    });

    test("Should return the root path status 200", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("Should return 404 for route not found", async () => {
        const response = await request(app).get("/some-undefined-route");
        expect(response.statusCode).toBe(404);
    });

    test("Should return Cannot GET /some-undefined-route", async () => {
        const response = await request(app).get("/some-undefined-route");
        expect(response.body.message).toBe("Cannot GET /some-undefined-route");    
    });
});

describe("Test /fees route", () => {
    describe("Test POST /fees route", () => {
          test("fee configuration transformation and storage", async () => {
               const feeConfig ={
                "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
                }
   
                const response = await request(app).post("/fees").send(feeConfig);
                expect(response.statusCode).toBe(200);
                expect(response.body.data.status).toBe("ok");
          });    
    });
});