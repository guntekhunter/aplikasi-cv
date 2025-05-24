"use client";
import data from "../data.json";
import { useState } from "react";

const hargaTypes = {
  harga1: "End Customer",
  harga2: "Aplikator",
  harga3: "Kontraktor"
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
  const [inputWidth, setInputWidth] = useState<number | "">("");
  const [inputLength, setInputLength] = useState<number | "">("");

  const filteredData =
    selectedProduk === "all"
      ? data
      : data.filter((item) => item.produk === selectedProduk);

  // Total luas ruangan
  const totalArea =
    typeof inputWidth === "number" && typeof inputLength === "number"
      ? inputWidth * inputLength
      : 0;

  // Ambil produk pertama dari filteredData untuk perhitungan
  const firstProduk = filteredData[0];

  let unitNeeded = 0;
  let totalHarga = 0;

  if (firstProduk) {
    const produkArea =
      firstProduk.panjang * (firstProduk.lebar / 100); // ubah cm ke meter

    if (produkArea > 0 && totalArea > 0) {
      unitNeeded = Math.ceil(totalArea / produkArea);
      totalHarga = unitNeeded * firstProduk[selectedHarga];
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Produk Filter */}
        <div>
          <label className="block mb-1 font-semibold">Pilih Produk:</label>
          <select
            value={selectedProduk}
            onChange={(e) => setSelectedProduk(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="all">Semua Produk</option>
            <option value="wallpanel">Wall Panel</option>
            <option value="plafon">Plafon</option>
            <option value="wall board">Wall Board</option>
          </select>
        </div>

        {/* Harga Filter */}
        <div>
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

      {/* Produk List */}
      <ul>
        {filteredData.map((item) => (
          <li
            key={item.id}
            className="border p-4 rounded-lg shadow-sm mb-4 bg-white"
          >
            <h2 className="text-xl font-bold capitalize mb-2">
              {item.produk}
            </h2>
            <p>
              Harga:{" "}
              <span className="font-semibold text-green-700">
                Rp{item[selectedHarga].toLocaleString()}
              </span>
            </p>
            <p>Panjang: {item.panjang}m</p>
            <p>Lebar: {item.lebar}cm</p>
            <p>Tebal: {item.tebal}mm</p>
          </li>
        ))}
      </ul>

      {/* Kalkulator */}
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

        {/* Output Perhitungan */}
        {unitNeeded > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="mb-1">
              <strong>Luas Ruangan:</strong> {totalArea.toFixed(2)} m²
            </p>
            <p className="mb-1">
              <strong>Kebutuhan Unit:</strong> {unitNeeded} pcs
            </p>
            <p className="text-green-700 font-bold text-lg">
              Total Harga: Rp{totalHarga.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
