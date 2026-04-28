import { useEffect } from "react";
import { resetDB } from "../db/utils";

export const useResetDB = () => {
  useEffect(() => {
    resetDB();
  }, []);
};
