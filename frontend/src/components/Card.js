import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardDeleteButtonClassName = (
    `card__like-button ${isLiked ? 'card__like-button_active' : ''}`
  );

  function handleClick() {
    onCardClick(card)
  }

  function handleLike() {
    onCardLike(card)
  }

  function handleDelete() {
    onCardDelete(card)
  }

  return (
    <div className="card">
      <img src={card.link} alt={card.link} className="card__image" onClick={handleClick} />
      {isOwn && <button className="card__delete-button" type="button" aria-label="Удалить" onClick={handleDelete}/>}
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button className={cardDeleteButtonClassName} type="button" aria-label="Нравится" onClick={handleLike}/>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </div>
  )

}

export default Card;
