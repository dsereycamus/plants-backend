import { assertDatabaseConnection } from "./configs/database";
import { app } from "./configs/server";

const port = process.env.PORT ?? 3000;

app.listen(port, async () => {
  await assertDatabaseConnection();
  console.log(`Server is running on http://localhost:${port}`);
});
