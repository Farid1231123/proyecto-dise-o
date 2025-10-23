// ============================================
// MODELO PRINCIPAL - Conecta con Base de Datos
// ============================================

class ModeloMunicipal {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api'; // URL de tu backend
        this.datosDemo = this.inicializarDatosDemo();
    }

    // ============================================
    // DATOS DE DEMOSTRACIÓN (Para probar sin backend)
    // ============================================

    inicializarDatosDemo() {
        return {
            ciudadanos: [
                {
                    id: 1,
                    dni: '12345678',
                    nombre: 'JUAN CARLOS DELGADO MARTINEZ',
                    email: 'juan.delgado@email.com',
                    telefono: '987654321',
                    direccion: 'JR. REAL 456, HUANCAYO'
                }
            ],
            tramites: [
                {
                    id: 1,
                    numero_expediente: 'EXP-2024-001234',
                    ciudadano_id: 1,
                    tipo: 'LICENCIA_FUNCIONAMIENTO',
                    descripcion: 'Solicitud de licencia para restaurante',
                    estado: 'EN_REVISION',
                    fecha_inicio: '2024-01-15T10:00:00Z',
                    fecha_completado: null,
                    monto_pendiente: 245.00
                },
                {
                    id: 2,
                    numero_expediente: 'EXP-2024-001189',
                    ciudadano_id: 1,
                    tipo: 'PERMISO_CONSTRUCCION',
                    descripcion: 'Permiso para ampliación de vivienda',
                    estado: 'PENDIENTE',
                    fecha_inicio: '2024-01-10T09:30:00Z',
                    fecha_completado: null,
                    monto_pendiente: 380.00
                }
            ],
            deudas: [
                {
                    id: 1,
                    ciudadano_id: 1,
                    tipo: 'ARBITRIOS',
                    monto_base: 420.00,
                    intereses_moratorios: 45.00,
                    monto_total: 465.00,
                    periodo: 'Ene-Mar 2024',
                    fecha_vencimiento: '2024-11-15',
                    estado: 'PENDIENTE'
                },
                {
                    id: 2,
                    ciudadano_id: 1,
                    tipo: 'MULTA_TRANSITO',
                    monto_base: 250.00,
                    intereses_moratorios: 30.00,
                    monto_total: 280.00,
                    periodo: 'Ago 2024',
                    fecha_vencimiento: '2024-10-01',
                    estado: 'PENDIENTE'
                }
            ]
        };
    }

    // ============================================
    // MÉTODOS DE CIUDADANOS (HU-014)
    // ============================================

    async obtenerCiudadano(id) {
        try {
            // Simular llamada a API
            await this.simularDelay();
            const ciudadano = this.datosDemo.ciudadanos.find(c => c.id === id);
            
            if (!ciudadano) {
                throw new Error('Ciudadano no encontrado');
            }
            
            return ciudadano;
        } catch (error) {
            console.error('Error obteniendo ciudadano:', error);
            throw error;
        }
    }

    async registrarCiudadano(datos) {
        try {
            await this.simularDelay();
            
            // Validaciones
            if (!/^\d{8}$/.test(datos.dni)) {
                throw new Error('DNI debe tener 8 dígitos');
            }

            if (!datos.email || !datos.telefono) {
                throw new Error('Email y teléfono son requeridos');
            }

            // Simular registro exitoso
            const nuevoId = Math.max(...this.datosDemo.ciudadanos.map(c => c.id)) + 1;
            const ciudadano = {
                id: nuevoId,
                ...datos,
                fecha_registro: new Date().toISOString()
            };
            
            this.datosDemo.ciudadanos.push(ciudadano);
            
            return {
                success: true,
                data: ciudadano,
                message: 'Ciudadano registrado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================
    // MÉTODOS DE TRÁMITES (HU-001, HU-002, HU-004, HU-005)
    // ============================================

    async registrarTramite(datos) {
        try {
            await this.simularDelay(2000); // Simular validación RENIEC
            
            // HU-001: Generar número de expediente único
            const numeroExpediente = `EXP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // HU-003: Validar datos requeridos
            if (!datos.tipo || !datos.descripcion) {
                throw new Error('Tipo y descripción son requeridos');
            }

            const nuevoTramite = {
                id: Math.max(...this.datosDemo.tramites.map(t => t.id)) + 1,
                numero_expediente: numeroExpediente,
                ciudadano_id: datos.ciudadanoId,
                tipo: datos.tipo,
                descripcion: datos.descripcion,
                estado: 'PENDIENTE',
                fecha_inicio: new Date().toISOString(),
                fecha_completado: null,
                monto_pendiente: this.calcularMontoTramite(datos.tipo),
                historial: [
                    {
                        estado_nuevo: 'PENDIENTE',
                        fecha: new Date().toISOString(),
                        razon: 'Trámite iniciado'
                    }
                ]
            };

            this.datosDemo.tramites.push(nuevoTramite);

            // HU-011: Simular notificación
            this.simularNotificacion('Trámite registrado exitosamente');

            return {
                success: true,
                data: nuevoTramite,
                message: 'Trámite registrado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async obtenerTramitesCiudadano(ciudadanoId) {
        try {
            await this.simularDelay();
            return this.datosDemo.tramites.filter(t => t.ciudadano_id === ciudadanoId);
        } catch (error) {
            console.error('Error obteniendo trámites:', error);
            return [];
        }
    }

    async obtenerDetalleTramite(expediente) {
        try {
            await this.simularDelay();
            const tramite = this.datosDemo.tramites.find(t => t.numero_expediente === expediente);
            
            if (!tramite) {
                throw new Error('Trámite no encontrado');
            }

            return tramite;
        } catch (error) {
            console.error('Error obteniendo detalle:', error);
            throw error;
        }
    }

    async cancelarTramite(tramiteId) {
        try {
            await this.simularDelay();
            const tramite = this.datosDemo.tramites.find(t => t.id === tramiteId);
            
            if (!tramite) {
                throw new Error('Trámite no encontrado');
            }

            if (tramite.estado !== 'PENDIENTE') {
                throw new Error('Solo se pueden cancelar trámites pendientes');
            }

            // HU-005: Validar que no tenga pagos
            if (tramite.monto_pendiente > 0) {
                // Simular reembolso si hubo pago
                console.log('Simulando reembolso...');
            }

            tramite.estado = 'CANCELADO';
            tramite.historial.push({
                estado_nuevo: 'CANCELADO',
                fecha: new Date().toISOString(),
                razon: 'Cancelado por el usuario'
            });

            return {
                success: true,
                message: 'Trámite cancelado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================
    // MÉTODOS DE PAGOS (HU-006, HU-007, HU-010)
    // ============================================

    async obtenerExpedientesPendientesPago(ciudadanoId) {
        try {
            await this.simularDelay();
            return this.datosDemo.tramites.filter(t => 
                t.ciudadano_id === ciudadanoId && 
                t.monto_pendiente > 0
            );
        } catch (error) {
            console.error('Error obteniendo expedientes:', error);
            return [];
        }
    }

    async procesarPago(datosPago) {
        try {
            await this.simularDelay(3000); // Simular procesamiento de pago
            
            // HU-006: Validar datos de pago
            if (!datosPago.metodo || datosPago.monto <= 0) {
                throw new Error('Datos de pago inválidos');
            }

            // Simular procesamiento con 90% de éxito
            const exito = Math.random() > 0.1;
            
            if (!exito) {
                throw new Error('Pago rechazado por el banco');
            }

            // HU-007: Generar comprobante
            const comprobante = `COMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            
            // Actualizar estado del trámite
            const tramite = this.datosDemo.tramites.find(t => t.id == datosPago.expedienteId);
            if (tramite) {
                tramite.monto_pendiente = 0;
                tramite.historial.push({
                    estado_nuevo: 'EN_REVISION',
                    fecha: new Date().toISOString(),
                    razon: 'Pago confirmado - En revisión'
                });
            }

            return {
                success: true,
                data: {
                    comprobante: comprobante,
                    fecha: new Date().toISOString(),
                    monto: datosPago.monto
                },
                message: 'Pago procesado exitosamente'
            };
        } catch (error) {
            // HU-010: Reprocesamiento automático
            console.log('Pago fallido, programando reintento...');
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================
    // MÉTODOS DE DEUDAS (HU-008, HU-009)
    // ============================================

    async obtenerDeudasCiudadano(ciudadanoId) {
        try {
            await this.simularDelay();
            return this.datosDemo.deudas.filter(d => d.ciudadano_id === ciudadanoId && d.estado === 'PENDIENTE');
        } catch (error) {
            console.error('Error obteniendo deudas:', error);
            return [];
        }
    }

    async pagarDeuda(deudaId) {
        try {
            await this.simularDelay();
            const deuda = this.datosDemo.deudas.find(d => d.id === deudaId);
            
            if (!deuda) {
                throw new Error('Deuda no encontrada');
            }

            deuda.estado = 'PAGADO';
            
            return {
                success: true,
                message: 'Deuda pagada exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async crearPlanPagos(deudaId, numeroCuotas) {
        try {
            await this.simularDelay();
            const deuda = this.datosDemo.deudas.find(d => d.id === deudaId);
            
            if (!deuda) {
                throw new Error('Deuda no encontrada');
            }

            // HU-009: Validar número de cuotas
            if (numeroCuotas < 3 || numeroCuotas > 12) {
                throw new Error('El plan debe ser entre 3 y 12 cuotas');
            }

            deuda.estado = 'FRACCIONADO';
            
            // HU-012: Programar recordatorios
            this.programarRecordatorios(deudaId, numeroCuotas);

            return {
                success: true,
                data: {
                    numeroCuotas: numeroCuotas,
                    montoCuota: (deuda.monto_total / numeroCuotas).toFixed(2),
                    montoTotal: deuda.monto_total
                },
                message: 'Plan de pagos creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    calcularMontoTramite(tipo) {
        const montos = {
            'LICENCIA_FUNCIONAMIENTO': 245.00,
            'PERMISO_CONSTRUCCION': 380.00,
            'CERTIFICADO_PARAMETROS': 150.00
        };
        return montos[tipo] || 100.00;
    }

    programarRecordatorios(deudaId, cuotas) {
        console.log(`Programando recordatorios para deuda ${deudaId} con ${cuotas} cuotas`);
        // En implementación real, se integraría con un sistema de colas
    }

    simularNotificacion(mensaje) {
        console.log(`📧 Notificación: ${mensaje}`);
        // HU-011: En implementación real, enviaría email/SMS
    }

    async simularDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============================================
    // MÉTODOS PARA INTEGRACIÓN CON BACKEND REAL
    // ============================================

    async llamarAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    }
}