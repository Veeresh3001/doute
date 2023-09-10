import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {changeSerachInput, onChangeInputBtn, onClearFilter} = props
  // console.log(categoryOptions)
  const onChangeSerachInput = event => {
    changeSerachInput(event.target.value)
  }

  const onChangeInput = event => {
    if (event.key === 'Enter') {
      onChangeInputBtn()
    }
  }

  const returnRatingItems = () => {
    const {ratingsList} = props

    return ratingsList.map(rating => {
      const {onClickRating} = props
      const onClickRatingBtn = () => onClickRating(rating.ratingId)

      return (
        <li onClick={onClickRatingBtn} key={rating.ratingId}>
          <img src={rating.imageUrl} alt={`rating ${rating.ratingId}`} />
          <p>& up</p>
        </li>
      )
    })
  }

  const returnCategoryItems = () => {
    const {categoryOptions} = props

    return categoryOptions.map(category => {
      const {onClickCategory} = props
      const onClickCategoryBtn = () => onClickCategory(category.categoryId)

      return (
        <li onClick={onClickCategoryBtn} key={category.categoryId}>
          <p>{category.name}</p>
        </li>
      )
    })
  }

  return (
    <div className="filters-group-container">
      <div className="search-card">
        <input
          type="search"
          placeholder="Search"
          className="search"
          // value=""
          onKeyDown={onChangeInput}
          onChange={onChangeSerachInput}
        />
        <BsSearch />
      </div>
      <h1>Category</h1>
      <ul className="category-card">{returnCategoryItems()}</ul>
      <h1>Rating</h1>
      <ul className="ratings-card">{returnRatingItems()}</ul>
      <button type="button" onClick={onClearFilter} className="clear-btn">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
