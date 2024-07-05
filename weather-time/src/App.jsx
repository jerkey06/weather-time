import './App.css'
import { Axios } from 'axios'

function App() {

  const [data, setData] = useState({})
  const [location, setLocation] = useState('Mexico')

  const API_KEY = 'f9983b23412d9b6c7ed6d21c4ba563c0';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`; 
  return (
    <div className='w-full h-full relative'>
      <div className='text-center p-4'>
        <input 
          type="text" 
          className='py-3 px-6 w-[700px] text-lg rounded-3xl border-gray-200 text-gray-600 placeholder:text-gray-400 focus:outline-none border-t-white/100 shadow-md'
          placeholder='localizacion'
        />
      </div>
    </div>
  )
}

export default App
