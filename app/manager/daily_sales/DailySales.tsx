"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Item = { product: string; quantity: number; price: number };
type Transaction = { id: number; worker: string; day: string; items: Item[] };

const transactions: Transaction[] = [
  { id: 1001, worker: "Бат",       day: "Даваа",   items: [{ product: "Кока-Кола", quantity: 2, price: 2500 }, { product: "Чипс", quantity: 1, price: 1500 }] },
  { id: 1002, worker: "Бат",       day: "Даваа",   items: [{ product: "Ус", quantity: 3, price: 1000 }] },
  { id: 1003, worker: "Сараа",     day: "Мягмар",  items: [{ product: "Жүүс", quantity: 2, price: 3000 }] },
  { id: 1004, worker: "Сараа",     day: "Лхагва",  items: [{ product: "Чипс", quantity: 2, price: 1500 }, { product: "Ус", quantity: 1, price: 1000 }] },
  { id: 1005, worker: "Тэмүүжин", day: "Баасан",  items: [{ product: "Кока-Кола", quantity: 1, price: 2500 }] },
  { id: 1006, worker: "Тэмүүжин", day: "Бямба",   items: [{ product: "Ус", quantity: 5, price: 1000 }, { product: "Чипс", quantity: 3, price: 1500 }] },
];

export default function DailySales() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDay = searchParams.get("day");
  const filtered = selectedDay ? transactions.filter(t => t.day === selectedDay) : transactions;
  const getTotal = (items: Item[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">{selectedDay ? `${selectedDay} — борлуулалт` : "Өдрийн борлуулалт"}</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} гүйлгээ</p>
          </div>
        </div>

        {/* LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Гүйлгээнүүд</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">Энэ өдөр борлуулалт байхгүй байна.</p>
            )}
            {filtered.map(t => (
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