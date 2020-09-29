import React, { Component, useState } from 'react';
import styled from 'styled-components';
import { navigateTo } from '../helpers/utilities';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTrophy, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const FabContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
    width: ${props => props.pads.x}px;
    height: ${props => props.pads.y}px;
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

export default function FloatingActionButton(props) {

  const [isActive, switchActive] = useState(false);
  const [isModalActive, switchModal] = useState(false);
  const [childSize, setPadding] = useState({x: 0, y: 0});

  return (
    <>
      <FabContainer pads={childSize}>
        <button className="fab noSelect"
          onClick={() => {
            isActive ? setPadding({x: 0, y: 0}) : setPadding({x: 40, y: 40});
            switchActive(!isActive)
          }}
        >
          {isActive ? <FontAwesomeIcon icon={faMinus} size="lg" /> : <FontAwesomeIcon icon={faPlus} size="lg" />}
        </button>

        {isActive && (
          <>
            <button className="fabChild noSelect" onClick={() => navigateTo('/')}>
              <FontAwesomeIcon icon={faHome} />
          </button>

            <button className="fabChild noSelect" onClick={() => {
              switchModal(!isModalActive)
              window.scrollTo(0, 0);
            }}>
              <FontAwesomeIcon icon={faTrophy} />
          </button>
          </>
        )}
      </FabContainer>
      <Modal show={isModalActive} toggleModal={() => switchModal(!isModalActive)}>
        {props.children}
      </Modal>
    </>
  )
}