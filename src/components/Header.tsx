import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import LoginModal from './auth/LoginModal'

const Header = () => {
    const { user, signOut } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and main title */}
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-900">
                                Le mariage de Hiromi et Audran
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8">
                            <LanguageSelector />

                            {/* User menu */}
                            {user ? (
                                <div className="relative">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">{user.email}</span>
                                        <button
                                            onClick={() => signOut()}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            {t('auth.signOut')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {t('auth.signIn')}
                                </button>
                            )}

                            {/* Mobile menu button */}
                            <div className="sm:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <svg
                                        className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <svg
                                        className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation bar */}
            <nav className="bg-gray-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="hidden sm:block">
                        <div className="flex justify-center space-x-8 py-2">
                            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                                {t('home.title')}
                            </Link>
                            <Link to="/venues" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                                {t('venues.title')}
                            </Link>
                            {user && (
                                <>
                                    <Link to="/checklist" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                                        {t('checklist.title')}
                                    </Link>
                                    <Link to="/budget" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                                        {t('budget.title')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                        {t('home.title')}
                    </Link>
                    <Link to="/venues" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                        {t('venues.title')}
                    </Link>
                    {user && (
                        <>
                            <Link to="/checklist" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                                {t('checklist.title')}
                            </Link>
                            <Link to="/budget" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                                {t('budget.title')}
                            </Link>
                        </>
                    )}
                </div>
                {user && (
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="px-3 space-y-3">
                            <div className="text-base font-medium text-gray-800">{user.email}</div>
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                            >
                                {t('auth.signOut')}
                            </button>
                        </div>
                    </div>
                )}
                {!user && (
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="px-4">
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                {t('auth.signIn')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    )
}

export default Header