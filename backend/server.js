const express = require('express');
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const photosControllers = require("./controllers/photosController")
const errorHandler = require("./middlewares/errorHandler")

dotenv.config();
// app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'https://msapps-api-assignment.onrender.com', 'https://pixaimage.onrender.com']
}));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    api_endpoint_set: !!process.env.API_ENDPOINT,
    api_endpoint_preview: process.env.API_ENDPOINT
      ? process.env.API_ENDPOINT.slice(0, 40) + "..."
      : "NOT SET"
  });
});

app.use("/photos", photosControllers)
app.use(errorHandler)
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
