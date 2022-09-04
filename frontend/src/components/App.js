import {useEffect, useState} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import {api} from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import {Route, Switch, useHistory} from 'react-router-dom';
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import {apiAuth} from "../utils/ApiAuth";
import Login from "./Login";

function App() {
    const history = useHistory();
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
    const [mesError, setMesError] = useState(false);
    const [userAuth, setUserAuth] = useState({});
    const [token, setToken] = useState('');
    
    

    useEffect(() => {
       
        const token = localStorage.getItem('token')
        api
            .getUserInfo(token)
            .then((profileInfo) => {
                setCurrentUser(profileInfo.data)
            })
            .catch((rej) => console.log(rej))
    }, [loggedIn])

    useEffect(() => {
        const token = localStorage.getItem('token')
        api
            .getInitialCards(token)
            .then((res) => {
                setCards(res.data.reverse())
            })
            .catch((rej) => console.log(rej));
    }, [loggedIn])

    function handleCardClick(card) {
        setSelectedCard(card)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard({});
        setIsInfoTooltipPopupOpen('');
    }

    function handleCardDelete(card) {
        const token = localStorage.getItem('token')
        api
            .deleteCard(card._id, token)
            .then((res) => {
                setCards((cards) => cards.filter((c) => c._id !== card._id))
                closeAllPopups()
            })
            .catch((rej) => console.log(rej))
    }

    function handleUpdateUser(profile) {
        const token = localStorage.getItem('token')
        api
            .editUserInfo(profile, token)
            .then((newProfile) => {
                setCurrentUser(newProfile.data)
                closeAllPopups()
            })
            .catch((rej) => console.log(rej))
    }

    function handleUpdateAvatar(avatar) {
        const token = localStorage.getItem('token')
        api
            .editUserAvatar(avatar,token)
            .then((newProfile) => {
                setCurrentUser(newProfile.data)
                closeAllPopups()
            })
            .catch((rej) => console.log(rej))
    }

    function handleCardLike(card) {
        const token = localStorage.getItem('token')
        const isLiked = card.likes.some(i => i === currentUser._id);
        api
            .changeLikeCardStatus(card._id, isLiked, token)
            .then((newCard) => {
                setCards((cards) => cards.map((c) => c._id === card._id ? newCard.data : c));
            })
            .catch((rej) => console.log(rej))
    }

    function handleAddPlaceSubmit(card) {
        const token = localStorage.getItem('token')
        api
            .postNewCard(card,token)
            .then((newCard) => {
                setCards([newCard.data, ...cards])
                closeAllPopups()
            })
            .catch((rej) => console.log(rej))
    }

    function handleRegister({password, email}) {
        apiAuth
            .register({
                password: password,
                email: email,
            })
            .then(() => {
                setIsInfoTooltipPopupOpen(true)
                setMesError(false)
                history.push('/sign-in')
            })
            .catch(() => {
                setIsInfoTooltipPopupOpen(true)
                setMesError(true)
            })
    }

    function handleLogin({password, email}) {
        apiAuth
            .login({
                password,
                email,
            })
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('token', res.token)
                    checkToken(res.token)
                }
            })
            .catch(() => {
                setIsInfoTooltipPopupOpen(true)
                setMesError(true)
            })
    }

    function auth(id, email) {
        setLoggedIn(true)
        setUserAuth({
            id,
            email,
        })
    }

    function checkToken(localToken) {
        apiAuth
            .checkToken(localToken)
            .then((res) => {
                auth(res.data._id, res.data.email)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        loggedIn ? history.push('/') : history.push('/sign-in')
    }, [loggedIn])

    useEffect(() => {
        const localToken = localStorage.getItem('token')
        localToken ? checkToken(localToken) : history.push('/sign-in')
    }, [loggedIn])

    function handleSignOutButtonClick() {
        exit()
    }

    function exit() {   
        localStorage.removeItem('token')
        setLoggedIn(false)
        setUserAuth({})
        setCards([])
        setCurrentUser({})
    }
    
    return (
        <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
            <div className="wrapper">
                <Header handleLogout={handleSignOutButtonClick} userAuth={userAuth}/>
                    <InfoTooltip isOpen={isInfoTooltipPopupOpen} error={mesError} onClose={closeAllPopups}/>
                    <Switch>
                        <Route path="/sign-up">
                            <Register onSubmit={handleRegister}/>
                        </Route>
                        <Route path="/sign-in">
                            <Login onSubmit={handleLogin}/>
                        </Route>
                        <ProtectedRoute
                            exact
                            path="/"
                            component={Main}
                            loggedIn={loggedIn}
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onCardClick={handleCardClick}
                            cards={cards}
                            currentUser={currentUser}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                    </Switch>
                    <Footer/>
                    <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                      onUpdateUser={handleUpdateUser}/>
                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
                                   onAddPlace={handleAddPlaceSubmit}/>
                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                     onUpdateAvatar={handleUpdateAvatar}/>
            </div>
        </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
