import React, { Component, useState } from 'react';
import styled from 'styled-components';
// import { navigateTo } from '../helpers/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

const FabContainer = styled.div`
  position: absolute;
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

export default function DynamicMobileFab(props) {

  const icon = icons[props.icon];

  return (
    <>
      <FabContainer>
        <button className="fab noSelect"
          onClick={() => {
            props.params ? props.func(...props.paramas) : props.func(); 
          }}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
        </button>
      </FabContainer>
    </>
  )
}