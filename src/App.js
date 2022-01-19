import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import Searchbar from "./components/Searchbar";
import Button from "./components/Button";
import ImageGallery from "./components/ImageGallery";
import { Rings } from "react-loader-spinner";
import { productsApi } from "./shared/service/Api";
import "./App.css";

// const initialState = {
//   pictures: [],
//   isLoading: false,
//   error: false,
//   finish: false,
//   largeImageURL: '',
//   tags: '',
// };
const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState(null);
  const [finish, setFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null); //{largeImageURL,tegs}

  const onChangeQwery = (query) => {
    setQuery(query);
    setPage(1)
    setPictures([]);
  };

  useEffect(() => {
    if (!query) return;
    setFinish(false);
    fetchProducts();
  }, [query]);

  useEffect(() => {
    if (!query) return;
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await productsApi.searchPictures(page, query);
      setPictures([...pictures, ...data.hits]);
      if (data.hits.length < 12) {
        setFinish(true);
      }
      if (!data.hits.length) {
        throw Error("Not images");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setPage((prevState) => {
      return prevState + 1;
    });
  };

  const handleOpenModal = (modal) => {
    // {url, tags}
    setModal(modal);
  };
  const closeModal = (e) => {
    setModal(null);
  };
  return (
    <div className="App">
      <Searchbar onSubmit={onChangeQwery} />
      {error && <h1>Impossible to load the pictures!</h1>}
      {!error && <ImageGallery pictures={pictures} onClick={handleOpenModal} />}
      {!finish && pictures.length !== 0 && <Button onClick={loadMore} />}
      {isLoading && <Rings />}
      {modal && (
        <Modal showModal={closeModal}>
          <img src={modal.largeImageURL} alt={modal.tags} />
        </Modal>
      )}
    </div>
  );
};

export default App;
