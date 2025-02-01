import type { NextPage } from 'next'
import Head from 'next/head'
import FeatureCard from "./components/featurecard"
import Footer from './components/footer'
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa'
import {IoBuild} from "react-icons/io5";
import {MdSell} from "react-icons/md";



const Home: NextPage = () => {
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

export default Home
