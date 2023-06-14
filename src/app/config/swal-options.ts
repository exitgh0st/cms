import Swal, { SweetAlertOptions } from 'sweetalert2';

export async function provideSwal() {
  return Swal.mixin({
    confirmButtonColor: 'green',
    customClass: {
      confirmButton: 'swal-confirm-button-f',
      cancelButton: 'swal-cancel-button'
    }
  });
}

export const swalCustomClass = {
  confirmButton: 'swal-confirm-button',
  cancelButton: 'swal-cancel-button'
};
