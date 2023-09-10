import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConst = {
  initial: 'initial',
  success: 'succuss',
  failure: 'failure',
  loading: 'loading',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConst.initial,
    activeOptionId: sortbyOptions[0].optionId,
    selectedCategoryId: '',
    selectedRatingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  onClearFilter = () => {
    this.setState(
      {
        selectedCategoryId: '',
        selectedRatingId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  onClickRating = ratingId => {
    // console.log(ratingId)
    this.setState({selectedRatingId: ratingId}, this.getProducts)
  }

  onClickCategory = categoryId => {
    this.setState({selectedCategoryId: categoryId}, this.getProducts)
  }

  changeSerachInput = value => {
    this.setState({searchInput: value})
  }

  onChangeInputBtn = () => {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConst.loading,
    })

    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      selectedCategoryId,
      selectedRatingId,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${selectedCategoryId}&title_search=${searchInput}&rating=${selectedRatingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    
    const shouldProductsList = productsList.length > 0

    return shouldProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <h1>No Products Found</h1>
        <p>We could not find any products. Try another filters.</p>
      </div>
    )
  }

  renderFailure = () => (
    <div className="fail-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Somthing Went Wrong</h1>
      <p>
        We are having some truble processing your request. Please try again.
      </p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  switchApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderProductsList()
      case apiStatusConst.failure:
        return this.renderFailure()
      case apiStatusConst.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onClickRating={this.onClickRating}
          onClickCategory={this.onClickCategory}
          changeSerachInput={this.changeSerachInput}
          onClearFilter={this.onClearFilter}
          onChangeInputBtn={this.onChangeInputBtn}
        />
        {this.switchApiStatus()}
      </div>
    )
  }
}

export default AllProductsSection
