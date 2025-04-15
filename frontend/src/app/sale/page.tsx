'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaArrowLeft } from 'react-icons/fa';

const fetchLocalInventory = async () => {
  return [
    { id: 1, name: 'Duftkerze A', stock: 50 },
    { id: 2, name: 'Duftspray B', stock: 30 },
    { id: 3, name: 'Tüte C', stock: 100 },
    { id: 4, name: 'Duftkerze B', stock: 20 },
    { id: 5, name: 'Tüte D', stock: 40 },
    { id: 6, name: 'Duftspray C', stock: 25 },
  ];
};

const fetchShopifyOrders = async () => {
  return [
    {
      orderId: 101,
      items: [
        { sku: 'SKU123', name: 'Duftkerze A', quantity: 3 },
        { sku: 'SKU456', name: 'Duftspray B', quantity: 1 },
      ],
    },
    {
      orderId: 102,
      items: [{ sku: 'SKU789', name: 'Tüte C', quantity: 5 }],
    },
    {
      orderId: 103,
      items: [{ sku: 'SKU321', name: 'Duftkerze B', quantity: 2 }],
    },
  ];
};

export default function WorkflowPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [mode, setMode] = useState<null | 'laden' | 'online'>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Authentifizierungs-Check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/unauthorized');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (mode === 'laden') {
      loadLocalInventory();
    } else if (mode === 'online') {
      loadShopifyOrders();
    }
  }, [mode]);

  const loadLocalInventory = async () => {
    const data = await fetchLocalInventory();
    setInventory(data);
  };

  const loadShopifyOrders = async () => {
    const data = await fetchShopifyOrders();
    setOrders(data);
  };

  const handleConfirmOrder = (order: any) => {
    alert(`Bestellung ${order.orderId} bestätigt.`);
    setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
    setSelectedOrder(null);
  };

  const handleProductOut = (product: any) => {
    alert(`${product.name} wurde ausgebucht.`);
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center space-x-2"
            onClick={() => (mode ? setMode(null) : router.push('/'))}
          >
            <FaArrowLeft size={16} />
            <span>Zurück</span>
          </button>
          <h1 className="text-3xl font-bold text-center w-full">
            {mode === 'laden'
              ? 'Kundenbestellung Laden'
              : mode === 'online'
              ? 'Kundenbestellung Online'
              : 'Wählen Sie den Verkaufsort'}
          </h1>
        </header>

        {!mode && (
          <div className="grid grid-cols-2 gap-4">
            <button
              className="p-6 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 text-center"
              onClick={() => setMode('laden')}
            >
              Laden
            </button>
            <button
              className="p-6 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 text-center"
              onClick={() => setMode('online')}
            >
              Online
            </button>
          </div>
        )}

        {mode === 'laden' && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white text-gray-800 font-semibold rounded-lg shadow text-center"
              >
                <p>{item.name}</p>
                <p>Verfügbar: {item.stock}</p>
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleProductOut(item)}
                >
                  Ausbuchen
                </button>
              </div>
            ))}
          </div>
        )}

        {mode === 'online' && !selectedOrder && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {orders.map((order) => (
              <button
                key={order.orderId}
                className="p-6 bg-white text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-100 text-center"
                onClick={() => setSelectedOrder(order)}
              >
                <p className="font-semibold">Bestellung #{order.orderId}</p>
                <p className="text-sm text-gray-600">Artikel: {order.items.length}</p>
              </button>
            ))}
          </div>
        )}

        {mode === 'online' && selectedOrder && (
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Bestellung #{selectedOrder.orderId}
            </h2>
            <ul className="space-y-2">
              {selectedOrder.items.map((item, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow text-gray-800"
                >
                  {item.name} – Menge: {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setSelectedOrder(null)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => handleConfirmOrder(selectedOrder)}
              >
                Bestätigen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
