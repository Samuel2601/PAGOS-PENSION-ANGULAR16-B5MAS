
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
declare var $: any;
import iziToast from 'izitoast';

@Component({
  selector: 'app-index-payments',
  templateUrl: './index-payments.component.html',
  styleUrls: ['./index-payments.component.scss']
})

export class IndexPaymentsComponent implements OnInit {
	public pagos: Array<any> = [];
	public pagos_const: Array<any> = [];
	public total_monto: Array<any> = [];
	public auxtotal = 0;
	public const_pagos: Array<any> = [];
	public token = localStorage.getItem('token');
	public page = 1;
	public pageSize = 10;
	public filtro = '';
	public desde: any = undefined;
	public hasta: any = undefined;
	public load = false;
	public rol: any;
	public aux: any;
	public total = 0;
	public vc = 0;
	constructor(private _adminService: AdminService) {}

	ngOnInit(): void {
		this.pagos = [];
		this.pagos_const = [];
		let aux = localStorage.getItem('identity');
		this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
			this.rol = response.data.rol;
			this.aux = response.data.email;
			this.recarga();

			////console.log(this.rol);
		});
		//this.recarga();
	}
	recarga() {
		this.auxtotal = 0;
		this.load = true;
		this._adminService.obtener_pagos_admin(this.token).subscribe((response) => {
			this.auxtotal = 0;
			this.pagos_const = response.data;
			this.pagos_const.forEach((element) => {
				this.pagos.push({ ckechk: 0, element });
			});
			this.pagos.forEach((element: any) => {
				this.auxtotal = element.element.total_pagar + this.auxtotal;
			});
			//console.log(this.pagos);
			this.const_pagos = this.pagos;
			this.load = false;
		});
		// this.auxtotal=parseFloat(this.auxtotal.toFixed(2));
	}

	filtrar_pagos() {
		this.pagos = [];
		this.auxtotal = 0;
		if (this.filtro) {
			var term = new RegExp(this.filtro.toString().trim(), 'i');
			this.pagos_const.forEach((element) => {
				this.pagos.push({ ckechk: 0, element });
			});
			this.pagos = this.pagos.filter(
				(item) =>
					term.test(item.element._id) ||
					term.test(item.element.estudiante.nombres) ||
					term.test(item.element.estudiante.apellidos) ||
					term.test(item.element.dni)
			);
			this.pagos.forEach((element: any) => {
				this.auxtotal = element.element.total_pagar + this.auxtotal;
			});
		} else {
			this.pagos_const.forEach((element) => {
				this.pagos.push({ ckechk: 0, element });
			});
			this.pagos.forEach((element: any) => {
				this.auxtotal = element.element.total_pagar + this.auxtotal;
			});
		}
		//this.auxtotal=parseFloat(this.auxtotal.toFixed(2));
	}
	select_todo() {
		if (this.total == 1) {
			this.pagos.forEach((element: any) => {
				element.ckechk = 0;
			});
		} else {
			this.pagos.forEach((element: any) => {
				element.ckechk = 1;
			});
		}
	}

	filtrar_fechas() {
		this.auxtotal = 0;
		this.pagos = [];
		if (this.desde || this.hasta) {
			
			let tt_desde = Date.parse(new Date(this.desde + 'T00:00:00').toString()) / 1000;
			let tt_hasta = Date.parse(new Date(this.hasta + 'T23:59:59').toString()) / 1000;
			this.auxtotal = 0;
			//console.log(tt_desde,tt_hasta);
			for (var item of this.const_pagos) {
				var tt_created = Date.parse(new Date(item.element.createdAt).toString()) / 1000;
				if (tt_created >= tt_desde && tt_created <= tt_hasta) {
					this.pagos.push( item );
					this.auxtotal = 0;
					this.const_pagos.forEach((elementt: any) => {
						this.auxtotal = elementt.element.total_pagar + this.auxtotal;
					});
				}
			}
			//console.log(this.pagos);
		} else {
			this.auxtotal = 0;
			this.pagos_const.forEach((element) => {
				this.pagos.push({ ckechk: 0, element });
			});
			this.pagos.forEach((element: any) => {
				this.auxtotal = element.element.total_pagar + this.auxtotal;
			});
		}
		// this.auxtotal=parseFloat(this.auxtotal.toFixed(2));
	}

	reset_data() {
		this.auxtotal = 0;
		this.desde = '';
		this.hasta = '';
		this.filtro = '';
		this.pagos = [];
		this.recarga();
	}

	eliminar(id: any) {
		//////console.log(id);
		this._adminService.eliminar_orden_admin(id, this.token).subscribe(
			(response) => {
				if (response.message == 'Eliminado con exito') {
					iziToast.success({
						title: 'SUCCESS',
						position: 'topRight',
						message: response.message,
					});
				} else {
					iziToast.error({
						title: 'ERROR',
						position: 'topRight',
						message: response.message,
					});
				}

				$('#delete-' + id).modal('hide');
				$('.modal-backdrop').removeClass('show');

				this.ngOnInit();
			},
			(error) => {
				//////console.log(error);
			}
		);
	}
	eliminar_todo() {
		this.load = true;
		//this.load_data_est=true;
		//////console.log(id);
		var con = 0;
		let ultimo = 0;
		this.pagos.forEach((element) => {
			if (element.ckechk == 1) {
				ultimo++;
			}
		});
		////console.log(ultimo);
		this.pagos.forEach((element: any) => {
			if (element.ckechk == 1) {
				this._adminService.eliminar_orden_admin(element.element._id, this.token).subscribe(
					(response) => {
						con++;
						if (con == ultimo) {
							iziToast.success({
								title: 'SUCCESS',
								position: 'topRight',
								message: 'Se eliminó correctamente el(los) pago.' + '(' + con + ')',
							});
							this.total = 0;
							$('#delete-todo').modal('hide');
							$('.modal-backdrop').removeClass('show');
							this.ngOnInit();
						}
						//this.recarga();
					},
					(error) => {
						//////console.log(error);
					}
				);
			}
		});
	}
}
