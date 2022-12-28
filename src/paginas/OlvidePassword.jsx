import { useState } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Error from '../components/Error'


const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState({})

  const handlerSubmit = async e => {
    e.preventDefault()
    setError({})
    if(email === ''){
      setError({
        msg: 'el Email es obligatorio',
        error: true
        })
        return
    }
    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
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
  }

  const {msg} = error

  return (
    <>
    <h1 className="text-sky-600 font-black text-3xl capitalize">Recupera tu acceso y administra tus <span className="text-slate-700">proyectos</span></h1>
    {msg && <Error alerta={error} />}
    <form 
    onSubmit={handlerSubmit}
    className="my-10 bg-white shadow rounded-lg p-10"
    >
      
        <div className="my-5">
            <label htmlFor="email" className=" uppercase text-gray-600 block text-xl font-bold">Email</label>
            <input 
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={email}
            onChange={e => setEmail(e.target.value) }
            />
        </div>

        <input 
        type="submit"
        value="Enviar Instrucciones"
        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-lg hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        
        />
    </form>
    <nav className="lg:flex lg:justify-between">
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Ya tienes una cuenta? Inicia Sesion</Link>
        <Link to="/registrar" className='block text-center my-5 text-slate-500 uppercase text-sm'>no tienes cuenta? Registrate</Link>
    </nav>
</>
  )
}

export default OlvidePassword