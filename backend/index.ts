import "dotenv/config";
import { createApp } from "./app.ts";

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
