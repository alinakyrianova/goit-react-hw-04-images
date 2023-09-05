import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { fetchImages } from 'API';
import { Searchbar } from '../Searchbar/Searchbar';
import { Gallery } from '../ImageGallery/ImageGallery';
import { Pagination } from '../LoadMore/LoadMore';
import { Wrapper } from './App.styled';
import { Loader } from '../Loader/Loader';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    const loadResult = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const { hits, totalHits: newTotalHits } = await fetchImages(query, page);

        if (hits && hits.length) {
          setImages((prevImages) => [...prevImages, ...hits]);
          setTotalHits(newTotalHits);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    loadResult();
  }, [query, page]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newQuery = evt.target.elements.query.value.trim();
    if (!newQuery) return;
    setQuery(`${Date.now()}/${newQuery}`);
    setImages([]);
    setPage(1);
    evt.target.reset();
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const hasMoreImages = images.length > 0 && images.length < totalHits;

  return (
    <Wrapper>
      <Searchbar onSubmit={handleSubmit} />
      {loading && <Loader />}
      {images.length > 0 && <Gallery imgItems={images} />}
      {hasMoreImages && (
        <Pagination onClick={handleLoadMore}>Load More</Pagination>
      )}
      <Toaster position="top-right" reverseOrder={true} />
    </Wrapper>
  );
};

