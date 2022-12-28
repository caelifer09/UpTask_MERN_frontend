import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import Error from "./Error"
import useProyectos from "../hooks/useProyectos"


const FormularioProyecto = () => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')
    const [boton, setBoton] = useState('Agregar Proyecto')
    const [id, setId] = useState(null)
    const { proyecto, alerta, mostrarAlerta, submitProyecto, obtenerProyecto } = useProyectos()
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if(!params.id) {
            setId(null)
            setNombre('')
            setDescripcion('')
            setFechaEntrega('')
            setCliente('')
            setBoton('Agregar Proyecto')
        }else{
            if(proyecto.nombre) {
                setId(proyecto._id)
                setNombre(proyecto.nombre)
                setDescripcion(proyecto.descripcion)
                setFechaEntrega(proyecto.fechaEntrega.split('T')[0])
                setCliente(proyecto.cliente)
                setBoton('Actualizar Proyecto')
            }else {
                navigate(`/proyectos`)
            }

        }
    },[params])

    const handleSubmit = async e => {
        e.preventDefault()
        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
        }
        await submitProyecto({id,nombre,descripcion,fechaEntrega,cliente})
        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
        setBoton('Agregar Proyecto')
    }
    const {msg} = alerta
  return (
    <form 
    onSubmit={handleSubmit}
    className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow">
        {msg && <Error  alerta={alerta}/>}
        <div className="mb-5">
            <label 
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor="nombre"
            >Nombre Proyecto</label>
            <input 
                id="nombre"
                type="text"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Nombre del Proyecto"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label 
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor="descripcion"
            >descripcion</label>
            <textarea 
                id="descripcion"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="descripcion del Proyecto"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label 
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor="fecha"
            >Fecha Entrega</label>
            <input 
                id="fecha"
                type="date"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                value={fechaEntrega}
                onChange={e => setFechaEntrega(e.target.value)}
            />
        </div>
        <div className="mb-5">
            <label 
            className="text-gray-700 uppercase font-bold text-sm"
            htmlFor="cliente"
            >Nombre Cliente</label>
            <input 
                id="cliente"
                type="text"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={e => setCliente(e.target.value)}
            />
        </div>
        <input 
            type="submit"
            value={boton}
            className="bg-sky-600 w-full uppercase font-bold text-white rounded p-3 cursor-pointer hover:bg-sky-800 transition-colors"
        />
    </form>
  )
}

export default FormularioProyecto