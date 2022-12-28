import { Link } from 'react-router-dom'
import { useState } from 'react'
import clienteAxios from '../config/clienteAxios'
import Error from '../components/Error'

const Registrar = () => {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword ] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState({})

    const handlerSubmit = async e => {
        e.preventDefault()
        if([nombre,email,password,password2].includes('')){
            setError({
                msg: 'todos los campos obligatorios',
                error: true
            })
            return
        }
        if(password !== password2){
            setError({
                msg: 'Password deben ser iguales',
                error: true
            })
            return
        }
        if(password < 6){
            setError({
                msg: 'la Password es muy debil',
                error: true
            })
            return
        }
        setError({})
        try {
            const {data} = await clienteAxios.post(`/usuarios`, {nombre, email, password})
            setError({
                msg: data.msg,
                error: false
            })
            setNombre('')
            setEmail('')
            setPassword('')
            setPassword2('')
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
    <h1 className="text-sky-600 font-black text-3xl capitalize">Crea tu cuenta y administra tus <span className="text-slate-700">proyectos</span></h1>
    <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handlerSubmit}
        >
            {msg && <Error alerta={error} />}
        <div className="my-5">
            <label htmlFor="nombre" className=" uppercase text-gray-600 block text-xl font-bold">Nombre</label>
            <input 
            id="nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label htmlFor="email" className=" uppercase text-gray-600 block text-xl font-bold">Email</label>
            <input 
            id="email"
            type="email"
            placeholder="Ingresa tu Email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label htmlFor="password" className=" uppercase text-gray-600 block text-xl font-bold">Password</label>
            <input 
            id="password"
            type="password"
            placeholder="Crea tu password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label htmlFor="password-repetir" className=" uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
            <input 
            id="password-repetir"
            type="password"
            placeholder="Repite tu password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            />
        </div>

        <input 
        type="submit"
        value="Crear Cuenta"
        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded-lg hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
    </form>
    <nav className="lg:flex lg:justify-between">
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Ya tienes una cuenta? Inicia Sesion</Link>
        <Link to="/olvide-password" className='block text-center my-5 text-slate-500 uppercase text-sm'>Olvide mi Password</Link>
    </nav>
</>
  )
}

export default Registrar