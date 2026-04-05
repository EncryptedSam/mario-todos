import { db } from "../db";

// SET volume
export const setVolume = (value: number) => {
  return db.settings.put({ key: "volume", value });
};

// GET volume
export const getVolume = async (): Promise<number> => {
  const res = await db.settings.get("volume");
  return res?.value ?? 1;
};

// SET confetti
export const setConfetti = (value: boolean) => {
  return db.settings.put({ key: "confetti", value });
};

// GET volume
export const getConfetti = async (): Promise<boolean> => {
  const res = await db.settings.get("confetti");
  return res?.value ?? true;
};
