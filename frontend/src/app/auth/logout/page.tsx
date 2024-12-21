import type { NextPage } from 'next';
import Head from 'next/head';
import Link from "next/link";
import { FaPlus } from 'react-icons/fa';
import Footer from '../components/Footer';

//Andere lösung, weil kein user client
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

const Wareneingang: NextPage = async () => {
    // Authentifizierungsstatus überprüfen
    const session = await getSession();

    if (!session?.user) {
        // Nicht authentifiziert: Benutzer zur Homepage weiterleiten
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <Head>
                <title>Wareneingang</title>
                <meta name="description" content="Verwalte eingehende Waren effizient." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-4">

                <h1 className="text-4xl font-bold mb-8">Wareneingang</h1>
                <p className="mb-4 text-gray-600">Hier kannst du eingehende Waren überprüfen und hinzufügen.</p>



                <div className="flex justify-center items-center space-x-4">
                    <Link href="/wehinzu" className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                        <FaPlus className="mr-2" />
                        Neuen Wareneingang hinzufügen
                    </Link>
                </div>


                {/* Platz für zukünftige Eingänge oder Listen */}
                <div className="mt-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-4">Eingehende Waren:</h2>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {/* Beispiel-Daten - Diese könnten später dynamisch geladen werden */}
                        <ul>
                            <li className="mb-2">Bestellung #001234 - 10x Artikel A - Eingetroffen am 10.10.2024</li>
                            <li className="mb-2">Bestellung #001235 - 20x Artikel B - Eingetroffen am 11.10.2024</li>
                            <li className="mb-2">Bestellung #001236 - 5x Artikel C - Eingetroffen am 12.10.2024</li>
                        </ul>
                    </div>
                </div>

                <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
                    &larr; Zurück
                </Link>

            </main>

            <Footer/>
        </div>
    )
}

export default Wareneingang
