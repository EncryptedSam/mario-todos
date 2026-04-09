// db/utils.ts
import { db } from "./index";

export const resetDB = async () => {
  await db.delete();
  await db.open();
};