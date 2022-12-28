import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Error from '../components/Error'

const NuevoPassword = () => {
  const [error, setError] = useState({})
  const { token } = useParams()
  const [valido, setValido] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setValido(true)
      } catch (error) {
        setError({
          msg: error.response.data.msg,
          error: true
        })
        setValido(false)
      }
    }
    return () => {comprobarToken()}
  },[])

  const handleSubmit = async e => {
    e.preventDefault()
    if(password < 6){
      setError({
        msg: 'Password minimo de 6 caracteres',
        error: true
      })
      return
    }
    setError({})
    try {
      const url =`/usuarios/olvide-password/${token}`
      const {data} = await clienteAxios.post(url, {password})
      setError({
        msg: data.msg,
        error: false
        })
        setPasswordModificado(true)
    } catch (error) {
      setError({
        msg: error.response.data.msg,
        error: true
    })
    }
  }
  const {msg} = error
  return (
    <>
      <h1 className="text-sky-600 font-black text-3xl capitalize">Crea un nuevo password y administra tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Error alerta={error} />}
      {valido && (
        <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10">

        <div className="my-5">
              <label htmlFor="password" className=" uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
              <input 
              id="password"
              type="password"
              placeholder="Crea tu nueva password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              value={password}
              onChange={e => setPassword(e.target.value)}
              />
          </div>
  
            <input 
            type="submit"
            value="Cambiar Password"
            className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-lg hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
            />
        </form>
      )}
      {passwordModificado && (
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia Sesion</Link>
      )}

</>
  )
}

export default NuevoPassword