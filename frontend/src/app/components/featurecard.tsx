import React from 'react'
import Link from 'next/link'

interface FeatureCardProps {
    title: string
    description: string
    href: string
    icon: React.ReactNode
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, href, icon }) => {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-60 h-40 cursor-pointer">
            <div className="mb-4 text-blue-500">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-center">{description}</p>
        </Link>
    )
}

export default FeatureCard