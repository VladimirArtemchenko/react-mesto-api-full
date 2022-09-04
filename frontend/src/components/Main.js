import React from 'react';
import Card from './Card';

function Main({ cards,currentUser, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardDelete, onCardLike }) {

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img src={currentUser.avatar} alt="Аватарка в профиле" className="profile__avatar" />
          <div className="profile__avatar-overlay" onClick={onEditAvatar}>
            <div className="profile__avatar-edit" aria-label="Редактировать"/>
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" aria-label="Редактировать" onClick={onEditProfile}/>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" aria-label="add" onClick={onAddPlace}/>
      </section>
      <section className="cards">
        {cards.map((card) => (<Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>))}
      </section>
    </main>
  )
}

export default Main;
