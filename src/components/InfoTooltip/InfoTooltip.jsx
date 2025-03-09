export default function InfoTooltip(props) {
    const { message, link, linkalt } = props.messages;
    return (
        <div className="info__tooltip">
            <div className="info__tooltip-image">
              <img className="info__tooltip-img" src={link} alt={linkalt} />
            </div>
              <h2 className="info__paragraph">{message}</h2>
        </div>
    );
}