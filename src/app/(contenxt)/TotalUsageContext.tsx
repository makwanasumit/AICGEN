import { createContext } from "react";

type TotalUsageContextType = {
  totalUsage: number;
  setTotalUsage: React.Dispatch<React.SetStateAction<number>>;
};

export const TotalUsageContext = createContext<TotalUsageContextType>({
  totalUsage: 0,
  setTotalUsage: () => {},
});
