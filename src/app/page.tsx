"use client";
import data from "../data.json";
import { useState } from "react";

const hargaTypes = {
  harga1: "End Customer",
  harga2: "Aplikator",
  harga3: "Kontraktor",
};

interface Produk {
  id: number;
  produk: string;
  harga1: number;
  harga2: number;
  harga3: number;
  harga4: number;
  panjang: number;
  lebar: number;
  tebal: number;
}

type HargaKey = "harga1" | "harga2" | "harga3";

export default function Home() {
  const [selectedProduk, setSelectedProduk] = useState("all");
  const [selectedHarga, setSelectedHarga] = useState<HargaKey>("harga1");
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [inputWidth, setInputWidth] = useState<number | "">("");
  const [inputLength, setInputLength] = useState<number | "">("");

  const filteredData =
    selectedProduk === "all"
      ? data
      : data.filter((item) => item.produk === selectedProduk);

  const selectedVariant = filteredData.find((item) => item.id === selectedVariantId);

  const totalArea =
    typeof inputWidth === "number" && typeof inputLength === "number"
      ? inputWidth * inputLength
      : 0;

  let unitNeeded = 0;
  let totalHarga = 0;

  if (selectedVariant) {
    const produkArea =
      selectedVariant.panjang * (selectedVariant.lebar / 100); // cm to m

    if (produkArea > 0 && totalArea > 0) {
      unitNeeded = Math.ceil(totalArea / produkArea);
      totalHarga = unitNeeded * selectedVariant[selectedHarga];
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Produk Filter */}
        <div className="w-full">
          <label className="block mb-1 font-semibold">Pilih Produk:</label>
          <select
            value={selectedProduk}
            onChange={(e) => {
              setSelectedProduk(e.target.value);
              setSelectedVariantId(null); // reset variant on product change
            }}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="all">Semua Produk</option>
            {[...new Set(data.map((item) => item.produk))].map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        {/* Harga Filter */}
        <div className="w-full">
          <label className="block mb-1 font-semibold">Tipe Harga:</label>
          <select
            value={selectedHarga}
            onChange={(e) => setSelectedHarga(e.target.value as HargaKey)}
            className="border rounded px-3 py-2 w-full"
          >
            {Object.entries(hargaTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Variant Selection as Cards */}
      {filteredData.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Pilih Varian Produk:</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredData.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedVariantId(item.id)}
                className={`cursor-pointer border rounded p-4 shadow-sm ${selectedVariantId === item.id
                  ? "border-blue-600 bg-blue-50"
                  : "bg-white"
                  } hover:border-blue-400`}
              >
                <p className="text-lg font-semibold capitalize">{item.produk}</p>
                <p>Harga: <span className="font-semibold text-green-700">Rp{item[selectedHarga].toLocaleString("id-ID")}</span></p>
                <p>Panjang: {item.panjang}m</p>
                <p>Lebar: {item.lebar}cm</p>
                <p>Tebal: {item.tebal}mm</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Hitung Kebutuhan Produk (m²):</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            placeholder="Lebar Ruangan (m)"
            value={inputWidth === "" ? "" : inputWidth}
            onChange={(e) =>
              setInputWidth(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Panjang Ruangan (m)"
            value={inputLength === "" ? "" : inputLength}
            onChange={(e) =>
              setInputLength(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Output */}
        {unitNeeded > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="mb-1">
              <strong>Luas Ruangan:</strong> {totalArea.toFixed(2)} m²
            </p>
            <p className="mb-1">
              <strong>Kebutuhan Unit:</strong> {unitNeeded} pcs
            </p>
            <p className="text-green-700 font-bold text-lg">
              Total Harga: Rp{totalHarga.toLocaleString("id-ID")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
