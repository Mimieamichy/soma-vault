// src/server.ts
import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Somavault backend running on port ${PORT}`);
});
