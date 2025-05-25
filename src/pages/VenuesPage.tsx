import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Table from '../components/Table'
import EditVenueModal from '../components/venues/EditVenueModal'
import { config } from '../config'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Venue } from '../components/Table'

const VenuesPage = () => {
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const { t, i18n } = useTranslation()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  
  const headers = [
    t('venues.headers.region'),
    t('venues.headers.name'),
    t('venues.headers.price'),
    t('venues.headers.comment'),
    t('venues.headers.maps'),
    t('venues.headers.preview'),
    t('venues.headers.image'),
    t('venues.headers.externalLink'),
    'Actions'
  ]

  const handleAdd = () => {
    setIsAddMode(true)
    setSelectedVenue(null)
    setIsEditModalOpen(true)
  }

  const handleEdit = (venue: Venue) => {
    setIsAddMode(false)
    setSelectedVenue(venue)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(t('venues.deleteConfirmation'))) {
      try {
        const { error } = await supabase
          .from('venues')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting venue:', error)
          return
        }

        // Refresh venues list
        await fetchVenues()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setSelectedVenue(null)
    setIsEditModalOpen(false)
  }

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('id, region, name, price, comment, map, external_link, created_at')
        
      if (error) {
        console.error('Error fetching venues:', error)
        return
      }

      if (data) {
        setVenues(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin')
      return
    }

    if (user) {
      fetchVenues()
    }
  }, [i18n.language, user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16 max-w-[95%] xl:max-w-[1800px] 2xl:max-w-[2000px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('venues.title')}</h2>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {t('venues.addButton')}
          </button>
        </div>
        <Table 
          headers={headers} 
          data={venues}
          googleMapsApiKey={config.googleMapsApiKey}
          initialSortColumn="price"
          renderActions={(venue) => (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(venue)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                {t('common.edit')}
              </button>
              <button
                onClick={() => handleDelete(venue.id)}
                className="text-red-600 hover:text-red-900"
              >
                {t('common.delete')}
              </button>
            </div>
          )}
        />
      </main>

      <EditVenueModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        venue={selectedVenue}
        onSave={fetchVenues}
        isAddMode={isAddMode}
      />
    </div>
  )
}

export default VenuesPage
