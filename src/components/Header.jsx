import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Busqueda from './Busqueda'
import useAuth from '../hooks/useAuth'

import io from 'socket.io-client'

let socket

const Header = () => {
  const { handleBuscador, cerrarSesionProyectos, setUpdate, update, setRedir } = useProyectos()
  const { cerraSesionAuth, auth } = useAuth()
  const [] = useState()

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL)
    socket.emit('pagina', 'logeado')
    },[])

  useEffect(() => {
    socket.on('update', correo => {
      if(!correo){
        return
      }
      if(auth.email === correo.email){
        setUpdate(!update)
        if(correo.id){
          setRedir(correo.id)
        }else{
          setRedir('')
        }
      }
    })
  })

  const cerrarSesion = () => {
    cerrarSesionProyectos()
    cerraSesionAuth()
    localStorage.removeItem('token')
  }
  return (
    <header className="px-4 py-5 bg-white border-b">
        <div className="md:flex md:justify-between">
            <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
                UpTask
            </h2>

            <div className='flex flex-col md:flex-row items-center gap-4'>
              <button
              onClick={handleBuscador}
              type='button'
              className='font-bold uppercase'
              >buscar Proyecto</button>
                    <Link
                    to="/proyectos"
                    className='font-bold uppercase'
                    >Proyectos</Link>
                    <button
                    type="button"
                    className='text-sm text-white bg-sky-600 p-3 rounded-md uppercase font-bold'
                    onClick={() => cerrarSesion()}
                    >Cerrar Sesion</button>

                    <Busqueda />
            </div>
        </div>
    </header>
  )
}

export default Header