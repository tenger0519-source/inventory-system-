import { Suspense } from "react";
import DailySales from "./DailySales";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DailySales />
    </Suspense>
  );
}