import type { ResponseObject } from "$lib/classes/responses.classes"
import type { ActionFailure, RequestEvent } from "@sveltejs/kit"
import type { GenericRepositoryInterface } from "$lib/database/repositories/types.repository"
import type { UsuarioRepositoryInterface } from "$lib/database/repositories/user.repository";
import type { SessionsRepositoryInterface } from "$lib/database/repositories/sessions.repository";

export type Repository<T> = T extends GenericRepositoryInterface[] ? T : never

export type FormHandler = (
    r: RequestEvent,
    mock?: any | undefined,
    ...repositories: any[]
) => Promise<ResponseObject | ActionFailure<any>>