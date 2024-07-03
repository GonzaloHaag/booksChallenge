import { Book } from "../interfaces/book_interface";

interface Props {
    despegableReadingList: boolean;
    setDespegableReadingList: React.Dispatch<React.SetStateAction<boolean>>;
    readingList: Book[];
    setReadingList: React.Dispatch<React.SetStateAction<Book[]>>;
    books: Book[];
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}
export const BooksReadingList = ({ despegableReadingList, setDespegableReadingList, readingList,setReadingList,books,setBooks }: Props) => {

    const handleReadingListBooks = (book:Book) => {
        setReadingList(readingList.filter((libro) => libro.ISBN !== book.ISBN));
        // Lo saco de la lista de lectura
        localStorage.setItem('librosLectura',JSON.stringify(readingList.filter((libro) => libro.ISBN !== book.ISBN)));

        // Lo vuelvo a agregar a la lista de libros disponibles  -> Lo que ya tenia más el libro
        setBooks([...books,book]);
        localStorage.setItem('librosDisponibles',JSON.stringify([...books,book]));
    }
    return (
        <>
            <div onClick={() => setDespegableReadingList(false)} className={`${despegableReadingList && 'bg-black/70 fixed inset-0 min-h-screen w-full'}`}></div>
            <div className={`fixed w-72 md:w-96 bg-gray-600 min-h-screen top-0 right-0 transition-all duration-300 ${despegableReadingList ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className="flex items-center text-center justify-center gap-2 mt-5">
                    <h2 className="text-xl">Lista de lectura</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-yellow-400" viewBox="0 0 576 512"><path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z" /></svg>
                </div>
                <ul className="flex flex-col gap-5 px-5 my-5">
                    {
                        readingList.length > 0 ? (
                            readingList.map((bookReading) => (
                                <li key={bookReading.ISBN} className="flex gap-5 shadow-lg p-2 rounded-md relative">
                                    <button onClick={() => handleReadingListBooks( bookReading )} className="absolute right-2 top-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 448 512"><path fill="#ffffff" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" /></svg>
                                    </button>
                                    <img src={bookReading.cover} width={70} alt={bookReading.title} className="rounded-md" />
                                    <div className="flex flex-col gap-2 text-base">
                                        <h4 className="font-semibold text-yellow-200">{bookReading.title}</h4>
                                        <span className="text-sm">Género: {bookReading.genre}</span>
                                        <span className="text-sm">Páginas: {bookReading.pages}</span>
                                    </div>
                                </li>
                            ))
                        )
                            :
                            <p className="text-center">No has agregado nada aún ☹</p>
                    }
                </ul>
            </div>
        </>
    )
}
