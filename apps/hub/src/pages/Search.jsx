import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBox from '../../../../shared/search/SearchBox';

export default function Search() {
  const [params] = useSearchParams();
  return (
    <div className="zh-search-page">
      <h1>Search</h1>
      <SearchBox autoFocus initialQuery={params.get('q') ?? ''} />
    </div>
  );
}
