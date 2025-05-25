import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

const BudgetPage = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('budget.title')}</h2>
        <div className="max-w-4xl mx-auto">
          {/* Add budget tracking content here */}
        </div>
      </main>
    </div>
  )
}

export default BudgetPage
