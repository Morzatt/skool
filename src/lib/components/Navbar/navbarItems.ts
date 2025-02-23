// Images Import
import backup_icon from "$lib/images/icons/backup_icon.svg"
import usuarios_icon from "$lib/images/icons/permisos_icon.svg"
import administrar_usuario_icon from "$lib/images/icons/administrar_usuario_icon.svg"
import trabajadores from "$lib/images/icons/trabajadores.svg"
import horarios from "$lib/images/icons/horarios.svg"
import constancias from "$lib/images/icons/historial_icon.svg"
import administrar_asistencias_icon from "$lib/images/icons/administrar_asistencias_icon.svg"
import administrar_departamentos_icon from "$lib/images/icons/departamentos_icon.svg"
import administrar_justificaciones_icon from "$lib/images/icons/administrar_justificaciones_icon.svg"

type RouteGroup = {
    name: string,
    routes: Route[]
}

type Route = {
    icon: string,
    i?: string,
    href: string,
    name: string,
}

export const routes: RouteGroup[] = [
    {
        name: "Empleados",
        routes: [
            {
                icon: trabajadores,
                href: "",
                name: "Administrar Empleados"
            },

            {
                icon: administrar_justificaciones_icon,
                href: "",
                name: "Administrar Justificaciones"
            },
        ]
    },
    {
        name: "Departamentos",
        routes: [
            {
                icon: administrar_departamentos_icon,
                href: "",
                name: "Administrar Departamentos"
            },
        ]
    },
    {
        name: "Asistencias",
        routes: [
            {
                icon: administrar_asistencias_icon,
                href: "",
                name: "Registrar Asistencias"
            },
            {
                icon: horarios,
                href: "",
                name: "Administrar Asistencias"
            }
        ]
    },
    {
        name: "Ajustes",
        routes: [
            {
                icon: administrar_usuario_icon,
                href: "settings/account",
                i: "fa-regular fa-address-book",
                name: "Mi Usuario"
            }
        ]
    }
]

export const adminRoutes: RouteGroup[] = [
    {
        name: "Ajustes de Administrador",
        routes: [
            {
                icon: usuarios_icon,
                href: "settings/users",
                name: "Usuarios y Permisos"
            },
            {
                icon: backup_icon,
                i: "fa-solid fa-database",
                href: "settings/backup",
                name: "Respaldos", 
            },

        ]
    }
]