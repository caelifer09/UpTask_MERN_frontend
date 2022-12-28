import { useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Error from './Error'

const ColaboradorForm = () => {
    const { alerta, mostrarAlerta,submitColaborador } = useProyectos()
    const [email, setEmail] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        if(email === ''){
            mostrarAlerta({
                msg: 'email es obligatorio',
                error: true
            })
            return
        }
        submitColaborador(email)
    }
    const {msg} = alerta
  return (
    <form 
        onSubmit={handleSubmit}
        className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
            {msg && <Error alerta={alerta} />}
        <div className="mb-5">
            <label 
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor="email"
            >Email Colaborador</label>
            <input 
                id="email"
                type="email"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="email del Usuario"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </div>
        <input 
          type="submit"
          value="Buscar Colaborador"
          className='mt-3 rounded bg-sky-600 hover:bg-sky-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors text-sm'
        />
    </form>
  )
}

export default ColaboradorForm