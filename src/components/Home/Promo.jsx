import React from 'react'
import { Link } from 'react-router-dom'
import PromoImg from '../../assets/promo.png'
import './promo.css'

export const Promo = () => {
  return (
    <div className='promo__container'>
        <h1>Welcome to <span style={{color: "var(--emphasis-color)"}}>Voochat</span></h1>
        <div className='promo__container-inner'>
            <Link to="/channels">Start Chatting Now!</Link>
            <img src={PromoImg} alt="Promo Img"/>
        </div>
    </div>
  )
}
