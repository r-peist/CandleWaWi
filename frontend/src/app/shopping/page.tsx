'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

// Lieferanten abrufen
const fetchSuppliers = async () => {
  try {
    const response = await fetch('/api/suppliers');
    if (!response.ok) throw new Error('Fehler beim Abrufen der Lieferanten');
    const { Lieferanten } = await response.json();
    return Lieferanten;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Materialien für einen Lieferanten abrufen
const fetchMaterialsForSupplier = async (supplierId: number) => {
  try {
    const response = await fetch('/api/suppliermaterials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Lieferant: { LiefID: supplierId } }),
    });
    if (!response.ok) throw new Error('Fehler beim Abrufen der Materialien');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function ShoppingPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<{ LiefID: number; Name: string }[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [cart, setCart] = useState<
    { material: string; link: string; supplier: string; MatID: number; quantity: number }[]
  >([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const suppliersLoaded = useRef(false);

  //  Nicht eingeloggt → redirect
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/unauthorized');
    }
  }, [isLoading, user, router]);

  // Lieferanten laden
  useEffect(() => {
    if (!suppliersLoaded.current) {
      const loadSuppliers = async () => {
        const data = await fetchSuppliers();
        setSuppliers(data);
      };
      loadSuppliers();
      suppliersLoaded.current = true;
    }
  }, []);

  // Materialien laden bei Auswahl
  useEffect(() => {
    const loadMaterials = async () => {
      if (selectedSupplier !== null) {
        const materialData = await fetchMaterialsForSupplier(selectedSupplier);
        setMaterials(materialData);
      }
    };
    loadMaterials();
  }, [selectedSupplier]);

  const toggleCartItem = (material: string, link: string, supplier: string, MatID: number) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.material === material);
      if (exists) {
        return prevCart.filter((item) => item.material !== material);
      } else {
        if (prevCart.length > 0 && prevCart[0].supplier !== supplier) {
          alert('Nur Artikel eines Lieferanten erlaubt.');
          return prevCart;
        }
        return [...prevCart, { material, link, supplier, MatID, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (material: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.material === material ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert('Warenkorb ist leer!');
      return;
    }

    const orderData = {
      LiefID: selectedSupplier,
      LagerID: 1,
      Datum: new Date().toISOString().split('T')[0],
      Materialien: cart.map((item) => ({ MatID: item.MatID, Menge: item.quantity })),
    };

    try {
      const response = await fetch('/api/bestellung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Bestellung: orderData }),
      });

      if (!response.ok) throw new Error('Fehler beim Abschicken der Bestellung.');

      alert('Bestellung erfolgreich gesendet!');
      setCart([]);
      setShowCartModal(false);
    } catch (error) {
      console.error(error);
      alert('Fehler beim Abschicken der Bestellung.');
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>WaWi - Einkauf</title>
      </Head>

      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100"
            onClick={() => router.push('/')}
          >
            <FaArrowLeft className="inline mr-2" />
            Zurück
          </button>
          <h1 className="text-3xl font-bold">Warenwirtschaft</h1>
        </div>
        <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
          <FaShoppingCart size={28} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              {cart.length}
            </span>
          )}
        </div>
      </header>

      {/* Lieferanten */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Lieferanten</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <li
              key={s.LiefID}
              className={`p-4 bg-white rounded-xl shadow-md cursor-pointer ${
                selectedSupplier === s.LiefID ? 'border-2 border-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={async () => {
                setSelectedSupplier(s.LiefID);
                const mats = await fetchMaterialsForSupplier(s.LiefID);
                setMaterials(mats);
              }}
            >
              <p className="text-center">{s.Name}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Materialien */}
      {selectedSupplier !== null && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Materialien</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {materials.map((m) => {
              const isInCart = cart.some((item) => item.material === m.MaterialName);
              return (
                <li
                  key={m.MatLiefID}
                  className={`p-4 bg-white rounded-xl shadow-md flex justify-between items-center ${
                    isInCart ? 'bg-green-100 border border-green-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-bold">{m.MaterialName}</p>
                    <p className="text-sm text-gray-500">Lieferant: {m.LieferantName}</p>
                    <a href={m.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">
                      Link
                    </a>
                  </div>
                  <button
                    onClick={() => toggleCartItem(m.MaterialName, m.Link, m.LieferantName, m.MatID)}
                    className={`px-4 py-2 rounded ${
                      isInCart ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {isInCart ? 'Entfernen' : 'Hinzufügen'}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Warenkorb Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() => setShowCartModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">🛒 Warenkorb</h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-600">Warenkorb ist leer.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-300 max-h-80 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <li key={idx} className="py-4 flex justify-between">
                      <div>
                        <p className="font-semibold">{item.material}</p>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">
                          Zum Material
                        </a>
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          className="w-16 border px-2 py-1 rounded"
                          onChange={(e) => updateCartItemQuantity(item.material, Number(e.target.value))}
                        />
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => toggleCartItem(item.material, item.link, item.supplier, item.MatID)}
                        >
                          Entfernen
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Gesamt: <span className="text-blue-600">{cart.length} Artikel</span>
                  </p>
                  <button
                    onClick={submitOrder}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Bestellung abschicken
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
