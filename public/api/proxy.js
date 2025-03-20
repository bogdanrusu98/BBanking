const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const apiResponse = await fetch("https://api.deepseek.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.REACT_APP_DEEPSEEK}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};