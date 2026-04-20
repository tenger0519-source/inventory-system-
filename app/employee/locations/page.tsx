"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

const products = [
  { id: 1, name: "Баригдсан төгсгөл", sector: "A1", quantity: 150, unit: "нэг" },
  { id: 2, name: "Цэвэр USB",          sector: "A2", quantity: 200, unit: "нэг" },
  { id: 3, name: "Ухаалаг гар утас",   sector: "B1", quantity: 50,  unit: "нэг" },
  { id: 4, name: "Монитор",            sector: "B2", quantity: 75,  unit: "нэг" },
  { id: 5, name: "Клавиатур, хулгана", sector: "C1", quantity: 120, unit: "нэг" },
  { id: 6, name: "Утасгүй хулгана",    sector: "C2", quantity: 30,  unit: "нэг" },
  { id: 7, name: "Цэнхэр сандал",      sector: "D1", quantity: 200, unit: "нэг" },
  { id: 8, name: "Оролтын хоолой",     sector: "D2", quantity: 100, unit: "нэг" },
];

export default function LocationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilter = () => {
    setFilteredProducts(products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !sectorFilter || p.sector === sectorFilter;
      return matchesSearch && matchesSector;
    }));
  };

  const sectors = [...new Set(products.map(p => p.sector))];

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/employee')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Барааны байршил</h1>
            <p className="text-sm text-muted-foreground">Бараа болон байршилаар хайх</p>
          </div>
        </div>

        {/* FILTERS */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Input
                  placeholder="Барааны нэрээр хайх..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Бүх сектор</option>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Button onClick={handleFilter} className="w-full">Хайх</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Байршлын жагсаалт</CardTitle>
            <CardDescription>{filteredProducts.length} бараа олдлоо</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Барааны нэр</TableHead>
                  <TableHead>Сектор</TableHead>
                  <TableHead>Тоо хэмжээ</TableHead>
                  <TableHead>Нэгж</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.sector}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>{p.unit}</TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Хайлтад тохирох мэдээлэл олдсонгүй.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}