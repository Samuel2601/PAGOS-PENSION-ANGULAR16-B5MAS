



import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { ConfigService } from 'src/app/service/config.service';
//import {CompleteParams, FlatfileMethods   } from "@flatfile/angular";
//import{Flatfile} from "@flatfile/sdk";

declare var iziToast: {
	show: (arg0: {
		title: string;
		titleColor: string;
		color: string;
		class: string;
		position: string;
		message: string;
	}) => void;
};

declare var $: any;

@Component({
  selector: 'app-index-students',
  templateUrl: './index-students.component.html',
  styleUrls: ['./index-students.component.scss']
})

export class IndexStudentsComponent implements OnInit {
	public estudiantes: Array<any> = [];
	public estudiantes_const: Array<any> = [];
	public token = localStorage.getItem('token');
	public rol: any;
	public page = 1;
	public pageSize = 10;
	public filtro = '';
	public load_eliminados = false;
	public load_data_est = true;
	private subir: Array<any> = [];
	private carga: Array<any> = [];
	public subidos = 0;
	public resubido = 0;
	public errorneos = 0;
	public mp = '';
	public total = 0;
	public resubidos = 0;
	public resubidosc = 0;
	public subidoss = 0;
	public errorneoss = 0;
	public errorv = 0;
	public vc = 0;
	constructor(private _adminService: AdminService,private progressBarService: ConfigService) {}
	//ID clave de acceso:FF00XR3WS37WD8LQBF6UQ2MIXJMNT4C6RHUU825Q
	//clave de acceso sercreta: evxpkjLuevPv5Q0nXXoBEoqJvy9QF2fwuMUzjj8Y
	//comando de inicio rapido: npx flatfile init --team 50869 --key FF00XR3WS37WD8LQBF6UQ2MIXJMNT4C6RHUU825Q  --secret evxpkjLuevPv5Q0nXXoBEoqJvy9QF2fwuMUzjj8Y  --environment test --name "flatfile-workbook"
	
