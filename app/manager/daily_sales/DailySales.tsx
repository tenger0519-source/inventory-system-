"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Item = {
  product: string;
  quantity: number;
  price: number;
};

type Transaction = {
  id: number;
  worker: string;
  day: string;
  items: Item[];
};

export default function DailySales() {
  const searchParams = useSearchParams();
  const selectedDay = searchParams.get("day");

  // MOCK DATA
  const transactions: Transaction[] = [
    {
      id: 1001,
      worker: "Бат",
      day: "Даваа",
      items: [
        { product: "Кока-Кола", quantity: 2, price: 2500 },
        { product: "Чипс", quantity: 1, price: 1500 },
      ],
    },
    {
      id: 1002,
      worker: "Бат",
      day: "Даваа",
      items: [{ product: "Ус", quantity: 3, price: 1000 }],
    },
    {
      id: 1003,
      worker: "Сараа",
      day: "Мягмар",
      items: [{ product: "Жүүс", quantity: 2, price: 3000 }],
    },
    {
      id: 1004,
      worker: "Сараа",
      day: "Лхагва",
      items: [
        { product: "Чипс", quantity: 2, price: 1500 },
        { product: "Ус", quantity: 1, price: 1000 },
      ],
    },
    {
      id: 1005,
      worker: "Тэмүүжин",
      day: "Баасан",
      items: [{ product: "Кока-Кола", quantity: 1, price: 2500 }],
    },
    {
      id: 1006,
      worker: "Тэмүүжин",
      day: "Бямба",
      items: [
        { product: "Ус", quantity: 5, price: 1000 },
        { product: "Чипс", quantity: 3, price: 1500 },
      ],
    },
  ];

  const filteredTransactions = selectedDay
    ? transactions.filter((t) => t.day === selectedDay)
    : transactions;

  const getTotal = (items: Item[]) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">
            {selectedDay
              ? `${selectedDay} - борлуулалт`
              : "Өдрийн борлуулалт"}
          </h1>

          <Button variant="outline" onClick={() => window.history.back()}>
            ← Буцах
          </Button>
        </div>

        {/* SALES LIST */}
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle>Гүйлгээнүүд</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
            
            {filteredTransactions.length === 0 && (
              <p className="text-muted-foreground">
                Энэ өдөр борлуулалт байхгүй байна
              </p>
            )}

            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg p-4 space-y-3 bg-muted/20"
              >
                {/* TOP */}
                <div className="flex justify-between">
                  <p className="font-semibold">🧑‍💼 {t.worker}</p>
                  <p className="text-sm text-muted-foreground">#{t.id}</p>
                </div>

                {/* ITEMS */}
                <div className="space-y-1">
                  {t.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <p>
                        {item.product} × {item.quantity}
                      </p>
                      <p>₮ {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-end pt-2 border-t">
                  <p className="font-semibold">
                    Нийт: ₮ {getTotal(t.items)}
                  </p>
                </div>
              </div>
            ))}

          </CardContent>
        </Card>
      </div>
    </main>
  );
}