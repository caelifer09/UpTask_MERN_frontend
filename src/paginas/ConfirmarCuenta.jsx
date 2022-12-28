import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Error from '../components/Error'

const ConfirmarCuenta = () => {
  const [error, setError] = useState({})
  const [confirmada, setConfirmada] = useState(false)
  const params = useParams()
  const {id} = params

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url=`/usuarios/confirmar/${id}`
        const {data} = await clienteAxios(url)
        setError({
          msg: data.msg,
          error: false
      })
      } catch (error) {
        setError({
          msg: error.response.data.msg,
          error: true
      })
      }
      setConfirmada(true)
    }
    return () => {confirmarCuenta()}
  },[])

  const {msg} = error
  return (
   <>
     <h1 className="text-sky-600 font-black text-3xl capitalize">Confirma tu cuenta y administra tus <span className="text-slate-700">proyectos</span></h1>
      <div className='mt-10 bg-white shadow-xl rounded-xl'>
      {msg && <Error alerta={error} />}
      {confirmada && (
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia Sesion</Link>
      )}
      </div>
   </>
  )
}

export default ConfirmarCuenta