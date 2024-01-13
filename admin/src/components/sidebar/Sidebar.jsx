import React from 'react'
import './sidebar.css'
import {Link} from 'react-router-dom'
import  addProduct from '../../assets/Product_Cart.svg'
import  listProduct from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={addProduct} alt="" />
            <p>Add Product</p>
        </div>
      </Link>

      <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={listProduct} alt="" />
            <p>Product List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
