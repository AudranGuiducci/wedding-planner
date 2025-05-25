import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">{t('home.title')}</h1>
          <p className="text-xl text-gray-600 mb-8">{t('home.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add feature cards or sections here */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
