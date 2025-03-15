// See https://svelte.dev/docs/kit/types#app.d.ts

import type { FormResponse } from "$lib/classes/responses.classes";
import type pino from "pino";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			usuario: Omit<Usuario, "contraseña">,
			log: pino.Logger<never, boolean>,
			response: FormResponse 
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
