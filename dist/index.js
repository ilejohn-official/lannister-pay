const mongoose = require("mongoose");
const { port, dbUrl } = require("./app/config");
const app = require("./app");
mongoose
    .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
    console.log("DB connected");
})
    .catch(function (err) {
    console.log(err);
});
app.listen(port, () => {
    console.log(`***** \nServer running on port ${port}\n*****`);
});
