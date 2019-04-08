import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioTile, Tile, Search, SkeletonText } from 'carbon-components-react';
import { Bee32 } from '@carbon/icons-react';

import SimplePagination from '../SimplePagination/SimplePagination';

import TileGroup from './TileGroup';

const StyledContainerDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledCatalogHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 0.5rem;
  align-items: center;
  .bx--search {
    max-width: 250px;
  }
`;

const StyledEmptyTile = styled(Tile)`
  &&& {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    > * {
      padding-bottom: 0.5rem;
    }
  }
`;

const StyledTitle = styled.span`
  font-weight: bold;
`;

export const propTypes = {
  /** Is the data actively loading? */

  isLoading: PropTypes.bool,
  pagination: PropTypes.shape({
    pageSize: PropTypes.number,
    pageText: PropTypes.string,
    nextPageText: PropTypes.string,
    prevPageText: PropTypes.string,
    onPage: PropTypes.func,
    /** current page number */
    page: PropTypes.number,
  }),

  /** We will callback with the search value */
  search: PropTypes.shape({
    placeHolderText: PropTypes.string,
    noMatchesFoundText: PropTypes.string,
    /** current search value */
    value: PropTypes.string,
    onSearch: PropTypes.func,
  }),

  /** form id */
  id: PropTypes.string.isRequired,
  /** title displayed above the catalog */
  title: PropTypes.node,
  /** tiles describes what to render */
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      /**  the values field is searched by the search widget */
      values: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
      /** renderContent is called back with the full value object and id to render */
      renderContent: PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  /** Callbacks */
  onSelection: PropTypes.func.isRequired,
  /** currently selected tile id */
  selectedTileId: PropTypes.string,
};

const defaultProps = {
  isLoading: false,
  title: null,
  pagination: null,
  search: null,
  selectedTileId: null,
};

/**
 * Renders a searchable and pageable catalog of RadioTiles from carbon. Couldn't reuse the TileGroup component from Carbon due to this limitation.
 * https://github.com/IBM/carbon-components-react/issues/1999
 *
 */
const TileCatalog = ({
  id,
  className,
  title,
  isLoading,
  search,
  pagination,
  tiles,
  onSelection,
  selectedTileId,
}) => {
  const page = pagination && pagination.page ? pagination.page : 1;
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  const searchState = search ? search.value : '';
  const handleSearch = search && search.onSearch;

  const startingIndex = pagination ? (page - 1) * pageSize : 0;
  const endingIndex = pagination ? (page - 1) * pageSize + pageSize : tiles.length;
  return (
    <StyledContainerDiv className={className}>
      <StyledCatalogHeader>
        <StyledTitle>{title}</StyledTitle>
        {search && search.placeHolderText ? (
          <Search
            value={searchState}
            labelText={search.placeHolderText}
            placeHolderText={search.placeHolderText}
            onChange={handleSearch}
            id={`${id}-searchbox`}
          />
        ) : null}
      </StyledCatalogHeader>
      {isLoading ? ( // generate empty tiles for first page
        <TileGroup
          tiles={[...Array(pageSize)].map((val, index) => (
            <StyledEmptyTile key={`emptytile-${index}`}>
              <SkeletonText />
            </StyledEmptyTile>
          ))}
          totalTiles={pageSize}
        />
      ) : tiles.length > 0 ? (
        <TileGroup
          tiles={tiles.slice(startingIndex, endingIndex).map(tile => (
            <RadioTile
              className={tile.className}
              key={tile.id}
              id={tile.id}
              value={tile.id}
              name={id}
              checked={selectedTileId === tile.id}
              onChange={onSelection}>
              {tile.renderContent
                ? tile.renderContent({ values: tile.values, id: tile.id })
                : tile.value}
            </RadioTile>
          ))}
          totalTiles={pageSize}
        />
      ) : (
        <StyledEmptyTile>
          <Bee32 />
          <p>{(search && search.noMatchesFoundText) || 'No matches found'}</p>
        </StyledEmptyTile>
      )}
      {pagination ? (
        <SimplePagination {...pagination} maxPage={Math.ceil(tiles.length / pageSize)} />
      ) : null}
    </StyledContainerDiv>
  );
};
TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
