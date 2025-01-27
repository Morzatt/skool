// Images Import
import backup_icon from "$lib/images/icons/backup_icon.svg"
import usuarios_icon from "$lib/images/icons/permisos_icon.svg"
import administrar_usuario_icon from "$lib/images/icons/administrar_usuario_icon.svg"
import trabajadores from "$lib/images/icons/trabajadores.svg"
import horarios from "$lib/images/icons/horarios.svg"
import constancias from "$lib/images/icons/historial_icon.svg"

type RouteGroup = {
    name: string,
    routes: Route[]
}

type Route = {
    icon: string,
    href: string,
    name: string
}

export const routes: RouteGroup[] = [
    {
        name: "Trabajadores",
        routes: [
            {
                icon: trabajadores,
                href: "",
                name: "Administrar Empleados"
            },
            {
                icon: horarios,
                href: "",
                name: "Administrar Horarios"
            },
            {
                icon: constancias,
                href: "",
                name: "Administrar Constancias de Trabajo"
            },
        ]
    },
    {
        name: "Ajustes",
        routes: [
            {
                icon: administrar_usuario_icon,
                href: "settings/account",
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
                href: "settings/backup",
                name: "Respaldos"
            },

        ]
    }
]