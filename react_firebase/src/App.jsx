import { useEffect, useState } from 'react';
import './App.css'
import { Auth } from "./components/Auth";
import { db, auth, storage } from './config/Firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { uploadBytes, ref } from 'firebase/storage';

function App() {

  // Movie list state
  const [movieList, setMovieList] = useState([]);

  // Updated Title State 
  const [updatedTitle, setUpdatedTitle] = useState("");

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // File upload State
  const [fileUpload, setFileUpload] = useState(null);

  // Reference of movie collection
  const moviesCollectionRef = collection(db, "movies");

  // Get movie list function
  const getMovieList = async () => {
    try {
      const q = query(moviesCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      console.log(filteredData);
      setMovieList(filteredData)
    } catch (err) {
      console.log(err);
    }
  };

    useEffect(() => {
    getMovieList();
  }, [])

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      const updatedMovieList = movieList.filter(movie => movie.id !== id);
      setMovieList(updatedMovieList); // Update the state to trigger a re-render
    } catch (err) {
      console.log(err);
    }
  }

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList();
    } catch (err) {
      console.log(err);
    }
  }

  const uploadFile = async () => {
    if (!fileUpload)
      return;
    try {
      const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedOscar: isNewMovieOscar,
        createdAt: serverTimestamp(),
        userId: auth?.currentUser?.uid,
      })
      getMovieList();
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='App'>
      <Auth />
      <div>
        <h1>Add movie</h1>
        <input
          type="text"
          placeholder='Movie title...'
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder='Release date...'
          onChange={(e) => setNewReleaseDate(e.target.value)}
        />
        <input
          type="checkbox"
          checked = {isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label htmlFor="">Received an Oscar</label>
        <button onClick={handleSubmit}>
          Sumbit Movie
        </button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={()=>deleteMovie(movie.id)}>Delete Movie</button>
            
            <input type="text" placeholder='new title' onChange={(e)=>setUpdatedTitle(e.target.value)}/>
            <button onClick={()=>updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  )
}

export default App
