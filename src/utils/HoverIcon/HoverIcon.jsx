import React, { useState } from 'react';
import './HoverIcon.module.css'; // Usando CSS Modules para mejor encapsulación

/**
 * #### Icono auxiliar para poder manejar el estado cuando está en "hover"
 * 
 * Ejemplo usado en el Dashboard
 * 
 * ```jsx
 * <HoverIcon iconoNormal={<ArrowRight color='#9EC5FE' className='icon-placeholder rounded-3'></ArrowRight>} iconoHover={<ArrowRight color='#FFF' className='icon-placeholder rounded-3'></ArrowRight>}></HoverIcon>
 * ```
 */

function HoverIcon({ iconoNormal, iconoHover }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="icono-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? iconoHover : iconoNormal}
    </div>
  );
}

export default HoverIcon;