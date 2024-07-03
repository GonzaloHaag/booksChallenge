import { useEffect, useState } from 'react';
import data from './books.json';
import { Book } from './interfaces/book_interface';
import { Books, BooksReadingList } from './components';

// La idea es tener un array de libros mas amigables 

const initialBooks:Book[] = data.library.map((data) => data.book);

/* Quiero los generos solamente de los libros, me hago un set
y lo convierto a array porque el set no admite valores repetidos */
const genres:string[] = Array.from(new Set(initialBooks.map((book) => book.genre)));


function App() {

  const [books,setBooks] = useState<Book[]>(initialBooks);
  const [readingList,setReadingList] = useState<Book[]>([]); //Lista de lectura, arrancara vacia
  const [filterGenre,setFilterGenre] = useState<string>('Todos');
  const [filterTitle,setFilterTitle] = useState<string>('');
  const [filterRange,setFilterRange] = useState<string>('1200');
  const [despegableReadingList,setDespegableReadingList] = useState(false);
  useEffect(() => {
    // Setear a la reading list y libros disponibles el valor de storage, si no encuentra nada que sea []
    setReadingList(
      JSON.parse(localStorage.getItem('librosLectura') ?? '[]')
    );

    // Si hay algo en librosDisponibles que sea eso, si no el initialBooks que es el estado inicial
    setBooks(
      JSON.parse(localStorage.getItem('librosDisponibles') ?? JSON.stringify(initialBooks))
    );
    // Sincronizar pestañas
    const handleStorageChange = (event:any) => {
      if (event.key === 'librosLectura') {
        setReadingList(JSON.parse(event.newValue ?? '[]'));
      } else if (event.key === 'librosDisponibles') {
        setBooks(JSON.parse(event.newValue ?? '[]'));
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
},[]);

const handleBooksList = (bookClick:Book) => {
  /* Si el libro esta en la lista hago un filter y me quedo con
  los que no coinciden para sacarlo. Si no esta me hago 
  una copia de lo que ya estaba + el libro que me llega */
  const filterReadingListBooks = readingList.includes( bookClick ) ? readingList.filter((libro) => libro.ISBN !== bookClick.ISBN)
  :
  [...readingList,bookClick];

  /** Ahora necesito actualizar la lista de libros disponibles, si esta en la lista de lectura,
   * me hago una copia de lo que tengo en books y me quedo con los que coincidan
   */
  const filterAvailableBooks = readingList.includes(bookClick)
  ? [...books, books.find((book) => book.ISBN === bookClick.ISBN)!]
  : books.filter((book) => book.ISBN !== bookClick.ISBN);
  setReadingList( filterReadingListBooks );
  setBooks(filterAvailableBooks);
  /** Guardo en el local storage con la clave correspondiente que indique en el useEffect */
  localStorage.setItem('librosDisponibles', JSON.stringify(filterAvailableBooks));
  localStorage.setItem('librosLectura',JSON.stringify( filterReadingListBooks ));
 }


  return (
    <div className="max-w-screen-xl mx-auto my-16 px-4 xl:px-0">
      <header className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-md md:text-4xl font-semibold italic">Books Challenge</h1>
          <button onClick={() => setDespegableReadingList(true) } type="button" className="inline-flex items-center px-2 md:px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            Lista de lectura
            <span className="inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
              {readingList.length}
            </span>
          </button>
        </div>
        <form className="flex flex-col gap-5 md:flex-row md:items-end justify-between">
          <div>
          <input type="text" value={ filterTitle } onChange={(event) => setFilterTitle(event.target.value) } placeholder="Buscar por título" className="py-[.375rem] px-3 min-w-72 outline-none transition-[outline] duration-300 focus:outline-2 focus:outline-white bg-gray-800 rounded-sm" />
          </div>
          <div className='flex gap-10'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='genre'>Filtrar por género</label>
            <select value={ filterGenre } onChange={(event) => setFilterGenre( event.target.value )} id="genre" className="bg-gray-800 py-2 px-2 rounded-sm outline-none">
              <option value='Todos'>Todos</option>
              {
                genres.map((genre) => (
                  <option key={genre} value={genre}>{ genre }</option>
                ))
              }
            </select>
          </div>
          <div className='flex flex-col gap-1 relative h-full'>
            <label htmlFor='pages'>Filtrar por páginas</label>
            <input value={ filterRange } onChange={(event) => setFilterRange( event.target.value )} type='range' min={0} max={1200} className='appearance-none bg-gray-800 rounded-full mt-[.625rem]' />
            <p className='absolute -bottom-7 text-sm'>máximo: {filterRange} </p>
          </div>
          </div>
        </form>
      </header>
      <main>
         <Books books={ books } readingList={ readingList } handleBooksList={ handleBooksList } filterGenre={ filterGenre } filterTitle={ filterTitle } filterRange={ filterRange } />
         <BooksReadingList despegableReadingList={ despegableReadingList } setDespegableReadingList={ setDespegableReadingList } readingList={ readingList } setReadingList = { setReadingList } books={ books } setBooks={ setBooks } />
      </main>
    </div>
  )
}

export default App
