import type { NextPage } from 'next'
import Head from 'next/head'
import FeatureCard from "./components/featurecard"
import Footer from './components/footer'
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa'
import {IoBuild} from "react-icons/io5";
import {MdSell} from "react-icons/md";


//Omars Änderungen
import { getSession } from '@auth0/nextjs-auth0';
//Omars Änderungen
export default async function Home() {
    const session = await getSession();
  
    // Wenn der Benutzer nicht authentifiziert ist, leite ihn weiter
    if (!session?.user) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
          <Head>
            <title>Warenwirtschaftssoftware</title>
            <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
            <link rel="icon" href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fgeruchsmanufaktur.de%2F&psig=AOvVaw2kVoAoZKSquekGTgjWxHXE&ust=1735039976558000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiipN7lvYoDFQAAAAAdAAAAABAJ" />
          </Head>
  
          <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
              Bitte loggen Sie sich ein!
            </h1>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Um Zugriff auf die Warenwirtschaftssoftware zu erhalten, müssen Sie sich zuerst mit Ihrem Konto einloggen.
            </p>
            <a
              href="/api/auth/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Zur Login-Seite
            </a>
          </main>
  
          <Footer />
        </div>
      );
    }



  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Head>
          <title>Warenwirtschaftssoftware</title>
          <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

          <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
              <h1 className="text-4xl font-bold mb-8">Willkommen zur Warenwirtschaftssoftware der
                  Geruchsmanufaktur!</h1>
              <div className="flex space-x-6">
                  <FeatureCard
                      title="Wareneingang"
                      description=""
                      href="/income"
                      icon={<FaTruckLoading size={40}/>}
                  />
                  <FeatureCard
                      title="Einkauf"
                      description=""
                      href="/shopping"
                      icon={<FaShoppingCart size={40}/>}
                  />
                  <FeatureCard
                      title="Inventar"
                      description=""
                      href="/inventory"
                      icon={<FaBoxes size={40}/>}
                  />
                  <FeatureCard
                      title="Herstellen"
                      description=""
                      href="/production"
                      icon={<IoBuild size={40}/>}
                  />
                  <FeatureCard
                      title="Verkauf"
                      description=""
                      href="/sale"
                      icon={<MdSell size={40}/>}
                  />
              </div>
              <div className="flex space-x-6 mt-8">
                  <FeatureCard
                      title="Chef"
                      description=""
                      href="/changes"
                      icon={<IoBuild size={40}/>}
                  />

              </div>
          </main>
          <Footer/>
      </div>
  )
}

//export default Home
