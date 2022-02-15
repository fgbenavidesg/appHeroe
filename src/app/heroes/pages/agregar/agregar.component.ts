import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `img{
        width: 100%;
        border-radius: 5px;
    }`
  ]
})
export class AgregarComponent implements OnInit {

  heroe : Heroe = {

    superhero:'',    
    publisher:Publisher.DCComics,      
    alter_ego:'',       
    first_appearance:'',
    characters:'',     
    alt_img:''         
  }
  publishers = [
    { 
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]
  constructor( private heroeService: HeroesService,
               private activateRoute: ActivatedRoute,
               private router:Router,
               private snackBar: MatSnackBar,
               private dialog: MatDialog) { }

  ngOnInit(): void {

    if(!this.router.url.includes('editar')){
      return;
    }

    this.activateRoute.params
    .pipe(
        switchMap(({id})=>this.heroeService.getHeroePorId(id))
    )
    .subscribe(heroe => this.heroe = heroe)
  }
  guardar(){
    if(this.heroe.superhero.trim().length===0)
    {
      return;
    }

    if(this.heroe.id){

       this.heroeService.actualizarHeroes(this.heroe)
       .subscribe(heroe => this.mostrarSnakbar('registro actualizado')) 
    }
    else{
       
      this.heroeService.agregarHeroes(this.heroe)
      .subscribe(heroe=>{
        this.router.navigate(['/heroes/editar',heroe.id]);
        this.mostrarSnakbar('registro creado')
    })
    }
    
  }
  borrar(){
    this.dialog.open(ConfirmarComponent,{
      width: '250px',
      data: this.heroe
      //{...this.heroe} cuando se aplican cambios en el componente
      //cuando se cierra 
    }).afterClosed().subscribe(
      (result)=>{
        if(result){

          this.heroeService.borrarHeroes(this.heroe.id!)
          .subscribe(resp =>{
            this.router.navigate(['/heroes'])
          });
        }
      }
    )
   
  } 
  mostrarSnakbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration: 2500
    });
  }
}
