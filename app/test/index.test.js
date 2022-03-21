const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { appName } = require("../config");
const Fee = require("../models/fee");

// remove all records
// afterEach(async () => {
//   await Fee.deleteMany();
// });
// afterAll(async () => {
//   await Fee.deleteMany();
//   mongoose.disconnect()
// });

// let server;

// beforeAll( (done) => {
//   mongoose.connect('mongodb://localhost:27017/lan-test');
//   server = app.listen(4000, () => {
//     global.agent = request.agent(server);
//     done();
//   });
// });

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
//   await server.close();
//   await mongoose.disconnect();
});

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


describe("Test POST /fees route", () => {
    test("fee configuration transformation and storage", async () => {
        const feeConfig = {
          "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
        };

        try {
            const response = await request(app).post("/fees").send(feeConfig);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("ok");
        } catch (error) {
            throw error
        }
    });    
});