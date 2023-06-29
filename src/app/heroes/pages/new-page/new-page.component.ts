import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    //Si no incluye la palabra edit es porque va a añadir
    if (!this.router.url.includes('edit')) return;
    //Si esta dentro del path de edit va a consultar al heroe por el id que tenga esa ruta
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        //Si el heroe no existe devuelve a la ruta /
        if (!hero) return this.router.navigateByUrl('/');
        //Si existe devuelve todos los valores del heroe
        this.heroForm.reset(hero);
        return;
      });
  }

  //Formulario Reactivo
  public heroForm = new FormGroup({
    id: new FormControl(''), //Cuando no se indica un tipado especial significa que puede venir un valor string o tipo nulo
    superhero: new FormControl<string>('', { nonNullable: true }), //Esta condición indica que no puede ser nulo
    publisher: new FormControl<Publisher>(Publisher.DCComics), //Esta condicion indica que el publisher debe ser de ese tipo y se le debe pasar alguno de los valores existentes de la Interface
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    // console.log({
    //   formmIsValid: this.heroForm.valid,
    //   value: this.heroForm.value,
    // });
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //mostrar snackbar
        this.showSnackBar(`${hero.superhero} updated!`);
        this.router.navigate(['/heroes/list']);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      //mostrar snackbar, y navegar a /heroes/edit/ hero.id
      this.showSnackBar(`${hero.superhero} created!`);
      this.heroForm.reset();
    });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //   .subscribe(wasDeleted=>{
    //     if(wasDeleted)
    //     this.router.navigate(['heroes/list'])
    //   })

    // });
    /* Otro metodo para borrar mejor que el anterior */
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => true),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id))
      )
      .subscribe((wasDeleted) => {
        if (wasDeleted) this.router.navigate(['heroes/list']);
      });
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}

// SQL server 6.0
