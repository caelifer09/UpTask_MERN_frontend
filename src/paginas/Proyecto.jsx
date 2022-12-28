import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'
import ModalFormTarea from '../components/ModalFormTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import ModalEliminarColaborador from "../components/modalEliminarColaborador"
import Tarea from '../components/Tarea'
import Colaborador from '../components/Colaborador'
import Error from '../components/Error'
import io from 'socket.io-client'
let socket

const Proyecto = () => {
    const { id } = useParams()
    const {  redir, proyecto, cargando, mostrarAlerta,obtenerProyecto, handleModalTarea , alerta, submitTareasProyecto, tareaEliminadaProyecto, tareaEditadaProyecto, tareaCompletadaProyecto, proyectoFueEliminado} =useProyectos()
    const navigate = useNavigate()
    const admin = useAdmin()

    useEffect(() => {
        obtenerProyecto(id)
    },[])
    
    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL)
        socket.emit('abrir proyecto', id)
    },[])
    useEffect(() => {
        if(redir === proyecto._id){
            mostrarAlerta({
                msg: 'fuiste eliminado del proyecto',
                error: true
            })
            navigate('/proyectos')
        }
    },[redir])
    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if(tareaNueva.proyecto === proyecto._id){
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if(tareaEliminada.proyecto === proyecto._id){
                tareaEliminadaProyecto(tareaEliminada)
            }
        })
        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto === proyecto._id){
                tareaEditadaProyecto(tareaActualizada)
            }
        })
        socket.on('tarea estado', tareaEstado => {
            if(tareaEstado.proyecto._id === proyecto._id){
                tareaCompletadaProyecto(tareaEstado)
            }
        })
        socket.on('fue eliminado', idProyecto => {
            if(idProyecto === proyecto._id){
                proyectoFueEliminado(idProyecto)
            }
        })

        return () => {
            socket.off("tarea agregada")
            socket.off("tarea eliminada")
            socket.off("tarea actualizada")
            socket.off("tarea estado")
          }

    })

    if(cargando) return 'Cargando...'

    const {msg} = alerta
  return (
    <>
        <div className='flex justify-between'>
            <h1 className='font-black text-4xl'>{proyecto.nombre}</h1>
            {admin && (
                <div className='flex items-center gap-2 text-gray-400 hover:text-black mr-11'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <Link
                to={`/proyectos/editar/${id}`}
                className='uppercase font-bold'
                >Editar</Link>
            </div>
            )}            
        </div>

        {admin && (
            <button
            onClick={handleModalTarea}
            type='button'
            className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>    
        nueva tarea</button>
        )}       

        <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>
        {msg && <Error alerta={alerta} />}
        <div className='bg-white shadow mt-10 rounded-lg'>
            {proyecto?.tareas?.length ? 
            proyecto.tareas?.map( tarea =>(
                <Tarea 
                key={tarea._id}
                tarea={tarea}
                />
            )) : 
            <p className='text-center my-5 p-10'>No hay tareas en este Proyecto</p>}
        </div>

        {admin && (
            <>
             <div className='flex items-center justify-between mt-10'>
             <p className='font-bold text-xl'>Colaboradores</p>
             <Link
             to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
             className="text-gray-400 uppercase font-bold hover:text-black"
             >añadir</Link>
         </div>
 
         <div className='bg-white shadow mt-10 rounded-lg'>
             {proyecto?.colaboradores?.length ? 
             proyecto.colaboradores?.map( colaborador =>(
                 <Colaborador 
                 key={colaborador._id}
                 colaborador={colaborador}
                 />
             )) : 
             <p className='text-center my-5 p-10'>No hay Colaboradores en este Proyecto</p>}
         </div>
         </>
        )}     
        <ModalFormTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />
    </>
    )
}

export default Proyecto