import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { supabase } from '../../lib/supabase'
import type { Venue } from '../Table'

interface EditVenueModalProps {
  isOpen: boolean
  onClose: () => void
  venue: Venue | null
  onSave: () => void
  isAddMode: boolean
}

const EditVenueModal: React.FC<EditVenueModalProps> = ({ isOpen, onClose, venue, onSave, isAddMode }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Omit<Venue, 'id' | 'created_at'>>({
    region: '',
    name: '',
    price: '',
    comment: '',
    map: '',
    external_link: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (venue) {
      setFormData({
        region: venue.region,
        name: venue.name,
        price: venue.price,
        comment: venue.comment || '',
        map: venue.map || '',
        external_link: venue.external_link || ''
      })
    } else {
      // Reset form for adding new venue
      setFormData({
        region: '',
        name: '',
        price: '',
        comment: '',
        map: '',
        external_link: ''
      })
    }
  }, [venue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (isAddMode) {
        const { error: addError } = await supabase
          .from('venues')
          .insert([formData])

        if (addError) throw addError
      } else if (venue) {
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            region: formData.region,
            name: formData.name,
            price: formData.price,
            comment: formData.comment,
            map: formData.map,
            external_link: formData.external_link,
          })
          .eq('id', venue.id)

        if (updateError) throw updateError
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving venue:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while saving the venue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAddMode ? t('venues.add.title') : t('venues.edit.title')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.region')}
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.price')}
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="map" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.maps')}
          </label>
          <input
            type="text"
            id="map"
            name="map"
            value={formData.map}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.comment')}
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="external_link" className="block text-sm font-medium text-gray-700">
            {t('venues.headers.external_link')}
          </label>
          <input
            type="text"
            id="external_link"
            name="external_link"
            value={formData.external_link}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditVenueModal
