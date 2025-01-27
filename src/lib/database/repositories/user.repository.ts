import type { Usuario, NewUsuario, UpdateUsuario } from "../types";
import { db } from "../";
import type { GenericRepositoryInterface } from "./types.repository";
import { set } from "zod";

export interface UsuarioRepositoryInterface extends GenericRepositoryInterface {
    create(usuario: NewUsuario): Promise<unknown>
    getByUsername(username: string): Promise<Usuario | undefined>
    delete(username: string): Promise<void>
    changePassword(usuario: string, newPwd: string): Promise<void>
    update(update: UpdateUsuario, username: string): Promise<void>
    getAll(): Promise<Omit<Usuario, "contraseña">[]>
} 

export let usuarioRepository: UsuarioRepositoryInterface = {
    create: async (usuario) => {
        try {
            let result = await db.insertInto("usuarios")
                .values(usuario)
                .executeTakeFirst()
        } catch (error) {
            throw error
        }
    },

    getByUsername: async (username) => {
        try {
            let result = await db.selectFrom("usuarios")
                .selectAll()
                .where("usuario", "=", username)
                .executeTakeFirst()
            return result;
        } catch (error) {
            throw error
        }
    },

    delete: async (username) => {
        try {
            let result = await db.deleteFrom("usuarios")
                .where("usuario", "=", username)
                .execute()
        } catch (error) {
            throw error
        }
    },

    changePassword: async (usuario, newPwd) => {
        try {
            let result = await db.updateTable("usuarios")
                .set({ contraseña: newPwd })
                .where("usuarios.usuario", "=", usuario)
                .executeTakeFirst()
        } catch (error) {
            throw error
        }
    },

    update: async (data, username) => {
        try {
            let result = await db.updateTable("usuarios")
            .set(data)
            .where("usuarios.usuario", "=", username)
            .execute()
        } catch (error) {
           throw error 
        }
    },

    getAll: async () => {
        try {
            let result = await db
                .selectFrom("usuarios")
                .select(["nombre", "apellido", "usuario", "role", "estado", "created_at"])
                .orderBy("usuarios.created_at desc")
                .execute()
            return result
        } catch (error) {
           throw error 
        }
    }
}