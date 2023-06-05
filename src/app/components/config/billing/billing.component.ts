import { Component,OnInit } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
declare var $: any;
import iziToast from 'izitoast';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  constructor(private _configservie: ConfigService) {
  }
  public config:any={}
  public sri:any={};
  ngOnInit(): void {
    this._configservie.getsri().subscribe(response=>{      
      if(response){
        this.sri=response;
        console.log(this.sri);
      }
    });
  }
  actualizar(actualizarForm: any) {
    console.log(this.config);
  }
  fileChangeEvent(event: any): void {
		var file: any;
		if (event.target.files && event.target.files[0]) {
			file = <File>event.target.files[0];
		} else {
			iziToast.show({
				title: 'ERROR',
				titleColor: '#FF0000',
				color: '#FFF',
				class: 'text-danger',
				position: 'topRight',
				message: 'No hay un imagen de envio',
			});
		}

		if (file.size <= 4000000) {
      if (file.type == 'application/x-pkcs12' || file.type == 'application/octet-stream') {
				const reader = new FileReader();
				reader.onload = (e) => (this.config.archivo = reader.result);
				// console.log(this.imgSelect);

				reader.readAsDataURL(file);

				$('#input-portada').text(file.name);
				this.config.archivo = file;
			} else {
				iziToast.show({
					title: 'ERROR',
					titleColor: '#FF0000',
					color: '#FFF',
					class: 'text-danger',
					position: 'topRight',
					message: 'El archivo debe ser un archivo tipo .p12',
				});
				$('#input-portada').text('Seleccionar imagen');
				//this.imgSelect = 'assets/img/01.jpg';
				this.config.archivo = undefined;
			}
		} else {
			iziToast.show({
				title: 'ERROR',
				titleColor: '#FF0000',
				color: '#FFF',
				class: 'text-danger',
				position: 'topRight',
				message: 'La imagen no puede superar los 4MB',
			});
			$('#input-portada').text('Seleccionar imagen');
			//this.imgSelect = 'assets/img/01.jpg';
			this.config.archivo = undefined;
		}
		// console.log(this.file);
	}

  view_password(label:any) {
		let type = $('#'+label).attr('type');

		if (type == 'text') {
			$('#'+label).attr('type', 'password');
		} else if (type == 'password') {
			$('#'+label).attr('type', 'text');
		}
	}

}
