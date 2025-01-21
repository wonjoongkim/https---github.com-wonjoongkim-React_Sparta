import { useState } from 'react';
import { getTypeIconSrc } from '../utils/pokemon-helper';

const PokemonCard = ({ pokemon: { pokemonId, paddedId, name, types, imgSrc, sprites, weight, height }, datas }) => {
const [popPage, setPopPage] = useState(false);

console.log(sprites)

const handelCard = async () => {
  setPopPage(true);
};


const closePopup = () => {
  setPopPage(false);
};

const handleOutsideClick = (event) => {
  // 팝업 외부 클릭 시 팝업 닫기
  if (event.target.className === 'popup') {
    closePopup();
  }
};


  return (
    <>
      <div className={`pokemon-card ${types[0].name}`} onClick={()=>handelCard()}>
        <div>
          <span className='id-number'>{'#' + paddedId}</span>
          <span className='pokemon-name'>{name}</span>

          <div className='types'>
            {types.map(({ name }) => {
              const typeImg = getTypeIconSrc(name);

              return (
                <div key={name} className={name}>
                  <img src={typeImg} alt={name} />
                  <span className='type-name'>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className='pokeball-bg'></div>
        <img className='pokemon-image' src={imgSrc} alt='pokemon-image' />
      </div>
    

    {/* 팝업창 */}
      {popPage && (
        <div className="popup" onClick={handleOutsideClick}>
          <div className="popup-content">
          <button className="close-button" onClick={closePopup}>X</button>
          <div className="popup-contenter">
            <h2 className='pokemon-name' style={{color:'#333333', fontSize: '55px'}}>{name}</h2>
            <img src={sprites.other.home.front_default} alt={`${name} sprite`}  style={{width:"250px"}}/>
              <div>
                <div className='types' style={{ justifyContent: 'center' }}>
                  {types.map(({ name }) => {
                    const typeImg = getTypeIconSrc(name);

                    return (
                      <div key={name} className={name}>
                        <img src={typeImg} alt={name} />
                        <span className='type-name'>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div><img src={sprites.other.showdown.front_default} alt={`${name} sprite`}  style={{paddingTop: '20px'}}/></div>
            <div style={{fontSize:'15px', padding: '10px 0'}}>무게: {weight}</div>
            <div style={{fontSize:'15px', padding: '5px 0'}}>키: {height}</div>
            <div style={{ fontSize: '15px', padding: '10px 0' }}>
              {datas.map((entry, index) => (
                <div  key={index}>
                <p style={{fontSize:'15px', padding: '5px 0', float: 'left'}} key={entry}>※ {entry.flavor_text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PokemonCard;
