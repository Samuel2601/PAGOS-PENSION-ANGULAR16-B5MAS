import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { ConfigService } from 'src/app/service/config.service';
import iziToast from 'izitoast';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [
  "../../../../../node_modules/bootstrap/dist/css/bootstrap.css",'./sidebar.component.scss',]
})
export class SidebarComponent implements OnInit {


	get progress(): number {
		return this.progressBarService.getProgress();
		
	}


	public isExpanded: boolean = false;
  public toggleExpansion() {
    this.isExpanded = !this.isExpanded;
}

  public lightStylesheet = document.getElementById('stylesheetLight') as HTMLLinkElement;
  public darkStylesheet = document.getElementById('stylesheetDark') as HTMLLinkElement;
  public cosmicStylesheet = document.getElementById('stylesheetCosmic') as HTMLLinkElement;
  public themes=[
    {cod:'nb-theme-default',name:'Default'},
    {cod:'nb-theme-dark',name:'Dark'},
    {cod:'nb-theme-corporate',name:'Corporate'},
    {cod:'nb-theme-material-light',name:'Material Light'},
    {cod:'nb-theme-material-dark',name:'Material Dark'},
    {cod:'nb-theme-cosmic',name:'Cosmic'},
  ]

  toggleStyles(tema:any) {
   

    // Verifica si el estilo claro está activo
    if (this.lightStylesheet && this.darkStylesheet && this.darkStylesheet) {
      if (tema=='theme-light') {
        this.lightStylesheet.disabled = false; // Habilita el estilo claro
        this.cosmicStylesheet.disabled=true;
        this.darkStylesheet.disabled = true; // Deshabilita el estilo oscuro
       
      } else if(tema=='theme-dark') {
		this.darkStylesheet.disabled = false; // Habilita el estilo oscuro

        this.lightStylesheet.disabled = true; // Deshabilita el estilo claro
        this.cosmicStylesheet.disabled=true;
      }else{
		this.cosmicStylesheet.disabled=false;
        this.darkStylesheet.disabled = true; 
        this.lightStylesheet.disabled = true;
        
      }
    }
  }
  CambioStyles(tema: string) {
    var body = document.getElementById('bodyparse');
    if (body && body.classList) {
      // Eliminar todas las clases existentes en el elemento body
      body.classList.forEach((className) => {
        if(body && className!='pace-done'){
          body.classList.remove(className);
        }
      });  
      // Agregar la nueva clase recibida como parámetro después de eliminar los espacios en blanco
      body.classList.add(tema.trim());
    }
  }

  public rol: any;
	public imagen: any;
	public nombres: any;
	public estado: any;
	public aux: any;
	public id: any;
	public pagos: any = {};
	public config: any = {};
	public token = localStorage.getItem('token');
	public url = GLOBAL.url;
  
	constructor(private _router: Router, private _adminService: AdminService,private progressBarService: ConfigService) {
		//let aux1 = localStorage.getItem("identity");    
		this.rol = JSON.parse(localStorage.getItem('user_data')||'')?.rol;
		this.id = JSON.parse(localStorage.getItem('user_data')||'')?._id;
		this.nombres =
			JSON.parse(localStorage.getItem('user_data')||'')?.nombres +
			' ' +
			JSON.parse(localStorage.getItem('user_data')||'')?.apellidos;
		this.aux = JSON.parse(localStorage.getItem('user_data')||'')?.email;
		this.estado = JSON.parse(localStorage.getItem('user_data')||'')?.estado;
		this.imagen = JSON.parse(localStorage.getItem('user_data')||'')?.portada;
	}

	ngOnInit(): void {
		this.buscar();
		//console.log(this.rol);
		if (this.estado == 'Fuera' || this.estado == 'deshabilitado') {
			this.logout();
		}
	}
	public facu=new Date();
	buscar(){
		this._adminService.getapitoken().subscribe(response=>{
			//console.log(response);
			//console.log(response[0].token);
			this._adminService.conec_api(response[0].token).subscribe(response=>{
				//console.log(response);
				if(response){
					this.pagos=response;
					if(this.facu.getDay()!=1){
						this.facu=new Date(this.facu.getFullYear()+'-'+(this.facu.getMonth()+2).toString()+'-1');
						//console.log(this.facu);
					}
					if(this.pagos.generated_at&& new Date(this.pagos.generated_at).getTime()<= this.facu.getTime() &&parseFloat(this.pagos.month_to_date_usage)>25){
						$('#staticBackdrop').modal('show');
					}
				}
				
				
			});
		})
		
	}
	logout() {
		//window.location.reload();
		localStorage.clear();

		this._router.navigate(['/']).then(() => {
			window.location.reload();
		});
	}


}
