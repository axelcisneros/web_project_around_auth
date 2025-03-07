export default function ImagePopup(props) {
    const { name, link } = props.card;
    return (
        <div className="popup__images">
            <div className="popup__content-image">
              <img className="popup__image" src={link} alt={name} />
            </div>
            <div className="popup__paragraph-content">
              <p className="popup__paragraph">{name}</p>
            </div>
        </div>
    );
}