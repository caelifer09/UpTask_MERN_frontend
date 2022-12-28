import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'

let socket

const ProyectoContext = createContext()

const ProyectoProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [tarea, setTarea] = useState({})
    const [cargando, setCargando] = useState(true)
    const [modalFT, setModalFT] = useState(false)
    const [modalET, setModalET] = useState(false)
    const [modalEC, setModalEC] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [buscador, setBuscador]=useState(false)
    const [update, setUpdate] =useState(false)
    const [redir, setRedir] = useState('')
    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios('/proyectos',config)
            setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        return () => obtenerProyectos()
    },[auth,update])
    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL)
    },[])
    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() =>{
            setAlerta({})
        }, 5000)
    }
    const submitProyecto = async proyecto => {
        if(!proyecto.id){
            await nuevoProyecto(proyecto)
        }else{
            await editarProyecto(proyecto)
        }
    }
    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto Creado Exitosamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${data._id}`)
            }, 2000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        }
    }
    const obtenerProyecto = async id => {
    setAlerta({})
       try {
        const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
       } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
        setCargando(false)
        setTimeout(() => {
            setAlerta({})
            navigate('/proyectos')
        }, 3000);
       }
       setCargando(false)
    }
    const eliminarProyecto = async id => {
       try {
        const token = localStorage.getItem('token')
        if(!token) return 
        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.delete(`/proyectos/${id}`,config)
        //socket
        socket.emit('eliminado', id)
        setAlerta({
            msg: data.msg,
            error: false
        })
        setTimeout(() => {
            setAlerta({})
            navigate("/proyectos")
        }, 2000)
       } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
        setTimeout(() => {
            setAlerta({})
        }, 2000);
       }
    }
    const submitTarea = async tarea => {
        if(tarea.id){
          await editarTarea(tarea)
        }else{
           await crearTarea(tarea)
        }        
    }
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            //socket 
            socket.emit('actualizar tarea', data)
            setAlerta({})
            setModalFT(false)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }
    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea , config)
            handleModalTarea()
            setAlerta({})
            // socket io
            socket.emit('nueva tarea', data)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }
    const handleModalTarea = () => {
        setModalFT(!modalFT)
        setTarea({})
    }
    const handleModalEliminar = () => {
        setModalET(!modalET)
        setTarea({})
    }
    const handleModalEC = () => {
        setModalEC(!modalEC)
        setColaborador({})
    }
    const muestraModal = colaborador => {
        setModalEC(!modalEC)
        setColaborador(colaborador)
    }
    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFT(!modalFT)
    }
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalET(!modalET)
    }
    const handleBuscador= () => {
        setBuscador(!buscador)
    }
    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            //socket
            socket.emit('eliminar tarea', tarea)

            setModalET(false)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }
    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
        setCargando(false)
    }
    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            //socket
            socket.emit('novedades', email)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }
    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config )
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            //socket
            socket.emit('novedades', {
                email: colaborador.email,
                id: proyecto._id
            })
            setAlerta({
                msg: data.msg,
                error: false
            })
            handleModalEC()
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }
    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return 
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`,{} , config)
            //socket 
            socket.emit('cambiar estado', data)
            setTarea({})
            setAlerta({})            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }
    }

    //socket io
    const submitTareasProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }
    const tareaEliminadaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }
    const tareaEditadaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    const tareaCompletadaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    const proyectoFueEliminado = id => {
        const limpiaProyectos = proyectos.filter(proyectoState => proyectoState._id !== id)
        setProyectos(limpiaProyectos)
        navigate("/proyectos")
    }
    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
        setTarea({})
        setColaborador({})
    }
    return (
    <ProyectoContext.Provider
            value={{
                proyectos,
                alerta,
                proyecto,
                cargando,
                modalFT,
                tarea,
                modalET,
                colaborador,
                modalEC,
                buscador,
                update,
                redir,
                mostrarAlerta,
                submitProyecto,
                obtenerProyecto,
                eliminarProyecto,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                handleModalEliminarTarea,
                handleModalEliminar,
                eliminarTarea,
                submitColaborador,
                agregarColaborador,
                handleModalEC,
                eliminarColaborador,
                muestraModal,
                completarTarea,
                handleBuscador,
                submitTareasProyecto,
                tareaEliminadaProyecto,
                tareaEditadaProyecto,
                tareaCompletadaProyecto,
                cerrarSesionProyectos,
                proyectoFueEliminado,
                setUpdate,
                setRedir
            }}
            >
        {children}
    </ProyectoContext.Provider>
  )
}
export {
    ProyectoProvider
}

export default ProyectoContext