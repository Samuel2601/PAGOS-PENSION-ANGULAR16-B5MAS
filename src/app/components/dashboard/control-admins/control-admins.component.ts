import { Component, OnInit} from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-control-admins',
  templateUrl: './control-admins.component.html',
  styleUrls: ['./control-admins.component.scss']
})
export class ControlAdminsComponent implements OnInit {

  constructor(private _adminService: AdminService) {}
  public resgistro_arr: any[] =[];
  public resgistro_const: any[] =[];
  public filtro='';
  public page = 1;
	public pageSize = 10;
  ngOnInit(): void {
    this.filtro='';
		this._adminService.listar_registro(localStorage.getItem('token')).subscribe((response) => {
			this.resgistro_arr=response.data.map((item:any)=>{
				if(item.admin){
					return{
						admin:{
							apellidos: item.admin.apellidos,
							nombres: item.admin.nombres,
							email: item.admin.email,
						},
						createdAt:item.createdAt,
						descripcion:item.descripcion,
						tipo:item.tipo,
					  _id:item._id,
					}
				}else{
					return{
						createdAt:item.createdAt,
						descripcion:item.descripcion,
						tipo:item.tipo,
					  _id:item._id,
					}
				}
				
			  });

			this.resgistro_const = this.resgistro_arr;
		});
	}
  filtrar_documento() {
		if (this.filtro) {
			var term = new RegExp(this.filtro.toString().trim(), 'i');
			this.resgistro_arr = this.resgistro_const.filter(
				(item) => term.test(item.admin.email) || term.test(item.tipo) || term.test(item.createdAt)
			);
		} else {
			this.resgistro_arr = this.resgistro_const;
		}
	}
}
