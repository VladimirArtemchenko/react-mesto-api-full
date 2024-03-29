import React, {useEffect} from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef();

  function handleOnChangeAvatar(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value
    })
  }
  useEffect(() => {
    avatarRef.current.value=''
  }, [isOpen, onClose])

  return (
    <PopupWithForm title="Обновить аватар" buttonText="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleOnChangeAvatar}>
      <input ref={avatarRef} id="link-input" className="form__input form__input_type_url" type="url" name="avatar" placeholder="Ссылка на новую аватарку" required />
      <span className="link-input-error form__input-error"/>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
