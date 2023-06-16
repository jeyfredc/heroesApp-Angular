import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';

/* Definiciòn de rutas padres o rutas abuelas de los componentes */
const routes: Routes = [
  {
    path: 'auth',
    // Carga mediante LazyLoad
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'heroes',
    // Carga mediante LazyLoad
    loadChildren: () =>
      import('./heroes/heroes.module').then((m) => m.HeroesModule),
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    // Esto se añade porque cuando una persona va y busca un dominio por lo general no hay una ruta ligada
    // es decir como https://dominio.com/'' <-- esto es un path vacio, por eso se pone el redirectTo
    // el pathMatch es porque entre los strings tambien hay strings vacios y poner esta regla hace que sea exacto el path a como lo estamos poniendo ahora
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full',
  },
  {
  //Quiere decir que cualquier otro path diferente al que hemos puesto va a redireccionar al 404Page
    path:'**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
