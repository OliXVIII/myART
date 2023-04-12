import React, { useState } from 'react';
import './restaurant-banner.scss';
import { ImArrowRight } from 'react-icons/im';
import StarRatings from 'react-star-ratings/build/star-ratings';
import ModalVisit from '../../modalVisit/modal-visit';
import { postVisit } from '../../../hooks/postUfoodData';
import { Link } from 'react-router-dom';

export const RestaurantBanner = ({ id, restaurant, index, similarRestaurants = [] }) => {
  const [showModalVisit, setShowModalVisit] = useState(false);

  let idList = ['5f31fc6155d7790550c08afe', '5f31fc6955d7790550c08b00', '5f31fc6d55d7790550c08b01'];
  const visited = () => idList.includes(restaurant.id);

  return (
    <div className={'restaurant-banner'}>
      <ModalVisit restaurant={restaurant} onClose={() => setShowModalVisit(false)} show={showModalVisit} id={id}>
        <p> Date, Rating, Comment</p>
      </ModalVisit>
      {index % 2 === 0 && (
        <div className={'restaurant-banner__image'}>
          <Link
            className={'restaurant-banner__image'}
            to={`/restaurant/${restaurant.name.replaceAll(' ', '-').toLowerCase()}`}
            state={{ restaurant: restaurant, similarRestaurants: similarRestaurants }}
          >
            <img src={restaurant.pictures[0]} alt={restaurant.name} />
          </Link>
        </div>
      )}
      <div className={'restaurant-banner__info'}>
        <h2>{restaurant.name}</h2>
        <div className={'restaurant-banner__info__stats'}>
          <div>
            Rating:{' '}
            <span>
              <StarRatings
                rating={restaurant.rating}
                starRatedColor="darkred"
                starEmptyColor="DarkGray"
                numberOfStars={5}
                name="rating"
                starDimension="15px"
                starSpacing="0px"
              />
            </span>
          </div>
          <p>
            Food Type:{' '}
            {restaurant.genres.map((element, index) => {
              return index != restaurant.genres.length - 1 ? element + ', ' : element;
            })}
          </p>
          <p>Price: {'$'.repeat(restaurant.price_range)}</p>
        </div>
        <p className={'restaurant-banner__description'}>{restaurant.description}</p>
        <Link
          className={'restaurant-banner__prompt'}
          to={`/restaurant/${restaurant.name.replaceAll(' ', '-').toLowerCase()}`}
          state={{ restaurant: restaurant }}
        >
          Go to restaurant page <ImArrowRight />
        </Link>
        {visited() ? (
          <button className={'restaurant-banner__visit'} onClick={() => setShowModalVisit(true)}>
            Register a visit
          </button>
        ) : (
          <p>Visited</p>
        )}
      </div>
      {index % 2 !== 0 && (
        <div className={'restaurant-banner__image'}>
          <Link
            className={'restaurant-banner__image'}
            to={`/restaurant/${restaurant.name.replaceAll(' ', '-').toLowerCase()}`}
            state={{ restaurant: restaurant, similarRestaurants: similarRestaurants }}
          >
            <img src={restaurant.pictures[0]} alt={restaurant.name} />
          </Link>
        </div>
      )}
    </div>
  );
};
