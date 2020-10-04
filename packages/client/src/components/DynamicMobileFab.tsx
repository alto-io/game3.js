import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { navigateTo } from '../helpers/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const FabContainer = styled.div`
  position: absolute;
  top: ${({ pos }) => pos.top};
  left: ${({ pos }) => pos.left};
  right: ${({ pos }) => pos.right};
  bottom: ${({ pos }) => pos.bottom};
  margin: 1rem;
  z-index: 99;
  display: flex;
  align-items: center;
  opacity: 0.4;

  .fab {
    font-family: 'Apercu Pro Mono';
    color: #fff;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 20px;
    background: #ff007b;
    outline: none;
    cursor: pointer; 
    box-shadow: 0px 5px 0px 0px #ff4c9a;
  }

  .fab:active {
    background: #ff4c9a;
  }

  .fabChild:active {
    background: #ff007b;
  }

  .fabChild {
    font-family: 'Apercu Pro Mono';
    color: #fff;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 7px;
    background: #ff4c9a;
    outline: none;
    cursor: pointer;
    margin-left: 1rem;
    box-shadow: 0px 5px 0px 0px #ff007b;
  }

  .noSelect {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
`
function setPosition(position) {
  switch (position) {
    case "top-left":
      return { top: 0, left: 0, bottom: 'auto', right: 'auto' }
    case "top-right":
      return { top: 0, left: 'auto', bottom: 'auto', right: 0 }
    case "bottom-right":
      return { top: 'auto', left: 'auto', bottom: 0, right: 0 }
    case "bottom-left":
      return { top: 'auto', left: 0, bottom: 0, right: 'auto' }
    default:
      return { top: 0, left: 0, bottom: 'auto', right: 'auto' }
  }
}

export default function DynamicMobileFab(props) {

  const icon = icons[props.icon];
  const [isReady, setReady] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    setReady(props.readyWhen);
    setShouldHide(props.hideWhen);
  }, [props.readyWhen, props.hideWhen])

  return (
    <>
      {!shouldHide && (
        <FabContainer pos={setPosition(props.pos || '')}>
          <button className="fab noSelect"
            onClick={() => {
              if (isReady) {
                props.params ? props.func(...props.paramas) : props.func()
              }
            }}
          >
            {isReady ? <FontAwesomeIcon icon={icon} size="lg" /> : <FontAwesomeIcon icon={faSpinner} spin size="lg" />}
          </button>
        </FabContainer>
      )}
    </>
  )
}