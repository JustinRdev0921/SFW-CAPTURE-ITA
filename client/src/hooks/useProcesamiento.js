// src/hooks/useProcesamiento.js
import { useState } from 'react'
import { fileUploadRequest } from '../api/usuarios'
import { createProcesingRequest } from '../api/procesing'
import { v4 as uuidv4 } from 'uuid'

export function useProcesamiento() {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccess] = useState('')
  const [errorMessage, setError] = useState('')
  const [pdfFile, setPDFFile] = useState(null)
  const [archivoSeleccionado, setArchivo] = useState(null)
  const [empleado, setEmpleado] = useState(null)
  const [numeroExpediente, setNumeroExpediente] = useState('')

  // ① limpiador de mensajes
  const clearFeedback = () => {
    setSuccess('')
    setError('')
  }

  const onEmpleadoLoad = (expediente, emp) => {
    setNumeroExpediente(expediente)
    setEmpleado(emp)
  }

  const onFileChange = e => {
    const file = e.target.files[0]
    setArchivo(file)
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = () => setPDFFile(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPDFFile(null)
    }
  }

  const onEnviar = async (data, numeroExpediente, empleado, username) => {
    setLoading(true)
    try {
      const idProcesamiento = uuidv4()

      // calcular nombreArchivo como antes
      const nombreArchivo =
        data.area === 'rrhhNomina' && data.grupo === 'NOV'
          ? `${idProcesamiento}-_-${numeroExpediente}-ZIP`
          : `${idProcesamiento}-_-${numeroExpediente}`

      // FormData para el upload
      const formData = new FormData()
      formData.append('numeroExpediente', numeroExpediente)
      formData.append('idProcesamiento', idProcesamiento)
      formData.append('idSitio', data.sitio)
      formData.append('idCiudad', data.ciudad)
      formData.append('idArea', data.area)
      formData.append('idGrupo', data.grupo)
      formData.append('idTipoDoc', data.tipoDocumento)
      formData.append('fechaProcesamiento', new Date(data.fecha).toISOString())
      formData.append('archivo', archivoSeleccionado)
      formData.append('username', username)

      const uploadRes = await fileUploadRequest(formData)
      if (uploadRes.status === 200) {
        await createProcesingRequest({
          numeroExpediente,
          idProcesamiento,
          idSitio: data.sitio,
          idCiudad: data.ciudad,                 // abreviatura elegida
          idArea: data.area,
          idGrupo: data.grupo,
          idTipoDoc: data.tipoDocumento,
          fechaProcesamiento: new Date(data.fecha).toISOString(),
          nombreArchivo,                          // ahora sí lo pasamos
          nombreArchivoOriginal: archivoSeleccionado.name,
          username,
          cedula: empleado.CEDULA,
          apellidos: empleado.APELLIDOS,
          nombres: empleado.NOMBRES,
          cargo: empleado.CARGO,
          division: empleado.DIVISION,
          seccion: empleado.SELECCION,
          ciudad: empleado.CIUDAD,
          tipoContrato: empleado.TIPO_CONTRATO,
          estadoEmpleado: empleado.ESTADO
        })
        setSuccess('¡Proceso completado con éxito!')
      } else {
        setError('Error al cargar el archivo.')
      }
    } catch (err) {
      console.error(err)
      setError('Error en el envío.')
    } finally {
      setLoading(false)
    }
  }

  return {
    empleado,
    numeroExpediente,
    onEmpleadoLoad,
    onFileChange,
    onEnviar,
    loading,
    successMessage,
    errorMessage,
    clearFeedback,         // ← lo exponemos
    pdfFile,
    scannedFile: archivoSeleccionado
  }
}
