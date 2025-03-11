import { useContext } from "react";
import CurrentUserContext from '@contexts/CurrentUserContext.js';

export default function InfoTooltip() {
   const { messagePopup } = useContext(CurrentUserContext);

    return (
        <div className="info__tooltip">
            <div className="info__tooltip-image">
              <img className="info__tooltip-img" src={messagePopup.link} alt={messagePopup.linkalt} />
            </div>
              <h2 className="info__paragraph">{messagePopup.message}</h2>
        </div>
    );
}