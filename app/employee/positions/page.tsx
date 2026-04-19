import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

// Sample product data - in a real app, this would come from an API
const products = [
  { id: 1, name: "Баригдсан төгсгөл", sector: "A1", quantity: 150, unit: "нэг" },
  { id: 2, name: "Цэвэр usbs", sector: "A2", quantity: 200, unit: "нэг" },
  { id: 3, name: "Эрдэмтэн гар утас", sector: "B1", quantity: 50, unit: "нэг" },
  { id: 4, name: "Монитор", sector: "B2", quantity: 75, unit: "нэг" },
  { id: 5, name: "Клавиатурын то duo", sector: "C1", quantity: 120, unit: "нэг" },
  { id: 6, name: "Холбогтойгай мүүс", sector: "C2", quantity: 30, unit: "кг" },
  { id: 7, name: "Цэнхэр сандас", sector: "D1", quantity: 200, unit: "нэг" },
  { id: 8, name: "Орлогоны хоол", sector: "D2", quantity: 100, unit: "нэг" },
];

export default function PositionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter products based on search term and sector
  const handleFilter = () => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !sectorFilter || product.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
    setFilteredProducts(filtered);
  };

  // Get unique sectors for the filter dropdown
  const sectors = [...new Set(products.map(p => p.sector))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Барааны pozycлууд</h1>
        <p className="text-muted-foreground">Барааны мэдээллийг хайж, секториор фильтрлж үзнэ үү.</p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Барааны нэрээр хайх</label>
            <Input
              type="text"
              placeholder="Барааны нэрээ оруулна уу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Санхүүгийн секториор фільтрлох</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Бүх секторууд</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleFilter}
              className="w-full"
            >
              Фильтрлчих
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Барааны нэр</TableHead>
              <TableHead>Санхүүгийн секторын дугаар</TableHead>
              <TableHead>Тоо хэмжээ</TableHead>
              <TableHead>Нэгж</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sector}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4 text-muted-foreground">
                  Хайлтаар тулгарч мэдээлэл олдсонгүй.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}