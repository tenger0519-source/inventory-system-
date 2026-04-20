import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

// Sample location data - in a real app, this would come from an API
const inventoryLocations = [
  { id: 1, product: "Баригдсан төгсгөл", location: "A1-05", quantity: 150, status: "Available" },
  { id: 2, product: "Цэвэр usbs", location: "A2-12", quantity: 200, status: "Available" },
  { id: 3, product: "Эрдэмтэн гар утас", location: "B1-03", quantity: 50, status: "Low Stock" },
  { id: 4, product: "Монитор", location: "B2-07", quantity: 75, status: "Available" },
  { id: 5, product: "Клавиатурын то duo", location: "C1-09", quantity: 120, status: "Available" },
  { id: 6, product: "Холбогтойгай мүүс", location: "C2-04", quantity: 30, status: "Available" },
  { id: 7, product: "Цэнхэр сандас", location: "D1-11", quantity: 200, status: "Available" },
  { id: 8, product: "Орлогоны хоол", location: "D2-02", quantity: 100, status: "Available" },
];

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(inventoryLocations);

  // Filter locations based on search term
  const handleFilter = () => {
    const filtered = inventoryLocations.filter(location =>
      location.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Барааны байршил хайх</h1>
        <p className="text-muted-foreground">
          Бараа ямар байршлагаа хадгалсан олох
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Бараа эсвэл байршилээр хайх</label>
            <Input
              type="text"
              placeholder="Барааны нэр эсвэл A1-05 гэх мэт байршил..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleFilter}
              className="w-full"
            >
              Хайх
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
              <TableHead>Байршил</TableHead>
              <TableHead>Тоо хэмжээ</TableHead>
              <TableHead>Төлөв</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.id}</TableCell>
                <TableCell>{location.product}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    location.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : location.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}>
                    {location.location}
                  </span>
                </TableCell>
                <TableCell>{location.quantity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
  location.status === "Available"
    ? "bg-green-100 text-green-800"
    : location.status === "Low Stock"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800"
}`}>
  {location.status}
</span>
                </TableCell>
              </TableRow>
            ))}
            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
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