import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey     : string = 'kDOwbToE5BTLgp1LX5lcZPGKGpISK1AO';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];

  public resultados: Gif[] = [];


  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  

    // if( localStorage.getItem('historial') ){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }



  buscarGifs( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();
    
    if( !this._historial.includes( query ) ) {
      //si el dato no existe, lo inserta con el metodo unshift
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10); //Limitamos el tamaño del arreglo a 10 posiciones

      localStorage.setItem('historial', JSON.stringify( this._historial )  );
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query );


    //Petición HTTP con Angular
    //Con lo que está dentro de <> le estamos diciendo a Typescript que lo que viene
    //luce de esa manera
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params } )
      .subscribe( ( resp ) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify( this.resultados )  );
      });

  }


}