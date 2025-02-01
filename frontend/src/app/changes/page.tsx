import type { NextPage } from 'next'
import Head from 'next/head'
import FeatureCard from "../components/featurecard"
import Footer from '../components/footer'
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa'



const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <Head>
                <title>Warenwirtschaftssoftware</title>
                <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
                <h1 className="text-4xl font-bold mb-8">Willkommen zum Chefbereich der
                    Geruchsmanufaktur!</h1>
                <div className="flex space-x-9">
                    <FeatureCard
                        title="Produkteanlegen"
                        description=""
                        href="/changes/changes3"
                        icon={<FaTruckLoading size={40}/>}
                    />
                    <FeatureCard
                        title="Inventar"
                        description=""
                        href="/changes/changes1"
                        icon={<FaShoppingCart size={40}/>}
                    />
                    <FeatureCard
                        title="Wareneingangskorrekturen"
                        description=""
                        href="/changes/changes2"
                        icon={<FaBoxes size={40}/>}
                    />
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default Home
