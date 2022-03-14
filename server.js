const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("API running"));
// Connect to mongodb
// const URI = process.env.MONGODB_URL;
// mongoose.connect(
//   URI,
//   {
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err) => {
//     if (err) throw err;
//     console.log("Connected to mongodb");
//   }
// );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
