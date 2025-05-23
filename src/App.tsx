import './App.css'
import Header from './components/Header'
import Table from './components/Table'
import { config } from './config'

function App() {
  const headers = ['Lieux', 'Endroit', 'Prix', 'Commentaire', 'Maps'];
  const data = [
    { 
      lieux: 'Paris', 
      endroit: 'Le Grand Hôtel', 
      prix: '5000', 
      commentaire: 'Vue sur la Tour Eiffel',
      maps: 'https://www.google.com/maps/place/The+Westin+Paris+-+Vend%C3%B4me,+75009+Paris,+France/@48.8684914,2.3294822,14.75z/data=!4m6!3m5!1s0x47e66e312ff32587:0x1be40690c66b119b!8m2!3d48.8707312!4d2.3313381!16s%2Fm%2F0wxrcgz?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D'
    },
    { 
      lieux: 'Lyon', 
      endroit: 'Château Vintage', 
      prix: '3500', 
      commentaire: 'Grand jardin disponible',
      maps: 'https://www.google.com/maps/place/Chateau+de+Savigny-les-Beaune/@47.0632069,4.8178567,16.75z/data=!4m15!1m8!3m7!1s0x47f28b634e7cff9b:0x25ef1c4506681fec!2s21420+Savigny-l%C3%A8s-Beaune,+France!3b1!8m2!3d47.0644992!4d4.8175578!16s%2Fm%2F02wxnj1!3m5!1s0x47f28b6f7ec34c4b:0xee1a56b24c309d99!8m2!3d47.0616738!4d4.8187496!16s%2Fg%2F122090ls?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D'
    },
    { 
      lieux: 'Bordeaux', 
      endroit: 'Domaine Viticole', 
      prix: '4200', 
      commentaire: 'Dégustation incluse',
      maps: 'https://www.google.com/maps/place/Chateau+de+Savigny-les-Beaune/@47.0632069,4.8178567,16.75z/data=!4m15!1m8!3m7!1s0x47f28b634e7cff9b:0x25ef1c4506681fec!2s21420+Savigny-l%C3%A8s-Beaune,+France!3b1!8m2!3d47.0644992!4d4.8175578!16s%2Fm%2F02wxnj1!3m5!1s0x47f28b6f7ec34c4b:0xee1a56b24c309d99!8m2!3d47.0616738!4d4.8187496!16s%2Fg%2F122090ls?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Lieux de Mariage</h2>
        <Table 
          headers={headers} 
          data={data} 
          googleMapsApiKey={config.googleMapsApiKey}
          initialSortColumn="Prix"
        />
      </main>
    </div>
  )
}

export default App