	//50869
	//test
	//X-Api-Key: <access key id>+<secret access key>
	ngOnInit(): void {
		this.estudiantes_const = [];
		this.estudiantes = [];
		this.load_data_est = true;
		let aux = localStorage.getItem('identity');
		this.recarga();
		this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
			//console.log(response);
			this.rol = response.data.rol;
			
		});
	}
	recarga() {
		//this.load_data_est=true;
		this.estudiantes_const = [];
		this.estudiantes = [];
		this.progressBarService.setProgress(this.progressBarService.getProgress()+25);
		this._adminService.listar_estudiantes_tienda(this.token).subscribe((response) => {
			//console.log(response);

			this.estudiantes_const = response.data;
			this.estudiantes = [];
			this.progressBarService.setProgress(this.progressBarService.getProgress()+25);
			if (this.load_eliminados) {
				this.estudiantes_const.forEach((element) => {
					if (element.estado == 'Desactivado') {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
				
			} else {
				this.estudiantes = [];
				this.estudiantes_const.forEach((element) => {
					if (element.estado != 'Desactivado' && element.estado != undefined) {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
			}
			this.progressBarService.setProgress(this.progressBarService.getProgress()+50);
			this.load_data_est = false;
			this.progressBarService.setProgress(0);
			/*
		this.estudiantes_const.forEach(element => {
			
			if(element.estado!='Desactivado'&&element.estado!=undefined){
				//////console.log(element.estado)
				this.estudiantes.push({ckechk:0,element});
			}
			
		});*/
			//////console.log(this.estudiantes);
			//this.load_data_est = false;
		});
	}
  importdatos(){
    
  }
/*
	importdatos(){
		
		//console.log("Nien");
		Flatfile.requestDataFromUser({
			//FF00XR3WS37WD8LQBF6UQ2MIXJMNT4C6RHUU825Q --incorp
			//049743df-0983-4d9d-9e83-beb35f411989 --samuel
		embedId:'049743df-0983-4d9d-9e83-beb35f411989',
		
		onData:(chunk,next)=>{
			//console.log(chunk);
			chunk.records.forEach((element:any) => {
				this.carga.push(element);
			});
			
			//this.subir=chunk.records;
			//console.log(this.carga);
			
			if(chunk.totalChunks!=1){
				next();
			}else{
				this.carga.forEach((element:any) => {
					this.subir.push(element.data);
				});
				//console.log(this.subir);
				this.subir_estudiante();
			}
			
		},
		onInit:({session})=>{
			session.off('close', () => {});
		},
		onComplete:()=>{
			console.log("import completed");
		}
		});
	}
*/


	//N1DDq4BfF8ShhGBbq8zR69euleb7wg32DpstLBtw5JfEUPZgSMq1dnXnJpeNyEfA
	// 2 produccion---- 0SiKfh578fSfDXrlTEtPsAE69La56Jut5LWnxQFtIPgTbw3ACPioIKmcUIhvpUHV
	// 88440965-79d0-4d6e-a58d-3df7053ba6dd
	licenseKey = '88440965-79d0-4d6e-a58d-3df7053ba6dd';

	settings = {
		type: 'estudiantepro',

		fields: [
			{
				label: 'Nombres',
				key: 'nombres',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Apellidos',
				key: 'apellidos',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Dirección',
				key: 'direccion',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Email',
				key: 'email',
				validators: [
					{ validate: 'required', error: 'Obligatorio' },
					{ validate: 'unique', error: 'Tiene que ser único' },
					{
						validate: 'regex_matches',
						regex:
							"^[-a-z0-9~!$%^&*_=+}{'?]+(.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(.[-a-z0-9_]+)*.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}))(:[0-9]{1,5})?$",
						error: 'solo correos',
					},
				],
			},
			/*{
				label: "Contraseña",
				key: "password",
				validators: [{ validate: "required", error: "Obligatorio" }]
			},*/
			{ label: 'Genero', key: 'genero' },
			{
				label: 'Telefono',
				key: 'telefono',
				validators: [
					{ validate: 'required', error: 'Obligatorio' },

					{ validate: 'regex_matches', regex: '^\\d{10,10}$', error: 'Debe ingresar 10 números' },
				],
			},

			{
				label: 'Cedula',
				key: 'dni',
				validators: [
					{ validate: 'required', error: 'Obligatorio' },
					{ validate: 'unique', error: 'Tiene que ser único' },

					{ validate: 'regex_matches', regex: '^\\d{10,10}$', error: 'Debe ingresar 10 números' },
				],
			},

			{
				label: 'Curso',
				key: 'curso',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Paralelo',
				key: 'paralelo',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Nombres Padre',
				key: 'nombres_padre',
			},
			{
				label: 'Cedula Padre',
				key: 'dni_padre',
				validators: [
					{ validate: 'regex_matches', regex: '^\\d{10,13}$', error: 'Debe ingresar 10 a 13 números' },
				],
			},
			{
				label: 'Email Padre',
				key: 'email_padre',
				validators: [
					{
						validate: 'regex_matches',
						regex:
							"^[-a-z0-9~!$%^&*_=+}{'?]+(.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(.[-a-z0-9_]+)*.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}))(:[0-9]{1,5})?$",
						error: 'solo correos',
					},
				],
			},
			{
				label: 'Nombres a Facturar',
				key: 'nombres_factura',
				validators: [{ validate: 'required', error: 'Obligatorio' }],
			},
			{
				label: 'Cedula a Facturar',
				key: 'dni_factura',
				validators: [
					{ validate: 'required', error: 'Obligatorio' },
					{ validate: 'regex_matches', regex: '^\\d{10,13}$', error: 'Debe ingresar 10 a 13 números' },
				],
			},
		],
	};
	//a5dba8ac-66f7-40b5-9fd0-74935e8fc05f
	// 2 produccion---- 049743df-0983-4d9d-9e83-beb35f411989
	//12345
	customer = { userId: '12345' };
  /*
	onData(results: CompleteParams): Promise<string> {
		let errorState = false;
		console.log(results);
		//console.log(results.validData);

		return new Promise((resolve, rejects) => {
			if (errorState) {
				rejects('reject -this text is controlled by the end-user');
				errorState = false;
			} else {
				console.log(results);
				//this.subir = results.data;
				//console.log(this.subir.length);
				//this.subir_estudiante();
				resolve('Agregados con exito');
			}
		});
	}
*/


	subir_estudiante() {
		this.load_data_est = true;
		this.subidoss = 0;
		this.resubidos = 0;
		this.resubidosc = 0;
		this.errorneoss = 0;
		this.errorv = 0;
		this.progressBarService.setProgress(this.progressBarService.getProgress()+10);
		this._adminService.registro_estudiante_masivo(this.subir, this.token).subscribe((response) => {
			//console.log(response);
			this.subidoss = response.s;
			this.resubidos = response.r;
			this.resubidosc = response.rc;
			this.errorneoss = response.e;
			this.errorv = response.ev;
			this.progressBarService.setProgress(this.progressBarService.getProgress()+50);
			if (this.subidoss != 0) {
				iziToast.show({
					title: 'SUCCESS',
					titleColor: '#1DC74C',
					color: '#FFF',
					class: 'iziToast-success',
					position: 'topRight',
					message: 'Estudiante agregado con exito (' + this.subidoss + ')',
				});
			}
			if (this.resubidos != 0) {
				iziToast.show({
					title: 'INFO',
					titleColor: '#1DC74C',
					color: '#FFF',
					class: 'iziToast-primary',
					position: 'topRight',
					message: 'Reactivado (' + this.resubidos + ')',
				});
			}
			if (this.resubidosc != 0) {
				iziToast.show({
					title: 'INFO',
					titleColor: '#1DC74C',
					color: '#FFF',
					class: 'iziToast-info',
					position: 'topRight',
					message: 'Reactivado con pension existente(' + this.resubidosc + ')',
				});
			}
			if (this.errorneoss != 0) {
				iziToast.show({
					title: 'ADVERTENCIA',
					titleColor: 'RED',
					color: 'RED',
					class: 'iziToast-warning',
					position: 'topRight',
					message: 'Estudiante ya existente' + '(' + this.errorneoss + ')',
				});
			}
			if (this.errorv != 0) {
				iziToast.show({
					title: 'ERROR',
					titleColor: 'RED',
					color: 'RED',
					class: 'iziToast-dannger',
					position: 'topRight',
					message: 'Fila con campo vacio' + '(' + this.errorv + ')',
				});
			}
			this.progressBarService.setProgress(this.progressBarService.getProgress()+100);
			this.load_eliminados = false;
			this.progressBarService.setProgress(0);
			//this.ngOnInit();
			location.reload();
		});
	}
	mostrar_eliminado() {
		this.total = 0;
		this.load_data_est = true;
		this.load_eliminados = true;
		this.estudiantes = [];
		this.estudiantes_const.forEach((element) => {
			if (element.estado == 'Desactivado') {
				//////console.log(element.estado)
				this.estudiantes.push({ ckechk: 0, element });
			}
		});
		this.load_data_est = false;
		//this.recarga();
	}
	mostrar_normales() {
		this.total = 0;
		this.load_data_est = true;
		this.load_eliminados = false;
		this.estudiantes = [];
		this.estudiantes_const.forEach((element) => {
			if (element.estado != 'Desactivado' && element.estado != undefined) {
				//////console.log(element.estado)
				this.estudiantes.push({ ckechk: 0, element });
			}
		});
		this.load_data_est = false;
		//this.recarga();
	}
	filtrar_estudiante() {
		this.load_data_est = true;
		this.estudiantes = [];
		var aux = this.filtro;
		if (this.filtro) {
			if (this.filtro.length <= 2) {
				this.filtro = "'" + this.filtro + "'";
			}
			var term = new RegExp(this.filtro.toString().trim(), 'i');
			if (this.load_eliminados) {
				this.estudiantes_const.forEach((element) => {
					if (element.estado == 'Desactivado') {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
			} else {
				this.estudiantes_const.forEach((element) => {
					if (element.estado != 'Desactivado' && element.estado != undefined) {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
			}

			this.estudiantes = this.estudiantes.filter(
				(item) =>
				term.test((item.element.curso).toString()+'-'+(item.element.paralelo).toString()+' '+item.element.genero) ||
				term.test((item.element.curso).toString()+'-'+(item.element.paralelo).toString()) ||
					term.test(item.element.nombres) ||
					term.test("'" + item.element.curso + "'") ||
					term.test("'" + item.element.paralelo + "'") ||
					term.test(item.element.genero) ||
					term.test(item.element.apellidos) ||
					term.test(item.element.email) ||
					
					term.test(item.element.dni) ||
					term.test(item.element.telefono) ||
					term.test(item.element._id)||
					term.test(item.element.createdAt)||
					term.test(item.element.email_padre)
			);
		} else {
			if (this.load_eliminados) {
				this.estudiantes_const.forEach((element) => {
					if (element.estado == 'Desactivado') {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
			} else {
				this.estudiantes_const.forEach((element) => {
					if (element.estado != 'Desactivado' && element.estado != undefined) {
						//////console.log(element.estado)
						this.estudiantes.push({ ckechk: 0, element });
					}
				});
			}
		}
		this.filtro = aux;
		this.load_data_est = false;
	}
	eliminar(id: any) {
		this.load_data_est = true;
		//this.load_data_est=true;
		//////console.log(id);
		this._adminService.eliminar_estudiante_admin(id, this.token).subscribe(
			(response) => {
				iziToast.show({
					title: 'SUCCESS',
					titleColor: '#1DC74C',
					color: '#FFF',
					class: 'iziToast-success',
					position: 'topRight',
					message: response.message,
				});

				$('#delete-' + id).modal('hide');
				$('.modal-backdrop').removeClass('show');

				location.reload();
			},
			(error) => {
				//////console.log(error);
			}
		);
	}
	eliminar_todo() {
		this.load_data_est = true;
		//this.load_data_est=true;
		//////console.log(id);
		var con = 0;
		let ultimo = 0;
		this.estudiantes.forEach((element) => {
			if (element.ckechk == 1) {
				ultimo++;
			}
		});
		////console.log(ultimo);
		this.estudiantes.forEach((element: any) => {
			if (element.ckechk == 1) {
				this._adminService.eliminar_estudiante_admin(element.element._id, this.token).subscribe(
					(response) => {
						con++;
						if (con == ultimo) {
							iziToast.show({
								title: 'SUCCESS',
								titleColor: '#1DC74C',
								color: '#FFF',
								class: 'iziToast-success',
								position: 'topRight',
								message: 'Se eliminó correctamente el(los) estudiante.' + '(' + con + ')',
							});
							this.total = 0;
							this.load_eliminados = true;
							this.recarga();
							////console.log("Fin1");
						}
						//this.recarga();
					},
					(error) => {
						//////console.log(error);
					}
				);
			}
		});
		$('#delete-todo').modal('hide');
		$('.modal-backdrop').removeClass('show');
		location.reload();
	}
	select_todo() {
		if (this.total == 1) {
			this.estudiantes.forEach((element: any) => {
				element.ckechk = 0;
			});
		} else {
			this.estudiantes.forEach((element: any) => {
				element.ckechk = 1;
			});
		}
	}
	activar_todo() {
		this.load_data_est = true;
		//this.load_data_est=true;
		//////console.log(id);
		var con = 0;
		let ultimo = 0;
		this.estudiantes.forEach((element) => {
			if (element.ckechk == 1) {
				ultimo++;
			}
		});
		////console.log(ultimo);
		this.estudiantes.forEach((element: any) => {
			if (element.ckechk == 1) {
				this._adminService.reactivar_estudiante_admin(element.element._id, this.token).subscribe(
					(response) => {
						con++;
						if (con == ultimo) {
						}
						iziToast.show({
							title: 'SUCCESS',
							titleColor: '#1DC74C',
							color: '#FFF',
							class: 'iziToast-success',
							position: 'topRight',
							message: 'Se activo correctamente el estudiante.' + '(' + con + ')',
						});
						this.total = 0;
						this.load_eliminados = false;
						this.recarga();
						////console.log("Fin2");
						//this.recarga();
					},
					(error) => {
						//////console.log(error);
					}
				);
			}
		});
		$('#activar-todo').modal('hide');
		$('.modal-backdrop').removeClass('show');
		location.reload();
	}

	activar(id: any) {
		this.load_data_est = true;
		//this.load_data_est=true;
		//////console.log(id);
		this._adminService.reactivar_estudiante_admin(id, this.token).subscribe(
			(response) => {
				iziToast.show({
					title: 'SUCCESS',
					titleColor: '#1DC74C',
					color: '#FFF',
					class: 'iziToast-success',
					position: 'topRight',
					message: 'Se activado correctamente el estudiante.',
				});

				$('#delete-' + id).modal('hide');
				$('.modal-backdrop').removeClass('show');
				this.mostrar_normales();
				location.reload();
			},
			(error) => {
				//////console.log(error);
			}
		);
	}
}
