import loader from "./loader";
import { Express } from "express";

export default function boot(): void {
  const app: Express = loader();
  const port: number | string = process.env.PORT || 3006;

  app.listen(port, function (): void {
    console.log(`Server is listening on port ${port}`);
  });
}