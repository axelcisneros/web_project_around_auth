import { useState } from "react";

export default function Card(props) {
    const { name, link, _id } = props.card;
    const [isLiked, setIsLiked] = useState(props.card.isLiked);
    const { handleCardClick, onCardLike, handleTrashClick } = props;
    const cardLikeButtonClassName = `main__button main__button_like ${isLiked ? 'main__button_like_active' : ''}`;
    const imageComponent = {
        name,
        link,
        _id,
        isLiked
    };

    async function handleLikeClick(card) {
       try {
            await onCardLike(card);
            setIsLiked(!isLiked);
       } catch (error) {
            console.log(error);
       }
    }

    return ( 
        <li className="main__gallery-card">
          <img className="main__gallery-image" src={link} alt={name} onClick={() => handleCardClick(imageComponent)} />
          <button aria-label="Delete card" type="button" className="main__button main__button_trash" onClick={() => handleTrashClick(imageComponent)}/>
          <div className="main__gallery-content">
            <p className="main__gallery-paragraph">{name}</p>
            <button aria-label="Like card" type="button" className={cardLikeButtonClassName} onClick={() => handleLikeClick(imageComponent)} />
          </div>
        </li>
    )
}