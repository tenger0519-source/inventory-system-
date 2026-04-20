"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

export default function DailySales() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getTransactionsByDay, globalTime } = useApp();
  const selectedDay = searchParams.get("day");
  const currentDay = selectedDay || globalTime.currentDay;
  const transactions = getTransactionsByDay(currentDay);
  const getTotal = (items: any[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">{selectedDay ? `${selectedDay} — борлуулалт` : "Өдрийн борлуулалт"}</h1>
            <p className="text-sm text-muted-foreground">{transactions.length} гүйлгээ</p>
          </div>
        </div>

        {/* LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Гүйлгээнүүд</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 && (
              <p className="text-sm text-muted-foreground">Энэ өдөр борлуулалт байхгүй байна.</p>
            )}
            {transactions.map(t => (
              <div key={t.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <p className="font-medium">{t.worker}</p>
                  <p className="text-sm text-muted-foreground">#{t.id}</p>
                </div>
                <div className="space-y-1">
                  {t.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.product} × {item.quantity}</span>
                      <span>₮ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end border-t pt-2">
                  <p className="font-semibold text-sm">Нийт: ₮ {getTotal(t.items).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}