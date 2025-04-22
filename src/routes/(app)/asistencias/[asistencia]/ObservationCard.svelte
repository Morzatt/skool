<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ObservacionAsistencia, Usuario } from "$lib/database/types";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

   let { index, observacion }: { index: number, observacion: ObservacionAsistencia & { nombre_usuario: string, apellido_usuario: string, role_usuario: string } } = $props()
</script>

<div class="card w-full h-fit bg-base-100 rounded-xl shadow-lg animate-pop-delayed" style="--delay: {(index*100)+200}ms">
  <span class="title {observacion.tipo_observacion === "Entrada" ? "text-success" : "text-error"}">Observación {observacion.tipo_observacion === "General" ? "" : `de ${observacion.tipo_observacion}`}</span>

  <div class="comments">
    <div class="comment-container w-full">
      <div class="user">
        <div class="user-pic">
          <svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linejoin="round" fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"></path>
            <path stroke-width="2" fill="#707277" stroke="#707277" d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"></path>
          </svg>
        </div>
        <div class="user-info">
          <div>
            <h3 class="font-bold">{observacion.nombre_usuario} {observacion.apellido_usuario}</h3>
            <span class="text-base-content/80">{observacion.encargado_observacion}</span>
          </div>

          <p>
            <span>{new Date(observacion.created_at).toLocaleDateString('es')},</span>
            <span>{new Date(observacion.created_at).toLocaleTimeString('es', { timeStyle: 'short', hour12: true })}</span>
          </p>
        </div>
      </div>

      <p class="comment-content">{capitalizeFirstLetter(observacion.observacion)}</p>
    </div>

    <div class="comment-react">
      <button
       aria-label="button" class="rounded-md transition-all duration-200 ease-in-out hover:text-base-100 hover:bg-base-content"><i class="fa-solid fa-pencil"></i></button>
      <button onclick="{() => { document.getElementById(`delete_observation_modal_${observacion.created_at}`).showModal() }}"
       aria-label="button" class="rounded-md transition-all duration-200 ease-in-out hover:text-base-100 hover:bg-base-content"><i class="fa-solid fa-trash-can"></i></button> 
      <hr>
    </div>
  </div>

</div>

<dialog id="delete_observation_modal_{observacion.created_at}" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-100 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-sm overflow-hidden">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-16 shrink-0 stroke-current red-filter"
            fill="none"
            viewBox="0 0 24 24">
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h3 class="text-lg mt-3">¿Desea eliminar Esta Observacion?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center mt-1">Esta acción es irreversible.</p>

        <div class="w-fit gap-3 mt-4 flex">

            <form method="dialog">
                <button type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/deleteObservation" method="POST" use:enhance>
                <input type="hidden" name="timestamp" value="{observacion.created_at}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
  .title {
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f1f1f1;
    font-weight: 700;
    font-size: 13px;
    color: #47484b;
  }

  .title::after {
    content: '';
    width: 8ch;
    height: 1px;
    position: absolute;
    bottom: -1px;
    background-color: #47484b;
  }

  .comments {
    @apply flex p-4 gap-2 pb-4;
  }

  .comment-react {
    width: 35px;
    height: fit-content;
    display: grid;
    grid-template-columns: auto;
    margin: 0;
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  .comment-react button {
    width: 35px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    outline: none;
  }

  .comment-react button:after {
    content: '';
    width: 40px;
    height: 40px;
    position: absolute;
    left: -2.5px;
    top: -2.5px;
    background-color: #f5356e;
    border-radius: 50%;
    z-index: 0;
    transform: scale(0);
  }

  .comment-react button svg {
    position: relative;
    z-index: 9;
  }

  .comment-react button:hover:after {
    animation: ripple 0.6s ease-in-out forwards;
  }

  .comment-react button:hover svg {
    fill: #f5356e;
  }

  .comment-react button:hover svg path {
    stroke: #f5356e;
    fill: #f5356e;
  }

  .comment-react hr {
    width: 80%;
    height: 1px;
    background-color: #dfe1e6;
    margin: auto;
    border: 0;
  }

  .comment-react span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 13px;
    font-weight: 600;
  }

  .comment-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    margin: 0;
  }

  .comment-container .user {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 10px;
  }

  .comment-container .user .user-pic {
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f1f1;
    border-radius: 50%;
  }

  .comment-container .user .user-pic:after {
    content: '';
    width: 9px;
    height: 9px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    border-radius: 50%;
    background-color: #0fc45a;
    border: 2px solid #ffffff;
  }

  .comment-container .user .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 3px;
  }

  .comment-container .user .user-info span {
    font-weight: 600;
    font-size: 13px;
  }

  .comment-container .user .user-info p {
    font-weight: 500;
    font-size: 12px;
    color: #acaeb4;
  }

  .comment-container .comment-content {
    @apply text-wrap flex w-full;
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    color: #5f6064;
  }

  .text-box {
    width: 100%;
    height: fit-content;
    background-color: #f1f1f1;
    padding: 8px;
  }

  .text-box .box-container {
    background-color: #ffffff;
    border-radius: 8px 8px 21px 21px;
    padding: 8px;
  }

  .text-box textarea {
    width: 100%;
    height: 40px;
    resize: none;
    border: 0;
    border-radius: 6px;
    padding: 12px 12px 10px 12px;
    font-size: 13px;
    outline: none;
    caret-color: #0a84ff;
  }

  .text-box .formatting {
    display: grid;
    grid-template-columns: auto auto auto auto auto 1fr;
  }

  .text-box .formatting button {
    width: 30px;
    height: 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 50%;
    border: 0;
    outline: none;
  }

  .text-box .formatting button:hover {
    background-color: #f1f1f1;
  }

  .text-box .formatting .send {
    width: 30px;
    height: 30px;
    background-color: #0a84ff;
    margin: 0 0 0 auto;
  }

  .text-box .formatting .send:hover {
    background-color: #026eda;
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
